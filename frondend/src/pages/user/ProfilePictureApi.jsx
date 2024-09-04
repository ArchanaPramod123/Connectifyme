import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";

const ProfilePictureApi = () => {
  const [profilePicture, setProfilePicture] = useState("");

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/profile_pic/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access")}`
          }
        });
        setProfilePicture(response.data.profile_picture);
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    fetchProfilePicture();
  }, []);

//   return (
//     <img
//       className="flex-shrink-0 h-10 w-10 rounded-full"
//       src={profilePicture}
//       alt="User Profile"
//     />
//   );
};

export default ProfilePictureApi;
