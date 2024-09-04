import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { FaHeart, FaRegHeart, FaEllipsisH } from "react-icons/fa";
import { useSelector } from "react-redux";

const PostDetailPage = ({ postID, onClose, isPostDetailOpen }) => {
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBody, setEditedBody] = useState("");
  const userId = useSelector((state) => state.auth.user_id);
  const baseURL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchPostDetails = async () => {
      const token = localStorage.getItem("access");
      try {
        const response = await axios.get(
          `${baseURL}/post/post-detail/${postID}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPost(response.data);
        setLiked(response.data.user_liked);
      } catch (error) {
        setError("Failed to fetch post details");
      }
    };

    if (isPostDetailOpen) {
      fetchPostDetails();
    }

    return () => {
      setPost(null);
    };
  }, [postID, isPostDetailOpen]);

  const handleLikeToggle = async () => {
    const token = localStorage.getItem("access");
    try {
      const response = await axios.post(
        `${baseURL}/post/toggle-like/${postID}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLiked(response.data.user_liked);
      setPost((prevPost) => ({
        ...prevPost,
        total_likes: response.data.total_likes,
      }));
    } catch (error) {
      setError("Failed to toggle like");
    }
  };

  const handleDeletePost = async () => {
    const token = localStorage.getItem("access");
    try {
      await axios.delete(`${baseURL}/post/delete-post/${postID}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onDeletePost(postID);
      onClose();
      toast.success("delete Successfuly");
    } catch (error) {
      setError("Failed to delete post");
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");
    try {
      const response = await axios.patch(
        `${baseURL}/post/update-post/${postID}/`,
        { body: editedBody },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPost((prevPost) => ({
        ...prevPost,
        body: response.data.body,
      }));
      setIsEditing(false);
      toast.success("update successfully");
    } catch (error) {
      setError("Failed to update post");
      toast.success("Failed to update post");
    }
  };

  if (!isPostDetailOpen) {
    return null;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>Loading...</div>;
  }
  console.log("in the post detailed userid,", userId);
  console.log("in the post detailed post id user id", post?.user?.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-3xl relative shadow-lg overflow-auto max-h-screen">
        <button
          onClick={() => onClose()}
          className="absolute top-4 right-4 text-xl font-bold text-gray-600 hover:text-gray-800"
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <img
            className="w-full h-auto max-h-96 object-cover rounded-lg mb-4"
            src={`${baseURL}${post.img}`}
            alt={post.body}
          />
          {isEditing ? (
            <div className="w-full mb-4">
              <textarea
                value={editedBody}
                onChange={(e) => setEditedBody(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleUpdatePost}
                className="mt-2 bg-blue-500 text-white py-1 px-4 rounded"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="w-full">
              <div className="text-lg font-semibold mb-2">{post.body}</div>
              <div className="text-gray-600 mb-4">{post.description}</div>
            </div>
          )}
          <div className="w-full flex justify-between items-center">
            <button onClick={handleLikeToggle} className="text-3xl">
              {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            </button>
            {post.user.id === userId && (
              <>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-xl"
                >
                  <FaEllipsisH />
                </button>
                {showMenu && (
                  <div className="absolute top-12 right-4 bg-white border rounded shadow-lg">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setEditedBody(post.body);
                        setShowMenu(false);
                      }}
                      className="block px-4 py-2 text-left w-full"
                    >
                      Update
                    </button>
                    <button
                      onClick={handleDeletePost}
                      className="block px-4 py-2 text-left w-full text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="w-full mt-4">
            <span className="text-lg">{post.total_likes} likes</span>
          </div>
          <div className="w-full mt-4">
            <h3 className="text-xl font-semibold mb-2">Comments</h3>
            {post.comments.length === 0 ? (
              <div className="text-gray-500">No comments yet.</div>
            ) : (
              post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex gap-4 mb-4 p-4 bg-gray-100 rounded-lg shadow-md"
                >
                  <img
                    className="w-10 h-10 object-cover rounded-full"
                    src={`${baseURL}${comment.profile_picture}`}
                    alt={comment.user_full_name}
                  />
                  <div className="flex-1">
                    <div className="font-semibold">
                      {comment.user_full_name}
                    </div>
                    <div>{comment.body}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
