import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import { toast } from "sonner";

const CommentSection = ({ mediaType, mediaId }) => {
  const { authUser, requireLogin } = useAuth();
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [loadingPostComment, setLoadingPostComment] = useState(false);
  const [loadingDeleteComment, setLoadingDeleteComment] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const res = await axios.get(`/comments/${mediaType}/${mediaId}`);
        setComments(res.data);
      } catch (err) {
        console.error("Lỗi tải bình luận:", err);
      } finally {
        setLoadingComments(false);
      }
    };

    if (mediaId && mediaType) {
      fetchComments();
    }
  }, [mediaId, mediaType]);

  
  const handlePostComment = async (content) => {
    if (!authUser) {
      requireLogin();
      return;
    }
    setLoadingPostComment(true);
    try {
      const res = await axios.post("/comments", {
        mediaId: mediaId,
        mediaType: mediaType,
        content: content,
      });
      setComments([res.data, ...comments]);
      toast.success("Đăng bình luận thành công!");
    } catch (error) {
      console.error("Lỗi đăng bình luận:", error);
      toast.error("Đăng bình luận thất bại.");
    } finally {
      setLoadingPostComment(false);
    }
  };


  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;
    setLoadingDeleteComment(commentId);
    try {
      await axios.delete(`/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
      toast.success("Đã xóa bình luận.");
    } catch (error) {
      console.error("Lỗi xóa bình luận:", error);
      toast.error("Xóa thất bại.");
    } finally {
      setLoadingDeleteComment(null);
    }
  };

  return (
    <div className="mt-12 border-t border-gray-700 pt-8">
      <h2 className="text-2xl font-semibold mb-6">Bình luận</h2>

      <CommentForm
        onSubmit={handlePostComment}
        isLoading={loadingPostComment}
      />

      <div className="mt-8">
        {loadingComments ? (
          <p className="text-gray-400 italic text-center">
            Đang tải bình luận...
          </p>
        ) : (
          <CommentList
            comments={comments}
            onDelete={handleDeleteComment}
            loadingDelete={loadingDeleteComment}
          />
        )}
      </div>
    </div>
  );
};

export default CommentSection;