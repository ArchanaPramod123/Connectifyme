
// import React, { useState, useEffect } from "react";
// import { FaTrash, FaEdit, FaEllipsisV } from "react-icons/fa";
// import axios from "axios";
// import { useSelector } from 'react-redux';

// const CommentModal = ({ postId, isOpen, onClose }) => {
//   const [comments, setComments] = useState([]);
//   const [comment, setComment] = useState("");
//   const [showMenu, setShowMenu] = useState(null);
//   const [editingComment, setEditingComment] = useState(null);
//   const [editCommentText, setEditCommentText] = useState("");

//   const userId = useSelector((state) => state.auth.user_id);
//   const baseURL = import.meta.env.VITE_BASE_URL;

//   const getToken = () => {
//     return localStorage.getItem("access");
//   };

//   useEffect(() => {
//     if (isOpen) {
//       axios
//         .get(`${baseURL}/post/comments/${postId}/`, {
//           headers: {
//             Authorization: `Bearer ${getToken()}`,
//           },
//         })
//         .then((response) => {
//           setComments(response.data);
//         })
//         .catch((error) => {
//           console.error("Error fetching comments:", error);
//         });
//     }
//   }, [isOpen, postId]);

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         `${baseURL}/post/comment-post/${postId}/`,
//         { body: comment },
//         {
//           headers: {
//             Authorization: `Bearer ${getToken()}`,
//           },
//         }
//       );
//       setComments(response.data);
//       setComment("");
//     } catch (error) {
//       console.error("Error adding comment:", error);
//     }
//   };

//   const handleDeleteComment = async (commentId) => {
//     try {
//       await axios.delete(
//         `${baseURL}/post/comment-delete/${commentId}/`,
//         {
//           headers: {
//             Authorization: `Bearer ${getToken()}`,
//           },
//         }
//       );
//       setComments(comments.filter((comment) => comment.id !== commentId));
//     } catch (error) {
//       console.error("Error deleting comment:", error);
//     }
//   };

//   const handleUpdateComment = (commentId, currentText) => {
//     setEditingComment(commentId);
//     setEditCommentText(currentText);
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.put(
//         `${baseURL}/post/comment-update/${editingComment}/`,
//         { body: editCommentText },
//         {
//           headers: {
//             Authorization: `Bearer ${getToken()}`,
//           },
//         }
//       );
//       setComments(
//         comments.map((comment) =>
//           comment.id === editingComment ? response.data : comment
//         )
//       );
//       setEditingComment(null);
//       setEditCommentText("");
//     } catch (error) {
//       console.error("Error updating comment:", error);
//     }
//   };

//   if (!isOpen) {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white rounded-lg p-5 w-3/4 max-w-2xl">
//         <div className="flex justify-end">
//           <button
//             className="bg-transparent border-none text-gray-500 text-2xl"
//             onClick={onClose}
//           >
//             &times;
//           </button>
//         </div>
//         {editingComment ? (
//           <form onSubmit={handleEditSubmit} className="flex mb-5">
//             <input
//               type="text"
//               value={editCommentText}
//               onChange={(e) => setEditCommentText(e.target.value)}
//               placeholder="Edit your comment"
//               className="flex-1 p-2 border border-gray-300 rounded-md mr-2"
//             />
//             <button
//               type="submit"
//               className="bg-green-500 text-white border-none px-4 py-2 rounded-md"
//             >
//               Update
//             </button>
//           </form>
//         ) : (
//           <form onSubmit={handleCommentSubmit} className="flex mb-5">
//             <input
//               type="text"
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               placeholder="Add a comment"
//               className="flex-1 p-2 border border-gray-300 rounded-md mr-2"
//             />
//             <button
//               type="submit"
//               className="bg-blue-500 text-white border-none px-4 py-2 rounded-md"
//             >
//               Comment
//             </button>
//           </form>
//         )}
//         <div className="overflow-y-auto max-h-72 pr-4 -mr-4">
//           {comments.map((comment) => (
//             <div
//               key={comment.id}
//               className="border-t border-gray-300 py-2 flex justify-between items-center"
//             >
//               <div className="flex items-center">
//                 {comment.profile_picture ? (
//                   <img
//                     src={`${baseURL}${comment.profile_picture}`}
//                     alt="Profile"
//                     className="w-10 h-10 rounded-full mr-2"
//                   />
//                 ) : (
//                   <img
//                     src="path/to/default/profile/picture.jpg"
//                     alt="Default Profile"
//                     className="w-10 h-10 rounded-full mr-2"
//                   />
//                 )}
//                 <div className="flex flex-col">
//                   <span className="font-bold">{comment.user_full_name}</span>
//                   <p>{comment.body}</p>
//                   <span className="text-gray-500 text-sm">
//                     {comment.created_time} ago
//                   </span>
//                 </div>
//               </div>
//               {comment.user === userId && (
//                 <button
//                   className="relative bg-transparent border-none"
//                   onClick={() =>
//                     setShowMenu(comment.id === showMenu ? null : comment.id)
//                   }
//                 >
//                   <FaEllipsisV />
//                   <div
//                     className={`absolute right-0 bg-white border border-gray-300 rounded-md shadow-md ${
//                       comment.id === showMenu ? "block" : "hidden"
//                     }`}
//                   >
//                     <button
//                       className="block px-4 py-2 w-full text-left hover:bg-gray-100"
//                       onClick={() =>
//                         handleUpdateComment(comment.id, comment.body)
//                       }
//                     >
//                       <FaEdit /> Update
//                     </button>
//                     <button
//                       className="block px-4 py-2 w-full text-left hover:bg-gray-100"
//                       onClick={() => handleDeleteComment(comment.id)}
//                     >
//                       <FaTrash /> Delete
//                     </button>
//                   </div>
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CommentModal;

import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaEllipsisV } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";

