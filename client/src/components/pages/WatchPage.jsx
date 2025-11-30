import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import YouTube from "react-youtube";
import EpisodeSelector from "../ui/EpisodeSelector";
import CommentSection from "../features/CommentSection";

const VITE_API_KEY = import.meta.env.VITE_API_KEY;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${VITE_API_KEY}`,
  },
};

const WatchPage = () => {
  const { movieId, tvId, seasonNumber, episodeNumber } = useParams();

  const id = movieId || tvId;
  const mediaType = movieId ? "movie" : "tv";
  const isEpisode = mediaType === "tv" && seasonNumber && episodeNumber;

  // States
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [episodeDetails, setEpisodeDetails] = useState(null);

  // State cho streaming
  const [youtubeTrailerId, setYoutubeTrailerId] = useState(null);
  const [vidsrcUrl, setVidsrcUrl] = useState(null);
  const [loadingStream, setLoadingStream] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setEpisodeDetails(null);
      setYoutubeTrailerId(null);
      setVidsrcUrl(null);

      try {
        const [detailReq, videoReq] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/${mediaType}/${id}?language=vi-VN`,
            options
          ),
          fetch(
            `https://api.themoviedb.org/3/${mediaType}/${id}/videos`,
            options
          ),
        ]);

        if (!detailReq.ok) throw new Error("Không thể tải thông tin phim.");

        const movieData = await detailReq.json();
        const videoData = await videoReq.json();

        movieData.videos = videoData;

        setMovie(movieData);

        // ===== LẤY YOUTUBE TRAILER ID  =====
        if (movieData.videos?.results?.length > 0) {
          const trailer = movieData.videos.results.find(
            (v) => v.type === "Trailer" && v.site === "YouTube"
          );
          const teaser = movieData.videos.results.find(
            (v) => v.type === "Teaser" && v.site === "YouTube"
          );

          const youtubeVideo = trailer || teaser || movieData.videos.results[0];

          if (youtubeVideo) {
            setYoutubeTrailerId(youtubeVideo.key);
          }
        }

        if (isEpisode) {
          // Fetch chi tiết tập phim
          try {
            const episodeResponse = await fetch(
              `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}?language=vi-VN`,
              options
            );
            if (episodeResponse.ok) {
              const episodeData = await episodeResponse.json();
              setEpisodeDetails(episodeData);
            }
          } catch (epError) {
            console.error("Lỗi khi fetch tập:", epError);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, mediaType, isEpisode, seasonNumber, episodeNumber]);

  // ===== HELPER VARIABLES =====
  const title = movie?.title || movie?.name;
  const releaseYear = (movie?.release_date || movie?.first_air_date)?.substring(
    0,
    4
  );

  // ===== YOUTUBE PLAYER OPTIONS =====
  const youtubeOpts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      controls: 1,
    },
  };

  // ===== RENDER STATES =====
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
      {/* ===== VIDEO PLAYER ===== */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl mb-6">
        {loadingStream ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-xl">Đang tải video...</p>
            </div>
          </div>
        ) : youtubeTrailerId ? (
          <YouTube
            videoId={youtubeTrailerId}
            opts={youtubeOpts}
            className="w-full h-full"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <p className="text-2xl mb-2">😔</p>
              <p className="text-xl">Không tìm thấy video cho tập này.</p>
            </div>
          </div>
        )}
      </div>

      {/* ===== BADGE NGUỒN VIDEO ===== */}
      <div className="mb-4 flex items-center gap-2 flex-wrap">
        {youtubeTrailerId ? (
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
            Trailer chính thức (TV Show)
          </span>
        ) : null}
      </div>

      {/* ===== THÔNG TIN PHIM ===== */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg">
        {isEpisode && episodeDetails ? (
          <>
            <h3 className="text-lg text-red-400 font-semibold">{title}</h3>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Tập {episodeDetails.episode_number}: {episodeDetails.name}
            </h1>
          </>
        ) : (
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
        )}

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
          {isEpisode && episodeDetails?.overview
            ? episodeDetails.overview
            : movie?.overview}
        </p>
      </div>

      {/* ===== DANH SÁCH TẬP ===== */}
      {mediaType === "tv" && (
        <EpisodeSelector
          tvId={id}
          currentSeason={parseInt(seasonNumber) || 1}
          currentEpisode={parseInt(episodeNumber)}
          movie={movie}
        />
      )}

      <CommentSection mediaType={mediaType} mediaId={id} />
    </div>
  );
};

export default WatchPage;
