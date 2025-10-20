import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom"; // Thêm Link
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faPlay } from "@fortawesome/free-solid-svg-icons"; // Thêm faPlay

const VITE_API_KEY = import.meta.env.VITE_API_KEY;
const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;

const MovieDetailPage = () => {
  // Lấy cả movieId và tvId từ URL (một trong hai sẽ có giá trị)
  const { movieId, tvId } = useParams();
  const location = useLocation();

  // Xác định ID và loại media
  const id = movieId || tvId;
  const mediaType = location.pathname.startsWith("/tv") ? "tv" : "movie";

  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      // Reset state mỗi khi tải
      setLoading(true);
      setError(null);
      setMovie(null);
      setCredits(null);

      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${VITE_API_KEY}`,
        },
      };

      try {
        // Gọi API động dựa trên mediaType và id
        const [movieResponse, creditsResponse] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/${mediaType}/${id}?language=vi-VN`,
            options
          ),
          fetch(
            `https://api.themoviedb.org/3/${mediaType}/${id}/credits?language=vi-VN`,
            options
          ),
        ]);

        if (!movieResponse.ok || !creditsResponse.ok) {
          throw new Error("Không thể tải dữ liệu phim.");
        }

        const movieData = await movieResponse.json();
        const creditsData = await creditsResponse.json();

        setMovie(movieData);
        setCredits(creditsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id, mediaType]); // Chạy lại useEffect khi 'id' hoặc 'mediaType' thay đổi

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Đang tải...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Không tìm thấy phim.
      </div>
    );
  }

  const director = credits?.crew.find((member) => member.job === "Director");
  const cast = credits?.cast.slice(0, 5);

  // Chuẩn bị dữ liệu hiển thị (dùng title cho phim lẻ, name cho phim bộ)
  const title = movie.title || movie.name;
  const releaseYear = (movie.release_date || movie.first_air_date)?.substring(
    0,
    4
  );
  const runtime =
    movie.runtime ||
    (movie.episode_run_time ? movie.episode_run_time[0] : null);

  return (
    <div className="text-white">
      {/* Banner */}
      <div className="relative h-[40vh] md:h-[60vh]">
        <img
          src={`${VITE_IMG_URL}${movie.backdrop_path}`}
          alt={`Banner của ${title}`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
      </div>

      {/* Nội dung chính */}
      <div className="container mx-auto max-w-6xl p-4 md:p-8 -mt-24 md:-mt-48 relative">
        <div className="md:flex md:space-x-8">
          {/* Poster */}
          <div className="w-1/2 md:w-1/3 flex-shrink-0">
            <img
              src={`${VITE_IMG_URL}${movie.poster_path}`}
              alt={`Poster của ${title}`}
              className="rounded-lg shadow-2xl w-full"
            />
          </div>
          {/* Thông tin phim */}
          <div className="mt-6 md:mt-0 flex flex-col justify-end">
            <h1 className="text-3xl md:text-5xl font-bold">{title}</h1>
            {movie.tagline && (
              <p className="text-gray-400 italic mt-1">{movie.tagline}</p>
            )}

            {/* ===  NÚT XEM  === */}
            <div className="my-5">
              <Link to={`/${mediaType}/${id}/trailer`}>
                <button
                  className="
                    rounded-full bg-red-600 px-6 py-3 text-base 
                    font-bold text-white shadow-lg 
                    transition-transform duration-200 hover:scale-105"
                >
                  <FontAwesomeIcon icon={faPlay} className="mr-2" />
                  Xem Phim
                </button>
              </Link>
            </div>
            {/* ========================================= */}

            <div className="flex items-center flex-wrap my-4 gap-4">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                <span className="font-bold text-xl">
                  {movie.vote_average?.toFixed(1)}
                </span>
                <span className="text-gray-400 text-sm">
                  ({movie.vote_count} đánh giá)
                </span>
              </div>
              {releaseYear && (
                <>
                  <span className="text-gray-400">•</span>
                  <span>{releaseYear}</span>
                </>
              )}
              {runtime && (
                <>
                  <span className="text-gray-400">•</span>
                  <span>
                    {runtime} phút{mediaType === "tv" && "/tập"}
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="border border-gray-600 rounded-full px-3 py-1 text-sm text-gray-300"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <h2 className="text-xl font-semibold mt-4 mb-2">Nội dung</h2>
            <p className="text-gray-300 leading-relaxed">{movie.overview}</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {director && (
                <div>
                  <h3 className="font-semibold">Đạo diễn</h3>
                  <p className="text-gray-400">{director.name}</p>
                </div>
              )}
              {movie.created_by && movie.created_by.length > 0 && (
                <div>
                  <h3 className="font-semibold">Biên kịch</h3>
                  <p className="text-gray-400">
                    {movie.created_by.map((c) => c.name).join(", ")}
                  </p>
                </div>
              )}
              {cast && cast.length > 0 && (
                <div>
                  <h3 className="font-semibold">Diễn viên</h3>
                  <p className="text-gray-400">
                    {cast.map((actor) => actor.name).join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
