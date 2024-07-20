
// import React, { useState } from 'react';
// import { FaHeart, FaRegHeart, FaRegComment } from 'react-icons/fa';
// import './Post.css';

// const Post = ({ post, onLike, onComment }) => {
//   const baseURL = 'http://127.0.0.1:8000';
//   const [comment, setComment] = useState('');
//   const [isLiked, setIsLiked] = useState(post.is_liked); // Assuming post has an is_liked property
//   const [showComments, setShowComments] = useState(false);

//   const handleCommentSubmit = (e) => {
//     e.preventDefault();
//     onComment(post.id, comment);
//     setComment('');
//   };

//   const handleLikeToggle = () => {
//     setIsLiked(!isLiked);
//     onLike(post.id, !isLiked);
//   };

//   return (
//     <div className="post-box">
//       <h2>{post.user.full_name}</h2>
//       {post.img && <img src={`${baseURL}${post.img}`} alt="Post" className="post-image" />}
//       <p className="post-body">{post.body}</p>
//       <div className="post-actions">
//         <button onClick={handleLikeToggle} className="like-button">
//           {isLiked ? <FaHeart className="heart-icon liked" /> : <FaRegHeart className="heart-icon" />}
//         </button>
//         <button onClick={() => setShowComments(!showComments)} className="comment-toggle-button">
//           <FaRegComment className="comment-icon" />
//         </button>
//       </div>
//       <p className="post-likes">Likes: {post.total_likes}</p>
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
//           {post.comments && post.comments.map((comment) => (
//             <div key={comment.id} className="comment">
//               <p>{comment.user.full_name}: {comment.body}</p>
//               <p>{comment.created_time} ago</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Post;





import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaRegComment } from 'react-icons/fa';
import './Post.css';

const Post = ({ post, onLike, onComment }) => {
  const baseURL = 'http://127.0.0.1:8000';
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [showComments, setShowComments] = useState(false);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    onComment(post.id, comment);
    setComment('');
  };

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    onLike(post.id, !isLiked);
  };

  return (
    <div className="post-box">
      <div className="post-header">
        {post.user.profile_picture && (
          <img src={`${baseURL}${post.user.profile_picture}`} alt="Profile" className="profile-picture" />
        )}
        <h2>{post.user.full_name}</h2>
      </div>
      {post.img && <img src={`${baseURL}${post.img}`} alt="Post" className="post-image" />}
      <p className="post-body">{post.body}</p>
      <div className="post-actions">
        <button onClick={handleLikeToggle} className="like-button">
          {isLiked ? <FaHeart className="heart-icon liked" /> : <FaRegHeart className="heart-icon" />}
        </button>
        <button onClick={() => setShowComments(!showComments)} className="comment-toggle-button">
          <FaRegComment className="comment-icon" />
        </button>
      </div>
      <p className="post-likes">Likes: {post.total_likes}</p>
      {showComments && (
        <div className="comments">
          <form onSubmit={handleCommentSubmit}>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment"
            />
            <button type="submit">Comment</button>
          </form>
          {post.comments && post.comments.map((comment) => (
            <div key={comment.id} className="comment">
              <p>{comment.user.full_name}: {comment.body}</p>
              <p>{comment.created_time} ago</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Post;
