import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import login_img from "../../assets/img/img_login.jpg";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

function LoginModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    // Lớp phủ tối (Overlay)
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-opacity-60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* CONTAINER MODAL CHÍNH - Responsive */}
      <div
        className="
          relative flex w-full h-full overflow-y-auto bg-gray-900 text-white
          md:h-auto md:max-w-2xl md:rounded-lg md:shadow-2xl
        "
        onClick={handleModalClick}
      >
        {/* Nút Đóng Modal */}
        <button
          className="absolute z-10 text-gray-400 transition top-4 right-4 hover:text-white"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
        </button>

        {/* --- Cột 1: HÌNH ẢNH (Bên trái) --- */}
        {/* 'hidden' để ẩn trên mobile, 'md:block' để hiện lại từ tablet trở lên */}
        <div className="hidden md:block md:w-1/2 min-h-[500px] relative">
          <img
            src={login_img}
            alt="BackGround_Login"
            className="absolute top-0 left-0 object-cover w-full h-full opacity-50"
          />
        </div>

        {/* --- Cột 2: FORM ĐĂNG NHẬP (Bên phải) --- */}
        {/* 'w-full' để chiếm hết màn hình mobile, 'md:w-1/2' trên desktop */}
        <div className="flex flex-col justify-center w-full p-10 bg-gray-800 md:w-1/2">
          <h3 className="mb-6 text-3xl font-bold text-white">Đăng nhập</h3>
          <p className="mb-6 text-sm text-gray-400">
            Nếu chưa có tài khoản,{" "}
            <a
              href="#"
              className="font-semibold text-yellow-400 hover:underline"
            >
              đăng ký ngay
            </a>
          </p>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 text-white transition bg-gray-700 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              className="w-full p-3 text-white transition bg-gray-700 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
            />
          </div>

          <button className="w-full py-3 mt-6 text-lg font-bold text-gray-900 transition bg-yellow-500 rounded-lg shadow-lg hover:bg-yellow-600">
            Đăng nhập
          </button>
          <a
            href="#"
            className="block mt-4 text-sm text-center text-gray-400 hover:text-white"
          >
            Quên mật khẩu?
          </a>

          <button className="flex items-center justify-center w-full py-3 mt-4 space-x-2 font-semibold text-white transition bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Đăng nhập bằng Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
