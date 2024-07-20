
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Post from './post/PostList';
// import Navbar from './usercommon/Navbar';
// import './UserHome.css';

// const HomePage = () => {
//   const [posts, setPosts] = useState([]);
//   const baseURL = 'http://127.0.0.1:8000/';

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await axios.get(baseURL + 'post/list-posts/', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('access')}`,
//           },
//         });
//         setPosts(response.data);
//       } catch (error) {
//         console.error('Error fetching posts:', error);
//       }
//     };

//     fetchPosts();
//   }, []);

//   return (
//     <div>
//       <Navbar />
//       <div className="posts-container">
//         {posts.map((post) => (
//           <div className="post-wrapper" key={post.id}>
//             <Post post={post} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HomePage;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from './post/PostList';
import Navbar from './usercommon/Navbar';
import './UserHome.css';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const baseURL = 'http://127.0.0.1:8000/';

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(baseURL + 'post/list-posts/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      await axios.post(
        `${baseURL}post/like-post/${postId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, total_likes: post.total_likes + 1 } : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      const response = await axios.post(
        `${baseURL}post/comment-post/${postId}/`,
        { body: comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, comments: [...post.comments, response.data] } : post
        )
      );
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="posts-container">
        {posts.map((post) => (
          <div className="post-wrapper" key={post.id}>
            <Post post={post} onLike={() => handleLike(post.id)} onComment={handleComment} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
