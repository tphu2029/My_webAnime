import User from "../models/User.js";
import bcrypt from "bcrypt";

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

//  CẬP NHẬT PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { displayName, phone, bio } = req.body;
    const userId = req.user._id;

    // Tìm user và cập nhật
    // { new: true } để nó trả về user *sau* khi đã cập nhật
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          displayName: displayName,
          phone: phone,
          bio: bio,
        },
      },
      { new: true, runValidators: true }
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

//  ĐỔI MẬT KHẨU
export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = req.user; // req.user đã được lấy từ authMiddleware

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Vui lòng nhập đủ thông tin." });
    }

    // Lấy user đầy đủ (vì req.user có thể không có hashedPassword)
    const fullUser = await User.findById(user._id);
    if (!fullUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    // So sánh mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, fullUser.hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu cũ không chính xác." });
    }

    // Hash mật khẩu mới
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật
    fullUser.hashedPassword = newHashedPassword;
    await fullUser.save();

    return res.status(200).json({ message: "Đổi mật khẩu thành công." });
  } catch (error) {
    console.log("updatePassword error", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
