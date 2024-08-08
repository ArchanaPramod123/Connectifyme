import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from './post/PostList'; 
import Navbar from './usercommon/Navbar';
import './UserHome.css';

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
      console.log("liseddddddddddddddddddddddd",response.data);
      setPosts(response.data);
      
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <Navbar fetchPosts={fetchPosts} />
      <div className="posts-container">
        {posts.map((post) => (
          <div className="post-wrapper" key={post.id}>
            <Post post={post} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;