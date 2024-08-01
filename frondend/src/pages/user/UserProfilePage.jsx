import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Navbar from '../user/usercommon/Navbar';

const UserPage = styled.div`
  display: flex;
  background-color: #faf7f4;
`;

const NavContainer = styled.div`
  width: 16.5%;
  background-color: #faf7f4;
  position: fixed;
  border-right: double;
`;

const ProfileContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 16.5%;
  padding-top: 2em;
`;

const ProfileContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  font-family: Arial, Helvetica, sans-serif;
  padding: 2em 5em;
  gap: 2em;
`;

const ProfilePhoto = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  img {
    width: 10em;
    height: 10em;
    object-fit: cover;
    border-radius: 50%;
    cursor: pointer;
    transition: opacity 0.3s;

    &:hover {
      opacity: 0.7;
    }
  }

  input[type="file"] {
    display: none;
  }

  label {
    position: absolute;
    bottom: 0;
    right: 0;
    background-color: #3897f0;
    color: white;
    border: none;
    padding: 0.5em;
    border-radius: 50%;
    cursor: pointer;
  }
`;

const ProfileInfo = styled.div`
  .name {
    font-size: 1.5em;
    margin-bottom: 0;
    font-weight: 600;
  }

  .about {
    font-size: 1em;
    color: #545454;
    margin: 0.5em 0;
  }

  .stats {
    display: flex;
    gap: 1em;
    margin-top: 1em;
  }

  .stat {
    text-align: center;
  }

  .stat-number {
    font-weight: bold;
  }
`;

const PostsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  padding: 2em 5em;
`;

const Post = styled.div`
  width: 10em;
  height: 10em;
  background-color: #ddd;
  border-radius: 0.5em;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.5em;
  }
`;

const EditButton = styled.button`
  background-color: #3897f0;
  color: white;
  border: none;
  padding: 0.5em 1em;
  border-radius: 0.3em;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #287dc3;
  }
`;

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
        setProfile(response.data.profile);
        setPosts(response.data.posts);
      } catch (error) {
        setError('Failed to fetch profile data');
      }
    };

    fetchProfile();
  }, []);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profile_picture', file);

      const token = localStorage.getItem('access');

      try {
        setLoading(true);
        const response = await axios.patch('http://localhost:8000/post/update_profile/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to update profile picture');
        setLoading(false);
      }
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <UserPage>
      <NavContainer>
        <Navbar />
      </NavContainer>
      <ProfileContentWrapper>
        <ProfileContainer>
          <ProfilePhoto>
            <img src={`http://localhost:8000${profile.profile_picture}`} alt="Profile" />
            <label htmlFor="profilePicInput">
              <input
                type="file"
                id="profilePicInput"
                onChange={handleProfilePicChange}
                disabled={loading}
              />
              +
            </label>
          </ProfilePhoto>
          <ProfileInfo>
            <div className="name">{profile.full_name}</div>
            <EditButton>Edit Profile</EditButton>
            <div className="about">{profile.description || 'No description available'}</div>
            <div className="stats">
              <div className="stat">
                <div className="stat-number">{profile.total_posts}</div>
                <div>Posts</div>
              </div>
              <div className="stat">
                <div className="stat-number">{profile.follower_count}</div>
                <div>Followers</div>
              </div>
              <div className="stat">
                <div className="stat-number">{profile.following_count}</div>
                <div>Following</div>
              </div>
            </div>
          </ProfileInfo>
        </ProfileContainer>
        <PostsContainer>
          {posts.map((post) => (
            <Post key={post.id}>
              <img src={`http://localhost:8000${post.img}`} alt={post.body} />
            </Post>
          ))}
        </PostsContainer>
      </ProfileContentWrapper>
    </UserPage>
  );
};

export default UserProfilePage;
