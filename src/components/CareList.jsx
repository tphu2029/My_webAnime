import React, { useState, useEffect } from "react";
import HorizontalCarousel from "./HorizontalCarousel";
import "../assets/css/carouselOverride.css";

const urlAnime =
  "https://api.themoviedb.org/3/discover/tv?language=vi-VN&sort_by=popularity.desc&with_genres=16&page=1";
const urlAnimePage2 =
  "https://api.themoviedb.org/3/discover/tv?language=vi-VN&sort_by=popularity.desc&with_genres=16&page=10";
const urlAnimePage3 =
  "https://api.themoviedb.org/3/discover/tv?language=vi-VN&sort_by=popularity.desc&with_genres=16&page=20";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_API_URL}`,
  },
};

const CareList = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllMovieData = async () => {
      try {
        const promises = [
          fetch(urlAnime, options).then((res) => res.json()),
          fetch(urlAnimePage2, options).then((res) => res.json()),
          fetch(urlAnimePage3, options).then((res) => res.json()),
        ];
        const results = await Promise.all(promises);

        const allAnime = [
          ...results[0].results,
          ...results[1].results,
          ...results[2].results,
        ];

        // Loại bỏ phim trùng lặp
        const uniqueAnime = Array.from(new Set(allAnime.map((a) => a.id))).map(
          (id) => {
            return allAnime.find((a) => a.id === id);
          }
        );

        // Tạo các danh sách phim mới từ danh sách duy nhất
        const loadedData = [
          {
            title: "Anime Phổ Biến ",
            movies: uniqueAnime.slice(0, 20),
          },
          {
            title: "Anime Được Đánh Giá Cao",
            movies: uniqueAnime
              .sort((a, b) => b.vote_average - a.vote_average)
              .slice(0, 15),
          },
          {
            title: "Anime Tuần",
            movies: uniqueAnime
              .filter((movie) => movie.genre_ids.includes(35))
              .slice(0, 15),
          },
          // Thêm các thể loại khác ở đây
        ];

        setAllMovies(loadedData);
      } catch (err) {
        setError(`Không thể tải dữ liệu: ${err.message}`);
        console.error("Lỗi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllMovieData();
  }, []);

  if (loading) {
    return (
      <div className="text-white text-center p-10 h-[700px] bg-gray-900 flex items-center justify-center">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-10 h-[700px] bg-gray-900 flex items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <div className="h-auto w-full bg-[#191b24] pb-16">
      <div className="py-3"></div>

      <p className="flex font-bold text-3xl ml-5 mb-6 text-amber-50">
        Bạn đang quan tâm gì?
      </p>
      <div className="grid-cols-6 grid-rows-2 mx-5 gap-5 grid">
        <a className="h-[150px] w-full bg-amber-100 rounded-3xl hover:scale-105 transform-fill transition-transform duration-300"></a>
        <a className="h-[150px] w-full bg-amber-100 rounded-3xl hover:scale-105 transform-fill transition-transform duration-300"></a>
        <a className="h-[150px] w-full bg-amber-100 rounded-3xl hover:scale-105 transform-fill transition-transform duration-300"></a>
        <a className="h-[150px] w-full bg-amber-100 rounded-3xl hover:scale-105 transform-fill transition-transform duration-300"></a>
        <a className="h-[150px] w-full bg-amber-100 rounded-3xl hover:scale-105 transform-fill transition-transform duration-300"></a>
        <a className="h-[150px] w-full bg-amber-100 rounded-3xl hover:scale-105 transform-fill transition-transform duration-300"></a>
        <a className="h-[150px] w-full bg-amber-100 rounded-3xl hover:scale-105 transform-fill transition-transform duration-300"></a>
        <a className="h-[150px] w-full bg-amber-100 rounded-3xl hover:scale-105 transform-fill transition-transform duration-300"></a>
        <a className="h-[150px] w-full bg-amber-100 rounded-3xl hover:scale-105 transform-fill transition-transform duration-300"></a>
        <a className="h-[150px] w-full bg-amber-100 rounded-3xl hover:scale-105 transform-fill transition-transform duration-300"></a>
      </div>

      <div className="mt-20 over">
        {allMovies.map((list) => (
          <HorizontalCarousel
            key={list.title}
            title={list.title}
            movies={list.movies}
          />
        ))}
      </div>
    </div>
  );
};

export default CareList;
