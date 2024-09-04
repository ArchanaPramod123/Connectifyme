import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Suggestion = () => {
  const [suggestions, setSuggestions] = useState([]);
  const baseURL = import.meta.env.VITE_BASE_URL;
  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(baseURL + "/post/suggesions/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await axios.post(
        baseURL + "/post/follow-unfollow/",
        { user_id: userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      fetchSuggestions(); 
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await axios.post(
        baseURL + "/post/follow-unfollow/",
        { user_id: userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      fetchSuggestions(); 
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <div className="bg-white p-7 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Suggestions For You</h2>
      {suggestions.length > 0 ? (
        suggestions.map((user) => (
          <div className="flex items-center justify-between mb-6" key={user.id}>
            <div className="flex items-center">
              <img
                className="h-10 w-10 rounded-full border border-gray-300"
                src={user.profile_picture}
                alt={user.username}
              />
              <div className="ml-3">
                {/* <div className="text-sm font-semibold">{user.username}</div> */}
                <Link
                  to={`/user/profile/${user.id}`}
                  className="text-lg font-bold"
                >
                  {user.full_name}
                </Link>
                <div className="text-xs text-gray-500">Suggested for you</div>
              </div>
            </div>
            <div>
              {user.is_following ? (
                <button
                  onClick={() => handleUnfollow(user.id)}
                  className="text-sm font-semibold text-gray-500 hover:text-gray-800"
                >
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={() => handleFollow(user.id)}
                  className="text-sm font-semibold text-blue-500 hover:text-blue-700"
                >
                  Follow
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-sm text-gray-500">No suggestions available.</div>
      )}
    </div>
  );
};

export default Suggestion;
