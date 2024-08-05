import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserLogin from '../../pages/user/UserLogin';
import UserSignUp from '../../pages/user/UserSignup';
import UserHome from '../../pages/user/UserHome';
import VerifyOTP from '../../common/Otppage';
import CreatePostPage from '../../pages/user/post/CreatePost';
import UserProfilePage from '../../pages/user/profile/UserProfilePage';
import ProfilePage from '../../pages/user/profile/CreateProfile';
import EditUserProfile from '../../pages/user/profile/EditUserProfile';
import PrivateRoute from '../../Redux/PrivateRoute';

const UserWrapper = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignUp />} />
        <Route path="/otp-verify" element={<VerifyOTP />} />
        <Route path="/home" element={<PrivateRoute><UserHome /></PrivateRoute>} />
        <Route path="/create-post" element={<PrivateRoute><CreatePostPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><UserProfilePage /></PrivateRoute>} />
        {/* <Route path="/profile/:userId" element={<PrivateRoute><UserProfilePage /></PrivateRoute>} /> */}
        <Route path="/edit-profile/:userId" element={<PrivateRoute><EditUserProfile /></PrivateRoute>} />
        <Route path="/profile-setup" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      </Routes>
    </div>
  );
};

export default UserWrapper;
