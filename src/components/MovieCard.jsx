import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlayCircle,
  faHeart,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MovieCard = ({ movie }) => {
  if (!movie || !movie.poster_path) {
    return null;
  }

  const movieDetails = {
    title: movie.title || movie.name,
    originalTitle: movie.original_title || movie.original_name || "",
    rating:
      typeof movie.vote_average === "number"
        ? movie.vote_average.toFixed(1)
        : null,
    votes: typeof movie.vote_count === "number" ? movie.vote_count : null,
    year: (movie.release_date || movie.first_air_date)?.substring(0, 4) || null,
    overview: movie.overview || "",
  };

  const mediaType = movie.title ? "movie" : "tv";

  return (
    <div className="group relative w-full cursor-pointer overflow-hidden rounded-lg bg-gray-900 shadow-md transition-transform duration-300 hover:scale-105">
      {/* Container chính của card, dùng aspect-ratio [2/3] */}
      <div className="aspect-[2/3]">
        {/* === 1. VÙNG LINK CHO MOBILE === */}
        {/* Link này bao trọn thẻ, hiển thị poster, và BIẾN MẤT trên desktop (lg:hidden) */}
        <Link
          to={`/${mediaType}/${movie.id}`}
          className="absolute inset-0 lg:hidden" // Chỉ hoạt động trên mobile
        >
          <img
            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movieDetails.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </Link>

        {/* === 2. VÙNG POSTER CHO DESKTOP (KHÔNG CÓ LINK) === */}
        {/* Vùng này chỉ để hiển thị, sẽ bị che bởi hover zone khi hover */}
        <div className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0 hidden lg:block">
          {" "}
          {/* Chỉ hoạt động trên desktop */}
          <img
            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movieDetails.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* === 3. PHẦN CHI TIẾT KHI HOVER (CHỈ HIỆN TRÊN DESKTOP) === */}
        <div
          className="
            absolute inset-0 flex-col overflow-hidden bg-gray-900 
            opacity-0 transition-opacity duration-500 
            hidden lg:flex lg:group-hover:opacity-100
          "
        >
          {/* Ảnh nền backdrop */}
          <div
            className="h-1/2 w-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${IMAGE_BASE_URL}${movie.backdrop_path})`,
            }}
          ></div>

          {/* Nội dung chi tiết phim */}
          <div className="flex h-1/2 flex-col justify-between p-3 text-white">
            <div>
              <h3 className="truncate text-base font-bold">
                {movieDetails.title}
              </h3>
              <p className="truncate text-xs text-gray-400">
                {movieDetails.originalTitle}
              </p>
            </div>

            {/* Các nút bấm */}
            <div className="flex items-center space-x-2">
              {/* Nút Play (đã sửa) */}
              <Link
                to={`/${mediaType}/${movie.id}/trailer`}
                className="flex flex-1"
              >
                <button className="flex w-full items-center justify-center rounded-lg bg-yellow-500 px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-yellow-600">
                  <FontAwesomeIcon icon={faPlayCircle} className="mr-1.5" />
                  Xem
                </button>
              </Link>
              {/* Nút Heart */}
              <button className="rounded-lg border-2 border-gray-600 p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white">
                <FontAwesomeIcon icon={faHeart} />
              </button>
              {/* Nút Info */}
              <Link to={`/${mediaType}/${movie.id}`}>
                <button className="rounded-lg border-2 border-gray-600 p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white">
                  <FontAwesomeIcon icon={faInfoCircle} />
                </button>
              </Link>
            </div>

            {/* Thông tin phụ */}
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              {movieDetails.rating && (
                <span className="font-semibold text-green-400">
                  {movieDetails.rating} Điểm
                </span>
              )}
              {movieDetails.year && <span>{movieDetails.year}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
