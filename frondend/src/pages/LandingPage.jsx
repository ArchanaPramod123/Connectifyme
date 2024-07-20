import React from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/bg.jpg'; 

const LandingPage = () => {
  return (
    <div
      className="relative bg-cover bg-center h-screen flex items-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
     
      <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-80"></div>

      <div className="relative z-10 container mx-auto text-center text-white">
        <h1 className="text-5xl font-bold mb-4">Welcome to Connectify</h1>
        <p className="text-lg mb-8">Connect with friends and the world around you on Connectify.</p>
        <Link to={'/user/'}>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
