
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Navbar from './usercommon/Navbar';
// import { useParams } from 'react-router-dom';

// const UserProfilePage = () => {
//   const { userId } = useParams(); // Get user ID from URL params
//   const [profile, setProfile] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [error, setError] = useState('');
//   const [isOwnProfile, setIsOwnProfile] = useState(false);
//   const [isFollowing, setIsFollowing] = useState(false);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = localStorage.getItem('access');
//       try {
//         const response = await axios.get(`http://localhost:8000/post/profile/${userId ? userId : ''}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setProfile(response.data.profile);
//         setPosts(response.data.posts);
//         setIsOwnProfile(response.data.is_own_profile);
//         setIsFollowing(response.data.is_following);
//         toast.success('successfully follow');
//       } catch (error) {
//         toast.success('successfully Unliked');
//         setError('Failed to fetch profile data');
//       }
//     };

//     fetchProfile();
//   }, [userId]);

//   const handleFollowToggle = async () => {
//     const token = localStorage.getItem('access');
//     try {
//       const response = await axios.post(`http://localhost:8000/post/follow-unfollow/${userId}/`, {}, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setIsFollowing(response.data.is_following);
//     } catch (error) {
//       console.error('Failed to follow/unfollow user', error);
//     }
//   };

//   if (error) {
//     return <div>{error}</div>;
//   }

//   if (!profile) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="flex bg-[#faf7f4]">
//       <div className="w-1/6 bg-[#faf7f4] fixed border-r-2">
//         <Navbar />
//       </div>
//       <div className="w-full flex flex-col pl-[16.5%] pt-8">
//         <div className="grid grid-cols-3 font-sans px-20 py-8 gap-8">
//           <div className="flex justify-center items-center relative">
//             <img
//               className="w-40 h-40 object-cover rounded-full cursor-pointer transition-opacity duration-300 hover:opacity-70"
//               src={`http://localhost:8000${profile.profile_picture}`}
//               alt="Profile"
//             />
//           </div>
//           <div className="col-span-2">
//             <div className="text-xl mb-0 font-semibold">{profile.full_name}</div>
//             <div className="text-base">{profile.username}</div>
//             {isOwnProfile ? (
//               <button className="bg-blue-500 text-white border-none px-4 py-2 rounded-md cursor-pointer transition-bg duration-300 hover:bg-blue-700 mt-4">
//                 Edit Profile
//               </button>
//             ) : (
//               <button
//                 onClick={handleFollowToggle}
//                 className={`border-none px-4 py-2 rounded-md cursor-pointer transition-bg duration-300 mt-4 ${isFollowing ? 'bg-red-500 hover:bg-red-700 text-white' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}
//               >
//                 {isFollowing ? 'Unfollow' : 'Follow'}
//               </button>
//             )}
//             <div className="text-base text-gray-600 mt-2">{profile.bio || 'No bio available'}</div>
//             <div className="flex gap-4 mt-4">
//               <div className="text-center">
//                 <div className="font-bold">{profile.total_posts}</div>
//                 <div>Posts</div>
//               </div>
//               <div className="text-center">
//                 <div className="font-bold">{profile.follower_count}</div>
//                 <div>Followers</div>
//               </div>
//               <div className="text-center">
//                 <div className="font-bold">{profile.following_count}</div>
//                 <div>Following</div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="flex flex-wrap gap-4 px-20 py-8">
//           {posts.map((post) => (
//             <div key={post.id} className="w-40 h-40 bg-gray-300 rounded-md">
//               <img
//                 className="w-full h-full object-cover rounded-md"
//                 src={post.img}
//                 alt={post.body}
//                 onError={(e) => { console.log(`Image failed to load: http://localhost:8000${post.img}`); }}
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfilePage;












import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../usercommon/Navbar';
import { useParams ,useNavigate } from 'react-router-dom';
import EditUserProfile from '../profile/EditUserProfile';
// import { toast } from 'react-toastify';

