import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaRegComment, FaEllipsisH } from "react-icons/fa";
import axios from "axios";
import CommentModal from "./CommentModel";
import { Link, resolvePath } from "react-router-dom";
import { useSelector } from "react-redux";
import ReportModal from "./UserPostReport";
import { Toaster, toast } from 'sonner';

const Post = ({ post }) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [comments, setComments] = useState(post.comments || []);
  const [totalLikes, setTotalLikes] = useState(post.total_likes);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = useSelector((state) => state.auth.user_id);

  const getToken = () => {
    return localStorage.getItem("access");
  };

  useEffect(() => {
    setIsLiked(post.is_liked);
    setTotalLikes(post.total_likes);
  }, [post]);

  const handleLikeToggle = async () => {
    try {
      const response = await axios.post(
        `${baseURL}/post/like-post/${post.id}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setIsLiked(response.data.is_liked);
      setTotalLikes(response.data.total_likes);
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  const handleReportSubmit = async (reason) => {
    try {
      console.log("the reson of the report sumit is ",reason);
      console.log("post",post);
      console.log("reson",reason);
      
            
      
      await axios.post(
        `${baseURL}/post/report-post/${post.id}/`,
        { 
          post: post.id, 
          reporter: user,
          reason: reason, 
         },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          
        }
      );
      setIsReportModalOpen(false);
      toast.success('Report submitted successfully');
    } catch (error) {
      console.error("Error reporting post:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <div className="flex items-center">
        {post.user.profile_picture && (
          <img
            src={`${baseURL}${post.user.profile_picture}`}
            alt="Profile"
            className="w-10 h-10 rounded-full mr-3"
          />
        )}
        <Link
          to={`/user/profile/${post.user.id}`}
          className="text-lg font-bold"
        >
          {post.user.full_name}
        </Link>

        <div style={{ marginLeft: "auto" }}>
          <button
            className="focus:outline-none w-5"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <FaEllipsisH className="text-xl" />
          </button>

          {isDropdownOpen && (
            <div className="absolute mt-2 py-2 w-48 bg-white border rounded-lg shadow-xl">
              {user === post.user.id ? (
                <>
                  <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Update
                  </button>
                  <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Delete
                  </button>
                </>
              ) : (
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsReportModalOpen(true)}
                >
                  Report
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {post.img && (
        <img
          src={post.img}
          alt="Post"
          className="w-full mt-3 rounded-lg shadow-md"
        />
      )}

      <div className="flex items-center mt-3">
        <button onClick={handleLikeToggle} className="mr-3 focus:outline-none">
          {isLiked ? (
            <FaHeart className="text-2xl text-red-500" />
          ) : (
            <FaRegHeart className="text-2xl" />
          )}
        </button>
        <button
          onClick={() => setIsCommentModalOpen(true)}
          className="focus:outline-none"
        >
          <FaRegComment className="text-2xl" />
        </button>
      </div>
      <p className="mt-3 font-medium">Likes: {totalLikes}</p>
      <p className="mt-3 font-medium">{post.body}</p>
      <CommentModal
        postId={post.id}
        comments={comments}
        setComments={setComments}
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};

export default Post;
