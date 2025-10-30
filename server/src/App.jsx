import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./components/pages/HomePage";
import CategoryPage from "./components/pages/CategoryPage";
import ScrollToTop from "./components/ui/ScrollToTop";
import MovieDetailPage from "./components/pages/MovieDetailPage";
import WatchPage from "./components/pages/WatchPage";
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Route này sẽ áp dụng Layout (Header/Footer) cho tất cả các trang con */}
        <Route path="/" element={<Layout />}>
          {/* Khi URL là '/', hiển thị trang chủ */}
          <Route index element={<HomePage />} />

          {/*TẤT CẢ CÁC ROUTE NÀY GIỜ ĐỀU DÙNG CHUNG 'CategoryPage' */}
          <Route path="/the-loai/anime/:genreSlug" element={<CategoryPage />} />
          <Route path="/phim-le" element={<CategoryPage />} />
          <Route path="/phim-bo" element={<CategoryPage />} />
          <Route path="/phim-chieu-rap" element={<CategoryPage />} />
          <Route path="/nam/:year" element={<CategoryPage />} />

          {/* Route cho chi tiết Phim Lẻ */}
          <Route path="/movie/:movieId" element={<MovieDetailPage />} />
          {/* Route cho chi tiết Phim Bộ */}
          <Route path="/tv/:tvId" element={<MovieDetailPage />} />

          {/* Route cho page xem phim */}
          <Route path="/movie/:movieId/trailer" element={<WatchPage />} />
          <Route path="/tv/:tvId/trailer" element={<WatchPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
