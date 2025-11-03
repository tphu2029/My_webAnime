import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faPlus,
  faClockRotateLeft,
  faBell,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const PersonLayout = () => {
  const menu = [
    { to: "/nguoi-dung/yeu-thich", label: "Yêu thích", icon: faHeart },
    { to: "/nguoi-dung/danh-sach", label: "Danh sách", icon: faPlus },
    { to: "/nguoi-dung/xem-tiep", label: "Xem tiếp", icon: faClockRotateLeft },
    { to: "/nguoi-dung/thong-bao", label: "Thông báo", icon: faBell },
    { to: "/nguoi-dung/tai-khoan", label: "Tài khoản", icon: faUser },
  ];

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1c1c1c] p-6 flex flex-col justify-between shadow-lg">
        <div>
          <h2 className="text-lg font-semibold mb-6">Quản lý tài khoản</h2>
          <nav className="flex flex-col space-y-2">
            {menu.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md relative transition-all ${
                    isActive
                      ? "bg-yellow-500 text-black font-semibold"
                      : "text-gray-300 hover:bg-gray-700"
                  }`
                }
              >
                <FontAwesomeIcon icon={item.icon} />
                {item.label}
                {/* thanh bên trái khi active */}
                <span
                  className={({ isActive }) =>
                    isActive
                      ? "absolute left-0 top-0 h-full w-1 bg-yellow-300 rounded-r-md"
                      : ""
                  }
                ></span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Avatar user */}
        <div className="flex flex-col items-center mt-10">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="User Avatar"
            className="w-14 h-14 rounded-full border-2 border-gray-500 mb-2"
          />
          <p className="text-sm text-gray-400">Tài khoản của tôi</p>
        </div>
      </aside>

      {/* Nội dung trang con */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default PersonLayout;
