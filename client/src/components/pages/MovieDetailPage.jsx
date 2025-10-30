import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom"; // Thêm Link
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faPlay } from "@fortawesome/free-solid-svg-icons"; // Thêm faPlay

// SỬA: Thay đổi cách đọc biến môi trường để tương thích rộng hơn
const VITE_API_KEY = import.meta.env.VITE_API_KEY;
const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;

const MovieDetailPage = () => {
  // Lấy cả movieId và tvId từ URL (một trong hai sẽ có giá trị)
  const { movieId, tvId } = useParams();
  const location = useLocation();

  // Xác định ID và loại media
  const id = movieId || tvId;
  const mediaType = location.pathname.startsWith("/tv") ? "tv" : "movie";

  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //State cho AI Review ===
  const [aiReview, setAiReview] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  // ================================

  useEffect(() => {
    const fetchMovieData = async () => {
      // Reset state mỗi khi tải
      setLoading(true);
      setError(null);
      setMovie(null);
      setCredits(null);
      // === MỚI: Reset AI state ===
      setAiReview("");
      setAiError(null);
      // ==========================

      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${VITE_API_KEY}`,
        },
      };

      try {
        // Gọi API động dựa trên mediaType và id
        const [movieResponse, creditsResponse] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/${mediaType}/${id}?language=vi-VN`,
            options
          ),
          fetch(
            `https://api.themoviedb.org/3/${mediaType}/${id}/credits?language=vi-VN`,
            options
          ),
        ]);

        if (!movieResponse.ok || !creditsResponse.ok) {
          throw new Error("Không thể tải dữ liệu phim.");
        }

        const movieData = await movieResponse.json();
        const creditsData = await creditsResponse.json();

        setMovie(movieData);
        setCredits(creditsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id, mediaType]); // Chạy lại useEffect khi 'id' hoặc 'mediaType' thay đổi

  // Chuẩn bị dữ liệu hiển thị (dùng title cho phim lẻ, name cho phim bộ)
  // Đưa lên sớm hơn để hàm AI có thể sử dụng
  const title = movie?.title || movie?.name;

  // Hàm gọi API AI Review ===
  const handleFetchAiReview = async (preference = "trung lập và hấp dẫn") => {
    setAiLoading(true);
    setAiError(null);
    setAiReview(""); // Xóa review cũ

    try {
      // API backend của bạn đang chạy trên port 5000
      const response = await fetch("http://localhost:5000/api/ai-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieTitle: title,
          userPreference: preference,
        }),
      });

      // SỬA: Đọc JSON trước để lấy nội dung lỗi từ server
      const data = await response.json();

      // Nếu response không OK (lỗi 401, 503...), ném lỗi với nội dung từ server
      if (!response.ok) {
        throw new Error(data.error || "Lỗi không xác định từ server.");
      }

      // Nếu response OK, hiển thị review
      setAiReview(data.review);
    } catch (err) {
      setAiError(err.message); // Hiển thị lỗi cụ thể (ví dụ: "AI đang khởi động...")
    } finally {
      setAiLoading(false);
    }
  };
  // ==================================

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Đang tải...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Không tìm thấy phim.
      </div>
    );
  }

  const director = credits?.crew.find((member) => member.job === "Director");
  const cast = credits?.cast.slice(0, 5);

  const releaseYear = (movie.release_date || movie.first_air_date)?.substring(
    0,
    4
  );
  const runtime =
    movie.runtime ||
    (movie.episode_run_time ? movie.episode_run_time[0] : null);

  return (
    <div className="text-white">
      {/* Banner */}
      <div className="relative h-[40vh] md:h-[60vh]">
        <img
          src={`${VITE_IMG_URL}${movie.backdrop_path}`}
          alt={`Banner của ${title}`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
      </div>

      {/* Nội dung chính */}
      <div className="container mx-auto max-w-6xl p-4 md:p-8 -mt-24 md:-mt-48 relative">
        <div className="md:flex md:space-x-8">
          {/* Poster */}
          <div className="w-1/2 md:w-1/3 flex-shrink-0">
            <img
              src={`${VITE_IMG_URL}${movie.poster_path}`}
              alt={`Poster của ${title}`}
              className="rounded-lg shadow-2xl w-full"
            />
          </div>
          {/* Thông tin phim */}
          <div className="mt-6 md:mt-0 flex flex-col justify-end w-full">
            <h1 className="text-3xl md:text-5xl font-bold">{title}</h1>
            {movie.tagline && (
              <p className="text-gray-400 italic mt-1">{movie.tagline}</p>
            )}

            {/*  NÚT XEM  */}
            <div className="my-5">
              <Link to={`/${mediaType}/${id}/trailer`}>
                <button
                  className="
                    rounded-full bg-red-600 px-6 py-3 text-base 
                    font-bold text-white shadow-lg 
                    transition-transform duration-200 hover:scale-105"
                >
                  <FontAwesomeIcon icon={faPlay} className="mr-2" />
                  Xem Phim
                </button>
              </Link>
            </div>
            {/* ========================================= */}

            <div className="flex items-center flex-wrap my-4 gap-4">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                <span className="font-bold text-xl">
                  {movie.vote_average?.toFixed(1)}
                </span>
                <span className="text-gray-400 text-sm">
                  ({movie.vote_count} đánh giá)
                </span>
              </div>
              {releaseYear && (
                <>
                  <span className="text-gray-400">•</span>
                  <span>{releaseYear}</span>
                </>
              )}
              {runtime && (
                <>
                  <span className="text-gray-400">•</span>
                  <span>
                    {runtime} phút{mediaType === "tv" && "/tập"}
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="border border-gray-600 rounded-full px-3 py-1 text-sm text-gray-300"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <h2 className="text-xl font-semibold mt-4 mb-2">Nội dung</h2>
            <p className="text-gray-300 leading-relaxed">{movie.overview}</p>

            {/* === MỚI: PHẦN ĐÁNH GIÁ CỦA AI === */}
            <div className="mt-6 border-t border-gray-700 pt-4">
              <h2 className="text-xl font-semibold mb-3">🤖 Góc nhìn từ AI</h2>

              {/* Nút bấm */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <button
                  onClick={() => handleFetchAiReview("trung lập và hấp dẫn")}
                  disabled={aiLoading}
                  className="bg-blue-600 px-4 py-2 rounded-lg text-sm font-semibold transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {aiLoading ? "Đang phân tích..." : "Đánh giá nhanh"}
                </button>
                <button
                  onClick={() =>
                    handleFetchAiReview("phong cách hài hước và châm biếm")
                  }
                  disabled={aiLoading}
                  className="bg-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition hover:bg-gray-600 disabled:opacity-50"
                >
                  {aiLoading ? "..." : "Đánh giá (Hài hước)"}
                </button>
                <button
                  onClick={() =>
                    handleFetchAiReview("phân tích sâu sắc và triết lý")
                  }
                  disabled={aiLoading}
                  className="bg-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition hover:bg-gray-600 disabled:opacity-50"
                >
                  {aiLoading ? "..." : "Phân tích (Sâu sắc)"}
                </button>
              </div>

              {/* Hiển thị kết quả */}
              {aiLoading && (
                <p className="text-gray-400 italic">AI đang suy nghĩ...</p>
              )}
              {aiReview && (
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-300 italic leading-relaxed">
                    {aiReview}
                  </p>
                </div>
              )}
              {aiError && <p className="text-red-500 mt-2">{aiError}</p>}
            </div>
            {/* === KẾT THÚC PHẦN AI === */}

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {director && (
                <div>
                  <h3 className="font-semibold">Đạo diễn</h3>
                  <p className="text-gray-400">{director.name}</p>
                </div>
              )}
              {movie.created_by && movie.created_by.length > 0 && (
                <div>
                  <h3 className="font-semibold">Biên kịch</h3>
                  <p className="text-gray-400">
                    {movie.created_by.map((c) => c.name).join(", ")}
                  </p>
                </div>
              )}
              {cast && cast.length > 0 && (
                <div>
                  <h3 className="font-semibold">Diễn viên</h3>
                  <p className="text-gray-400">
                    {cast.map((actor) => actor.name).join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
