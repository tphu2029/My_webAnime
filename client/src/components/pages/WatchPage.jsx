import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import YouTube from "react-youtube";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import EpisodeSelector from "../ui/EpisodeSelector";

// Lấy cấu hình API từ environment variables
const VITE_API_KEY = import.meta.env.VITE_API_KEY;
const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;

// Cấu hình options cho fetch API
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${VITE_API_KEY}`,
  },
};

/**
 * Component WatchPage
 * Trang xem phim/tập phim với YouTube player
 * Hỗ trợ cả Movies và TV Shows (với seasons/episodes)
 */
const WatchPage = () => {
  // Lấy params từ URL (movieId hoặc tvId + seasonNumber + episodeNumber)
  const { movieId, tvId, seasonNumber, episodeNumber } = useParams();

  // Xác định ID và loại media
  const id = movieId || tvId; // ID của phim hoặc TV show
  const mediaType = movieId ? "movie" : "tv"; // Phân biệt movie hay tv
  const isEpisode = mediaType === "tv" && seasonNumber && episodeNumber; // Kiểm tra có phải trang tập phim không

  // State lưu thông tin phim/TV show chính
  const [movie, setMovie] = useState(null);
  // State lưu key của video YouTube (trailer hoặc episode)
  const [trailerKey, setTrailerKey] = useState(null);
  // State loading khi đang fetch data
  const [loading, setLoading] = useState(true);
  // State lưu lỗi nếu có
  const [error, setError] = useState(null);
  // State lưu thông tin chi tiết của tập phim (nếu là TV show)
  const [episodeDetails, setEpisodeDetails] = useState(null);
  // State lưu danh sách tất cả tập trong mùa (không còn sử dụng cho display, chỉ để reference)
  const [seasonEpisodes, setSeasonEpisodes] = useState([]);
  // State loading khi đang fetch episodes
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  /**
   * Effect: Fetch data khi component mount hoặc khi URL params thay đổi
   * Thực hiện các bước:
   * 1. Fetch thông tin phim/TV show
   * 2. Nếu là tập phim: Fetch chi tiết tập và danh sách tập trong mùa
   * 3. Fetch video trailer (ưu tiên tiếng Nhật, fallback tiếng Anh)
   */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setSeasonEpisodes([]);
      setEpisodeDetails(null);

      try {
        // =====  GỌI API THÔNG TIN PHIM (TIẾNG VIỆT) =====
        const movieResponse = await fetch(
          `https://api.themoviedb.org/3/${mediaType}/${id}?language=vi-VN`,
          options
        );
        if (!movieResponse.ok) throw new Error("Không thể tải thông tin phim.");
        const movieData = await movieResponse.json();
        setMovie(movieData);

        // =====  NẾU LÀ TẬP TV, LẤY THÔNG TIN TẬP =====
        if (isEpisode) {
          setLoadingEpisodes(true);
          try {
            // Gọi API lấy chi tiết tập cụ thể
            const episodeResponse = await fetch(
              `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}?language=vi-VN`,
              options
            );
            if (episodeResponse.ok) {
              const episodeData = await episodeResponse.json();
              setEpisodeDetails(episodeData);
            } else {
              console.warn("Không thể tải chi tiết tập.");
            }

            // Gọi API lấy TẤT CẢ tập trong mùa (để có context)
            const seasonResponse = await fetch(
              `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?language=vi-VN`,
              options
            );
            if (seasonResponse.ok) {
              const seasonData = await seasonResponse.json();
              setSeasonEpisodes(seasonData.episodes || []);
            } else {
              console.warn("Không thể tải danh sách tập của mùa.");
            }
          } catch (epError) {
            console.error("Lỗi khi fetch tập hoặc mùa:", epError);
          } finally {
            setLoadingEpisodes(false);
          }
        }

        // =====  TÌM VIDEO TRAILER =====
        /**
         * Helper function: Tìm video trailer phù hợp nhất từ danh sách videos
         * Ưu tiên: Official Trailer > Any Trailer > Teaser > Any YouTube video
         */
        const findTrailer = (data) => {
          const officialTrailer = data.results.find(
            (vid) =>
              vid.official && vid.site === "YouTube" && vid.type === "Trailer"
          );
          const anyTrailer = data.results.find(
            (vid) => vid.site === "YouTube" && vid.type === "Trailer"
          );
          const anyTeaser = data.results.find(
            (vid) => vid.site === "YouTube" && vid.type === "Teaser"
          );
          const anyVideo = data.results.find((vid) => vid.site === "YouTube");

          return (
            officialTrailer?.key ||
            anyTrailer?.key ||
            anyTeaser?.key ||
            anyVideo?.key ||
            null
          );
        };

        // Ưu tiên gọi API video tiếng Nhật (ja-JP) cho anime
        let videoResponse = await fetch(
          `https://api.themoviedb.org/3/${mediaType}/${id}/videos?language=ja-JP`,
          options
        );
        let videoData = await videoResponse.json();
        let foundKey = findTrailer(videoData);

        // Nếu không tìm thấy tiếng Nhật, gọi lại API video tiếng Anh (en-US)
        if (!foundKey) {
          videoResponse = await fetch(
            `https://api.themoviedb.org/3/${mediaType}/${id}/videos?language=en-US`,
            options
          );
          videoData = await videoResponse.json();
          foundKey = findTrailer(videoData); // Tìm lại trong data tiếng Anh
        }

        setTrailerKey(foundKey); // Set key cuối cùng tìm được (hoặc null)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, mediaType, isEpisode, seasonNumber, episodeNumber]); // Chạy lại khi các params này thay đổi

  // Cấu hình cho YouTube player
  const playerOptions = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1, // Tự động phát video khi load
      controls: 1, // Hiển thị controls
    },
  };

  // ===== HELPER VARIABLES =====
  // Lấy tiêu đề phim (movie.title cho phim, movie.name cho TV)
  const title = movie?.title || movie?.name;
  // Lấy năm phát hành (4 ký tự đầu của release_date hoặc first_air_date)
  const releaseYear = (movie?.release_date || movie?.first_air_date)?.substring(
    0,
    4
  );

  // ===== RENDER STATES =====
  // Hiển thị loading state
  if (loading) {
    return <div className="text-white text-center p-10">Đang tải trang...</div>;
  }

  // Hiển thị error state
  if (error) {
    return <div className="text-red-500 text-center p-10">{error}</div>;
  }

  // Hiển thị khi không tìm thấy phim
  if (!movie) {
    return (
      <div className="text-white text-center p-10">Không tìm thấy phim.</div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-8 text-white">
      {/* ===== PHẦN VIDEO PLAYER Ở TRÊN ===== */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl mb-6">
        {trailerKey ? (
          // Có video key: Hiển thị YouTube player
          <YouTube
            videoId={trailerKey}
            opts={playerOptions}
            className="absolute top-0 left-0 h-full w-full"
          />
        ) : (
          // Không có video: Hiển thị thông báo
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-xl">
              {isEpisode
                ? "Không tìm thấy video cho tập này (đang hiển thị trailer)."
                : "Không tìm thấy trailer."}
            </p>
          </div>
        )}
      </div>

      {/* ===== PHẦN THÔNG TIN PHIM Ở DƯỚI ===== */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg">
        {/* --- TIÊU ĐỀ --- */}
        {isEpisode && episodeDetails ? (
          // Nếu là trang tập phim: Hiển thị tên show + tên tập
          <>
            {/* Hiển thị tên show nhỏ hơn */}
            <h3 className="text-lg text-red-400 font-semibold">{title}</h3>
            {/* Hiển thị tên tập to hơn */}
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Tập {episodeDetails.episode_number}: {episodeDetails.name}
            </h1>
          </>
        ) : (
          // Nếu không phải tập: Hiển thị tiêu đề phim/show
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {title} {mediaType === "movie" ? "" : "(Trailer)"}
          </h1>
        )}

        {/* --- TAGLINE (nếu có) --- */}
        {movie.tagline && (
          <p className="text-gray-400 italic text-sm mb-4">{movie.tagline}</p>
        )}

        {/* --- PHẦN ĐÁNH GIÁ, NĂM PHÁT HÀNH --- */}
        <div className="flex items-center flex-wrap gap-4 mb-4">
          {/* Rating */}
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
            <span className="font-bold text-lg">
              {movie.vote_average?.toFixed(1)}
            </span>
            <span className="text-gray-400 text-xs">
              ({movie.vote_count} đánh giá)
            </span>
          </div>

          {/* Năm phát hành */}
          {releaseYear && (
            <>
              <span className="text-gray-400">•</span>
              <span className="text-sm">{releaseYear}</span>
            </>
          )}
        </div>

        {/* --- DANH SÁCH THỂ LOẠI --- */}
        <div className="flex flex-wrap gap-2 mb-4">
          {movie.genres.map((genre) => (
            <span
              key={genre.id}
              className="border border-gray-600 rounded-full px-3 py-1 text-xs text-gray-300"
            >
              {genre.name}
            </span>
          ))}
        </div>

        {/* --- NỘI DUNG/TÓM TẮT --- */}
        <h2 className="text-xl font-semibold mt-6 mb-2">Nội dung</h2>
        <p className="text-gray-300 leading-relaxed text-sm">
          {/* Ưu tiên hiển thị tóm tắt tập phim (nếu có), không thì dùng tóm tắt của show */}
          {isEpisode && episodeDetails?.overview
            ? episodeDetails.overview
            : movie?.overview}
        </p>
      </div>

      {/* ===== DANH SÁCH TẬP PHIM (CHỈ CHO TV SHOWS) ===== */}
      {/* Hiển thị EpisodeSelector cho tất cả TV shows (bao gồm cả trang trailer) */}
      {mediaType === "tv" && (
        <EpisodeSelector
          tvId={id}
          currentSeason={parseInt(seasonNumber) || 1} // Mùa hiện tại (hoặc 1 nếu đang xem trailer)
          currentEpisode={parseInt(episodeNumber)} // Tập hiện tại (undefined nếu đang xem trailer)
          movie={movie} // Thông tin đầy đủ của TV show
        />
      )}
    </div>
  );
};

export default WatchPage;
