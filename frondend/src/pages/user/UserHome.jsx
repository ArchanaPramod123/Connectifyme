// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Post from './post/PostList'; 
// import Navbar from './usercommon/Navbar';
// import Suggestion from './UserSuggestion';
// import './UserHome.css';

// const HomePage = () => {
//   const [posts, setPosts] = useState([]);
//   const baseURL = 'http://127.0.0.1:8000/';
  

//   const fetchPosts = async () => {
//     try {
//       const response = await axios.get(baseURL + 'post/list-posts/', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access')}`,
//         },
//       });
//       console.log("liseddddddddddddddddddddddd",response.data);
//       setPosts(response.data);
      
//     } catch (error) {
//       console.error('Error fetching posts:', error);
//     }
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   return (
//     <div>
//       <Navbar fetchPosts={fetchPosts} />
//       <div className="posts-container">
//         {posts.map((post) => (
//           <div className="post-wrapper" key={post.id}>
//             <Post post={post} />
//           </div>
//         ))}
//       </div>
//       <div className="suggestions-section">
//           <Suggestion />
//         </div>
//     </div>
//   );
// };

// export default HomePage;





import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from './post/PostList';
import Navbar from './usercommon/Navbar';
import Suggestion from './UserSuggestion';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const baseURL = 'http://127.0.0.1:8000/';

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

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Navbar Section */}
      <div className="w-1/5">
        <Navbar fetchPosts={fetchPosts} />
      </div>

      {/* Post List Section */}
      <div className="w-3/5 flex flex-col items-center">
        {posts.map((post) => (
          <div className="w-full max-w-lg mb-6 bg-white rounded-lg shadow-md p-6" key={post.id}>
            <Post post={post} />
          </div>
        ))}
      </div>

      {/* Suggestion Section */}
      <div className="w-1/5">
        <Suggestion />
      </div>
    </div>
  );
};

export default HomePage;
