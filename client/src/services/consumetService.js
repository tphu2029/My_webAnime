/**
 * Consumet API Service
 * Service để lấy anime streaming links từ Consumet API
 * Hỗ trợ GoGoAnime provider với audio tiếng Nhật
 */

// Base URL của Consumet API (public instance)
const CONSUMET_BASE_URL = "https://api.consumet.org";

/**
 * Hàm search anime từ GoGoAnime bằng tên
 *
 * @param {string} query - Tên anime cần search
 * @returns {Promise<Array>} - Danh sách kết quả anime
 */
export const searchAnime = async (query) => {
  try {
    const response = await fetch(
      `${CONSUMET_BASE_URL}/anime/gogoanime/${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error("Không thể search anime từ Consumet");
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Lỗi khi search anime:", error);
    return [];
  }
};

/**
 * Hàm lấy thông tin chi tiết anime từ GoGoAnime ID
 *
 * @param {string} animeId - ID của anime trên GoGoAnime
 * @returns {Promise<Object>} - Thông tin chi tiết anime (bao gồm episodes)
 */
export const getAnimeInfo = async (animeId) => {
  try {
    const response = await fetch(
      `${CONSUMET_BASE_URL}/anime/gogoanime/info/${animeId}`
    );

    if (!response.ok) {
      throw new Error("Không thể lấy thông tin anime");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin anime:", error);
    return null;
  }
};

/**
 * Hàm tìm anime ID từ GoGoAnime bằng tên (best match)
 * Helper function để map từ TMDB title sang GoGoAnime
 *
 * @param {string} title - Tên anime từ TMDB
 * @returns {Promise<string|null>} - GoGoAnime ID (best match) hoặc null
 */
export const findAnimeIdByTitle = async (title) => {
  try {
    // Thử search với tên gốc
    let results = await searchAnime(title);

    // Nếu không tìm thấy, thử loại bỏ năm (VD: "Anime Name (2024)" -> "Anime Name")
    if (!results || results.length === 0) {
      const cleanTitle = title.replace(/\s*\(.*?\)\s*/g, "").trim();
      results = await searchAnime(cleanTitle);
    }

    // Nếu vẫn không có, thử loại bỏ season info
    if (!results || results.length === 0) {
      const cleanTitle = title.replace(/season\s+\d+/gi, "").trim();
      results = await searchAnime(cleanTitle);
    }

    // Trả về kết quả đầu tiên (best match)
    if (results && results.length > 0) {
      return results[0].id;
    }

    return null;
  } catch (error) {
    console.error("Lỗi khi tìm anime ID:", error);
    return null;
  }
};

/**
 * Hàm lấy episode ID cho một tập cụ thể
 *
 * @param {string} animeId - ID của anime trên GoGoAnime
 * @param {number} episodeNumber - Số tập cần lấy
 * @returns {Promise<string|null>} - Episode ID hoặc null
 */
export const getEpisodeId = async (animeId, episodeNumber) => {
  try {
    const animeInfo = await getAnimeInfo(animeId);

    if (!animeInfo || !animeInfo.episodes) {
      return null;
    }

    // Tìm episode với số tập matching
    const episode = animeInfo.episodes.find(
      (ep) => ep.number === episodeNumber
    );

    return episode ? episode.id : null;
  } catch (error) {
    console.error("Lỗi khi lấy episode ID:", error);
    return null;
  }
};

/**
 * Hàm lấy streaming sources cho một episode
 * Trả về các link stream (HLS/MP4) với multiple qualities
 *
 * @param {string} episodeId - ID của episode từ GoGoAnime
 * @returns {Promise<Object>} - Object chứa sources và download links
 */
export const getStreamingLinks = async (episodeId) => {
  try {
    const response = await fetch(
      `${CONSUMET_BASE_URL}/anime/gogoanime/watch/${episodeId}`
    );

    if (!response.ok) {
      throw new Error("Không thể lấy streaming links");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy streaming links:", error);
    return null;
  }
};

/**
 * Hàm wrapper hoàn chỉnh: Từ title + episode number -> Streaming links
 *
 * @param {string} title - Tên anime từ TMDB
 * @param {number} episodeNumber - Số tập cần xem
 * @returns {Promise<Object|null>} - Streaming data hoặc null
 */
export const getAnimeStreamByTitle = async (title, episodeNumber = 1) => {
  try {
    // Bước 1: Tìm anime ID từ title
    const animeId = await findAnimeIdByTitle(title);
    if (!animeId) {
      console.warn(`Không tìm thấy anime: ${title}`);
      return null;
    }

    // Bước 2: Lấy episode ID
    const episodeId = await getEpisodeId(animeId, episodeNumber);
    if (!episodeId) {
      console.warn(`Không tìm thấy tập ${episodeNumber} của ${title}`);
      return null;
    }

    // Bước 3: Lấy streaming links
    const streamData = await getStreamingLinks(episodeId);
    return streamData;
  } catch (error) {
    console.error("Lỗi khi lấy anime stream:", error);
    return null;
  }
};
