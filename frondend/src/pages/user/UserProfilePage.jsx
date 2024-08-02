import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './usercommon/Navbar';

const UserProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access');
      try {
        const response = await axios.get('http://localhost:8000/post/profile/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data); // Log the response
        setProfile(response.data.profile);
        setPosts(response.data.posts);
      } catch (error) {
        setError('Failed to fetch profile data');
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex bg-[#faf7f4]">
      <div className="w-1/6 bg-[#faf7f4] fixed border-r-2">
        <Navbar />
      </div>
      <div className="w-full flex flex-col pl-[16.5%] pt-8">
        <div className="grid grid-cols-3 font-sans px-20 py-8 gap-8">
          <div className="flex justify-center items-center relative">
            <img
              className="w-40 h-40 object-cover rounded-full cursor-pointer transition-opacity duration-300 hover:opacity-70"
              src={`http://localhost:8000${profile.profile_picture}`}
              alt="Profile"
            />
          </div>
          <div className="col-span-2">
            <div className="text-xl mb-0 font-semibold">{profile.full_name}</div>
            <div className="text-base">{profile.username}</div>
            <button className="bg-blue-500 text-white border-none px-4 py-2 rounded-md cursor-pointer transition-bg duration-300 hover:bg-blue-700 mt-4">
              Edit Profile
            </button>
            <div className="text-base text-gray-600 mt-2">{profile.bio || 'No bio available'}</div>
            <div className="flex gap-4 mt-4">
              <div className="text-center">
                <div className="font-bold">{profile.total_posts}</div>
                <div>Posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{profile.follower_count}</div>
                <div>Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{profile.following_count}</div>
                <div>Following</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 px-20 py-8">
          {posts.map((post) => (
            <div key={post.id} className="w-40 h-40 bg-gray-300 rounded-md">
              <img
                className="w-full h-full object-cover rounded-md"
                src={post.img}
                alt={post.body}
                onError={(e) => { console.log(`Image failed to load: http://localhost:8000${post.img}`); }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
