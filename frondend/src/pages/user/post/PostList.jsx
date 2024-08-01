// import React, { useState } from "react";
// import { FaHeart, FaRegHeart, FaRegComment, FaTrash } from "react-icons/fa";
// import axios from "axios";
// import "./Post.css";

// const Post = ({ post }) => {
//   const baseURL = "http://127.0.0.1:8000";
//   const [comment, setComment] = useState("");
//   const [isLiked, setIsLiked] = useState(post.is_liked);
//   const [showComments, setShowComments] = useState(false);
//   const [comments, setComments] = useState(post.comments || []);
//   const [totalLikes, setTotalLikes] = useState(post.total_likes);

//   const getToken = () => {
//     return localStorage.getItem("access");
//   };

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         `${baseURL}/post/comment-post/${post.id}/`,
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

//   const handleLikeToggle = async () => {
//     try {
//       const response = await axios.post(
//         `${baseURL}/post/like-post/${post.id}/`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${getToken()}`,
//           },
//         }
//       );
//       setIsLiked(!isLiked);
//       setTotalLikes(response.data.total_likes);
//     } catch (error) {
//       console.error("Error liking post:", error);
//     }
//   };

//   const handleDeleteComment = async (commentId) => {
//     try {
//       await axios.delete(`${baseURL}/post/delete-comment/${commentId}/`, {
//         headers: {
//           Authorization: `Bearer ${getToken()}`,
//         },
//       });
//       setComments(comments.filter((comment) => comment.id !== commentId));
//     } catch (error) {
//       console.error("Error deleting comment:", error);
//     }
//   };

//   return (
//     <div className="post-box">
//       <div className="post-header">
//         {post.user.profile_picture && (
//           <img
//             src={`${baseURL}${post.user.profile_picture}`}
//             alt="Profile"
//             className="profile-picture"
//           />
//         )}
//         <h2>{post.user.full_name}</h2>
//       </div>
//       {post.img && (
//         <img src={`${baseURL}${post.img}`} alt="Post" className="post-image" />
//       )}
//       <p className="post-body">{post.body}</p>
//       <div className="post-actions">
//         <button onClick={handleLikeToggle} className="like-button">
//           {isLiked ? (
//             <FaHeart className="heart-icon liked" />
//           ) : (
//             <FaRegHeart className="heart-icon" />
//           )}
//         </button>
//         <button
//           onClick={() => setShowComments(!showComments)}
//           className="comment-toggle-button"
//         >
//           <FaRegComment className="comment-icon" />
//         </button>
//       </div>
//       <p className="post-likes">Likes: {totalLikes}</p>
//       {showComments && (
//         <div className="comments">
//           <form onSubmit={handleCommentSubmit}>
//             <input
//               type="text"
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               placeholder="Add a comment"
//             />
//             <button type="submit">Comment</button>
//           </form>
//           {comments.map((comment) => (
//             <div key={comment.id} className="comment">
//               <p>
//                 {comment.user.full_name}: {comment.body}
//               </p>
//               <p>{comment.created_time} ago</p>
//               <button
//                 onClick={() => handleDeleteComment(comment.id)}
//                 className="delete-comment-button"
//               >
//                 <FaTrash className="delete-icon" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Post;

// import React, { useState } from "react";
// import { FaHeart, FaRegHeart, FaRegComment, FaTrash } from "react-icons/fa";
// import axios from "axios";

// const Post = ({ post }) => {
//   const baseURL = "http://127.0.0.1:8000";
//   const [comment, setComment] = useState("");
//   const [isLiked, setIsLiked] = useState(post.is_liked);
//   const [showComments, setShowComments] = useState(false);
//   const [comments, setComments] = useState(post.comments || []);
//   const [totalLikes, setTotalLikes] = useState(post.total_likes);

//   const getToken = () => {
//     return localStorage.getItem("access");
//   };

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         `${baseURL}/post/comment-post/${post.id}/`,
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

