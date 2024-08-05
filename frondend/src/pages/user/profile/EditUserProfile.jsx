


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import ProfileCrop from '../post/crop/ProfileCrop';

// const EditProfileModal = ({ profile = {}, onClose }) => {
//   // Initialize state with profile data or default values
//   console.log('Profile:', profile);
//   const [fullName, setFullName] = useState(profile.full_name || '');
//   const [bio, setBio] = useState(profile.bio || '');
//   const [profilePicture, setProfilePicture] = useState(profile.profile_picture || '');
//   const [croppedImage, setCroppedImage] = useState(null);
//   const [isCropping, setIsCropping] = useState(false);

//   useEffect(() => {
//     const { userId } = useParams();
    
//     // Update state if profile prop changes
//     setFullName(profile.full_name || '');
//     setBio(profile.bio || '');
//     setProfilePicture(profile.profile_picture || '');
//   }, [profile]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setProfilePicture(imageUrl);
//       setIsCropping(true);
//     }
//   };

//   const handleSaveChanges = async () => {
//     const token = localStorage.getItem('access');
//     const formData = new FormData();
//     formData.append('full_name', fullName);
//     formData.append('bio', bio);
//     if (croppedImage) {
//       formData.append('profile_picture', croppedImage);
//     }

//     try {
//       await axios.patch(`http://localhost:8000/post/edit-profile/${profile.id}/`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       onClose();
//     } catch (error) {
//       console.error('Failed to update profile', error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
//         <h2 className="text-2xl mb-4">Edit Profile</h2>
//         <div className="flex flex-col items-center mb-4">
//           <div className="relative w-24 h-24 mb-4">
//             <img
//               className="w-full h-full object-cover rounded-full"
//               src={profilePicture ? `http://localhost:8000${profilePicture}` : ''}
//               alt="Profile"
//             />
//             <input
//               type="file"
//               accept="image/*"
//               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//               onChange={handleImageChange}
//             />
//           </div>
//           <input
//             type="text"
//             value={fullName}
//             onChange={(e) => setFullName(e.target.value)}
//             placeholder="Full Name"
//             className="mb-2 p-2 border rounded-md w-full"
//           />
//           <textarea
//             value={bio}
//             onChange={(e) => setBio(e.target.value)}
//             placeholder="Bio"
//             className="mb-2 p-2 border rounded-md w-full"
//           />
//         </div>
//         <div className="flex justify-end gap-4">
//           <button
//             onClick={onClose}
//             className="bg-gray-300 text-black px-4 py-2 rounded-md"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSaveChanges}
//             className="bg-blue-500 text-white px-4 py-2 rounded-md"
//           >
//             Save Changes
//           </button>
//         </div>
//       </div>
//       {isCropping && (
//         <ProfileCrop
//           imgUrl={profilePicture}
//           aspectInit={1}
//           setCroppedImg={setCroppedImage}
//           onClose={() => setIsCropping(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default EditProfileModal;




















// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import ProfileCrop from '../post/crop/ProfileCrop';
// import NavBar from '../usercommon/Navbar';

// const EditUserProfile = ({ onClose }) => {
//   const { userId } = useParams(); // Get userId from URL params
//   const [profile, setProfile] = useState({});
//   const [fullName, setFullName] = useState('');
//   const [bio, setBio] = useState('');
//   const [profilePicture, setProfilePicture] = useState('');
//   const [croppedImage, setCroppedImage] = useState(null);
//   const [isCropping, setIsCropping] = useState(false);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = localStorage.getItem('access');
//       try {
//         const response = await axios.get(`http://localhost:8000/post/profile/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setProfile(response.data.profile);
//         setFullName(response.data.profile.full_name || '');
//         setBio(response.data.profile.bio || '');
//         setProfilePicture(response.data.profile.profile_picture || '');
//       } catch (error) {
//         console.error('Failed to fetch profile data', error);
//       }
//     };

//     if (userId) fetchProfile();
//   }, [userId]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setProfilePicture(imageUrl);
//       setIsCropping(true);
//     }
//   };

//   const handleSaveChanges = async () => {
//     const token = localStorage.getItem('access');
//     const formData = new FormData();
//     formData.append('full_name', fullName);
//     formData.append('bio', bio);
//     if (croppedImage) formData.append('profile_picture', croppedImage);

//     try {
//       await axios.patch(`http://localhost:8000/post/edit-profile/${userId}/`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       onClose();
//     } catch (error) {
//       console.error('Failed to update profile', error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
//         <h2 className="text-2xl mb-4">Edit Profile</h2>
//         <div className="flex flex-col items-center mb-4">
//           <div className="relative w-24 h-24 mb-4">
//             <img
//               className="w-full h-full object-cover rounded-full"
//               src={profilePicture ? `http://localhost:8000${profilePicture}` : ''}
//               alt="Profile"
//             />
//             <input
//               type="file"
//               accept="image/*"
//               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//               onChange={handleImageChange}
//             />
//           </div>
//           <input
//             type="text"
//             value={fullName}
//             onChange={(e) => setFullName(e.target.value)}
//             placeholder="Full Name"
//             className="mb-2 p-2 border rounded-md w-full"
//           />
//           <textarea
//             value={bio}
//             onChange={(e) => setBio(e.target.value)}
//             placeholder="Bio"
//             className="mb-2 p-2 border rounded-md w-full"
//           />
//         </div>
//         <div className="flex justify-end gap-4">
//           <button
//             onClick={onClose}
//             className="bg-gray-300 text-black px-4 py-2 rounded-md"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSaveChanges}
//             className="bg-blue-500 text-white px-4 py-2 rounded-md"
//           >
//             Save Changes
//           </button>
//         </div>
//       </div>
//       {isCropping && (
//         <ProfileCrop
//           imgUrl={profilePicture}
//           aspectInit={1}
//           setCroppedImg={setCroppedImage}
//           onClose={() => setIsCropping(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default EditUserProfile


















// src/pages/user/profile/EditProfileModal.jsx

import React, { useState } from 'react';
import axios from 'axios';
import ProfileCrop from '../post/crop/ProfileCrop';

const EditProfileModal = ({ profile, onClose, onProfileUpdate }) => {
  const [name, setName] = useState(profile.full_name);
  const [bio, setBio] = useState(profile.bio);
  const [profilePic, setProfilePic] = useState(profile.profile_picture);
  const [showCropper, setShowCropper] = useState(false);
  const [croppedImg, setCroppedImg] = useState(null);

  const handleSave = async () => {
    const token = localStorage.getItem('access');
    const formData = new FormData();
    formData.append('full_name', name);
    formData.append('bio', bio);
    if (croppedImg) {
      formData.append('profile_picture', croppedImg);
    }

    try {
      const response = await axios.put(`http://localhost:8000/update_profile/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      onProfileUpdate(response.data);
      onClose();
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg">
      <div className="bg-white rounded-lg p-6 shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Profile Picture</label>
          <div className="flex items-center">
            <img
              src={croppedImg || `http://localhost:8000${profilePic}`}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
      {showCropper && (
        <ProfileCrop
          imgUrl={profilePic}
          aspectInit={1}
          setCroppedImg={setCroppedImg}
          onClose={() => setShowCropper(false)}
        />
      )}
    </div>
  );
};

export default EditProfileModal;