const UserProfilePage = () => {
  const { userId } = useParams(); // Get user ID from URL params
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    console.log('User ID:', userId);
    const fetchProfile = async () => {
      const token = localStorage.getItem('access');
      try {
        const response = await axios.get(`http://localhost:8000/post/profile/${userId ? userId : ''}`, {
          // const response = await axios.get(`http://localhost:8000/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Profile data:', response.data);
        setProfile(response.data.profile);
        setPosts(response.data.posts);
        setIsOwnProfile(response.data.is_own_profile);
        setIsFollowing(response.data.is_following);
      } catch (error) {
        setError('Failed to fetch profile data');
      }
    };

    fetchProfile();
  }, [userId]);
  console.log('Navigating to edit profile with userId:', userId);


  const handleFollowToggle = async () => {
    const token = localStorage.getItem('access');
    try {
      const response = await axios.post(`http://localhost:8000/post/follow-unfollow/${userId}/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsFollowing(response.data.is_following);
      setProfile((prevProfile) => ({
        ...prevProfile,
        follower_count: response.data.follower_count,
        following_count: response.data.following_count,
      }));
    } catch (error) {
      console.error('Failed to follow/unfollow user', error);
    }
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
          <div className="flex justify-center items-center relative mb-4 lg:mb-0 lg:w-1/3">
            <img
              className="w-40 h-40 lg:w-48 lg:h-48 object-cover rounded-full cursor-pointer transition-opacity duration-300 hover:opacity-70"
              src={`http://localhost:8000${profile.profile_picture}`}
              alt="Profile"
            />
          </div>
          <div className="flex flex-col items-center lg:items-start lg:col-span-2 lg:w-2/3">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-2xl font-semibold">{profile.username}</div>
              {isOwnProfile ? (
                <button className="bg-blue-500 text-white border-none px-4 py-2 rounded-md cursor-pointer transition-bg duration-300 hover:bg-blue-700"  
                onClick={() => navigate(`/user/edit-profile/${userId}`)} >
                  
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleFollowToggle}
                    className={`border-none px-4 py-2 rounded-md cursor-pointer transition-bg duration-300 ${isFollowing ? 'bg-red-500 hover:bg-red-700 text-white' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                  <button className="bg-gray-300 text-black border-none px-4 py-2 rounded-md cursor-pointer transition-bg duration-300 hover:bg-gray-400">
                    Message
                  </button>
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
              <div>{profile.bio || 'No bio available'}</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 px-20 py-8">
          {posts.map((post) => (
            <div key={post.id} className="w-full aspect-square bg-gray-300 rounded-md overflow-hidden">
              <img
                className="w-full h-full object-cover"
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




















// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Navbar from '../usercommon/Navbar';
// import { useParams ,useNavigate } from 'react-router-dom';
// import EditUserProfile from '../profile/EditUserProfile';
// // import { toast } from 'react-toastify';

// const UserProfilePage = () => {
//   const { userId } = useParams(); // Get user ID from URL params
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [error, setError] = useState('');
//   const [isOwnProfile, setIsOwnProfile] = useState(false);
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     console.log('User ID:', userId);
//     const fetchProfile = async () => {
//       const token = localStorage.getItem('access');
//       try {
//         // const response = await axios.get(`http://localhost:8000/post/profile/${userId ? userId : ''}`, {
//           const response = await axios.get(`http://localhost:8000/post/profile/${userId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         console.log('Profile data:', response.data);
//         setProfile(response.data.profile);
//         setPosts(response.data.posts);
//         setIsOwnProfile(response.data.is_own_profile);
//         setIsFollowing(response.data.is_following);
//       } catch (error) {
//         setError('Failed to fetch profile data');
//       }
//     };

//     fetchProfile();
//   }, [userId]);
//   console.log('Navigating to edit profile with userId:', userId);


//   const handleFollowToggle = async () => {
//     const token = localStorage.getItem('access');
//     try {
//       const response = await axios.post(`http://localhost:8000/post/follow-unfollow/${userId}/`, {}, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setIsFollowing(response.data.is_following);
//       setProfile((prevProfile) => ({
//         ...prevProfile,
//         follower_count: response.data.follower_count,
//         following_count: response.data.following_count,
//       }));
//     } catch (error) {
//       console.error('Failed to follow/unfollow user', error);
//     }
//   };

//   if (error) {
//     return <div>{error}</div>;
//   }

//   if (!profile) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="flex bg-[#faf7f4] min-h-screen">
//       <div className="w-1/6 bg-[#faf7f4] fixed border-r-2 min-h-screen">
//         <Navbar />
//       </div>
//       <div className="w-full flex flex-col pl-[16.5%] pt-8 pb-8">
//         <div className="flex flex-col items-center lg:flex-row lg:items-start lg:px-20 lg:py-8 lg:gap-8">
//           <div className="flex justify-center items-center relative mb-4 lg:mb-0 lg:w-1/3">
//             <img
//               className="w-40 h-40 lg:w-48 lg:h-48 object-cover rounded-full cursor-pointer transition-opacity duration-300 hover:opacity-70"
//               src={`http://localhost:8000${profile.profile_picture}`}
//               alt="Profile"
//             />
//           </div>
//           <div className="flex flex-col items-center lg:items-start lg:col-span-2 lg:w-2/3">
//             <div className="flex items-center gap-4 mb-4">
//               <div className="text-2xl font-semibold">{profile.username}</div>
//               {isOwnProfile ? (
//                 <button className="bg-blue-500 text-white border-none px-4 py-2 rounded-md cursor-pointer transition-bg duration-300 hover:bg-blue-700"  
//                 onClick={() => navigate(`/user/edit-profile/${userId}`)} >
                  
//                   Edit Profile
//                 </button>
//               ) : (
//                 <>
//                   <button
//                     onClick={handleFollowToggle}
//                     className={`border-none px-4 py-2 rounded-md cursor-pointer transition-bg duration-300 ${isFollowing ? 'bg-red-500 hover:bg-red-700 text-white' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}
//                   >
//                     {isFollowing ? 'Unfollow' : 'Follow'}
//                   </button>
//                   <button className="bg-gray-300 text-black border-none px-4 py-2 rounded-md cursor-pointer transition-bg duration-300 hover:bg-gray-400">
//                     Message
//                   </button>
//                 </>
//               )}
//             </div>
//             <div className="flex gap-8 mb-4">
//               <div className="text-center">
//                 <div className="font-bold">{profile.total_posts}</div>
//                 <div>Posts</div>
//               </div>
//               <div className="text-center">
//                 <div className="font-bold">{profile.follower_count}</div>
//                 <div>Followers</div>
//               </div>
//               <div className="text-center">
//                 <div className="font-bold">{profile.following_count}</div>
//                 <div>Following</div>
//               </div>
//             </div>
//             <div className="text-center lg:text-left">
//               <div className="font-semibold">{profile.full_name}</div>
//               <div>{profile.bio || 'No bio available'}</div>
//             </div>
//           </div>
//         </div>
//         <div className="grid grid-cols-3 gap-4 px-20 py-8">
//           {posts.map((post) => (
//             <div key={post.id} className="w-full aspect-square bg-gray-300 rounded-md overflow-hidden">
//               <img
//                 className="w-full h-full object-cover"
//                 src={post.img}
//                 alt={post.body}
//                 onError={(e) => { console.log(`Image failed to load: http://localhost:8000${post.img}`); }}
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfilePage;