//   const handleLikeToggle = async () => {
//     try {
//       const response = await axios.post(
//         `${baseURL}/post/like-post/${post.id}/`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${getToken()}`,
//           },
//         }
//       );
//       setIsLiked(response.data.is_liked);
//       setTotalLikes(response.data.total_likes);
//     } catch (error) {
//       console.error("Error liking post:", error);
//     }
//   };

//   const handleDeleteComment = async (commentId) => {
//     try {
//       await axios.delete(`${baseURL}/post/delete-comment/${commentId}/`, {
//         headers: {
//           Authorization: `Bearer ${getToken()}`,
//         },
//       });
//       setComments(comments.filter((comment) => comment.id !== commentId));
//     } catch (error) {
//       console.error("Error deleting comment:", error);
//     }
//   };

//   return (
//     <div className="border border-gray-300 my-5 p-5 rounded-lg bg-white">
//       <div className="flex items-center">
//         {post.user.profile_picture && (
//           <img
//             src={`${baseURL}${post.user.profile_picture}`}
//             alt="Profile"
//             className="w-10 h-10 rounded-full mr-3"
//           />
//         )}
//         <h2 className="text-lg font-bold">{post.user.full_name}</h2>
//       </div>
//       {post.img && (
//         <img src={`${baseURL}${post.img}`} alt="Post" className="w-full mt-3" />
//       )}
//       <p className="mt-3">{post.body}</p>
//       <div className="flex items-center mt-3">
//         <button onClick={handleLikeToggle} className="mr-3 focus:outline-none">
//           {isLiked ? (
//             <FaHeart className="text-red-600 text-2xl" />
//           ) : (
//             <FaRegHeart className="text-2xl" />
//           )}
//         </button>
//         <button
//           onClick={() => setShowComments(!showComments)}
//           className="focus:outline-none"
//         >
//           <FaRegComment className="text-2xl" />
//         </button>
//       </div>
//       <p className="mt-3">Likes: {totalLikes}</p>
//       {showComments && (
//         <div className="mt-5">
//           <form onSubmit={handleCommentSubmit} className="flex items-center mb-3">
//             <input
//               type="text"
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               placeholder="Add a comment"
//               className="flex-1 p-2 border border-gray-300 rounded mr-2"
//             />
//             <button
//               type="submit"
//               className="bg-blue-500 text-white px-3 py-2 rounded"
//             >
//               Comment
//             </button>
//           </form>
//           {comments.map((comment) => (
//             <div key={comment.id} className="border-t border-gray-300 pt-3 mt-3">
//               <p>
//                 <span className="font-bold">{comment.user.full_name}</span>: {comment.body}
//               </p>
//               <p className="text-gray-500 text-sm">{comment.created_time} ago</p>
//               <button
//                 onClick={() => handleDeleteComment(comment.id)}
//                 className="text-red-500 focus:outline-none mt-2"
//               >
//                 <FaTrash className="inline-block" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Post;















// import React, { useState, useEffect } from "react";
// import { FaHeart, FaRegHeart, FaRegComment, FaTrash } from "react-icons/fa";
// import axios from "axios";

// const Post = ({ post }) => {
//   const baseURL = "http://127.0.0.1:8000";
//   const [comment, setComment] = useState("");
//   const [isLiked, setIsLiked] = useState(post.is_liked);
//   const [showComments, setShowComments] = useState(false);
//   const [comments, setComments] = useState(post.comments || []);
//   const [totalLikes, setTotalLikes] = useState(post.total_likes);

//   const getToken = () => {
//     return localStorage.getItem("access");
//   };

//   useEffect(() => {
//     // If post already has is_liked and total_likes, no need to fetch again.
//     setIsLiked(post.is_liked);
//     setTotalLikes(post.total_likes);
//   }, [post]);

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         `${baseURL}/post/comment-post/${post.id}/`,
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

