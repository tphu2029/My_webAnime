import User from "../models/User.js";
import bcrypt from "bcrypt";

/**
 * Controller để lấy thông tin user hiện tại
 * Middleware protectedRoute đã gán req.user trước khi vào đây
 */
export const authMe = (req, res) => {
  try {
    const user = req.user; // Lấy user từ middleware

    // Trả về thông tin user
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log("authMe error", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Controller để thêm/xóa phim khỏi danh sách yêu thích
 * Nếu phim đã có trong favorites -> Xóa (unlike)
 * Nếu phim chưa có -> Thêm vào (like)
 */
export const toggleFavorite = async (req, res) => {
  try {
    const { mediaId, mediaType, posterPath, title } = req.body;
    const user = req.user; // Lấy user từ protectedRoute middleware

    // Kiểm tra xem có đầy đủ thông tin không
    if (!mediaId || !mediaType || !posterPath || !title) {
      return res.status(400).json({ message: "Thiếu thông tin media." });
    }

    const mediaItem = { mediaId, mediaType, posterPath, title };

    // Tìm xem phim đã có trong danh sách yêu thích chưa
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

    // Lưu lại user vào database
    const updatedUser = await user.save();

    // Trả về user đã cập nhật (che mật khẩu)
    res.status(200).json({
      user: {
        ...updatedUser.toObject(),
        hashedPassword: "Đã bị che", // Không gửi password về client
      },
    });
  } catch (error) {
    console.error("toggleFavorite error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Controller để cập nhật thông tin profile của user
 * Cập nhật displayName, phone, bio
 */
export const updateProfile = async (req, res) => {
  try {
    const { displayName, phone, bio } = req.body;
    const userId = req.user._id;

    // Tìm user và cập nhật các trường mới
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          displayName: displayName,
          phone: phone,
          bio: bio,
        },
      },
      { new: true, runValidators: true } // new: true để trả về document đã update
    ).select("-hashedPassword"); // Luôn loại bỏ password

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    return res.status(200).json({
      message: "Cập nhật thông tin thành công.",
      user: updatedUser, // Gửi lại user đã cập nhật
    });
  } catch (error) {
    console.log("updateProfile error", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Controller để đổi mật khẩu
 * Kiểm tra mật khẩu cũ -> Hash mật khẩu mới -> Lưu vào DB
 */
export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = req.user; // req.user đã được lấy từ authMiddleware

    // Kiểm tra có đủ thông tin không
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Vui lòng nhập đủ thông tin." });
    }

    // Lấy user đầy đủ từ DB (vì req.user có thể không có hashedPassword)
    const fullUser = await User.findById(user._id);
    if (!fullUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    // So sánh mật khẩu cũ với mật khẩu đã hash trong DB
    const isMatch = await bcrypt.compare(oldPassword, fullUser.hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu cũ không chính xác." });
    }

    // Hash mật khẩu mới (10 rounds)
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu mới
    fullUser.hashedPassword = newHashedPassword;
    await fullUser.save();

    return res.status(200).json({ message: "Đổi mật khẩu thành công." });
  } catch (error) {
    console.log("updatePassword error", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
