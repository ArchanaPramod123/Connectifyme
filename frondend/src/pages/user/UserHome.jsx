import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from './post/PostList';
import Navbar from './usercommon/Navbar';
import Suggestion from './UserSuggestion';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const baseURL = import.meta.env.VITE_BASE_URL;

  const fetchPosts = async () => {
    try {
      const response = await axios.get(baseURL + '/post/list-posts/', {
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
      <div className="w-1/5">
        <Navbar fetchPosts={fetchPosts} />
      </div>
      <div className="w-3/5 flex flex-col items-center">
        {posts.map((post) => (
          <div className="w-full max-w-lg mb-6 bg-white rounded-lg shadow-md p-6" key={post.id}>
            <Post post={post} />
          </div>
        ))}
      </div>
      <div className="w-1/5">
        <Suggestion />
      </div>
    </div>
  );
};

export default HomePage;