//   const handleLikeToggle = async () => {
//     try {
//       const response = await axios.post(
//         `${baseURL}/post/like-post/${post.id}/`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${getToken()}`,
//           },
//         }
//       );
//       setIsLiked(response.data.is_liked);
//       setTotalLikes(response.data.total_likes);
//     } catch (error) {
//       console.error("Error liking post:", error);
//     }
//   };

//   const handleDeleteComment = async (commentId) => {
//     try {
//       await axios.delete(`${baseURL}/post/delete-comment/${commentId}/`, {
//         headers: {
//           Authorization: `Bearer ${getToken()}`,
//         },
//       });
//       setComments(comments.filter((comment) => comment.id !== commentId));
//     } catch (error) {
//       console.error("Error deleting comment:", error);
//     }
//   };

//   return (
//     <div className="border border-gray-300 my-5 p-5 rounded-lg bg-white">
//       <div className="flex items-center">
//         {post.user.profile_picture && (
//           <img
//             src={`${baseURL}${post.user.profile_picture}`}
//             alt="Profile"
//             className="w-10 h-10 rounded-full mr-3"
//           />
//         )}
//         <h2 className="text-lg font-bold">{post.user.full_name}</h2>
//       </div>
//       {post.img && (
//         <img src={`${baseURL}${post.img}`} alt="Post" className="w-full mt-3" />
//       )}
//       <p className="mt-3">{post.body}</p>
//       <div className="flex items-center mt-3">
//         <button onClick={handleLikeToggle} className="mr-3 focus:outline-none">
//           {isLiked ? (
//             <FaHeart className="text-2xl text-red-500" />
//           ) : (
//             <FaRegHeart className="text-2xl" />
//           )}
//         </button>
//         <button
//           onClick={() => setShowComments(!showComments)}
//           className="focus:outline-none"
//         >
//           <FaRegComment className="text-2xl" />
//         </button>
//       </div>
//       <p className="mt-3">Likes: {totalLikes}</p>
//       {showComments && (
//         <div className="mt-5">
//           <form onSubmit={handleCommentSubmit} className="flex items-center mb-3">
//             <input
//               type="text"
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               placeholder="Add a comment"
//               className="flex-1 p-2 border border-gray-300 rounded mr-2"
//             />
//             <button
//               type="submit"
//               className="bg-blue-500 text-white px-3 py-2 rounded"
//             >
//               Comment
//             </button>
//           </form>
//           {comments.map((comment) => (
//             <div key={comment.id} className="border-t border-gray-300 pt-3 mt-3">
//               <p>
//                 <span className="font-bold">{comment.user.full_name}</span>: {comment.body}
//               </p>
//               <p className="text-gray-500 text-sm">{comment.created_time} ago</p>
//               <button
//                 onClick={() => handleDeleteComment(comment.id)}
//                 className="text-red-500 focus:outline-none mt-2"
//               >
//                 <FaTrash className="inline-block" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Post;














// import React, { useState, useEffect } from "react";
// import { FaHeart, FaRegHeart, FaRegComment, FaTrash } from "react-icons/fa";
// import axios from "axios";

// const Post = ({ post }) => {
//   const baseURL = "http://127.0.0.1:8000";
//   const [comment, setComment] = useState("");
//   const [isLiked, setIsLiked] = useState(post.is_liked);
//   const [showComments, setShowComments] = useState(false);
//   const [comments, setComments] = useState(post.comments || []);
//   const [totalLikes, setTotalLikes] = useState(post.total_likes);

//   const getToken = () => {
//     return localStorage.getItem("access");
//   };

//   useEffect(() => {
//     console.log("Post prop changed:", post);
//     setIsLiked(post.is_liked);
//     setTotalLikes(post.total_likes);
//   }, [post]);

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         `${baseURL}/post/comment-post/${post.id}/`,
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

//   const handleLikeToggle = async () => {
//     try {
//       const response = await axios.post(
//         `${baseURL}/post/like-post/${post.id}/`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${getToken()}`,
//           },
//         }
//       );
//       console.log("Like/unlike response:", response.data);
//       setIsLiked(response.data.is_liked);
//       setTotalLikes(response.data.total_likes);
//     } catch (error) {
//       console.error("Error liking/unliking post:", error);
//     }
//   };

