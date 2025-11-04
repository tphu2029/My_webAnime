import User from "../models/User.js";

export const authMe = (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log("authMe error", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Hàm xử lý mục yêu thích
export const toggleFavorite = async (req, res) => {
  try {
    const { mediaId, mediaType, posterPath, title } = req.body;
    const user = req.user; // Lấy từ protectedRoute

    if (!mediaId || !mediaType || !posterPath || !title) {
      return res.status(400).json({ message: "Thiếu thông tin media." });
    }

    const mediaItem = { mediaId, mediaType, posterPath, title };

    // Kiểm tra xem phim đã có trong danh sách yêu thích chưa
    const existingIndex = user.favorites.findIndex(
      (item) => item.mediaId === mediaId
    );

    if (existingIndex > -1) {
      // Đã có -> Xóa đi (unlike)
      user.favorites.splice(existingIndex, 1);
    } else {
      // Chưa có -> Thêm vào (like)
      user.favorites.push(mediaItem);
    }

    // Lưu lại user
    const updatedUser = await user.save();

    // Trả về user đã cập nhật (chỉ trả về thông tin cần thiết)
    res.status(200).json({
      user: {
        ...updatedUser.toObject(),
        hashedPassword: "Đã bị che", // Đảm bảo không gửi lại pass
      },
    });
  } catch (error) {
    console.error("toggleFavorite error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
