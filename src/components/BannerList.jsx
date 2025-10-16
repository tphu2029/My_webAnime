import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  faCirclePlay,
  faHeart,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";

// --- TMDB CONFIGURATION ---
const API_URL = `https://api.themoviedb.org/3/discover/tv?language=vi-VN&sort_by=popularity.desc&with_genres=16&without_genres=10751,35&page=1`;
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
          .slice(0, 5);
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
      <div className="text-white text-center p-10 h-[700px] bg-gray-900 flex items-center justify-center">
        Đang tải dữ liệu Banner...
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center p-10 h-[700px] bg-gray-900 flex items-center justify-center">
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
        autoPlay={true}
        infiniteLoop={true}
        interval={5000}
        stopOnHover={true}
        selectedItem={selectedIndex}
        onChange={setSelectedIndex}
        className="custom-carousel"
      >
        {topAnime.map((movie) => (
          <div
            key={movie.id}
            className="relative h-[700px] text-white overflow-hidden"
          >
            {/* Lớp nền chính là ảnh backdrop */}
            <img
              src={`${IMAGE_BASE_URL}w1280${movie.backdrop_path}`}
              alt={movie.name || movie.title}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />

            {/* Overlay gradient và blur để làm nổi bật nội dung */}
            <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/70 via-transparent to-transparent z-20"></div>

            {/* Container nội dung */}
            <div className="relative z-30 flex flex-col items-start justify-center h-full p-4 md:p-10 lg:p-20">
              <div className="max-w-xl text-left">
                <p className="text-sm mb-2 text-red-500 font-bold">
                  {movie.original_name || movie.original_title || movie.name}
                </p>
                <h1 className="text-4xl font-extrabold mb-4 line-clamp-2 text-shadow-2xs shadow-stone-950">
                  {movie.name || movie.title}
                </h1>
                <div className="flex items-center space-x-4 mb-4 text-sm font-semibold">
                  <span className="bg-yellow-500 text-black px-2 py-1 rounded">
                    IMDb{" "}
                    {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                  </span>
                  <span>HD</span>
                  <span>
                    {movie.first_air_date
                      ? movie.first_air_date.split("-")[0]
                      : movie.release_date?.split("-")[0]}
                  </span>
                  <span>TV Show</span>
                </div>
                <p className="text-base mb-8 text-gray-300 line-clamp-3">
                  {movie.overview || "Không có mô tả chi tiết."}
                </p>
                {/* PLAY + THONG TIN */}
                <div className="flex items-center space-x-15">
                  <a href="#Intro">
                    <FontAwesomeIcon
                      icon={faCirclePlay}
                      className="text-7xl hover:text-red-500 cursor-pointer transition-colors duration-200"
                    />
                  </a>
                  <div className="flex items-center space-x-4">
                    <FontAwesomeIcon
                      icon={faHeart}
                      className="text-4xl text-white cursor-pointer hover:text-red-500 transition-colors duration-200"
                    />
                    <FontAwesomeIcon
                      icon={faCircleInfo}
                      className="text-4xl text-white cursor-pointer hover:text-red-500 transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
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
