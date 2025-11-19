import express from "express";
import axios from "axios";

const router = express.Router();
const ANIME_API_URL = "http://localhost:3000"; // Server Consumet (Port 3000)

// --- ANIMEPAHE ROUTES ---

// 1. Proxy Search (Tìm kiếm)
router.get("/animepahe/search/:query", async (req, res) => {
  try {
    const encodedQuery = encodeURIComponent(req.params.query);
    // Gọi sang endpoint animepahe của server 3000
    const response = await axios.get(
      `${ANIME_API_URL}/anime/animepahe/${encodedQuery}`
    );
    res.status(200).json(response.data);
  } catch (err) {
    console.error("AnimePahe Search Error:", err.message);
    // Trả về rỗng nếu lỗi để frontend biết
    res.status(200).json({ results: [] });
  }
});

// 2. Proxy Info (Lấy thông tin & danh sách tập)
router.get("/animepahe/info/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `${ANIME_API_URL}/anime/animepahe/info/${req.params.id}`
    );
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Proxy Watch (Lấy link xem)
router.get("/animepahe/watch/:episodeId", async (req, res) => {
  try {
    const response = await axios.get(
      `${ANIME_API_URL}/anime/animepahe/watch/${req.params.episodeId}`
    );
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
