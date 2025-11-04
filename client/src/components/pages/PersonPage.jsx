import React, { useEffect, useState } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faPlus,
  faClockRotateLeft,
  faUser,
  faX,
  faPlay,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";

const apiKey = import.meta.env.VITE_API_KEY;
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
};

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function PersonPage() {
  const location = useLocation();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authUser, toggleFavorite } = useAuth();

  const pageTitle = (() => {
    if (location.pathname.includes("yeu-thich")) return "Phim yêu thích";
    if (location.pathname.includes("xem-tiep")) return "Danh sách xem tiếp";
    if (location.pathname.includes("danh-sach")) return "Danh sách cá nhân";
    return "Quản lý tài khoản";
  })();

  useEffect(() => {
    setLoading(true);
    const path = location.pathname;

    const fetchTmdbData = async (url) => {
      try {
        const res = await fetch(url, options);
        if (!res.ok) throw new Error("Lỗi khi fetch API");
        const data = await res.json();
        return data.results || [];
      } catch (err) {
        console.error(err);
        return [];
      }
    };

    if (path.includes("yeu-thich")) {
      // --- LẤY DỮ LIỆU YÊU THÍCH (từ Context) ---
      if (authUser && authUser.favorites) {
        const favoriteMovies = authUser.favorites.map((fav) => ({
          id: fav.mediaId,
          title: fav.title,
          poster: `${IMAGE_BASE_URL}${fav.posterPath}`,
          subtitle: fav.mediaType === "tv" ? "Phim bộ" : "Phim lẻ",
          mediaType: fav.mediaType,
          originalPosterPath: fav.posterPath,
          progress: null, // Yêu thích không có progress
        }));
        setMovies(favoriteMovies);
      } else {
        setMovies([]);
      }
      setLoading(false);
    } else if (path.includes("xem-tiep")) {
      // --- LẤY DỮ LIỆU "XEM TIẾP" (từ API) ---
      const url = `https://api.themoviedb.org/3/discover/tv?language=vi-VN&sort_by=popularity.desc&with_genres=16&page=2`;
      fetchTmdbData(url)
        .then((apiMovies) => {
          const continueWatchingMovies = apiMovies
            .slice(0, 10)
            .map((movie) => ({
              id: movie.id,
              title: movie.name || movie.title,
              poster: `${IMAGE_BASE_URL}${movie.poster_path}`,
              subtitle: `Tập ${Math.floor(Math.random() * 10) + 1}`,
              mediaType: "tv",
              originalPosterPath: movie.poster_path,
              progress: `${Math.floor(Math.random() * 15) + 5}/24 p`,
            }));
          setMovies(continueWatchingMovies);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // --- Logic cho /danh-sach và /tai-khoan ---
      setMovies([]);
      setLoading(false);
    }
  }, [location.pathname, authUser]);

  const menu = [
    { to: "/yeu-thich", label: "Yêu thích", icon: faHeart },
    { to: "/danh-sach", label: "Danh sách", icon: faPlus },
    { to: "/xem-tiep", label: "Xem tiếp", icon: faClockRotateLeft },
    { to: "/tai-khoan", label: "Tài khoản", icon: faUser },
  ];

  const handleRemoveFavorite = (e, movie) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({
      mediaId: String(movie.id),
      mediaType: movie.mediaType,
      posterPath: movie.originalPosterPath,
      title: movie.title,
    });
  };

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      {/* Sidebar (Ẩn trên mobile/tablet, chỉ hiện trên Desktop) */}
      <aside className="hidden lg:flex w-64 bg-[#1c1c1c] p-6 flex-col justify-between shadow-lg">
        <div>
          <h2 className="text-lg font-semibold mb-6">Quản lý tài khoản</h2>
          <nav className="flex flex-col space-y-2">
            {menu.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-150 ${
                    isActive
                      ? "bg-yellow-500 text-black font-semibold"
                      : "text-gray-300 hover:bg-gray-700"
                  }`
                }
              >
                <FontAwesomeIcon icon={item.icon} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Nội dung chính (Thêm padding-bottom để không bị menu mobile che) */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto w-full pb-20 lg:pb-8">
        <h2 className="text-2xl font-bold mb-6">{pageTitle}</h2>

        {loading ? (
          <p className="text-gray-400">Đang tải...</p>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {movies.map((movie) => (
              <div
                key={movie.id}
                // 🌟 SỬA 1: Bỏ `bg-gray-900 shadow-md` khỏi card
                className="group relative w-full cursor-pointer overflow-hidden rounded-lg transition-transform duration-300 lg:hover:scale-105"
              >
                {/* Ảnh Poster chính (luôn hiển thị) */}
                <Link to={`/${movie.mediaType}/${movie.id}`}>
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    // 🌟 SỬA 2: Thêm `lg:group-hover:opacity-30` (chỉ hover trên desktop)
                    className="w-full rounded-lg object-cover aspect-2/3 lg:group-hover:opacity-30 transition-opacity duration-300"
                  />
                </Link>

                {/* Phần chi tiết khi HOVER (Ẩn trên Mobile, chỉ hiện trên Desktop) */}
                <div
                  className="
                    absolute inset-0 flex flex-col overflow-hidden bg-black/80 text-white
                    opacity-0 transition-opacity duration-300
                    hidden lg:flex lg:group-hover:opacity-100 p-4 justify-end
                  "
                >
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">
                    {movie.title}
                  </h3>
                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                    {movie.subtitle}
                  </p>

                  {/* Các nút bấm */}
                  <div className="flex items-center space-x-2 mb-4">
                    {/* Nút Play */}
                    <Link
                      to={`/${movie.mediaType}/${movie.id}/trailer`}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 
                                   bg-yellow-500 text-black font-semibold rounded-lg 
                                   hover:bg-yellow-400 transition-colors"
                      title="Xem ngay"
                    >
                      <FontAwesomeIcon icon={faPlay} />
                      <span>Xem ngay</span>
                    </Link>

                    {/* Nút Info */}
                    <Link
                      to={`/${movie.mediaType}/${movie.id}`}
                      className="w-10 h-10 flex items-center justify-center 
                                   rounded-lg border-2 border-gray-600 
                                   text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                      title="Thông tin"
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
                    </Link>
                  </div>

                  {/* Thanh tiến trình và text (Chỉ hiện nếu có progress) */}
                  {movie.progress && (
                    <>
                      <div className="h-1 bg-gray-600 rounded overflow-hidden mb-1">
                        <div
                          className="h-full bg-yellow-400"
                          style={{ width: "66%" }} // Cần logic % thật
                        ></div>
                      </div>
                      <p className="text-gray-400 text-xs">{movie.progress}</p>
                    </>
                  )}
                </div>

                {/* Nút Xóa (Chỉ hiện ở tab Yêu thích) - Vẫn giữ riêng biệt để dễ click */}
                {location.pathname.includes("yeu-thich") && (
                  <button
                    onClick={(e) => handleRemoveFavorite(e, movie)}
                    className="
                      absolute top-2 right-2 w-7 h-7 bg-black/70 text-white 
                      rounded-full flex items-center justify-center 
                      // 🌟 SỬA 3: Thêm `lg:group-hover:opacity-100` và `hidden lg:flex`
                      opacity-0 lg:group-hover:opacity-100 transition hover:bg-red-600
                      hidden lg:flex
                    "
                    title="Xóa khỏi Yêu thích"
                  >
                    <FontAwesomeIcon icon={faX} size="sm" />
                  </button>
                )}

                {/* 🌟 SỬA 4: Hiển thị text bên dưới (Chỉ trên mobile/tablet) */}
                <div className="mt-2 text-sm lg:hidden">
                  {movie.progress && (
                    <div className="h-1 bg-gray-600 rounded overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: "66%" }}
                      ></div>
                    </div>
                  )}
                  <p className="mt-1 text-gray-300 font-semibold truncate">
                    {movie.title}
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    {movie.subtitle}
                  </p>
                  {movie.progress && (
                    <p className="text-gray-500 text-xs mt-1">
                      {movie.progress}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64 bg-gray-900 rounded-lg">
            <p className="text-gray-400">
              {location.pathname.includes("yeu-thich") && !authUser
                ? "Vui lòng đăng nhập để xem mục yêu thích."
                : "Bạn chưa có phim nào trong mục này."}
            </p>
          </div>
        )}
      </main>

      {/* Footer Menu Mobile */}
      <footer className="fixed bottom-0 left-0 right-0 lg:hidden bg-[#1c1c1c] border-t border-gray-800 z-10">
        <nav className="flex justify-around items-center h-16">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full transition-colors duration-150 ${
                  isActive
                    ? "text-yellow-500"
                    : "text-gray-300 hover:text-yellow-500"
                }`
              }
            >
              <FontAwesomeIcon icon={item.icon} className="text-xl" />
              <span className="text-xs mt-1">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </footer>
    </div>
  );
}
