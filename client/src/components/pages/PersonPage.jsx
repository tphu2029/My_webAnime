import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilm,
  faUserFriends,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const MovieCard = ({ movie }) => (
  <div className="aspect-2/3 bg-gray-800 rounded-lg overflow-hidden">
    <img
      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
      alt={movie.name}
      className="w-full h-full object-cover"
    />
  </div>
);

const sampleMovies = [
  {
    id: 129133,
    name: "Thám Tử Lừng Danh Conan: Tàu Ngầm Sắt Màu Đen",
    poster_path: "/yDPwJJbVoaSbBWa3rXorjUJGv0o.jpg",
  },
  {
    id: 85937,
    name: "Spy x Family",
    poster_path: "/3Rrf8tqgA2t42s2vEyfsTqDVSaL.jpg",
  },
  {
    id: 999708,
    name: "Totto-Chan: Cô Bé Bên Cửa Sổ",
    poster_path: "/nh3GkA4Hq2fN5iVQX9E0X3kdo0.jpg",
  },
];

const PersonPage = ({
  title,
  apiEndpoint,
  emptyMessage,
  showTabs = false,
  showAddButton = false,
}) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("phim");

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      if (title.includes("xem tiếp")) setMovies(sampleMovies);
      else setMovies([]);
      setLoading(false);
    }, 500);
  }, [apiEndpoint, title]);

  const tabButton = (tab, icon, label) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`py-2 px-5 rounded-full font-semibold transition-colors ${
        activeTab === tab
          ? "bg-white text-gray-900"
          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
      }`}
    >
      <FontAwesomeIcon icon={icon} className="mr-2" />
      {label}
    </button>
  );

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {showAddButton && (
          <button className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
            <FontAwesomeIcon icon={faPlus} />
            Thêm mới
          </button>
        )}
      </div>

      {/* Tabs */}
      {showTabs && (
        <div className="flex gap-4 mb-6">
          {tabButton("phim", faFilm, "Phim")}
          {tabButton("dienvien", faUserFriends, "Diễn viên")}
        </div>
      )}

      {/* Lưới phim */}
      {loading ? (
        <p className="text-gray-400">Đang tải...</p>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
          {movies.map((movie) => (
            <div key={movie.id} className="relative group">
              <MovieCard movie={movie} />
              <button className="absolute top-2 right-2 w-6 h-6 bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                &times;
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-48 bg-gray-900 rounded-lg">
          <p className="text-gray-400">
            {activeTab === "dienvien"
              ? "Bạn chưa có diễn viên yêu thích nào."
              : emptyMessage}
          </p>
        </div>
      )}
    </div>
  );
};

export default PersonPage;
