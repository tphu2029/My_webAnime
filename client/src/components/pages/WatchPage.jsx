import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import YouTube from "react-youtube";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

// Cấu hình API
const VITE_API_KEY = import.meta.env.VITE_API_KEY;
const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${VITE_API_KEY}`,
  },
};

const WatchPage = () => {
  const { movieId, tvId } = useParams();
  const id = movieId || tvId;
  const mediaType = movieId ? "movie" : "tv";

  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        //  Gọi API thông tin phim (luôn là tiếng Việt)
        const movieResponse = await fetch(
          `https://api.themoviedb.org/3/${mediaType}/${id}?language=vi-VN`,
          options
        );
        if (!movieResponse.ok) throw new Error("Không thể tải thông tin phim.");
        const movieData = await movieResponse.json();
        setMovie(movieData);

        //  Hàm helper để tìm key video
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

        //  Ưu tiên gọi API video tiếng Nhật (ja-JP)
        let videoResponse = await fetch(
          `https://api.themoviedb.org/3/${mediaType}/${id}/videos?language=ja-JP`,
          options
        );
        let videoData = await videoResponse.json();
        let foundKey = findTrailer(videoData);

        //  Nếu không tìm thấy tiếng Nhật (!foundKey),
        // gọi lại API video tiếng Anh (en-US) làm dự phòng
        if (!foundKey) {
          videoResponse = await fetch(
            `https://api.themoviedb.org/3/${mediaType}/${id}/videos?language=en-US`,
            options
          );
          videoData = await videoResponse.json();
          foundKey = findTrailer(videoData); // Tìm lại trong data tiếng Anh
        }

        setTrailerKey(foundKey); // Set key cuối cùng tìm được
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, mediaType]);
  // Cấu hình player
  const playerOptions = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      controls: 1,
    },
  };

  // Các hàm helper để lấy thông tin (vì fetch chung)
  const title = movie?.title || movie?.name;
  const releaseYear = (movie?.release_date || movie?.first_air_date)?.substring(
    0,
    4
  );

  if (loading) {
    return <div className="text-white text-center p-10">Đang tải trang...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-10">{error}</div>;
  }

  if (!movie) {
    return (
      <div className="text-white text-center p-10">Không tìm thấy phim.</div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-8 text-white">
      {/* ===== PLAYER Ở TRÊN ===== */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl mb-6">
        {trailerKey ? (
          <YouTube
            videoId={trailerKey}
            opts={playerOptions}
            className="absolute top-0 left-0 h-full w-full"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-xl">Không tìm thấy trailer/video.</p>
          </div>
        )}
      </div>

      {/* ===== PHẦN THÔNG TIN Ở DƯỚI ===== */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
        {movie.tagline && (
          <p className="text-gray-400 italic text-sm mb-4">{movie.tagline}</p>
        )}

        <div className="flex items-center flex-wrap gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
            <span className="font-bold text-lg">
              {movie.vote_average?.toFixed(1)}
            </span>
            <span className="text-gray-400 text-xs">
              ({movie.vote_count} đánh giá)
            </span>
          </div>
          {releaseYear && (
            <>
              <span className="text-gray-400">•</span>
              <span className="text-sm">{releaseYear}</span>
            </>
          )}
        </div>

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

        <h2 className="text-xl font-semibold mt-6 mb-2">Nội dung</h2>
        <p className="text-gray-300 leading-relaxed text-sm">
          {movie.overview}
        </p>
      </div>

      {/* */}
    </div>
  );
};

export default WatchPage;
