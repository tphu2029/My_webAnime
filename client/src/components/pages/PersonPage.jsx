import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faPlus,
  faClockRotateLeft,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

// Bạn nên thay thế bằng dữ liệu thật của mình
const sampleMovies = [
  {
    id: 1,
    title: "Jujutsu Kaisen",
    subtitle: "Tập 24",
    poster: "https://via.placeholder.com/300x450.png?text=Phim+1", // Ảnh mẫu
    progress: "20/24 phút",
  },
  {
    id: 2,
    title: "Berserk",
    subtitle: "Tập 12",
    poster: "https://via.placeholder.com/300x450.png?text=Phim+2", // Ảnh mẫu
    progress: "15/23 phút",
  },
  {
    id: 3,
    title: "Anime Mẫu 3",
    subtitle: "Tập 1",
    poster: "https://via.placeholder.com/300x450.png?text=Phim+3", // Ảnh mẫu
    progress: "5/25 phút",
  },
];

export default function PersonPage() {
  const location = useLocation();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const pageTitle = (() => {
    if (location.pathname.includes("yeu-thich")) return "Phim yêu thích";
    if (location.pathname.includes("xem-tiep")) return "Danh sách xem tiếp";
    if (location.pathname.includes("danh-sach")) return "Danh sách cá nhân";
    return "Quản lý tài khoản";
  })();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // Giờ đây 'sampleMovies' đã được định nghĩa và sẽ hoạt động
      if (location.pathname.includes("xem-tiep")) setMovies(sampleMovies);
      else if (location.pathname.includes("yeu-thich")) setMovies([]);
      else setMovies([]);
      setLoading(false);
    }, 400);
  }, [location.pathname]);

  const menu = [
    { to: "/yeu-thich", label: "Yêu thích", icon: faHeart },
    { to: "/danh-sach", label: "Danh sách", icon: faPlus },
    { to: "/xem-tiep", label: "Xem tiếp", icon: faClockRotateLeft },
    { to: "/tai-khoan", label: "Tài khoản", icon: faUser },
  ];

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

      {/*  Nội dung chính (Thêm padding-bottom để không bị menu mobile che) */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto w-full pb-20 lg:pb-8">
        <h2 className="text-2xl font-bold mb-6">{pageTitle}</h2>

        {loading ? (
          <p className="text-gray-400">Đang tải...</p>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {movies.map((movie) => (
              <div key={movie.id} className="relative group">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full rounded-lg object-cover"
                />
                <button className="absolute top-2 right-2 w-7 h-7 bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  ×
                </button>
                <div className="mt-2 text-sm">
                  <div className="h-1 bg-gray-600 rounded overflow-hidden">
                    <div className="h-full w-2/3 bg-yellow-400"></div>
                  </div>
                  <p className="mt-1 text-gray-300 font-semibold truncate">
                    {movie.title}
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    {movie.subtitle}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{movie.progress}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64 bg-gray-900 rounded-lg">
            <p className="text-gray-400">Bạn chưa có phim nào trong mục này.</p>
          </div>
        )}
      </main>

      {/* 🌟 FIX 4: Thêm Menu Footer cho Mobile/Tablet (Chỉ hiện khi < lg) */}
      <footer className="fixed bottom-0 left-0 right-0 lg:hidden bg-[#1c1c1c] border-t border-gray-800 z-10">
        <nav className="flex justify-around items-center h-16">
          {/* Tái sử dụng mảng 'menu' để tạo thanh điều hướng mobile */}
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
