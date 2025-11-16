import mongoose from "mongoose";

/**
 * Anime Model
 * Model để lưu mapping giữa TMDB và GoGoAnime
 * Giúp map anime từ TMDB (UI/metadata tiếng Việt) sang GoGoAnime (video streaming)
 */

const animeSchema = new mongoose.Schema(
  {
    // TMDB ID - ID của anime trên The Movie Database
    tmdbId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    // GoGoAnime ID - ID của anime trên GoGoAnime (slug format)
    // VD: "shingeki-no-kyojin", "one-piece", etc.
    gogoAnimeId: {
      type: String,
      required: true,
    },

    // Tên anime (từ TMDB) - để dễ quản lý
    title: {
      type: String,
      required: true,
    },

    // Tên anime gốc (từ TMDB) - original_name
    originalTitle: {
      type: String,
    },

    // Loại media (tv hoặc movie)
    mediaType: {
      type: String,
      enum: ["tv", "movie"],
      default: "tv",
    },

    // Season mapping (cho trường hợp 1 anime TMDB có nhiều season khác GoGoAnime ID)
    // VD: Season 1 -> "anime-season-1", Season 2 -> "anime-season-2"
    seasonMappings: [
      {
        seasonNumber: Number,
        gogoAnimeId: String,
      },
    ],

    // Trạng thái mapping (verified/unverified)
    // verified: đã kiểm tra và hoạt động
    // unverified: mới thêm, chưa test
    status: {
      type: String,
      enum: ["verified", "unverified"],
      default: "unverified",
    },

    // Người tạo mapping (user ID)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Metadata bổ sung
    metadata: {
      // Số tập
      totalEpisodes: Number,
      // Năm phát hành
      releaseYear: Number,
      // Ghi chú
      notes: String,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Index kép để tìm kiếm nhanh
animeSchema.index({ tmdbId: 1, mediaType: 1 });
animeSchema.index({ gogoAnimeId: 1 });

/**
 * Static method: Tìm GoGoAnime ID từ TMDB ID
 * @param {Number} tmdbId - TMDB ID
 * @param {String} mediaType - Loại media (tv/movie)
 * @param {Number} seasonNumber - Số season (optional)
 * @returns {Promise<String|null>} - GoGoAnime ID hoặc null
 */
animeSchema.statics.findGoGoAnimeId = async function (
  tmdbId,
  mediaType = "tv",
  seasonNumber = null
) {
  try {
    const anime = await this.findOne({ tmdbId, mediaType });

    if (!anime) return null;

    // Nếu có season mapping và seasonNumber được cung cấp
    if (seasonNumber && anime.seasonMappings && anime.seasonMappings.length > 0) {
      const seasonMapping = anime.seasonMappings.find(
        (sm) => sm.seasonNumber === parseInt(seasonNumber)
      );
      if (seasonMapping) {
        return seasonMapping.gogoAnimeId;
      }
    }

    // Trả về GoGoAnime ID mặc định
    return anime.gogoAnimeId;
  } catch (error) {
    console.error("Lỗi khi tìm GoGoAnime ID:", error);
    return null;
  }
};

/**
 * Static method: Tạo hoặc cập nhật anime mapping
 * @param {Object} mappingData - Data cho mapping
 * @returns {Promise<Object>} - Anime document
 */
animeSchema.statics.createOrUpdateMapping = async function (mappingData) {
  try {
    const { tmdbId, mediaType } = mappingData;

    // Tìm xem đã có mapping chưa
    const existing = await this.findOne({ tmdbId, mediaType });

    if (existing) {
      // Cập nhật mapping hiện có
      Object.assign(existing, mappingData);
      await existing.save();
      return existing;
    } else {
      // Tạo mapping mới
      const newAnime = new this(mappingData);
      await newAnime.save();
      return newAnime;
    }
  } catch (error) {
    console.error("Lỗi khi tạo/cập nhật mapping:", error);
    throw error;
  }
};

const Anime = mongoose.model("Anime", animeSchema);

export default Anime;
