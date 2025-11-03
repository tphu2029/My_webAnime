import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./components/pages/HomePage";
import CategoryPage from "./components/pages/CategoryPage";
import ScrollToTop from "./components/ui/ScrollToTop";
import MovieDetailPage from "./components/pages/MovieDetailPage";
import WatchPage from "./components/pages/WatchPage";
import PersonPage from "./components/pages/PersonPage"; // 👈 thêm

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />

          {/* Các trang thể loại */}
          <Route path="/the-loai/anime/:genreSlug" element={<CategoryPage />} />
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
          <Route path="/yeu-thich" element={<PersonPage type="favorites" />} />
          <Route path="/danh-sach" element={<PersonPage type="list" />} />
          <Route path="/xem-tiep" element={<PersonPage type="continue" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
