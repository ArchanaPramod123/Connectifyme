import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "./usercommon/Navbar";

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const accessToken = localStorage.getItem("access");
  const baseURL = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${baseURL}/post/explore/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [accessToken]);

  return (
    <div className="flex">
      <div className="w-1/4 bg-white shadow-md fixed top-0 left-0 bottom-0 z-9">
        <NavBar />
      </div>
      <div className="flex-grow ml-60 p-4 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Explore</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {posts.length === 0 ? (
            <p>No posts available.</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="relative">
                <img
                  src={`${baseURL}${post.img}`}
                  alt="Post"
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
