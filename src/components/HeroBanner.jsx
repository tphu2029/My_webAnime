import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faHeart,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const IMG_ORIGINAL = "https://image.tmdb.org/t/p/original";
const IMG_W185 = "https://image.tmdb.org/t/p/w185";

// Map genre_id → tên tiếng Việt (TV genres phổ biến)
const TV_GENRE_MAP = {
  16: "Hoạt hình",
  10759: "Hành động & Phiêu lưu",
  35: "Hài hước",
  18: "Tâm lý",
  10765: "Khoa học viễn tưởng & Kỳ ảo",
  9648: "Bí ẩn",
  10762: "Thiếu nhi",
  10751: "Gia đình",
  27: "Kinh dị",
  80: "Tội phạm",
  99: "Tài liệu",
  10768: "Chiến tranh & Chính trị",
};

function formatYear(item) {
  const date = item.release_date || item.first_air_date || "";
  return date ? date.slice(0, 4) : "";
}

function tmdbRating(item) {
  return typeof item.vote_average === "number"
    ? item.vote_average.toFixed(1)
    : null;
}

function titleOf(item) {
  return item.title || item.name || "";
}

function subTitleOf(item) {
  return item.original_title || item.original_name || "";
}

// Hero banner: tự fetch anime nổi bật
// Props tuỳ chọn: onPlay, onFavorite, onInfo
const HeroBanner = ({ onPlay, onFavorite, onInfo }) => {
  const [items, setItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const url =
    "https://api.themoviedb.org/3/discover/tv?language=vi-VN&sort_by=popularity.desc&with_genres=16&page=30";

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiKey = import.meta.env.VITE_API_KEY;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json;charset=utf-8",
          },
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        const arr = Array.isArray(data.results) ? data.results : [];
        setItems(arr);
        const firstWithBackdrop = arr.findIndex((i) => i.backdrop_path);
        setActiveIndex(firstWithBackdrop >= 0 ? firstWithBackdrop : 0);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || "Error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, []);

  const item = useMemo(() => items[activeIndex], [items, activeIndex]);
  const relatedItems = useMemo(() => (items || []).slice(0, 10), [items]);

  if (loading) {
    return (
      <section className="h-[50vh] animate-pulse rounded-2xl bg-gray-900 md:h-[420px] lg:h-[520px]" />
    );
  }
  if (error || !item) {
    return null;
  }

  const bg = item.backdrop_path ? `${IMG_ORIGINAL}${item.backdrop_path}` : null;
  const rating = tmdbRating(item);
  const year = formatYear(item);

  return (
    <section className="relative h-auto pb-4 overflow-hidden bg-gray-900">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: bg ? `url(${bg})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/70 to-transparent" />

      {/* Content */}
      <div className="relative z-10 grid grid-cols-1 items-center gap-6 px-4 py-8 md:px-10 md:py-12 lg:grid-cols-2 lg:px-14 lg:py-16">
        {/* Left block: text */}
        <div className="max-w-2xl text-white">
          <h1 className="mb-3 text-3xl font-extrabold drop-shadow-sm md:text-4xl lg:text-5xl line-clamp-1">
            {titleOf(item)}
          </h1>
          <p className="mb-4 line-clamp-1 text-sm text-gray-300 md:text-base">
            {subTitleOf(item)}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {rating && (
              <span className="px-2 py-1 rounded bg-yellow-500 text-black text-xs font-semibold">
                TMDB {rating}
              </span>
            )}
            {year && (
              <span className="px-2 py-1 rounded border border-gray-600 text-gray-200 text-xs">
                {year}
              </span>
            )}
            {item.media_type && (
              <span className="px-2 py-1 rounded border border-gray-600 text-gray-200 text-xs">
                {item.media_type === "tv" ? "Phim bộ" : "Phim lẻ"}
              </span>
            )}
          </div>

          {/* Overview - Luôn giữ chỗ cao tương đương 3 dòng để đồng bộ kích thước */}
          <p className="text-gray-200/90 text-sm md:text-base leading-relaxed mb-6 line-clamp-3 min-h-[4rem] md:min-h-[4.5rem]">
            {item.overview ? (
              item.overview
            ) : (
              <span className="italic text-gray-500 text-left block w-full">
                Không có phần giới thiệu
              </span>
            )}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3 mb-6">
            <Link to={`/tv/${item.id}/trailer`}>
              <button
                type="button"
                onClick={onPlay}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-colors"
              >
                <FontAwesomeIcon icon={faPlay} />
                Xem ngay
              </button>
            </Link>

            <button
              type="button"
              onClick={() => onFavorite && onFavorite(item)}
              className="w-11 h-11 rounded-full border-2 border-gray-500/70 text-gray-300 hover:bg-gray-700 hover:text-white transition"
              aria-label="Yêu thích"
            >
              <FontAwesomeIcon icon={faHeart} />
            </button>

            <Link to={`/tv/${item.id}`}>
              {" "}
              <button
                type="button"
                onClick={() => onInfo && onInfo(item)}
                className="w-11 h-11 rounded-full border-2 border-gray-500/70 text-gray-300 hover:bg-gray-700 hover:text-white transition"
                aria-label="Thông tin"
              >
                <FontAwesomeIcon icon={faInfoCircle} />
              </button>
            </Link>
          </div>

          {/* Tags từ genre_ids → tên thể loại */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(item.genre_ids || [])
              .map((gid) => ({ id: gid, name: TV_GENRE_MAP[gid] }))
              .filter((g) => g.name)
              .slice(0, 6)
              .map((g) => (
                <span
                  key={g.id}
                  className="px-2 py-1 text-xs rounded bg-gray-800 text-gray-200 border border-gray-700"
                >
                  {g.name}
                </span>
              ))}
          </div>
        </div>

        {/* Right block is visually covered by background; keep empty for layout */}
        <div className="hidden lg:block" />
      </div>

      {/* Related posters row */}
      {relatedItems.length > 0 && (
        <div className="relative z-10 px-4 pb-6 md:px-10 lg:px-14">
          {/* Cho phép trượt ngang trên mobile/tablet và ẩn thanh cuộn */}
          <div className="flex gap-3 overflow-x-auto whitespace-nowrap scrollbar-hide md:gap-4 lg:justify-center">
            {relatedItems.map((ri, idx) => {
              const src = ri.poster_path
                ? `${IMG_W185}${ri.poster_path}`
                : null;
              return (
                <button
                  key={`${ri.media_type || "item"}-${ri.id}`}
                  type="button"
                  className={`shrink-0 rounded-xl border-2 focus:outline-none ${
                    items[activeIndex]?.id === ri.id
                      ? "border-yellow-500"
                      : "border-transparent"
                  }`}
                  onClick={() => {
                    const absIndex = items.findIndex((x) => x.id === ri.id);
                    if (absIndex >= 0) setActiveIndex(absIndex);
                  }}
                >
                  {src ? (
                    <img
                      src={src}
                      alt={titleOf(ri)}
                      className="h-[150px] w-[100px] rounded-[10px] object-cover shadow md:h-[180px] md:w-[120px]"
                    />
                  ) : (
                    <div className="h-[150px] w-[100px] rounded-[10px] bg-gray-700 md:h-[180px] md:w-[120px]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroBanner;
