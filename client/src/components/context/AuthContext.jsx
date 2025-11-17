import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

axios.defaults.baseURL = "/api";

// Tạo Context để share auth state across components
export const AuthContext = createContext();

// Custom hook để sử dụng AuthContext dễ dàng hơn
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component để wrap app và provide auth state
export const AuthProvider = ({ children }) => {
  // State lưu thông tin user đang đăng nhập
  const [authUser, setAuthUser] = useState(null);

  // State lưu access token (lấy từ localStorage nếu có)
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );

  // State để hiển thị modal yêu cầu đăng nhập
  const [loginModalRequired, setLoginModalRequired] = useState(false);

  /**
   * Effect: Xử lý khi accessToken thay đổi
   * - Nếu có token: Set Authorization header và fetch user info
   * - Nếu không có token: Xóa header và reset user
   */
  useEffect(() => {
    if (accessToken) {
      // Set Authorization header cho mọi request
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      // Lưu token vào localStorage
      localStorage.setItem("accessToken", accessToken);

      // Nếu chưa có thông tin user, fetch từ server
      if (!authUser) {
        axios
          .get("/user/me")
          .then((response) => {
            setAuthUser(response.data.user);
          })
          .catch((error) => {
            console.error("AuthMe lỗi, token có thể đã hết hạn", error);
            setAccessToken(null);
            setAuthUser(null);
          });
      }
    } else {
      // Không có token: Xóa Authorization header và localStorage
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("accessToken");
      setAuthUser(null);
    }
  }, [accessToken, authUser]);

  /**
   * Effect: Chạy khi app load lần đầu
   * Kiểm tra xem có token trong localStorage không và fetch user info
   */
  useEffect(() => {
    if (accessToken && !authUser) {
      axios
        .get("/user/me")
        .then((response) => {
          setAuthUser(response.data.user);
        })
        .catch((error) => {
          console.error("AuthMe lỗi khi tải trang", error);
          setAccessToken(null);
        });
    }
  }, []); // Empty dependency array = chỉ chạy 1 lần khi mount

  /**
   * Function: Đăng nhập
   * @param {string} username - Tên đăng nhập
   * @param {string} password - Mật khẩu
   */
  const login = async (username, password) => {
    try {
      // Gọi API đăng nhập
      const response = await axios.post("/auth/signin", { username, password });
      // Lưu access token
      setAccessToken(response.data.accessToken);
      // Fetch thông tin user
      await axios
        .get("/user/me")
        .then((res) => setAuthUser(res.data.user))
        .catch(() => setAuthUser(null));
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Throw để component xử lý
    }
  };

  /**
   * Function: Đăng ký tài khoản mới
   * @param {object} userData - Thông tin user (username, password, email, displayName)
   */
  const signup = async (userData) => {
    try {
      // Gọi API đăng ký
      await axios.post("/auth/signup", userData);
      // Tự động đăng nhập sau khi đăng ký thành công
      await login(userData.username, userData.password);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  /**
   * Function: Đăng xuất
   * Gọi API logout và xóa token
   */
  const logout = async () => {
    try {
      await axios.post("/auth/signout");
    } catch (error) {
      console.error("Lỗi khi đăng xuất", error);
    } finally {
      // Dù có lỗi hay không, vẫn xóa token local
      setAccessToken(null);
    }
  };

  /**
   * Function: Hiển thị thông báo yêu cầu đăng nhập
   * Sử dụng khi user chưa đăng nhập nhưng cố truy cập chức năng cần auth
   */
  const requireLogin = () => {
    toast.error("Vui lòng đăng nhập để sử dụng tính năng này!");
    setLoginModalRequired(true);
  };

  /**
   * Function: Tắt yêu cầu đăng nhập
   * Sử dụng sau khi user đã đăng nhập hoặc đóng modal
   */
  const clearLoginRequirement = () => {
    setLoginModalRequired(false);
  };

  /**
   * Function: Thêm/xóa phim khỏi danh sách yêu thích
   * @param {object} mediaItem - Thông tin phim {mediaId, mediaType, posterPath, title}
   */
  const toggleFavorite = async (mediaItem) => {
    // Kiểm tra user đã đăng nhập chưa
    if (!authUser) {
      requireLogin();
      return;
    }

    try {
      // Gọi API toggle favorite
      const response = await axios.put("/user/favorites", mediaItem);
      // Cập nhật user state với data mới từ server
      setAuthUser(response.data.user);

      // Kiểm tra xem phim có trong favorites không để hiển thị toast phù hợp
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
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra.");
    }
  };

  /**
   * Function: Cập nhật thông tin profile
   * @param {object} formData - {displayName, phone, bio}
   */
  const updateUserProfile = async (formData) => {
    try {
      const response = await axios.put("/user/profile", formData);
      // Cập nhật user state với thông tin mới
      setAuthUser(response.data.user);
      toast.success(response.data.message || "Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật profile:", error);
      throw new Error(
        error.response?.data?.message || "Lỗi khi cập nhật thông tin"
      );
    }
  };

  /**
   * Function: Đổi mật khẩu
   * @param {object} passwordData - {oldPassword, newPassword}
   */
  const updateUserPassword = async (passwordData) => {
    try {
      const response = await axios.put("/user/password", passwordData);
      toast.success(response.data.message || "Đổi mật khẩu thành công!");
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      throw new Error(error.response?.data?.message || "Lỗi khi đổi mật khẩu");
    }
  };

  // Object chứa tất cả values và functions cần share
  const value = {
    authUser, // User hiện tại (null nếu chưa đăng nhập)
    login, // Function đăng nhập
    signup, // Function đăng ký
    logout, // Function đăng xuất
    toggleFavorite, // Function thêm/xóa yêu thích
    requireLogin, // Function yêu cầu đăng nhập
    loginModalRequired, // State hiển thị modal đăng nhập
    clearLoginRequirement, // Function tắt modal đăng nhập
    updateUserProfile, // Function cập nhật profile
    updateUserPassword, // Function đổi mật khẩu
  };

  // Provide context value cho tất cả children components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
