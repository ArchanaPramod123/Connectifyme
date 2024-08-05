// import React, { useState } from 'react';
// import axios from 'axios';
// import CropImage from './post/crop/CropImage'; // Import your CropImage component

// const ProfileSetupPage = () => {
//   const [profilePicture, setProfilePicture] = useState(null);
//   const [backgroundImage, setBackgroundImage] = useState(null);
//   const [croppedProfilePicture, setCroppedProfilePicture] = useState(null);
//   const [croppedBackgroundImage, setCroppedBackgroundImage] = useState(null);

//   const handleProfilePictureChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setProfilePicture(URL.createObjectURL(file));
//     }
//   };

//   const handleBackgroundImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setBackgroundImage(URL.createObjectURL(file));
//     }
//   };

//   const handleSave = () => {
//     const formData = new FormData();
//     if (croppedProfilePicture) formData.append('profile_picture', croppedProfilePicture);
//     if (croppedBackgroundImage) formData.append('background_image', croppedBackgroundImage);

//     axios.patch('/api/user/profile/', formData)
//       .then(response => {
//         alert('Profile updated successfully');
//         window.location.href = '/home';
//       })
//       .catch(error => {
//         console.error('Error updating profile:', error);
//         alert('Failed to update profile');
//       });
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
//       <h1 className="text-2xl font-semibold mb-4">Set Up Your Profile</h1>
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
//         <input type="file" onChange={handleProfilePictureChange} className="mt-1" />
//         {profilePicture && (
//           <CropImage imgUrl={profilePicture} aspectInit={1} setCroppedImg={setCroppedProfilePicture} />
//         )}
//       </div>
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">Background Image</label>
//         <input type="file" onChange={handleBackgroundImageChange} className="mt-1" />
//         {backgroundImage && (
//           <CropImage imgUrl={backgroundImage} aspectInit={16 / 9} setCroppedImg={setCroppedBackgroundImage} />
//         )}
//       </div>
//       <button onClick={handleSave} className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
//     </div>
//   );
// };

// export default ProfileSetupPage;

















// // createProfile.jsx
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import CropImage from './post/crop/CropImage';

// const baseURL = 'http://127.0.0.1:8000'; // Add your base URL here

// const CreateProfile = () => {
//   const [profilePicture, setProfilePicture] = useState(null);
//   const [croppedProfilePicture, setCroppedProfilePicture] = useState(null);
//   const [bio, setBio] = useState('');
//   const [username, setUsername] = useState('');
//   const navigate = useNavigate();

//   const handleProfilePictureChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setProfilePicture(URL.createObjectURL(file));
//     }
//   };

//   const handleSave = () => {
//     const formData = new FormData();
//     if (croppedProfilePicture) {
//       fetch(croppedProfilePicture)
//         .then(res => res.blob())
//         .then(blob => {
//           formData.append('profile_picture', blob, 'profile.jpg');
//           formData.append('bio', bio);
//           formData.append('username', username);

//           axios.patch(`${baseURL}/api/create-profile`, formData, {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//           })
//             .then(response => {
//               alert('Profile updated successfully');
//               navigate('/user/home');
//             })
//             .catch(error => {
//               console.error('Error updating profile:', error);
//               alert('Failed to update profile');
//             });
//         });
//     } else {
//       formData.append('bio', bio);
//       formData.append('username', username);

//       axios.patch(`${baseURL}/api/create-profile/`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       })
//         .then(response => {
//           alert('Profile updated successfully');
//           navigate('/user/home');
//         })
//         .catch(error => {
//           console.error('Error updating profile:', error);
//           alert('Failed to update profile');
//         });
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
//       <h1 className="text-2xl font-semibold mb-4">Set Up Your Profile</h1>
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">Username</label>
//         <input
//           type="text"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="mt-1 p-2 border border-gray-300 rounded w-full"
//           required
//         />
//       </div>
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
//         <input type="file" onChange={handleProfilePictureChange} className="mt-1" />
//         {profilePicture && (
//           <CropImage imgUrl={profilePicture} aspectInit={1} setCroppedImg={setCroppedProfilePicture} />
//         )}
//       </div>
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">Bio</label>
//         <textarea
//           value={bio}
//           onChange={(e) => setBio(e.target.value)}
//           className="mt-1 p-2 border border-gray-300 rounded w-full"
//           rows={4}
//           required
//         />
//       </div>
//       <button onClick={handleSave} className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700">
//         Save
//       </button>
//     </div>
//   );
// };

