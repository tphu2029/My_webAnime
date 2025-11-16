// Import các thư viện cần thiết
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Lấy config từ environment variables
const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;
const VITE_API_KEY = import.meta.env.VITE_API_KEY;

/**
 * Component EpisodeSelector
 * Hiển thị selector cho mùa và danh sách các tập phim của TV series
 *
 * @param {string} tvId - ID của TV show từ TMDB
 * @param {number} currentSeason - Số mùa hiện tại đang xem
 * @param {number} currentEpisode - Số tập hiện tại đang xem (optional)
 * @param {object} movie - Object chứa thông tin đầy đủ của TV show
 */
const EpisodeSelector = ({ tvId, currentSeason, currentEpisode, movie }) => {
  // State lưu danh sách tất cả các mùa
  const [seasons, setSeasons] = useState([]);
  // State lưu mùa được chọn (mặc định là currentSeason hoặc 1)
  const [selectedSeason, setSelectedSeason] = useState(currentSeason || 1);
  // State lưu danh sách tập của mùa đang chọn
  const [episodes, setEpisodes] = useState([]);
  // State loading khi đang fetch episodes
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  // Cấu hình options cho fetch API
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${VITE_API_KEY}`,
    },
  };

  /**
   * Effect: Load danh sách seasons từ movie object
   * Lọc bỏ season 0 (specials/bonus) nếu không cần
   */
  useEffect(() => {
    if (movie && movie.seasons) {
      // Lọc bỏ season 0 (specials)
      const filteredSeasons = movie.seasons.filter((s) => s.season_number > 0);
      setSeasons(filteredSeasons);
    }
  }, [movie]);

  /**
   * Effect: Fetch danh sách episodes khi selectedSeason thay đổi
   * Gọi TMDB API để lấy thông tin chi tiết của season
   */
  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoadingEpisodes(true);
      try {
        // Gọi API lấy thông tin season (bao gồm danh sách episodes)
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${tvId}/season/${selectedSeason}?language=vi-VN`,
          options
        );
        if (response.ok) {
          const data = await response.json();
          setEpisodes(data.episodes || []);
        }
      } catch (error) {
        console.error("Lỗi khi tải tập phim:", error);
      } finally {
        setLoadingEpisodes(false);
      }
    };

    // Chỉ fetch khi có selectedSeason
    if (selectedSeason) {
      fetchEpisodes();
    }
  }, [selectedSeason, tvId]);

  return (
    <div className="mt-8">
      {/* ===== SEASON SELECTOR ===== */}
      {/* Chỉ hiển thị khi có nhiều hơn 1 mùa */}
      {seasons.length > 1 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Chọn mùa</h3>
          <div className="flex flex-wrap gap-2">
            {seasons.map((season) => (
              <button
                key={season.id}
                onClick={() => setSelectedSeason(season.season_number)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedSeason === season.season_number
                    ? "bg-red-600 text-white" // Mùa đang chọn: màu đỏ
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600" // Mùa khác: màu xám
                }`}
              >
                Mùa {season.season_number}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===== EPISODES LIST ===== */}
      <h3 className="text-lg font-semibold mb-4">
        Danh sách tập - Mùa {selectedSeason}
      </h3>

      {/* Hiển thị loading state */}
      {loadingEpisodes ? (
        <p>Đang tải danh sách tập...</p>
      ) : episodes.length > 0 ? (
        // Grid layout cho danh sách episodes
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-4 max-h-[600px] overflow-y-auto">
          {episodes.map((episode) => {
            // Kiểm tra xem episode này có đang được xem không
            const isWatching =
              currentSeason === selectedSeason &&
              currentEpisode === episode.episode_number;

            return (
              // Link đến trang xem episode cụ thể
              <Link
                key={episode.id}
                to={`/tv/${tvId}/season/${episode.season_number}/episode/${episode.episode_number}`}
                className={`block p-3 rounded-lg transition-colors ${
                  isWatching
                    ? "bg-red-800/90 ring-2 ring-red-500" // Tập đang xem: highlight đỏ
                    : "bg-gray-800 hover:bg-gray-700" // Tập khác: màu xám
                }`}
              >
                <div className="flex flex-col gap-3">
                  {/* Thumbnail của episode */}
                  <img
                    src={
                      episode.still_path
                        ? `${VITE_IMG_URL}${episode.still_path}` // Ưu tiên ảnh của episode
                        : movie.backdrop_path
                        ? `${VITE_IMG_URL}${movie.backdrop_path}` // Fallback: backdrop của show
                        : "/placeholder.jpg" // Fallback cuối: placeholder
                    }
                    alt={`Hình ảnh tập ${episode.episode_number}`}
                    className="w-full rounded aspect-video object-cover"
                  />

                  {/* Thông tin episode */}
                  <div className="flex-1">
                    {/* Tên episode */}
                    <h3
                      className={`font-semibold truncate ${
                        isWatching ? "text-white" : "text-gray-200"
                      }`}
                    >
                      Tập {episode.episode_number}: {episode.name}
                    </h3>

                    {/* Tóm tắt nội dung episode */}
                    <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                      {episode.overview || "Chưa có tóm tắt."}
                    </p>

                    {/* Ngày phát sóng */}
                    {episode.air_date && (
                      <p className="text-xs text-gray-500 mt-1">
                        Phát sóng: {episode.air_date}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        // Không tìm thấy episodes
        <p>Không tìm thấy danh sách tập cho mùa này.</p>
      )}
    </div>
  );
};

export default EpisodeSelector;
