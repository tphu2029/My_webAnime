import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import login_img from "../assets/img/Chainsaw-Man-Reze_Death.jpg";
import { faTimes } from "@fortawesome/free-solid-svg-icons"; // Thêm faCheckCircle cho thành công

function LoginModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  // Hàm ngăn click bên trong modal làm modal đóng
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    // Lớp phủ tối (Overlay)
    <div
      className="fixed inset-0 bg-opacity-50 z-[100] flex items-center justify-center backdrop-blur-lg transition-shadow  "
      onClick={onClose}
    >
      {/* Hộp Modal chính - Thay đổi màu nền, kích thước và bo góc */}
      <div
        className="bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full relative overflow-hidden" // Tăng max-w lên 2xl (48rem) và dùng bg-gray-900
        onClick={handleModalClick}
      >
        {/* Nút Đóng Modal (Icon X) */}
        <button
          className="absolute top-3 right-3 z-10 text-gray-400 hover:text-white transition"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
        </button>

        {/* Nội dung Modal - Chia làm hai cột chính */}
        <div className="flex ">
          {/* Cột 1: Thông tin thương hiệu & Hình nền (Bên trái) */}
          <div className="w-1/2  flex flex-col items-center justify-center relative min-h-[500px]">
            <img
              src={login_img}
              alt="BackGround_Login"
              className="object-cover w-full h-full opacity-50"
            />
          </div>

          {/* Cột 2: Form Đăng nhập (Bên phải) */}
          <div className="w-1/2 p-10 bg-gray-800">
            {" "}
            {/* Dùng bg-gray-800 để tạo sự khác biệt màu nền */}
            <h3 className="text-3xl font-bold text-white mb-6 ">Đăng nhập</h3>
            <p className="text-gray-400 mb-6 text-sm ">
              Nếu chưa có tài khoản,{" "}
              <a
                href="#"
                className="text-yellow-400 hover:underline font-semibold"
              >
                đăng ký ngay
              </a>
            </p>
            {/* Form Inputs */}
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 bg-gray-700 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-yellow-500 transition"
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                className="w-full p-3 bg-gray-700 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-yellow-500 transition"
              />
            </div>
            {/* Nút Đăng nhập chính */}
            <button className="w-full py-3 mt-6 bg-yellow-500 text-gray-900 font-bold text-lg rounded-lg hover:bg-yellow-600 transition shadow-lg">
              Đăng nhập
            </button>
            <a
              href="#"
              className="block text-center text-sm text-gray-400 hover:text-white mt-4"
            >
              Quên mật khẩu?
            </a>
            {/* Đăng nhập bằng Google */}
            <button className="w-full py-3 mt-4 flex items-center justify-center space-x-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition border border-gray-600">
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
    </div>
  );
}

export default LoginModal;