//   const handleDeleteComment = async (commentId) => {
//     try {
//       await axios.delete(`${baseURL}/post/comment/${commentId}/`, {
//         headers: {
//           Authorization: `Bearer ${getToken()}`,
//         },
//       });
//       setComments(comments.filter((comment) => comment.id !== commentId));
//     } catch (error) {
//       console.error("Error deleting comment:", error);
//     }
//   };

//   return (
//     <div className="border border-gray-300 my-5 p-5 rounded-lg bg-white">
//       <div className="flex items-center">
//         {post.user.profile_picture && (
//           <img
//             src={`${baseURL}${post.user.profile_picture}`}
//             alt="Profile"
//             className="w-10 h-10 rounded-full mr-3"
//           />
//         )}
//         <h2 className="text-lg font-bold">{post.user.full_name}</h2>
//       </div>
//       {post.img && (
//         <img src={`${baseURL}${post.img}`} alt="Post" className="w-full mt-3" />
//       )}
//       <p className="mt-3">{post.body}</p>
//       <div className="flex items-center mt-3">
//         <button onClick={handleLikeToggle} className="mr-3 focus:outline-none">
//           {isLiked ? (
//             <FaHeart className="text-2xl text-red-500" />
//           ) : (
//             <FaRegHeart className="text-2xl" />
//           )}
//         </button>
//         <button
//           onClick={() => setShowComments(!showComments)}
//           className="focus:outline-none"
//         >
//           <FaRegComment className="text-2xl" />
//         </button>
//       </div>
//       <p className="mt-3">Likes: {totalLikes}</p>
//       {showComments && (
//         <div className="mt-5">
//           <form onSubmit={handleCommentSubmit} className="flex items-center mb-3">
//             <input
//               type="text"
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               placeholder="Add a comment"
//               className="flex-1 p-2 border border-gray-300 rounded mr-2"
//             />
//             <button
//               type="submit"
//               className="bg-blue-500 text-white px-3 py-2 rounded"
//             >
//               Comment
//             </button>
//           </form>
//           {comments.map((comment) => (
//             <div key={comment.id} className="border-t border-gray-300 pt-3 mt-3">
//               <p>
//                 <span className="font-bold">{comment.user.full_name}</span>: {comment.body}
//               </p>
//               <p className="text-gray-500 text-sm">{comment.created_time} ago</p>
//               <button
//                 onClick={() => handleDeleteComment(comment.id)}
//                 className="text-red-500 focus:outline-none mt-2"
//               >
//                 <FaTrash className="inline-block" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Post;









// import React, { useState, useEffect } from "react";
// import { FaHeart, FaRegHeart, FaRegComment, FaTrash } from "react-icons/fa";
// import axios from "axios";

// const Post = ({ post }) => {
//   const baseURL = "http://127.0.0.1:8000";
//   const [comment, setComment] = useState("");
//   const [isLiked, setIsLiked] = useState(post.is_liked);
//   const [showComments, setShowComments] = useState(false);
//   const [comments, setComments] = useState(post.comments || []);
//   const [totalLikes, setTotalLikes] = useState(post.total_likes);

//   const getToken = () => {
//     return localStorage.getItem("access");
//   };

//   useEffect(() => {
//     console.log("Post prop changed:", post);
//     setIsLiked(post.is_liked);
//     setTotalLikes(post.total_likes);
//   }, [post]);

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Comment Data:", { body: comment });
//     try {
//       const response = await axios.post(
//         `${baseURL}/post/comment-post/${post.id}/`,
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

//   const handleLikeToggle = async () => {
//     try {
//       const response = await axios.post(
//         `${baseURL}/post/like-post/${post.id}/`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${getToken()}`,
//           },
//         }
//       );
//       console.log("Like/unlike response:", response.data);
//       setIsLiked(response.data.is_liked);
//       setTotalLikes(response.data.total_likes);
//     } catch (error) {
//       console.error("Error liking/unliking post:", error);
//     }
//   };

