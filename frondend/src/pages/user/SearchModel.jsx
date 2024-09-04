import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const baseURL = import.meta.env.VITE_BASE_URL;
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      try {
        const response = await axios.get(baseURL+`/post/search-users/?q=${query}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-20 z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-bg shadow-lg relative">
        <FaTimes
          className="absolute top-4 right-4 text-gray-500 cursor-pointer hover:text-gray-700"
          onClick={onClose}
          size={15}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search..."
          className="w-full p-3 border-b border-gray-200 focus:outline-none"
        />
        <div className="max-h-70 overflow-y-auto mt-5">
          {searchResults.length > 0 ? (
            searchResults.map((user) => (
              <Link
                to={`/user/profile/${user.id}`}
                key={user.id}
                className="flex items-center p-2 hover:bg-gray-100 rounded-md transition"
                onClick={onClose}
              >
                <img
                  src={user.profile_picture || 'default_profile_pic_url'}
                  alt={user.username}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <span className="text-gray-900 font-medium">{user.username}</span>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 text-center">No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
