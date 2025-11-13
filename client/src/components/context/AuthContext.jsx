// client/src/components/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

axios.defaults.baseURL = "/api";

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );
  const [loginModalRequired, setLoginModalRequired] = useState(false);
  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      localStorage.setItem("accessToken", accessToken);
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
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("accessToken");
      setAuthUser(null);
    }
  }, [accessToken, authUser]);

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
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post("/auth/signin", { username, password });
      setAccessToken(response.data.accessToken);
      await axios
        .get("/user/me")
        .then((res) => setAuthUser(res.data.user))
        .catch(() => setAuthUser(null));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      await axios.post("/auth/signup", userData);
      await login(userData.username, userData.password);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post("/auth/signout");
    } catch (error) {
      console.error("Lỗi khi đăng xuất", error);
    } finally {
      setAccessToken(null);
    }
  };

  const requireLogin = () => {
    toast.error("Vui lòng đăng nhập để sử dụng tính năng này!");
    setLoginModalRequired(true);
  };
  const clearLoginRequirement = () => {
    setLoginModalRequired(false);
  };

  const toggleFavorite = async (mediaItem) => {
    if (!authUser) {
      requireLogin();
      return;
    }
    try {
      const response = await axios.put("/user/favorites", mediaItem);
      setAuthUser(response.data.user);
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

  const updateUserProfile = async (formData) => {
    try {
      const response = await axios.put("/user/profile", formData);
      setAuthUser(response.data.user);
      toast.success(response.data.message || "Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật profile:", error);
      throw new Error(
        error.response?.data?.message || "Lỗi khi cập nhật thông tin"
      );
    }
  };

  const updateUserPassword = async (passwordData) => {
    try {
      const response = await axios.put("/user/password", passwordData);
      toast.success(response.data.message || "Đổi mật khẩu thành công!");
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      throw new Error(error.response?.data?.message || "Lỗi khi đổi mật khẩu");
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
    updateUserProfile,
    updateUserPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
