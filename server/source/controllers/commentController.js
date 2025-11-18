import Comment from "../models/Comment.js";
import mongoose from "mongoose";


// Lấy tất cả bình luận cho một movie/tv
// GET /:mediaType/:mediaId
export const getComments = async (req, res) => {
  try {
    const { mediaType, mediaId } = req.params;

    const comments = await Comment.find({ mediaType, mediaId })
      .populate("user", "displayName avatarUrl")
      .sort({ createdAt: -1 }); // Sắp xếp bình luận mới nhất lên đầu

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};


// Tạo một bình luận mới
// POST /
export const createComment = async (req, res) => {
  try {
    const { mediaType, mediaId, content } = req.body;
    const userId = req.user._id;

    if (!content) {
      return res.status(400).json({ message: "Nội dung không được để trống." });
    }

    const newComment = new Comment({
      mediaType,
      mediaId,
      content,
      user: userId,
    });

    await newComment.save();

    // Populate thông tin user trước khi gửi về client
    const populatedComment = await Comment.findById(newComment._id).populate(
      "user",
      "displayName avatarUrl"
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};


// Xóa một bình luận
// DELETE /:id
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID bình luận không hợp lệ." });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy bình luận." });
    }

    // Chỉ chủ nhân của bình luận mới được xóa
    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Bạn không có quyền xóa bình luận này." });
    }

    await Comment.findByIdAndDelete(id);

    res.status(200).json({ message: "Đã xóa bình luận." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};