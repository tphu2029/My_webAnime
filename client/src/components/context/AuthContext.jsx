import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

axios.defaults.baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

// Tạo Context
export const AuthContext = createContext();

// Tạo hàm "use" (để tiện sử dụng sau này)
export const useAuth = () => {
  return useContext(AuthContext);
};

// Tạo Provider (Cái bọc toàn bộ App)
export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );
  const [loginModalRequired, setLoginModalRequired] = useState(false);

  useEffect(() => {
    if (accessToken) {
      // Thêm token vào header mặc định cho mọi request
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      localStorage.setItem("accessToken", accessToken);

      // Lấy thông tin user mỗi khi token thay đổi (nếu chưa có user)
      if (!authUser) {
        axios
          .get("/user/me")
          .then((response) => {
            setAuthUser(response.data.user);
          })
          .catch((error) => {
            // Nếu token hết hạn, xóa nó đi
            console.error("AuthMe lỗi, token có thể đã hết hạn", error);
            setAccessToken(null);
            setAuthUser(null);
          });
      }
    } else {
      // Xóa token khỏi header và localStorage
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("accessToken");
      setAuthUser(null); // Đảm bảo logout
    }
  }, [accessToken, authUser]);

  // Lấy lại user khi tải lại trang (chỉ chạy 1 lần)
  useEffect(() => {
    if (accessToken && !authUser) {
      axios
        .get("/user/me") //
        .then((response) => {
          setAuthUser(response.data.user);
        })
        .catch((error) => {
          console.error("AuthMe lỗi khi tải trang", error);
          setAccessToken(null);
        });
    }
  }, []);

  // Các hàm để gọi từ components
  const login = async (username, password) => {
    const response = await axios.post("/auth/signin", { username, password });
    setAccessToken(response.data.accessToken);
    axios
      .get("/user/me")
      .then((res) => setAuthUser(res.data.user))
      .catch(() => setAuthUser(null));
  };

  const signup = async (userData) => {
    // userData phải là object: { username, password, email, firstName, lastName }
    await axios.post("/auth/signup", userData);
    // Sau khi đăng ký, tự động đăng nhập
    await login(userData.username, userData.password);
  };

  const logout = async () => {
    try {
      await axios.post("/auth/signout"); // Backend sẽ xóa cookie (nếu có)
    } catch (error) {
      console.error("Lỗi khi đăng xuất", error);
    }
    setAccessToken(null);
  };

  // 🌟 THÊM: Hàm yêu cầu đăng nhập
  const requireLogin = () => {
    toast.error("Vui lòng đăng nhập để sử dụng tính năng này!");
    setLoginModalRequired(true);
  };
  const clearLoginRequirement = () => {
    setLoginModalRequired(false);
  };

  // 🌟 THÊM: Hàm xử lý Yêu thích
  const toggleFavorite = async (mediaItem) => {
    // mediaItem là object { mediaId, mediaType, posterPath, title }
    if (!authUser) {
      requireLogin();
      return;
    }

    try {
      // Gửi yêu cầu lên server
      const response = await axios.put("/user/favorites", mediaItem);

      // Cập nhật lại state của authUser với dữ liệu mới từ server
      setAuthUser(response.data.user);

      // Kiểm tra xem đã thêm hay xóa
      const isFavorited = response.data.user.favorites.some(
        (item) => item.mediaId === mediaItem.mediaId
      );

      if (isFavorited) {
        toast.success("Đã thêm vào Yêu thích!");
      } else {
        toast.info("Đã xóa khỏi Yêu thích.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật Yêu thích:", error);
      toast.error("Đã có lỗi xảy ra.");
    }
  };

  const value = {
    authUser,
    login,
    signup,
    logout,
    toggleFavorite,
    requireLogin,
    loginModalRequired,
    clearLoginRequirement,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
