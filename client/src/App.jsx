import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./components/pages/HomePage";
import CategoryPage from "./components/pages/CategoryPage";
import ScrollToTop from "./components/ui/ScrollToTop";
import MovieDetailPage from "./components/pages/MovieDetailPage";
import WatchPage from "./components/pages/WatchPage";
import PersonLayout from "./components/layout/PersonLayout";
import PersonPage from "./components/pages/PersonPage";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Layout chính */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="the-loai/anime/:genreSlug" element={<CategoryPage />} />
          <Route path="phim-le" element={<CategoryPage />} />
          <Route path="phim-bo" element={<CategoryPage />} />
          <Route path="phim-chieu-rap" element={<CategoryPage />} />
          <Route path="nam/:year" element={<CategoryPage />} />

          <Route path="movie/:movieId" element={<MovieDetailPage />} />
          <Route path="tv/:tvId" element={<MovieDetailPage />} />
          <Route path="movie/:movieId/trailer" element={<WatchPage />} />
          <Route path="tv/:tvId/trailer" element={<WatchPage />} />
        </Route>

        {/* Layout phụ: quản lý tài khoản */}
        <Route path="/nguoi-dung" element={<PersonLayout />}>
          <Route
            index
            element={
              <PersonPage
                title="Phim yêu thích"
                apiEndpoint="/api/yeu-thich"
                emptyMessage="Bạn chưa thêm phim nào vào danh sách yêu thích."
                showTabs={true}
              />
            }
          />
          <Route
            path="yeu-thich"
            element={
              <PersonPage
                title="Phim yêu thích"
                apiEndpoint="/api/yeu-thich"
                emptyMessage="Bạn chưa thêm phim nào vào danh sách yêu thích."
                showTabs={true}
              />
            }
          />
          <Route
            path="xem-tiep"
            element={
              <PersonPage
                title="Danh sách xem tiếp"
                apiEndpoint="/api/xem-tiep"
                emptyMessage="Bạn chưa có phim nào trong danh sách xem tiếp."
              />
            }
          />
          <Route
            path="danh-sach"
            element={
              <PersonPage
                title="Danh sách cá nhân"
                apiEndpoint="/api/danh-sach"
                emptyMessage="Bạn chưa tạo danh sách nào."
                showAddButton={true}
              />
            }
          />
          <Route
            path="thong-bao"
            element={<p className="text-gray-300">Chưa có thông báo nào.</p>}
          />
          <Route
            path="tai-khoan"
            element={<p className="text-gray-300">Thông tin tài khoản.</p>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
