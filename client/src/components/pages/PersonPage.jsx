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
  faCamera,
} from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

// --- Cấu hình API (cho tab Xem tiếp) ---
const apiKey = import.meta.env.VITE_API_KEY;
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
};
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
// ------------------------------------

export default function PersonPage() {
  const location = useLocation();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authUser, toggleFavorite, updateUserProfile, updateUserPassword } =
    useAuth();

  //State cho trang Tài khoản
  const [activeTab, setActiveTab] = useState("info"); // 'info' hoặc 'password'
  const [formData, setFormData] = useState({
    displayName: "",
    phone: "",
    bio: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [infoLoading, setInfoLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [infoError, setInfoError] = useState(null);
  const [passError, setPassError] = useState(null);

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
      // --- LẤY DỮ LIỆU YÊU THÍCH ---
      if (authUser && authUser.favorites) {
        const favoriteMovies = authUser.favorites.map((fav) => ({
          id: fav.mediaId,
          title: fav.title,
          poster: `${IMAGE_BASE_URL}${fav.posterPath}`,
          subtitle: fav.mediaType === "tv" ? "Phim bộ" : "Phim lẻ",
          mediaType: fav.mediaType,
          originalPosterPath: fav.posterPath,
          progress: null,
        }));
        setMovies(favoriteMovies);
      } else {
        setMovies([]);
      }
      setLoading(false);
    } else if (path.includes("xem-tiep")) {
      // --- LẤY DỮ LIỆU "XEM TIẾP" (API) ---
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
      // --- TRANG TÀI KHOẢN hoặc DANH SÁCH ---
      setMovies([]);
      setLoading(false);
      if (path.includes("tai-khoan") && authUser) {
        setFormData({
          displayName: authUser.displayName || "",
          phone: authUser.phone || "",
          bio: authUser.bio || "",
        });
      }
    }
  }, [location.pathname, authUser]);

  // Các hàm cho form Tài khoản
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setInfoLoading(true);
    setInfoError(null);
    try {
      // Gọi hàm từ context
      await updateUserProfile(formData);
      // Toast.success đã được gọi bên trong context
    } catch (err) {
      setInfoError(err.message || "Lỗi không xác định");
      toast.error(err.message || "Lỗi không xác định");
    } finally {
      setInfoLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPassError("Mật khẩu mới không khớp!");
      return;
    }
    setPassLoading(true);
    setPassError(null);
    try {
      // Gọi hàm từ context
      await updateUserPassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      // Toast.success đã được gọi bên trong context
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPassError(err.message || "Lỗi không xác định");
      toast.error(err.message || "Lỗi không xác định");
    } finally {
      setPassLoading(false);
    }
  };

  // Hàm xóa yêu thích (cho tab Yêu thích)
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

  // --- Menu Sidebar ---
  const menu = [
    { to: "/yeu-thich", label: "Yêu thích", icon: faHeart },
    { to: "/danh-sach", label: "Danh sách", icon: faPlus },
    { to: "/xem-tiep", label: "Xem tiếp", icon: faClockRotateLeft },
    { to: "/tai-khoan", label: "Tài khoản", icon: faUser },
  ];

  const renderAccountPage = () => (
    <div className="max-w-4xl mx-auto">
      {/* --- Tabs --- */}
      <div className="flex border-b border-gray-700 mb-8">
        <button
          onClick={() => setActiveTab("info")}
          className={`py-3 px-6 font-semibold transition-colors ${
            activeTab === "info"
              ? "border-b-2 border-yellow-500 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Thông tin
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`py-3 px-6 font-semibold transition-colors ${
            activeTab === "password"
              ? "border-b-2 border-yellow-500 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Đổi mật khẩu
        </button>
      </div>

      {/* --- Nội dung Tab --- */}
      {activeTab === "info" && (
        <form onSubmit={handleInfoSubmit}>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cột Avatar */}
            <div className="shrink-0 flex flex-col items-center gap-4 w-full lg:w-48">
              {authUser?.avatarUrl ? (
                <img
                  src={authUser.avatarUrl}
                  alt="Avatar"
                  className="w-48 h-48 rounded-full object-cover border-4 border-gray-700"
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-700">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-6xl text-gray-500"
                  />
                </div>
              )}
              <button
                type="button"
                className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faCamera} />
                Đổi ảnh
              </button>
            </div>

            {/* Cột Thông tin */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Tên hiển thị
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInfoChange}
                  className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-500 focus:ring-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  value={authUser?.username || ""}
                  disabled
                  className="w-full p-3 bg-gray-900 rounded-lg border border-gray-700 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={authUser?.email || ""}
                  disabled
                  className="w-full p-3 bg-gray-900 rounded-lg border border-gray-700 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInfoChange}
                  className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-500 focus:ring-yellow-500 outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Giới thiệu (Bio)
                </label>
                <textarea
                  name="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleInfoChange}
                  className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-500 focus:ring-yellow-500 outline-none"
                ></textarea>
              </div>
            </div>
          </div>
          {infoError && <p className="text-red-500 mt-4">{infoError}</p>}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={infoLoading}
              className="py-2 px-6 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              {infoLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      )}

      {activeTab === "password" && (
        <form onSubmit={handlePasswordSubmit} className="max-w-md mx-auto">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Mật khẩu cũ
              </label>
              <input
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                required
                className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-500 focus:ring-yellow-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Mật khẩu mới
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-500 focus:ring-yellow-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-500 focus:ring-yellow-500 outline-none"
              />
            </div>
          </div>
          {passError && <p className="text-red-500 mt-4">{passError}</p>}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={passLoading}
              className="py-2 px-6 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              {passLoading ? "Đang lưu..." : "Đổi mật khẩu"}
            </button>
          </div>
        </form>
      )}
    </div>
  );

  const renderMovieGrid = () =>
    loading ? (
      <p className="text-gray-400">Đang tải...</p>
    ) : movies.length > 0 ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="group relative w-full cursor-pointer overflow-hidden rounded-lg transition-transform duration-300 lg:hover:scale-105"
          >
            {/* Ảnh Poster chính (luôn hiển thị) */}
            <Link to={`/${movie.mediaType}/${movie.id}`}>
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full rounded-lg object-cover aspect-2/3 lg:group-hover:opacity-30 transition-opacity duration-300"
              />
            </Link>

            {/* Phần chi tiết khi HOVER (Ẩn trên Mobile, chỉ hiện trên Desktop) */}
            <div
              className="
                absolute inset-0 flex-col overflow-hidden bg-black/80 text-white
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

              <div className="flex items-center space-x-2 mb-4">
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

              {movie.progress && (
                <>
                  <div className="h-1 bg-gray-600 rounded overflow-hidden mb-1">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: "66%" }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-xs">{movie.progress}</p>
                </>
              )}
            </div>

            {/* Nút Xóa (Chỉ hiện ở tab Yêu thích) */}
            {location.pathname.includes("yeu-thich") && (
              <button
                onClick={(e) => handleRemoveFavorite(e, movie)}
                className="
                  absolute top-2 right-2 w-7 h-7 bg-black/70 text-white 
                  rounded-full flex items-center justify-center 
                  opacity-0 lg:group-hover:opacity-100 transition hover:bg-red-600 lg:flex
                "
                title="Xóa khỏi Yêu thích"
              >
                <FontAwesomeIcon icon={faX} size="sm" />
              </button>
            )}

            {/* Text bên dưới (Chỉ trên mobile/tablet) */}
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
              <p className="text-gray-400 text-xs truncate">{movie.subtitle}</p>
              {movie.progress && (
                <p className="text-gray-500 text-xs mt-1">{movie.progress}</p>
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
    );
  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      {/* Sidebar */}
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

      {/* Nội dung chính: RENDER CÓ ĐIỀU KIỆN */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto w-full pb-20 lg:pb-8">
        <h2 className="text-2xl font-bold mb-6">{pageTitle}</h2>

        {
          location.pathname.includes("tai-khoan")
            ? renderAccountPage() // Hiển thị form tài khoản
            : renderMovieGrid() // Hiển thị lưới phim
        }
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