const CommentModal = ({ postId, isOpen, onClose }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [reply, setReply] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  const userId = useSelector((state) => state.auth.user_id);
  const baseURL = import.meta.env.VITE_BASE_URL;

  const getToken = () => localStorage.getItem("access");

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, postId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${baseURL}/post/comments/${postId}/`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseURL}/post/comment-post/${postId}/`,
        { body: comment },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      fetchComments(); // Fetch comments again to get the updated list
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseURL}/post/comment-post/${postId}/`,
        { body: reply, parent_id: parentId },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      fetchComments(); // Fetch comments again to get the updated list
      setReply("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${baseURL}/post/comment-delete/${commentId}/`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      fetchComments(); // Fetch comments again to get the updated list
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleUpdateComment = (commentId, currentText) => {
    setEditingComment(commentId);
    setEditCommentText(currentText);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${baseURL}/post/comment-update/${editingComment}/`,
        { body: editCommentText },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      fetchComments(); // Fetch comments again to get the updated list
      setEditingComment(null);
      setEditCommentText("");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const renderReplies = (replies) => {
    return replies.map((reply) => (
      <div
        key={reply.id}
        className="border-l border-gray-300 pl-4 ml-4 py-2 flex justify-between items-center"
      >
        <div className="flex items-center">
          {reply.profile_picture ? (
            <img
              src={`${baseURL}${reply.profile_picture}`}
              alt="Profile"
              className="w-8 h-8 rounded-full mr-2"
            />
          ) : (
            <img
              src="path/to/default/profile/picture.jpg"
              alt="Default Profile"
              className="w-8 h-8 rounded-full mr-2"
            />
          )}
          <div className="flex flex-col">
            <span className="font-bold">{reply.user_full_name}</span>
            <p>{reply.body}</p>
            <span className="text-gray-500 text-sm">
              {reply.created_time} ago
            </span>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(showMenu === reply.id ? null : reply.id)}
            className="bg-transparent border-none text-gray-500"
          >
            <FaEllipsisV />
          </button>
          {showMenu === reply.id && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg z-10">
              {reply.user === userId && (
                <>
                  <button
                    onClick={() => handleUpdateComment(reply.id, reply.body)}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <FaEdit className="mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteComment(reply.id)}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <FaTrash className="mr-2" />
                    Delete
                  </button>
                </>
              )}
              <button
                onClick={() =>
                  setReplyingTo(replyingTo === reply.id ? null : reply.id)
                }
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Reply
              </button>
            </div>
          )}
        </div>
      </div>
    ));
  };

  const renderComments = (comments) => {
    return comments.map((comment) => (
      <div key={comment.id} className="py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {comment.profile_picture ? (
              <img
                src={`${baseURL}${comment.profile_picture}`}
                alt="Profile"
                className="w-8 h-8 rounded-full mr-2"
              />
            ) : (
              <img
                src="path/to/default/profile/picture.jpg"
                alt="Default Profile"
                className="w-8 h-8 rounded-full mr-2"
              />
            )}
            <div className="flex flex-col">
              <span className="font-bold">{comment.user_full_name}</span>
              <p>{comment.body}</p>
              <span className="text-gray-500 text-sm">
                {comment.created_time} ago
              </span>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() =>
                setShowMenu(showMenu === comment.id ? null : comment.id)
              }
              className="bg-transparent border-none text-gray-500"
            >
              <FaEllipsisV />
            </button>
            {showMenu === comment.id && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg z-10">
                {comment.user === userId && (
                  <>
                    <button
                      onClick={() =>
                        handleUpdateComment(comment.id, comment.body)
                      }
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <FaEdit className="mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <FaTrash className="mr-2" />
                      Delete
                    </button>
                  </>
                )}
                <button
                  onClick={() =>
                    setReplyingTo(replyingTo === comment.id ? null : comment.id)
                  }
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Reply
                </button>
              </div>
            )}
          </div>
        </div>

        {renderReplies(comment.replies || [])}
        {replyingTo === comment.id && (
          <form
            onSubmit={(e) => handleReplySubmit(e, comment.id)}
            className="mt-2 flex items-center space-x-2"
          >
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Write a reply..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="w-full p-3 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19V6.414l7.293 7.293a1 1 0 001.414-1.414l-8-8a1 1 0 00-1.414 0l-8 8a1 1 0 001.414 1.414L9 6.414V19a1 1 0 002 0z"
                  />
                </svg>
              </button>
            </div>
          </form>
        )}
      </div>
    ));
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
          {/* <h2 className="text-lg font-bold mb-4">Comments</h2> */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Comments</h2>
            <button
              className="bg-transparent border-none text-gray-500 text-2xl"
              onClick={onClose}
            >
              &times;
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {renderComments(comments)}
          </div>

          <form
            onSubmit={handleCommentSubmit}
            className="mt-4 flex items-center space-x-2"
          >
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19V6.414l7.293 7.293a1 1 0 001.414-1.414l-8-8a1 1 0 00-1.414 0l-8 8a1 1 0 001.414 1.414L9 6.414V19a1 1 0 002 0z"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default CommentModal;
