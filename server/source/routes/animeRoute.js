import express from "express";
import {
  getAnimeMapping,
  createOrUpdateMapping,
  getAllMappings,
  deleteMapping,
  verifyMapping,
  searchGoGoAnime,
  getAnimeStream,
} from "../controllers/animeController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

/**
 * Anime Routes
 * Routes để quản lý anime mapping giữa TMDB và GoGoAnime
 */

const router = express.Router();

/**
 * GET /api/anime/search-gogoanime
 * Search anime trên GoGoAnime (public - để hỗ trợ khi mapping)
 */
router.get("/search-gogoanime", searchGoGoAnime);

/**
 * GET /api/anime/stream/:tmdbId
 * Proxy endpoint để lấy streaming links (bypass CORS)
 * Query params: mediaType, seasonNumber, episodeNumber, title
 */
router.get("/stream/:tmdbId", getAnimeStream);

/**
 * GET /api/anime/mapping/:tmdbId
 * Lấy GoGoAnime ID từ TMDB ID (public - để WatchPage dùng)
 * Query params: mediaType (tv/movie), seasonNumber (optional)
 */
router.get("/mapping/:tmdbId", getAnimeMapping);

/**
 * GET /api/anime/mappings
 * Lấy tất cả mappings (public - có thể giới hạn cho admin nếu cần)
 * Query params: page, limit, status, search, mediaType
 */
router.get("/mappings", getAllMappings);

/**
 * POST /api/anime/mapping
 * Tạo hoặc cập nhật mapping (yêu cầu đăng nhập)
 * Body: { tmdbId, gogoAnimeId, title, originalTitle, mediaType, seasonMappings, metadata }
 */
router.post("/mapping", protectedRoute, createOrUpdateMapping);

/**
 * PATCH /api/anime/mapping/:tmdbId/verify
 * Verify mapping (yêu cầu đăng nhập)
 * Query params: mediaType
 */
router.patch("/mapping/:tmdbId/verify", protectedRoute, verifyMapping);

/**
 * DELETE /api/anime/mapping/:tmdbId
 * Xóa mapping (yêu cầu đăng nhập)
 * Query params: mediaType
 */
router.delete("/mapping/:tmdbId", protectedRoute, deleteMapping);

export default router;
// trigger restart
