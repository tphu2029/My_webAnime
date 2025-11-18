import React from "react";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const CommentList = ({ comments, onDelete, loadingDelete }) => {
  const { authUser } = useAuth();

  if (comments.length === 0) {
    return <p className="text-gray-400">Chưa có bình luận nào.</p>;
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment._id} className="flex items-start space-x-4">
          <img
            src={comment.user.avatarUrl || `https://ui-avatars.com/api/?name=${comment.user.displayName}&background=random`}
            alt={comment.user.displayName}
            className="h-10 w-10 rounded-full object-cover"
          />
          {/* min-w-0 + p.breakwords: Xuống dòng chuỗi dài*/}
          <div className="flex-1 min-w-0"> 
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-white">{comment.user.displayName}</span>
                <span className="ml-3 text-sm text-gray-400">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                    locale: vi,
                  })}
                </span>
              </div>
              {/* Hiển thị nút xóa nếu user này là chủ nhân bình luận */}
              {authUser && authUser._id === comment.user._id && (
                <button
                  onClick={() => onDelete(comment._id)}
                  disabled={loadingDelete === comment._id}
                  className="text-gray-500 transition hover:text-red-500 disabled:cursor-not-allowed"
                >
                  {loadingDelete === comment._id ? "Đang xóa..." : <FontAwesomeIcon icon={faTrash} />}
                </button>
              )}
            </div>
            <p className="mt-1 text-gray-300 whitespace-pre-wrap break-words">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;