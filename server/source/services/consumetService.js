/**
 * Consumet API Service (Backend)
 * Service để tương tác với Consumet API từ server
 */

// Base URL của Consumet API
const CONSUMET_BASE_URL = "http://localhost:3000";

/**
 * Hàm search anime từ GoGoAnime
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
 * Hàm lấy thông tin chi tiết anime
 * @param {string} animeId - ID của anime trên GoGoAnime
 * @returns {Promise<Object>} - Thông tin chi tiết anime
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
 * Hàm lấy streaming links cho một episode
 * @param {string} episodeId - ID của episode
 * @returns {Promise<Object>} - Streaming data
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
 * Hàm lấy episode ID
 * @param {string} animeId - ID của anime
 * @param {number} episodeNumber - Số tập
 * @returns {Promise<string|null>} - Episode ID
 */
export const getEpisodeId = async (animeId, episodeNumber) => {
  try {
    const animeInfo = await getAnimeInfo(animeId);
    if (!animeInfo || !animeInfo.episodes) {
      return null;
    }

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
 * Hàm tìm anime ID từ title
 * @param {string} title - Tên anime
 * @returns {Promise<string|null>} - Anime ID
 */
export const findAnimeIdByTitle = async (title) => {
  try {
    let results = await searchAnime(title);

    if (!results || results.length === 0) {
      const cleanTitle = title.replace(/\s*\(.*?\)\s*/g, "").trim();
      results = await searchAnime(cleanTitle);
    }

    if (!results || results.length === 0) {
      const cleanTitle = title.replace(/season\s+\d+/gi, "").trim();
      results = await searchAnime(cleanTitle);
    }

    if (results && results.length > 0) {
      return results[0].id;
    }

    return null;
  } catch (error) {
    console.error("Lỗi khi tìm anime ID:", error);
    return null;
  }
};