// export default CreateProfile;








// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import ProfileCrop from './post/crop/ProfileCrop';

// const baseURL = 'http://127.0.0.1:8000'; // Add your base URL here

// const CreateProfile = () => {
//   const [profilePicture, setProfilePicture] = useState(null);
//   const [croppedProfilePicture, setCroppedProfilePicture] = useState(null);
//   const [bio, setBio] = useState('');
//   const [username, setUsername] = useState('');
//   const navigate = useNavigate();

//   const handleProfilePictureChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setProfilePicture(file);
//     }
//   };

//   const handleSave = () => {
//     const formData = new FormData();
//     if (croppedProfilePicture) {
//       fetch(croppedProfilePicture)
//         .then(res => res.blob())
//         .then(blob => {
//           formData.append('profile_picture', blob, 'profile.jpg');
//           formData.append('bio', bio);
//           formData.append('username', username);

//           axios.patch(`${baseURL}/api/create-profile/`, formData, {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//               'Authorization': `Bearer ${localStorage.getItem('access')}` // Include JWT token
//             },
//           })
//             .then(response => {
//               alert('Profile updated successfully');
//               navigate('/user/home');
//             })
//             .catch(error => {
//               console.error('Error updating profile:', error);
//               alert('Failed to update profile');
//             });
//         });
//     } else {
//       formData.append('bio', bio);
//       formData.append('username', username);

//       axios.patch(`${baseURL}/api/create-profile/`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${localStorage.getItem('token')}` // Include JWT token
//         },
//       })
//         .then(response => {
//           alert('Profile updated successfully');
//           navigate('/user/home');
//         })
//         .catch(error => {
//           console.error('Error updating profile:', error);
//           alert('Failed to update profile');
//         });
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
//       <h1 className="text-2xl font-semibold mb-4">Set Up Your Profile</h1>
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">Username</label>
//         <input
//           type="text"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="mt-1 p-2 border border-gray-300 rounded w-full"
//           required
//         />
//       </div>
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
//         <div className="relative w-24 h-24 mb-4">
//           <input
//             type="file"
//             onChange={handleProfilePictureChange}
//             className="absolute w-full h-full opacity-0 cursor-pointer"
//           />
//           {croppedProfilePicture ? (
//             <img src={croppedProfilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
//           ) : (
//             <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
//               +
//             </div>
//           )}
//         </div>
//         {profilePicture && (
//           <ProfileCrop imgUrl={URL.createObjectURL(profilePicture)} aspectInit={1} setCroppedImg={setCroppedProfilePicture} />
//         )}
//       </div>
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">Bio</label>
//         <textarea
//           value={bio}
//           onChange={(e) => setBio(e.target.value)}
//           className="mt-1 p-2 border border-gray-300 rounded w-full"
//           rows={4}
//           required
//         />
//       </div>
//       <button onClick={handleSave} className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700">
//         Save
//       </button>
//     </div>
//   );
// };

// export default CreateProfile;














// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import ProfileCrop from './post/crop/ProfileCrop';

// const baseURL = 'http://127.0.0.1:8000'; // Add your base URL here

// const CreateProfile = () => {
//   const [profilePicture, setProfilePicture] = useState(null);
//   const [croppedProfilePicture, setCroppedProfilePicture] = useState(null);
//   const [bio, setBio] = useState('');
//   const [username, setUsername] = useState('');
//   const [showCropper, setShowCropper] = useState(false);
//   const navigate = useNavigate();

//   const handleProfilePictureChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setProfilePicture(file);
//       setShowCropper(true); // Show the cropper
//     }
//   };

