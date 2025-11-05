// client/src/App.jsx
import React, { useState, useEffect } from "react"; // <--- THÊM useState, useEffect
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./components/pages/HomePage";
import CategoryPage from "./components/pages/CategoryPage";
import ScrollToTop from "./components/ui/ScrollToTop";
import MovieDetailPage from "./components/pages/MovieDetailPage";
import WatchPage from "./components/pages/WatchPage";
import PersonPage from "./components/pages/PersonPage";
import { Toaster } from "sonner";
import "./assets/css/index.css";
import { AuthProvider } from "./components/context/AuthContext";
import LoadingOverlay from "./components/ui/LoadingOverlay";

function App() {
  // loading khi tải trang
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    // Hẹn giờ để tắt loading sau 1.5 giây
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 2000);

    // Xóa hẹn giờ khi component bị unmount
    return () => clearTimeout(timer);
  }, []); // Mảng rỗng [] đảm bảo code này CHỈ CHẠY 1 LẦN

  return (
    // Bọc AuthProvider bên ngoài cùng
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="bottom-right" richColors />

        {/* Hiển thị overlay dựa trên state của App.jsx */}
        {isPageLoading && <LoadingOverlay />}

        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />

            {/* Các trang thể loại */}
            <Route
              path="/the-loai/anime/:genreSlug"
              element={<CategoryPage />}
            />
            <Route path="/phim-le" element={<CategoryPage />} />
            <Route path="/phim-bo" element={<CategoryPage />} />
            <Route path="/phim-chieu-rap" element={<CategoryPage />} />
            <Route path="/nam/:year" element={<CategoryPage />} />

            {/* Chi tiết và xem phim */}
            <Route path="/movie/:movieId" element={<MovieDetailPage />} />
            <Route path="/tv/:tvId" element={<MovieDetailPage />} />
            <Route path="/movie/:movieId/trailer" element={<WatchPage />} />
            <Route path="/tv/:tvId/trailer" element={<WatchPage />} />

            {/* Dùng chung PersonPage */}
            <Route path="/tai-khoan" element={<PersonPage type="account" />} />
            <Route
              path="/yeu-thich"
              element={<PersonPage type="favorites" />}
            />
            <Route path="/danh-sach" element={<PersonPage type="list" />} />
            <Route path="/xem-tiep" element={<PersonPage type="continue" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
