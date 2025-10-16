import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

// --- TMDB CONFIGURATION ---
const API_URL = `https://api.themoviedb.org/3/discover/tv?language=vi-VN&sort_by=popularity.desc&with_genres=16&without_genres=10751,35&page=1`;
const IMAGE_BASE_URL = import.meta.env.VITE_IMG_URL;
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
            {/* LỚP NỀN BLURRED TOÀN MÀN HÌNH (nhưng nằm dưới cùng) */}
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-lg brightness-100 z-0 "
              style={{
                backgroundImage: `url(${IMAGE_BASE_URL}${movie.backdrop_path})`,
              }}
            ></div>

            {/* CONTAINER FLEX CHÍNH: Chứa cả văn bản và ảnh, được căn giữa theo chiều dọc */}
            <div className="absolute inset-0 flex items-center justify-start z-30">
              {/* VÙNG CHỨA CHI TIẾT PHIM (Văn bản và nút): CHIỀU RỘNG CỐ ĐỊNH */}
              <div className="flex-shrink-0 w-full md:w-[450px] lg:w-[500px] p-10 md:p-20 text-center ">
                <p className="text-sm  mb-2 text-red-500 font-bold ">
                  {movie.original_name || movie.original_title || movie.name}
                </p>
                <h1
                  className="text-4xl font-extrabold mb-4 line-clamp-2 text-shadow-2xs shadow-stone-950"
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                >
                  {movie.name || movie.title}
                </h1>
                <div className="flex items-center justify-center space-x-4 mb-4 text-sm font-semibold line">
                  <span className="bg-yellow-500 text-black px-2 py-1 rounded line">
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
                {/* PLAY + THONG TIN (INTRO) */}
                <div className="flex items-center justify-center space-x-15 ">
                  <a href="#Intro">
                    <a href="#Intro">
                      <FontAwesomeIcon
                        icon={faCirclePlay}
                        className="text-7xl hover:text-red-500 cursor-pointer transition-colors duration-200 filter "
                      />
                    </a>
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

              {/* LỚP ẢNH CHÍNH SẮC NÉT (Nằm bên phải vùng văn bản, chiếm phần còn lại) */}
              {/* Flex-grow để nó chiếm hết không gian còn lại, và flex để tự căn giữa ảnh bên trong */}
              <div className="flex-grow flex items-center justify-center h-full  ">
                <img
                  src={`${IMAGE_BASE_URL}${movie.backdrop_path}`}
                  alt={movie.name || movie.title}
                  // object-contain: Giữ nguyên tỷ lệ, căn giữa, không cắt ảnh.
                  // w-full h-full: Đảm bảo ảnh chiếm hết không gian của div cha (flex-grow)
                  className="w-full h-full object-contain "
                />
              </div>
            </div>

            {/* OVERLAY GRADIENT: Giờ chỉ cần làm gradient từ trái qua để làm mờ vùng văn bản */}
            {/* Loại bỏ gradient từ phải qua để ảnh không bị tối ở giữa */}
            <div
              className="absolute inset-0 
                           z-20"
            >
              {/* Gradient từ dưới lên vẫn giữ nguyên để che chân ảnh */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent"></div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* THANH THUMBNAIL TÙY CHỈNH (Giữ nguyên, nhưng z-index cao hơn) */}
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
              src={`${IMAGE_BASE_URL.replace("original", "w200")}${
                movie.poster_path
              }`}
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
