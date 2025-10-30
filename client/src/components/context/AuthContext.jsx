import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// 1. Tạo Context
export const AuthContext = createContext();

// 2. Tạo hàm "use" (để tiện sử dụng sau này)
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Tạo Provider (Cái bọc toàn bộ App)
export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );

  // **Quan trọng: Cấu hình axios mặc định**
  // Lần sau, mỗi khi gọi axios(..), nó sẽ tự động đính kèm token
  useEffect(() => {
    if (accessToken) {
      // Thêm token vào header mặc định cho mọi request
      // Đảm bảo URL API là đúng (ví dụ: http://localhost:5001)
      axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "/api"; // Cấu hình .env
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      localStorage.setItem("accessToken", accessToken);
    } else {
      // Xóa token khỏi header
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("accessToken");
    }
  }, [accessToken]);

  // **Quan trọng: Lấy lại user khi tải lại trang**
  // Khi F5, state bị mất, nhưng token còn trong localStorage
  // Ta dùng token đó gọi /me để lấy lại thông tin user
  useEffect(() => {
    if (accessToken) {
      axios
        .get("/auth/me") // URL đến endpoint 'authMe' của bạn
        .then((response) => {
          setAuthUser(response.data.user);
        })
        .catch((error) => {
          // Nếu token hết hạn, xóa nó đi
          console.error("AuthMe lỗi, token có thể đã hết hạn", error);
          setAccessToken(null);
        });
    }
  }, []); // Chỉ chạy 1 lần lúc tải trang

  // Các hàm để gọi từ components
  const login = async (email, password) => {
    // axios đã được cấu hình baseURL ở trên
    const response = await axios.post("/auth/signin", { email, password });
    setAuthUser(response.data.user);
    setAccessToken(response.data.accessToken);
  };

  const signup = async (userData) => {
    const response = await axios.post("/auth/signup", userData);
    setAuthUser(response.data.user);
    setAccessToken(response.data.accessToken);
  };

  const logout = async () => {
    await axios.post("/auth/signout"); // Backend sẽ xóa cookie (nếu có)
    setAuthUser(null);
    setAccessToken(null); // Client tự xóa state và accessToken
  };

  const value = {
    authUser,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
