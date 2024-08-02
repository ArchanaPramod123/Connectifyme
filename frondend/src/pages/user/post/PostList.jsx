// import React, { useState, useEffect } from "react";
// import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";
// import axios from "axios";
// import CommentModal from "./CommentModel";

// const Post = ({ post }) => {
//   const baseURL = "http://127.0.0.1:8000";
//   const [isLiked, setIsLiked] = useState(post.is_liked);
//   const [comments, setComments] = useState(post.comments || []);
//   const [totalLikes, setTotalLikes] = useState(post.total_likes);
//   const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

//   const getToken = () => {
//     return localStorage.getItem("access");
//   };

//   useEffect(() => {
//     console.log("postlikeddddddddddddddddddddddddddd",post.is_liked);
//     setIsLiked(post.is_liked);

    
//     setTotalLikes(post.total_likes);
//   }, [post]);

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
//       console.error("Error liking/unliking post:", error);
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
//           onClick={() => setIsCommentModalOpen(true)}
//           className="focus:outline-none"
//         >
//           <FaRegComment className="text-2xl" />
//         </button>
//       </div>
//       <p className="mt-3">Likes: {totalLikes}</p>
//       <CommentModal
//         postId={post.id}
//         comments={comments}
//         setComments={setComments}
//         isOpen={isCommentModalOpen}
//         onClose={() => setIsCommentModalOpen(false)}
//       />
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
        <img src={post.img} alt="Post" className="w-full mt-3" />
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
