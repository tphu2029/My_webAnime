import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faPlay } from "@fortawesome/free-solid-svg-icons";
import EpisodeSelector from "../ui/EpisodeSelector";
import CommentSection from "../features/CommentSection";

const VITE_API_KEY = import.meta.env.VITE_API_KEY;
const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;

/**
 * Component MovieDetailPage
 * Trang chi tiết phim/TV show với thông tin đầy đủ
 * Hiển thị poster, backdrop, thông tin, cast, crew, và episode selector (cho TV)
 */
const MovieDetailPage = () => {
  // Lấy cả movieId và tvId từ URL params (một trong hai sẽ có giá trị)
  const { movieId, tvId } = useParams();
  const location = useLocation();

  // Xác định ID và loại media dựa trên URL path
  const id = movieId || tvId; // ID của phim hoặc TV show
  const mediaType = location.pathname.startsWith("/tv") ? "tv" : "movie"; // Phân biệt movie hay tv

  // State lưu thông tin phim/TV show
  const [movie, setMovie] = useState(null);
  // State lưu thông tin credits (cast & crew)
  const [credits, setCredits] = useState(null);
  // State loading khi đang fetch data
  const [loading, setLoading] = useState(true);
  // State lưu lỗi nếu có
  const [error, setError] = useState(null);

  // Cấu hình options cho fetch API
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${VITE_API_KEY}`,
    },
  };

  /**
   * Effect: Fetch data khi component mount hoặc khi id/mediaType thay đổi
   * Fetch song song cả thông tin phim và credits để tối ưu performance
   */
  useEffect(() => {
    const fetchMovieData = async () => {
      // Reset state mỗi khi tải mới
      setLoading(true);
      setError(null);
      setMovie(null);
      setCredits(null);

      try {
        // Gọi API song song bằng Promise.all để tối ưu tốc độ
        const [movieResponse, creditsResponse] = await Promise.all([
          // API lấy thông tin chi tiết phim/TV (tiếng Việt)
          fetch(
            `https://api.themoviedb.org/3/${mediaType}/${id}?language=vi-VN`,
            options
          ),
          // API lấy thông tin credits (cast & crew - tiếng Việt)
          fetch(
            `https://api.themoviedb.org/3/${mediaType}/${id}/credits?language=vi-VN`,
            options
          ),
        ]);

        // Kiểm tra xem cả 2 API có thành công không
        if (!movieResponse.ok || !creditsResponse.ok) {
          throw new Error("Không thể tải dữ liệu phim.");
        }

        // Parse JSON từ cả 2 responses
        const movieData = await movieResponse.json();
        const creditsData = await creditsResponse.json();

        // Cập nhật state với data đã fetch
        setMovie(movieData);
        setCredits(creditsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id, mediaType]); // Chạy lại khi id hoặc mediaType thay đổi

  // Helper: Lấy tiêu đề phim (movie.title cho phim, movie.name cho TV)
  const title = movie?.title || movie?.name;

  // ===== RENDER STATES =====
  // Hiển thị loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Đang tải...
      </div>
    );
  }

  // Hiển thị error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  // Hiển thị khi không tìm thấy phim
  if (!movie) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Không tìm thấy phim.
      </div>
    );
  }

  // ===== HELPER VARIABLES =====
  // Tìm đạo diễn từ credits
  const director = credits?.crew.find((member) => member.job === "Director");
  // Lấy 5 diễn viên chính đầu tiên
  const cast = credits?.cast.slice(0, 5);
  // Lấy năm phát hành (4 ký tự đầu)
  const releaseYear = (movie.release_date || movie.first_air_date)?.substring(
    0,
    4
  );
  // Lấy runtime: movie.runtime cho phim, episode_run_time[0] cho TV
  const runtime =
    movie.runtime ||
    (movie.episode_run_time ? movie.episode_run_time[0] : null);

  return (
    <div className="text-white">
      {/* ===== BANNER BACKDROP ===== */}
      <div className="relative h-[40vh] md:h-[60vh]">
        {/* Hình ảnh backdrop lớn */}
        <img
          src={`${VITE_IMG_URL}${movie.backdrop_path}`}
          alt={`Banner của ${title}`}
          className="h-full w-full object-cover"
        />
        {/* Overlay gradient để text dễ đọc hơn */}
        <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
      </div>

      {/* ===== NỘI DUNG CHÍNH ===== */}
      <div className="container mx-auto max-w-6xl p-4 md:p-8 -mt-24 md:-mt-48 relative">
        <div className="md:flex md:space-x-8">
          {/* --- POSTER BÊN TRÁI --- */}
          <div className="w-1/2 md:w-1/3 shrink-0">
            <img
              src={`${VITE_IMG_URL}${movie.poster_path}`}
              alt={`Poster của ${title}`}
              className="rounded-lg shadow-2xl w-full"
            />
          </div>

          {/* --- THÔNG TIN PHIM BÊN PHẢI --- */}
          <div className="mt-6 md:mt-0 flex flex-col justify-end w-full">
            {/* Tiêu đề */}
            <h1 className="text-3xl md:text-5xl font-bold">{title}</h1>

            {/* Tagline (nếu có) */}
            {movie.tagline && (
              <p className="text-gray-400 italic mt-1">{movie.tagline}</p>
            )}

            {/* --- NÚT XEM PHIM --- */}
            <div className="my-5">
              <Link
                to={
                  mediaType === "tv"
                    ? `/tv/${id}/season/1/episode/1` // TV: Link đến tập 1 mùa 1
                    : `/movie/${id}/trailer` // Movie: Link đến trailer
                }
              >
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

            {/* --- RATING, NĂM, RUNTIME --- */}
            <div className="flex items-center flex-wrap my-4 gap-4">
              {/* Rating với icon ngôi sao */}
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                <span className="font-bold text-xl">
                  {movie.vote_average?.toFixed(1)}
                </span>
                <span className="text-gray-400 text-sm">
                  ({movie.vote_count} đánh giá)
                </span>
              </div>

              {/* Năm phát hành */}
              {releaseYear && (
                <>
                  <span className="text-gray-400">•</span>
                  <span>{releaseYear}</span>
                </>
              )}

              {/* Thời lượng */}
              {runtime && (
                <>
                  <span className="text-gray-400">•</span>
                  <span>
                    {runtime} phút{mediaType === "tv" && "/tập"}
                  </span>
                </>
              )}
            </div>

            {/* --- DANH SÁCH THỂ LOẠI --- */}
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

            {/* --- NỘI DUNG/TÓM TẮT --- */}
            <h2 className="text-xl font-semibold mt-4 mb-2">Nội dung</h2>
            <p className="text-gray-300 leading-relaxed">{movie.overview}</p>

            {/* --- EPISODE SELECTOR (CHỈ CHO TV SHOWS) --- */}
            {mediaType === "tv" && (
              <EpisodeSelector
                tvId={id}
                currentSeason={1} // Mặc định hiển thị mùa 1
                movie={movie} // Truyền thông tin đầy đủ của TV show
              />
            )}

            {/* --- THÔNG TIN CAST & CREW --- */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Đạo diễn (cho movies) */}
              {director && (
                <div>
                  <h3 className="font-semibold">Đạo diễn</h3>
                  <p className="text-gray-400">{director.name}</p>
                </div>
              )}

              {/* Biên kịch (cho TV shows) */}
              {movie.created_by && movie.created_by.length > 0 && (
                <div>
                  <h3 className="font-semibold">Biên kịch</h3>
                  <p className="text-gray-400">
                    {movie.created_by.map((c) => c.name).join(", ")}
                  </p>
                </div>
              )}

              {/* Diễn viên chính */}
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
        
        <CommentSection mediaType={mediaType} mediaId={id} />
      </div>
    </div>
  );
};

export default MovieDetailPage;
