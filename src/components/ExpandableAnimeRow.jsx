import React, { useState } from "react";
import MovieCard from "./MovieCard";

// Hiển thị 5 anime đầu, bấm "Xem thêm" để mở rộng danh sách còn lại
// Giữ hiệu ứng hover của MovieCard nhưng không tạo scroll ngang
// Props: title: string, movies: array
const ExpandableAnimeRow = ({ title, movies = [] }) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? movies : movies.slice(0, 5);

  return (
    <section className="mb-12 px-5">
      {title && (
        <h2 className="font-extrabold text-3xl text-amber-700 ml-2 mb-8">
          {title}
        </h2>
      )}

      {/* Wrapper chặn tràn ngang để hover không tạo scrollbar */}
      <div className="overflow-x-hidden">
        {/* Dùng grid/flex để không cần carousel */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {visible.map((movie) => (
            <div key={movie.id}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>

      {movies.length > 5 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((s) => !s)}
            className="px-5 py-2 rounded-full bg-gray-800 text-gray-100 hover:bg-gray-700 transition"
          >
            {showAll ? "Thu gọn" : `Xem thêm (${movies.length - 5})`}
          </button>
        </div>
      )}
    </section>
  );
};

export default ExpandableAnimeRow;
