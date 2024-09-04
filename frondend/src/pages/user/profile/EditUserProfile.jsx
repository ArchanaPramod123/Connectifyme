import React, { useState } from "react";
import axios from "axios";
import ProfileCrop from "../post/crop/ProfileCrop";
import { useSelector } from "react-redux";

const EditProfileModal = ({ profile, onClose, onProfileUpdate }) => {
  // const [name, setName] = useState(profile.full_name);

  const [name, setName] = useState(profile.full_name || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [isPrivate, setIsPrivate] = useState(profile.is_private || false);

  const [profilePic, setProfilePic] = useState(profile.profile_picture);
  // const [isPrivate, setIsPrivate] = useState(profile.is_private);
  const [showCropper, setShowCropper] = useState(false);
  const [croppedImg, setCroppedImg] = useState(null);
  const userprofile_id = useSelector((state) => state.auth.user_id);
  const baseURL = import.meta.env.VITE_BASE_URL;
  const handleSave = async () => {
    const token = localStorage.getItem("access");
    const formData = new FormData();
    formData.append("full_name", name);
    formData.append("bio", bio);
    console.log("the chaneg bio is the ,", bio);
    formData.append("is_private", isPrivate);

    if (croppedImg) {
      const response = await fetch(croppedImg);
      const blob = await response.blob();
      const file = new File([blob], "profile_picture.jpg", { type: blob.type });
      formData.append("profile_picture", file);
    }

    try {
      const response = await axios.patch(
        `${baseURL}/post/edit-profile/${userprofile_id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onProfileUpdate({
        ...response.data,
        profile_picture: croppedImg || profilePic,
      });

      onClose();
      console.log("the response data is ", response.data);

      onClose();
    } catch (error) {
      console.error("Failed to update profile", error);
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
              src={croppedImg || `${profilePic}`}
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
        {/* <div className="mb-4">
          <label className="block text-gray-700 mb-2">Profile Privacy</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="mr-2"
            />
            <span>{isPrivate ? "Private" : "Public"}</span>
          </div>
        </div> */}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Profile Privacy</label>
          <div className="flex items-center">
            <label className="mr-4">
              <input
                type="radio"
                value="public"
                checked={!isPrivate}
                onChange={() => setIsPrivate(false)}
                className="mr-1"
              />
              Public
            </label>
            <label>
              <input
                type="radio"
                value="private"
                checked={isPrivate}
                onChange={() => setIsPrivate(true)}
                className="mr-1"
              />
              Private
            </label>
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
      {/* {showCropper && (
        <ProfileCrop
          imgUrl={profilePic}
          aspectInit={1}
          setCroppedImg={(img) => {
            setCroppedImg(new Blob([img], { type: "image/jpeg" }));  // Convert cropped image to Blob
            setShowCropper(false);
          }}
          onClose={() => setShowCropper(false)}
        />
      )} */}
    </div>
  );
};

export default EditProfileModal;
