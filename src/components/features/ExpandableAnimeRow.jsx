import React, { useState, useEffect } from "react";
import MovieCard from "../ui/MovieCard";

const INITIAL_VISIBLE_COUNT = 5; // Số phim hiển thị ban đầu trên desktop

const ExpandableAnimeRow = ({ title, movies = [] }) => {
  const [showAll, setShowAll] = useState(false);

  // số phim hiển thị ban đầu dựa trên breakpoint
  const getInitialCount = () => {
    if (window.innerWidth < 640) return 4; // Mobile: 4 phim
    if (window.innerWidth < 1024) return 8; // Tablet: 8 phim
    if (window.innerWidth < 1440) return 10; // Laptop: 10 phim
    return 12; // Desktop: 12 phim
  };

  const [visibleCount, setVisibleCount] = useState(getInitialCount());

  // Cập nhật lại số lượng phim khi resize màn hình
  useEffect(() => {
    const handleResize = () => setVisibleCount(getInitialCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleMovies = showAll ? movies : movies.slice(0, visibleCount);
  const remainingCount = movies.length - visibleCount;

  return (
    <section className="mb-8 px-4 md:mb-12 md:px-5">
      {title && (
        <h2 className="mb-4 ml-2 text-2xl font-extrabold text-amber-700 md:mb-6 lg:text-3xl">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 md:gap-5">
        {visibleMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {movies.length > visibleCount && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((s) => !s)}
            className="rounded-full bg-gray-800 px-5 py-2 text-sm text-gray-100 transition hover:bg-gray-700"
          >
            {showAll ? "Thu gọn" : `Xem thêm (${remainingCount})`}
          </button>
        </div>
      )}
    </section>
  );
};

export default ExpandableAnimeRow;