//   const handleSave = () => {
//     const formData = new FormData();
//     if (croppedProfilePicture) {
//       fetch(croppedProfilePicture)
//         .then(res => res.blob())
//         .then(blob => {
//           formData.append('profile_picture', blob, 'profile.jpg');
//           formData.append('bio', bio);
//           formData.append('username', username);

//           axios.patch(`${baseURL}/api/create-profile/`, formData, {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//               'Authorization': `Bearer ${localStorage.getItem('access')}` // Include JWT token
//             },
//           })
//             .then(response => {
//               alert('Profile updated successfully');
//               navigate('/user/home');
//             })
//             .catch(error => {
//               console.error('Error updating profile:', error);
//               alert('Failed to update profile');
//             });
//         });
//     } else {
//       formData.append('bio', bio);
//       formData.append('username', username);

//       axios.patch(`${baseURL}/api/create-profile/`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${localStorage.getItem('token')}` // Include JWT token
//         },
//       })
//         .then(response => {
//           alert('Profile updated successfully');
//           navigate('/user/home');
//         })
//         .catch(error => {
//           console.error('Error updating profile:', error);
//           alert('Failed to update profile');
//         });
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
//       <h1 className="text-2xl font-semibold mb-4">Set Up Your Profile</h1>
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">Username</label>
//         <input
//           type="text"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="mt-1 p-2 border border-gray-300 rounded w-full"
//           required
//         />
//       </div>
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
//         <div className="relative w-24 h-24 mb-4">
//           <input
//             type="file"
//             onChange={handleProfilePictureChange}
//             className="absolute w-full h-full opacity-0 cursor-pointer"
//           />
//           {croppedProfilePicture ? (
//             <img src={croppedProfilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
//           ) : (
//             <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
//               +
//             </div>
//           )}
//         </div>
//         {showCropper && (
//           <ProfileCrop 
//             imgUrl={URL.createObjectURL(profilePicture)} 
//             aspectInit={1} 
//             setCroppedImg={setCroppedProfilePicture} 
//             onClose={() => setShowCropper(false)} // Hide the cropper after cropping
//           />
//         )}
//       </div>
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">Bio</label>
//         <textarea
//           value={bio}
//           onChange={(e) => setBio(e.target.value)}
//           className="mt-1 p-2 border border-gray-300 rounded w-full"
//           rows={4}
//           required
//         />
//       </div>
//       <button onClick={handleSave} className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700">
//         Save
//       </button>
//     </div>
//   );
// };

// export default CreateProfile;
















import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { Toaster, toast } from 'sonner';
import ProfileCrop from '../post/crop/ProfileCrop';

const baseURL = 'http://127.0.0.1:8000';

const CreateProfile = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [croppedProfilePicture, setCroppedProfilePicture] = useState(null);
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [showCropper, setShowCropper] = useState(false);
  const navigate = useNavigate();

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicture(file);
      setShowCropper(true);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    if (croppedProfilePicture) {
      const response = await fetch(croppedProfilePicture);
      const blob = await response.blob();
      formData.append('profile_picture', blob, 'profile.jpg');
    }
    formData.append('bio', bio);
    formData.append('username', username);

    try {
      await axios.patch(`${baseURL}/api/create-profile/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        },
      });
      toast.success('Profile updated successfully');
      navigate('/user/home');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
    
      <h1 className="text-2xl font-semibold mb-4">Set Up Your Profile</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
        <div className="relative w-24 h-24 mb-4">
          <input
            type="file"
            onChange={handleProfilePictureChange}
            className="absolute w-full h-full opacity-0 cursor-pointer"
          />
          {croppedProfilePicture ? (
            <img src={croppedProfilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              +
            </div>
          )}
        </div>
        {showCropper && (
          <ProfileCrop 
            imgUrl={URL.createObjectURL(profilePicture)} 
            aspectInit={1} 
            setCroppedImg={setCroppedProfilePicture} 
            onClose={() => setShowCropper(false)} 
          />
        )}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded w-full"
          rows={4}
          required
        />
      </div>
      <button onClick={handleSave} className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700">
        Save
      </button>
    </div>
  );
};

export default CreateProfile;
