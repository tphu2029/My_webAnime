import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlayCircle,
  faHeart,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MovieCard = ({ movie }) => {
  if (!movie || !movie.poster_path) {
    return null;
  }

  const movieDetails = {
    title: movie.title || movie.name,
    originalTitle: movie.original_title || movie.original_name,
    ratingImdb: "5.2",
    resolution: "4K",
    ageRating: "T16",
    year:
      (movie.release_date || movie.first_air_date)?.substring(0, 4) || "2025",
    duration: "1h 40m",
    genres: ["Tình Cảm", "Hài", "Tâm Lý", "Lãng Mạn"],
  };

  return (
    <div className="relative group w-[200px] h-[300px]">
      {/* Container của nội dung card, sẽ phóng to và nổi lên */}
      <div
        className="
          absolute inset-0 bg-gray-900 rounded-lg shadow-lg
          transition-all duration-500 transform
          group-hover:z-50 
          group-hover:w-[400px] group-hover:h-[450px]
          group-hover:-translate-x-1/4 group-hover:-translate-y-1/4
          group-hover:rounded-xl group-hover:shadow-2xl 
          group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]
          group-hover:shadow-black/50
          overflow-hidden
        "
      >
        {/* Lớp phủ chứa ảnh nền và nội dung chi tiết */}
        <div className="absolute inset-0 bg-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col overflow-visible">
          {/* Ảnh nền ở trên cùng, sẽ tràn ra ngoài */}
          <div
            className="w-full h-2/3 mb-5 bg-cover bg-center rounded-t-lg transition-transform duration-500 transform group-hover:scale-110 group-hover:origin-center"
            style={{
              backgroundImage: `url(${IMAGE_BASE_URL}${movie.backdrop_path})`,
            }}
          ></div>

          {/* Nội dung chi tiết phim */}
          <div className="flex-1 p-4 text-white flex flex-col justify-between">
            {/* Tiêu đề */}
            <div>
              <h3 className="text-xl font-bold truncate">
                {movieDetails.title}
              </h3>
              <p className="text-sm text-gray-400">Play Dirty</p>
            </div>

            {/* Các nút bấm */}
            <div className="flex justify-between items-center my-4 space-x-2">
              <button className="flex-1 px-4 py-2 bg-yellow-500 text-black text-sm font-semibold rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center">
                <FontAwesomeIcon icon={faPlayCircle} className="mr-2" />
                Xem ngay
              </button>
              <button className="p-2 rounded-lg border-2 border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faHeart} />
              </button>
              <button className="p-2 rounded-lg border-2 border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faInfoCircle} />
              </button>
            </div>

            {/* Thông tin phụ: IMDb, 4K, T16, Năm, Thời lượng */}
            <div className="flex items-center text-xs text-gray-400 space-x-2 mb-2">
              <span className="bg-yellow-500 text-black px-1 rounded font-semibold">
                IMDb {movieDetails.ratingImdb}
              </span>
              <span className="border border-gray-600 px-1 rounded">
                {movieDetails.resolution}
              </span>
              <span className="border border-gray-600 px-1 rounded">
                {movieDetails.ageRating}
              </span>
              <span>{movieDetails.year}</span>
              <span>{movieDetails.duration}</span>
            </div>

            {/* Thể loại */}
            <p className="text-xs text-gray-400">
              {movieDetails.genres.join(" • ")}
            </p>
          </div>
        </div>

        {/* Phần hiển thị ban đầu (chỉ ảnh poster) - giữ nguyên để ẩn/hiện */}
        <div className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0">
          <img
            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movieDetails.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
