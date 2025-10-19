import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import MovieCard from "./MovieCard";

// --- CẤU HÌNH API ---
const apiKey = import.meta.env.VITE_API_KEY;
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
};

// --- ÁNH XẠ SLUG SANG TÊN VÀ ID CỦA TMDB ---
const GENRE_MAP = {
  // Anime Demographics & Tropes
  shounen: { name: "Shounen", id: 10759 }, // Action & Adventure
  shoujo: { name: "Shoujo", id: 10749 }, // Romance
  seinen: { name: "Seinen", id: 18 }, // Drama
  isekai: { name: "Isekai", id: 10765 }, // Sci-Fi & Fantasy
  "slice-of-life": { name: "Đời thường", id: 18 }, // Drama

  // Standard Genres
  action: { name: "Hành động & Phiêu lưu", id: 10759 },
  comedy: { name: "Hài hước", id: 35 },
  romance: { name: "Lãng mạn", id: 10749 },
  fantasy: { name: "Kỳ ảo & Siêu nhiên", id: 10765 },
  mystery: { name: "Huyền bí", id: 9648 },
  "sci-fi": { name: "Khoa học viễn tưởng", id: 10765 },
  horror: { name: "Kinh dị", id: 27 },
  music: { name: "Âm nhạc", id: 10402 },
  historical: { name: "Lịch sử", id: 36 },

  // Genres mapped to the closest alternative (Drama)
  sports: { name: "Thể thao", id: 18 },
  school: { name: "Trường học", id: 18 },
};

const CategoryPage = () => {
  const { genreSlug, year } = useParams();
  const location = useLocation();

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [title, setTitle] = useState("");

  const listRef = useRef(null);

  // Reset lại state khi URL thay đổi
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    if (listRef.current) {
      listRef.current.scrollIntoView();
    }
  }, [location.pathname, year]);

  // Fetch dữ liệu khi URL hoặc page thay đổi
  useEffect(() => {
    const fetchData = async () => {
      let apiUrl = "";
      let pageTitle = "";
      const currentPath = location.pathname;

      // Dựa vào URL để quyết định API cần gọi và tiêu đề trang
      if (currentPath.startsWith("/the-loai")) {
        const genreInfo = GENRE_MAP[genreSlug] || {
          name: "Không xác định",
          id: null,
        };
        if (!genreInfo.id) {
          setError("Thể loại không hợp lệ.");
          setLoading(false);
          return;
        }
        pageTitle = `Thể loại: ${genreInfo.name}`;
        apiUrl = `https://api.themoviedb.org/3/discover/tv?language=vi-VN&with_genres=16,${genreInfo.id}&sort_by=popularity.desc&page=${page}`;
      } else if (currentPath.startsWith("/phim-le")) {
        pageTitle = "Phim Lẻ";
        apiUrl = `https://api.themoviedb.org/3/discover/movie?language=vi-VN&with_genres=16&sort_by=popularity.desc&page=${page}`;
      } else if (currentPath.startsWith("/phim-bo")) {
        pageTitle = "Phim Bộ";
        apiUrl = `https://api.themoviedb.org/3/discover/tv?language=vi-VN&with_genres=16&sort_by=popularity.desc&page=${page}`;
      } else if (currentPath.startsWith("/phim-chieu-rap")) {
        pageTitle = "Phim Chiếu Rạp";
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 12);
        const todayString = today.toISOString().split("T")[0];
        const oneMonthAgoString = oneMonthAgo.toISOString().split("T")[0];
        apiUrl = `https://api.themoviedb.org/3/discover/movie?language=vi-VN&with_genres=16&with_keywords=210024&primary_release_date.gte=${oneMonthAgoString}&primary_release_date.lte=${todayString}&sort_by=popularity.desc&page=${page}`;
      } else if (currentPath.startsWith("/nam")) {
        pageTitle = `Anime năm ${year}`;
        apiUrl = `https://api.themoviedb.org/3/discover/tv?language=vi-VN&with_genres=16&first_air_date_year=${year}&sort_by=popularity.desc&page=${page}`;
      }

      if (!apiUrl) return;

      setTitle(pageTitle);
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(apiUrl, options);
        if (!response.ok) throw new Error("Không thể tải dữ liệu");

        const data = await response.json();
        // logic loai bo phim trung lap
        setMovies((prevMovies) => {
          // Gộp danh sách phim cũ và mới
          const combinedMovies = [...prevMovies, ...data.results];

          // Dùng Map để tự động xử lý trùng lặp dựa trên movie.id
          const movieMap = new Map();
          combinedMovies.forEach((movie) => {
            movieMap.set(movie.id, movie); // Nếu id đã tồn tại, nó sẽ tự động được ghi đè
          });

          // Chuyển Map trở lại thành một mảng duy nhất
          return Array.from(movieMap.values());
        });

        setHasMore(data.page < data.total_pages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.pathname, year, page]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="container mx-auto min-h-screen px-4 py-8 md:py-12">
      <h1
        ref={listRef}
        className="mb-8 text-3xl font-bold text-white md:text-4xl"
      >
        <span className="text-yellow-400">{title}</span>
      </h1>

      {error && <p className="text-center text-red-500">{error}</p>}

      {movies.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 md:gap-5">
          {movies.map((movie) => (
            <MovieCard key={`${movie.id}-${location.pathname}`} movie={movie} />
          ))}
        </div>
      ) : (
        !loading && (
          <p className="text-center text-gray-500">
            Không tìm thấy phim nào phù hợp.
          </p>
        )
      )}

      <div className="mt-10 flex justify-center">
        {loading && <p>Đang tải thêm phim...</p>}
        {!loading && hasMore && (
          <button
            onClick={handleLoadMore}
            className="rounded-full bg-gray-800 px-6 py-3 font-semibold text-white transition hover:bg-gray-700"
          >
            Xem thêm
          </button>
        )}
        {!loading && !hasMore && movies.length > 0 && (
          <p className="text-gray-500">Bạn đã xem hết danh sách.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
