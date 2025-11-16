import Anime from "../models/Anime.js";
import {
  searchAnime,
  getAnimeInfo,
  getStreamingLinks as getConsumetStreamingLinks,
  getEpisodeId,
  findAnimeIdByTitle,
} from "../services/consumetService.js";

/**
 * Anime Controller
 * Controller để quản lý anime mapping giữa TMDB và GoGoAnime
 */

/**
 * GET /api/anime/mapping/:tmdbId
 * Lấy GoGoAnime ID từ TMDB ID
 * @param {Number} tmdbId - TMDB ID (từ params)
 * @param {String} mediaType - Loại media tv/movie (từ query)
 * @param {Number} seasonNumber - Số season (từ query, optional)
 */
export const getAnimeMapping = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const { mediaType = "tv", seasonNumber } = req.query;

    // Tìm GoGoAnime ID từ database
    const gogoAnimeId = await Anime.findGoGoAnimeId(
      parseInt(tmdbId),
      mediaType,
      seasonNumber ? parseInt(seasonNumber) : null
    );

    if (!gogoAnimeId) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy mapping cho anime này",
      });
    }

    res.json({
      success: true,
      data: {
        tmdbId: parseInt(tmdbId),
        gogoAnimeId,
        mediaType,
        seasonNumber: seasonNumber ? parseInt(seasonNumber) : null,
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy anime mapping:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy mapping",
      error: error.message,
    });
  }
};

/**
 * POST /api/anime/mapping
 * Tạo hoặc cập nhật anime mapping
 * Body: { tmdbId, gogoAnimeId, title, originalTitle, mediaType, seasonMappings, metadata }
 */
export const createOrUpdateMapping = async (req, res) => {
  try {
    const mappingData = req.body;

    // Validate required fields
    if (!mappingData.tmdbId || !mappingData.gogoAnimeId || !mappingData.title) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc: tmdbId, gogoAnimeId, title",
      });
    }

    // Thêm createdBy nếu có user trong request (từ auth middleware)
    if (req.user) {
      mappingData.createdBy = req.user._id;
    }

    // Tạo hoặc cập nhật mapping
    const anime = await Anime.createOrUpdateMapping(mappingData);

    res.json({
      success: true,
      message: "Mapping đã được lưu thành công",
      data: anime,
    });
  } catch (error) {
    console.error("Lỗi khi tạo/cập nhật mapping:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lưu mapping",
      error: error.message,
    });
  }
};

/**
 * GET /api/anime/mappings
 * Lấy tất cả anime mappings (có phân trang)
 * Query params: page, limit, status, search
 */
export const getAllMappings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      search,
      mediaType,
    } = req.query;

    // Xây dựng query filter
    const filter = {};
    if (status) filter.status = status;
    if (mediaType) filter.mediaType = mediaType;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { originalTitle: { $regex: search, $options: "i" } },
        { gogoAnimeId: { $regex: search, $options: "i" } },
      ];
    }

    // Tính toán pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Lấy data
    const [animes, total] = await Promise.all([
      Anime.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("createdBy", "username email"),
      Anime.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: animes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách mappings:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách",
      error: error.message,
    });
  }
};

/**
 * DELETE /api/anime/mapping/:tmdbId
 * Xóa anime mapping
 */
export const deleteMapping = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const { mediaType = "tv" } = req.query;

    const result = await Anime.findOneAndDelete({
      tmdbId: parseInt(tmdbId),
      mediaType,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy mapping để xóa",
      });
    }

    res.json({
      success: true,
      message: "Đã xóa mapping thành công",
    });
  } catch (error) {
    console.error("Lỗi khi xóa mapping:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa mapping",
      error: error.message,
    });
  }
};

/**
 * PATCH /api/anime/mapping/:tmdbId/verify
 * Đánh dấu mapping là verified
 */
export const verifyMapping = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const { mediaType = "tv" } = req.query;

    const anime = await Anime.findOneAndUpdate(
      { tmdbId: parseInt(tmdbId), mediaType },
      { status: "verified" },
      { new: true }
    );

    if (!anime) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy mapping",
      });
    }

    res.json({
      success: true,
      message: "Đã verify mapping thành công",
      data: anime,
    });
  } catch (error) {
    console.error("Lỗi khi verify mapping:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi verify",
      error: error.message,
    });
  }
};

/**
 * GET /api/anime/search-gogoanime
 * Search anime trên GoGoAnime (để hỗ trợ admin khi mapping)
 * Query: q (search query)
 */
export const searchGoGoAnime = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Thiếu query search",
      });
    }

    // Gọi Consumet API để search
    const results = await searchAnime(q);

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Lỗi khi search GoGoAnime:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi search GoGoAnime",
      error: error.message,
    });
  }
};

/**
 * GET /api/anime/stream/:tmdbId
 * Proxy endpoint để lấy streaming links (bypass CORS)
 * Query params: mediaType, seasonNumber, episodeNumber, title
 */
export const getAnimeStream = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const { mediaType = "tv", seasonNumber, episodeNumber, title } = req.query;

    if (!episodeNumber) {
      return res.status(400).json({
        success: false,
        message: "Thiếu episodeNumber",
      });
    }

    console.log(`🎬 [Stream Proxy] Lấy stream cho TMDB ${tmdbId}, tập ${episodeNumber}`);

    // Bước 1: Kiểm tra mapping trong DB
    const gogoAnimeId = await Anime.findGoGoAnimeId(
      parseInt(tmdbId),
      mediaType,
      seasonNumber ? parseInt(seasonNumber) : null
    );

    let stream = null;
    let usedGogoId = null;

    if (gogoAnimeId) {
      // Có mapping -> Dùng trực tiếp
      console.log(`✅ Tìm thấy mapping: ${gogoAnimeId}`);
      usedGogoId = gogoAnimeId;
      const episodeId = await getEpisodeId(gogoAnimeId, parseInt(episodeNumber));
      if (episodeId) {
        stream = await getConsumetStreamingLinks(episodeId);
      }
    } else if (title) {
      // Không có mapping -> Tự động tìm
      console.log(`🔍 Tìm anime: ${title}`);
      const foundId = await findAnimeIdByTitle(title);

      if (foundId) {
        console.log(`✅ Tìm thấy anime: ${foundId}`);
        usedGogoId = foundId;
        const episodeId = await getEpisodeId(foundId, parseInt(episodeNumber));
        if (episodeId) {
          stream = await getConsumetStreamingLinks(episodeId);

          // Tự động lưu mapping vào DB
          if (stream && stream.sources) {
            console.log(`💾 Tự động lưu mapping: ${tmdbId} -> ${foundId}`);
            try {
              await Anime.createOrUpdateMapping({
                tmdbId: parseInt(tmdbId),
                gogoAnimeId: foundId,
                title: title,
                mediaType: mediaType,
                metadata: {
                  notes: "Auto-mapped from backend proxy",
                },
              });
              console.log(`✅ Đã lưu mapping vào DB`);
            } catch (saveError) {
              console.error("Lỗi khi lưu mapping:", saveError);
            }
          }
        }
      }
    }

    if (!stream || !stream.sources) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy stream cho tập này",
      });
    }

    console.log(`✅ Tìm thấy ${stream.sources.length} nguồn stream`);

    res.json({
      success: true,
      data: {
        stream,
        gogoAnimeId: usedGogoId,
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy anime stream:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy stream",
      error: error.message,
    });
  }
};