//   const handleDeleteComment = async (commentId) => {
//     try {
//       await axios.delete(`${baseURL}/post/comment/${commentId}/`, {
//         headers: {
//           Authorization: `Bearer ${getToken()}`,
//         },
//       });
//       setComments(comments.filter((comment) => comment.id !== commentId));
//     } catch (error) {
//       console.error("Error deleting comment:", error);
//     }
//   };

//   return (
//     <div className="border border-gray-300 my-5 p-5 rounded-lg bg-white">
//       <div className="flex items-center">
//         {post.user.profile_picture && (
//           <img
//             src={`${baseURL}${post.user.profile_picture}`}
//             alt="Profile"
//             className="w-10 h-10 rounded-full mr-3"
//           />
//         )}
//         <h2 className="text-lg font-bold">{post.user.full_name}</h2>
//       </div>
//       {post.img && (
//         <img src={`${baseURL}${post.img}`} alt="Post" className="w-full mt-3" />
//       )}
//       <p className="mt-3">{post.body}</p>
//       <div className="flex items-center mt-3">
//         <button onClick={handleLikeToggle} className="mr-3 focus:outline-none">
//           {isLiked ? (
//             <FaHeart className="text-2xl text-red-500" />
//           ) : (
//             <FaRegHeart className="text-2xl" />
//           )}
//         </button>
//         <button
//           onClick={() => setShowComments(!showComments)}
//           className="focus:outline-none"
//         >
//           <FaRegComment className="text-2xl" />
//         </button>
//       </div>
//       <p className="mt-3">Likes: {totalLikes}</p>
//       {showComments && (
//         <div className="mt-5">
//           <form onSubmit={handleCommentSubmit} className="flex items-center mb-3">
//             <input
//               type="text"
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               placeholder="Add a comment"
//               className="flex-1 p-2 border border-gray-300 rounded mr-2"
//             />
//             <button
//               type="submit"
//               className="bg-blue-500 text-white px-3 py-2 rounded"
//             >
//               Comment
//             </button>
//           </form>
//           {comments.map((comment) => (
//             <div key={comment.id} className="border-t border-gray-300 pt-3 mt-3">
//               <p>
//                 <span className="font-bold">{comment.user.full_name}</span>: {comment.body}
//               </p>
//               <p className="text-gray-500 text-sm">{comment.created_time} ago</p>
//               <button
//                 onClick={() => handleDeleteComment(comment.id)}
//                 className="text-red-500 focus:outline-none mt-2"
//               >
//                 <FaTrash className="inline-block" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Post;














import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";
import axios from "axios";
import CommentModal from "./CommentModel";

const Post = ({ post }) => {
  const baseURL = "http://127.0.0.1:8000";
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [comments, setComments] = useState(post.comments || []);
  const [totalLikes, setTotalLikes] = useState(post.total_likes);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const getToken = () => {
    return localStorage.getItem("access");
  };

  useEffect(() => {
    console.log("postlikeddddddddddddddddddddddddddd",post.is_liked);
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

  return (
    <div className="border border-gray-300 my-5 p-5 rounded-lg bg-white">
      <div className="flex items-center">
        {post.user.profile_picture && (
          <img
            src={`${baseURL}${post.user.profile_picture}`}
            alt="Profile"
            className="w-10 h-10 rounded-full mr-3"
          />
        )}
        <h2 className="text-lg font-bold">{post.user.full_name}</h2>
      </div>
      {post.img && (
        <img src={`${baseURL}${post.img}`} alt="Post" className="w-full mt-3" />
      )}
      <p className="mt-3">{post.body}</p>
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
      <p className="mt-3">Likes: {totalLikes}</p>
      <CommentModal
        postId={post.id}
        comments={comments}
        setComments={setComments}
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
      />
    </div>
  );
};

export default Post;
