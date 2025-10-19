import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import HomePage from "./components/HomePage";
import CategoryPage from "./components/CategoryPage";

function App() {
  return (
    <BrowserRouter>
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
