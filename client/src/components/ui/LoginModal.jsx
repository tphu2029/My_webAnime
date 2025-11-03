import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import login_img from "../../assets/img/img_login.jpg";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";

function LoginModal({ isOpen, onClose }) {
  //State cho modal
  const { login, signup } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);

  //State cho form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  //State cho loading và error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  // Hàm reset form khi chuyển tab
  const toggleView = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(false);
    setIsLoginView(!isLoginView);
    // Reset fields
    setUsername("");
    setPassword("");
    setEmail("");
    setFirstName("");
    setLastName("");
  };

  // Hàm xử lý submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLoginView) {
        // --- ĐĂNG NHẬP ---
        if (!username || !password) {
          throw new Error("Vui lòng nhập Tên đăng nhập và Mật khẩu.");
        }
        await login(username, password);
      } else {
        // --- ĐĂNG KÝ ---
        if (!username || !password || !email || !firstName || !lastName) {
          throw new Error("Vui lòng nhập đầy đủ thông tin.");
        }
        await signup({
          username,
          password,
          email,
          firstName,
          lastName,
        });
      }
      onClose(); // Đóng modal nếu thành công
    } catch (err) {
      // Hiển thị lỗi từ server (nếu có) hoặc lỗi chung
      setError(
        err.response?.data?.message ||
          err.message ||
          "Đã có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // Lớp phủ tối
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
          {/* SỬA: Tiêu đề động */}
          <h3 className="mb-6 text-3xl font-bold text-white">
            {isLoginView ? "Đăng nhập" : "Đăng ký"}
          </h3>
          <p className="mb-6 text-sm text-gray-400">
            {/* SỬA: Nút chuyển đổi view */}
            {isLoginView ? "Nếu chưa có tài khoản, " : "Đã có tài khoản? "}
            <a
              href="#"
              onClick={toggleView}
              className="font-semibold text-yellow-400 hover:underline"
            >
              {isLoginView ? "đăng ký ngay" : "đăng nhập ngay"}
            </a>
          </p>

          {/* Bọc form và thêm onSubmit */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* --- Chỉ hiển thị khi ĐĂNG KÝ --- */}
            {!isLoginView && (
              <>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Họ"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-3 text-white transition bg-gray-700 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
                  />
                  <input
                    type="text"
                    placeholder="Tên"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-3 text-white transition bg-gray-700 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 text-white transition bg-gray-700 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
                />
              </>
            )}

            {/* --- Hiển thị ở cả 2 view --- */}
            <input
              type="text"
              placeholder="Tên đăng nhập "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 text-white transition bg-gray-700 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 text-white transition bg-gray-700 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
            />

            {/* Hiển thị lỗi */}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* Nút Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-6 text-lg font-bold text-gray-900 transition bg-yellow-500 rounded-lg shadow-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Đang xử lý..."
                : isLoginView
                ? "Đăng nhập"
                : "Đăng ký"}
            </button>
          </form>
          {/* --- Hết Form --- */}

          {isLoginView && (
            <a
              href="#"
              className="block mt-4 text-sm text-center text-gray-400 hover:text-white"
            >
              Quên mật khẩu?
            </a>
          )}

          {isLoginView && (
            <button className="flex items-center justify-center w-full py-3 mt-4 space-x-2 font-semibold text-white transition bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span>Đăng nhập bằng Google</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
