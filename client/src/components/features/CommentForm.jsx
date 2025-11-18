import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

// Xử lý gửi bình luận
const CommentForm = ({ onSubmit, isLoading }) => {
  const { authUser } = useAuth();
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content);
    setContent(""); // Xóa nội dung form sau khi gửi
  };

  // Nếu chưa đăng nhập, hiển thị thông báo
  if (!authUser) {
    return (
      <div className="my-4 rounded-lg border border-gray-700 bg-gray-800 p-4 text-center text-gray-400">
        Vui lòng <span className="font-bold text-red-500">đăng nhập</span> để để lại bình luận.
      </div>
    );
  }

  // Đã đăng nhập, hiển thị form
  return (
    <form onSubmit={handleSubmit} className="my-6">
      <div className="flex items-start space-x-4">
        <img
          src={authUser.avatarUrl || `https://ui-avatars.com/api/?name=${authUser.displayName}&background=random`}
          alt="Avatar"
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500"
            rows="3"
            placeholder="Viết bình luận của bạn..."
            disabled={isLoading}
          ></textarea>
          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="mt-2 rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Đang gửi..." : "Gửi bình luận"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;