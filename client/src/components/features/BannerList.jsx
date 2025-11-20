import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  faCirclePlay,
  faHeart,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// --- TMDB CONFIG ---
const API_URL = `https://api.themoviedb.org/3/discover/tv?language=vi-VN&sort_by=vote_average.desc&vote_count.gte=500&with_genres=16&with_original_language=ja&page=1`;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";
const apiKey = import.meta.env.VITE_API_KEY;
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
};

const BannerList = () => {
  const [topAnime, setTopAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { authUser, toggleFavorite, requireLogin } = useAuth();

  const handleFavoriteClick = (e, movie) => {
    e.preventDefault();
    e.stopPropagation();

    if (!authUser) {
      requireLogin();
      return;
    }

    toggleFavorite({
      mediaId: String(movie.id),
      mediaType: "tv",
      posterPath: movie.poster_path,
      title: movie.name || movie.title,
    });
  };

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const response = await fetch(API_URL, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        const filteredResults = result.results
          .filter((item) => item.backdrop_path && item.poster_path)
          .slice(0, 7);
        setTopAnime(filteredResults);
      } catch (err) {
        setError(
          "Không thể tải dữ liệu TMDB. Vui lòng kiểm tra API Key/Token."
        );
        console.error("Lỗi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimeData();
  }, []);

  if (loading)
    return (
      <div className="flex h-[50vh] items-center justify-center bg-gray-900 p-10 text-center text-white md:h-[700px]">
        Đang tải dữ liệu Banner...
      </div>
    );
  if (error)
    return (
      <div className="flex h-[50vh] items-center justify-center bg-gray-900 p-10 text-center text-red-500 md:h-[700px]">
        {error}
      </div>
    );

  return (
    <div className="relative w-full">
      <Carousel
        showArrows={false}
        showThumbs={false}
        showStatus={false}
        showIndicators={false}
        autoPlay
        infiniteLoop
        interval={5000}
        stopOnHover
        selectedItem={selectedIndex}
        onChange={setSelectedIndex}
        className="custom-carousel"
      >
        {topAnime.map((movie) => {
          // Kiểm tra xem phim có trong danh sách yêu thích không
          const isFavorite = authUser?.favorites?.some(
            (fav) => fav.mediaId === String(movie.id)
          );

          return (
            <div
              key={movie.id}
              className="relative h-[50vh] overflow-hidden text-white md:h-[700px]"
            >
              <img
                src={`${IMAGE_BASE_URL}w1280${movie.backdrop_path}`}
                alt={movie.name || movie.title}
                className="absolute inset-0 z-0 h-full w-full object-cover"
              />
              {/* Lớp phủ */}
              <div className="absolute inset-0 z-10 bg-black opacity-20" />

              <div className="absolute bottom-0 left-0 right-0 z-20 h-40 bg-linear-to-t from-black via-black/60 to-transparent" />

              {/* Container nội dung */}
              <div className="relative z-30 flex h-full flex-col items-start justify-center p-6 md:p-10 lg:p-20">
                <div className="max-w-xl text-left">
                  <p className="mb-2 text-sm font-bold text-red-500 line-clamp-1 md:line-clamp-none">
                    {movie.original_name || movie.original_title || movie.name}
                  </p>
                  <h1 className="mb-4 line-clamp-2 text-3xl font-extrabold text-shadow-2xs shadow-stone-950 md:text-4xl lg:text-5xl">
                    {movie.name || movie.title}
                  </h1>

                  {/* Mô tả */}
                  <p className="mb-8 text-base text-gray-300 line-clamp-3">
                    {movie.overview || "Không có mô tả chi tiết."}
                  </p>

                  {/* Các nút bấm */}
                  <div className="flex items-center space-x-6 md:space-x-8">
                    <Link to={`/tv/${movie.id}/trailer`}>
                      <FontAwesomeIcon
                        icon={faCirclePlay}
                        className="cursor-pointer text-6xl transition-colors duration-200 hover:text-red-500 md:text-7xl"
                      />
                    </Link>

                    <div className="flex items-center space-x-4">
                      <FontAwesomeIcon
                        icon={faHeart}
                        onClick={(e) => handleFavoriteClick(e, movie)}
                        className={`cursor-pointer text-3xl transition-colors duration-200 md:text-4xl ${
                          isFavorite
                            ? "text-red-500"
                            : "text-white hover:text-red-500"
                        }`}
                      />
                      <Link to={`/tv/${movie.id}`}>
                        <FontAwesomeIcon
                          icon={faCircleInfo}
                          className="cursor-pointer text-3xl text-white transition-colors duration-200 hover:text-red-500 md:text-4xl"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Carousel>

      {/* THANH THUMBNAIL TÙY CHỈNH */}
      <div className="absolute bottom-10 right-10 z-40 hidden md:flex space-x-2 p-1 bg-black bg-opacity-30 rounded-lg">
        {topAnime.map((movie, index) => (
          <div
            key={movie.id}
            onClick={() => setSelectedIndex(index)}
            className={`
              w-16 h-10 md:w-20 md:h-12 
              relative cursor-pointer overflow-hidden rounded-md 
              shadow-lg transform transition-all duration-300
              ${
                selectedIndex === index
                  ? "ring-2 ring-yellow-500 ring-offset-2 ring-offset-black scale-105"
                  : "opacity-70 hover:opacity-100"
              }
            `}
          >
            <img
              src={`${IMAGE_BASE_URL}w200${movie.poster_path}`}
              alt={`Thumbnail for ${movie.name || movie.title}`}
              className="w-full h-full object-cover"
            />
            {selectedIndex !== index && (
              <div className="absolute inset-0 bg-black opacity-30"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerList;
