import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import ProfileCrop from "../post/crop/ProfileCrop";

const CreateProfile = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [croppedProfilePicture, setCroppedProfilePicture] = useState(null);
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  const baseURL = import.meta.env.VITE_BASE_URL;
  const [isPrivate, setIsPrivate] = useState(false);
  console.log("is private is true or false", isPrivate);

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
      formData.append("profile_picture", blob, "profile.jpg");
    }
    formData.append("bio", bio);
    formData.append("username", username);

    formData.append("is_private", isPrivate);

    try {
      await axios.patch(`${baseURL}/post/update_profile/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      toast.success("Profile updated successfully");
      navigate("/user/home");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">Set Up Your Profile</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Profile Picture
        </label>
        <div className="relative w-24 h-24 mb-4">
          <input
            type="file"
            onChange={handleProfilePictureChange}
            className="absolute w-full h-full opacity-0 cursor-pointer"
          />
          {croppedProfilePicture ? (
            <img
              src={croppedProfilePicture}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
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

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Profile Privacy
        </label>
        <select
          value={isPrivate}
          onChange={(e) => setIsPrivate(e.target.value === "true")}
          className="mt-1 p-2 border border-gray-300 rounded w-full"
        >
          <option value={false}>Public</option>
          <option value={true}>Private</option>
        </select>
      </div>

      <button
        onClick={handleSave}
        className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Save
      </button>
    </div>
  );
};

export default CreateProfile;
