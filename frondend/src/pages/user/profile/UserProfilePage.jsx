import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../usercommon/Navbar";
import { useParams } from "react-router-dom";
import EditUserProfile from "../profile/EditUserProfile";
import PostDetailPage from "./PostDetailPage";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import createChatRoomApi from "../chat/apiCall/createChatRoomApi"; // Import the chat room creation function

const UserProfilePage = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isPostDetailOpen, setIsPostDetailOpen] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const userprofile_id = useSelector((state) => state.auth.user_id);
  const baseURL = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access");
      try {
        const response = await axios.get(
          `${baseURL}/post/profile/${userId ? userId : ""}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfile(response.data.profile);
        setPosts(response.data.posts);
        setIsOwnProfile(response.data.is_own_profile);
        setIsFollowing(response.data.is_following);
      } catch (error) {
        setError("Failed to fetch profile data");
      }
    };

    fetchProfile();
  }, [userId]);

  const handleFollowToggle = async () => {
    const token = localStorage.getItem("access");
    try {
      const response = await axios.post(
        `${baseURL}/post/follow-unfollow/${userId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsFollowing(response.data.is_following);
      setProfile((prevProfile) => ({
        ...prevProfile,
        follower_count: response.data.follower_count,
        following_count: response.data.following_count,
      }));
      console.log("the followr time anoter user id", userId);
      await createChatRoomApi(userId);
    } catch (error) {
      console.error("Failed to follow/unfollow user", error);
    }
  };

  const openPostDetail = (postId) => {
    setSelectedPostId(postId);
    setIsPostDetailOpen(true);
  };

  const closePostDetail = () => {
    setIsPostDetailOpen(false);
    setSelectedPostId(null);
  };

  const openEditProfileModal = () => {
    setShowEditProfileModal(true);
  };

  // const handleProfileUpdate = (updatedProfile) => {
  //     setProfile(updatedProfile);
  //     setShowEditProfileModal(false);
  // };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      ...updatedProfile,
      profile_picture:
        updatedProfile.profile_picture || prevProfile.profile_picture, 
    }));
    setShowEditProfileModal(false);
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex bg-[#faf7f4] min-h-screen">
      <div className="w-1/6 bg-[#faf7f4] fixed border-r-2 min-h-screen">
        <Navbar />
      </div>
      <div className="w-full flex flex-col pl-[16.5%] pt-8 pb-8">
        <div className="flex flex-col items-center lg:flex-row lg:items-start lg:px-20 lg:py-8 lg:gap-8">
          <div className="flex justify-center items-center  mb-4 lg:mb-0 lg:w-1/3">
            <img
              className="w-40 h-40 lg:w-48 lg:h-48 object-cover rounded-full cursor-pointer transition-opacity duration-300 hover:opacity-70"
              src={`${profile.profile_picture}`}
              alt="Profile"
            />
          </div>
          <div className="flex flex-col items-center lg:items-start lg:col-span-2 lg:w-2/3">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-2xl font-semibold">{profile.username}</div>
              {isOwnProfile ? (
                <button
                  className="bg-blue-500 text-white border-none px-4 py-2 rounded-md cursor-pointer transition-bg duration-300 hover:bg-blue-700"
                  onClick={openEditProfileModal}
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleFollowToggle}
                    className={`border-none px-4 py-2 rounded-md cursor-pointer transition-bg duration-300 ${
                      isFollowing
                        ? "bg-red-500 hover:bg-red-700 text-white"
                        : "bg-blue-500 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>

                  {(profile.is_public || isFollowing) && (
                    <Link to="/user/messages">
                      <button className="bg-gray-300 text-black border-none px-4 py-2 rounded-md cursor-pointer transition-bg duration-300 hover:bg-gray-400">
                        Message
                      </button>
                    </Link>
                  )}
                </>
              )}
            </div>
            <div className="flex gap-8 mb-4">
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
            <div className="text-center lg:text-left">
              <div className="font-semibold">{profile.full_name}</div>
              <div>{profile.bio || "No bio available"}</div>
            </div>
          </div>
        </div>

        {profile.is_private && !isOwnProfile && !isFollowing ? (
          <div className="text-center text-gray-500 mt-8">
            <h1>This account is private. Follow to see their posts.</h1>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 px-20 py-8">
            {posts.map((post) => (
              <div
                key={post.id}
                className="w-full aspect-square bg-gray-300 rounded-md overflow-hidden"
                onClick={() => openPostDetail(post.id)}
              >
                <img
                  className="w-full h-full object-cover"
                  src={`${post.img}`}
                  alt={post.body}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {showEditProfileModal && (
        <EditUserProfile
          profile={profile}
          onClose={() => setShowEditProfileModal(false)}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
      <PostDetailPage
        postID={selectedPostId}
        onClose={closePostDetail}
        isPostDetailOpen={isPostDetailOpen}
      />
    </div>
  );
};

export default UserProfilePage;
