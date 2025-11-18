import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    mediaId: {
      type: String,
      required: true,
    },

    mediaType: {
      type: String,
      required: true,
      enum: ["movie", "tv"],
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxLength: 2000,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },

    // Reply (coming soon)
    // parentComment: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Comment",
    //   default: null,
    // },
  },
  {
    timestamps: true,
  }
);

// Tạo index để query bình luận theo phim nhanh hơn
commentSchema.index({ mediaId: 1, mediaType: 1 });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;