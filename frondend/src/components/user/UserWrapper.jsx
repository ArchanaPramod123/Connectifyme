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
import AuthUser from '../../Redux/AuthUser';
import PostDetailPage from '../../pages/user/profile/PostDetailPage';
import Suggestion from '../../pages/user/UserSuggestion';
import SearchModal from '../../pages/user/SearchModel'; 
import Messages from '../../pages/user/chat/Message';
import Explore from '../../pages/user/Explore';
import ForgetPassword from '../../common/ForgetPassword';
import ResetPassword from '../../common/ResetPassword';
import ReportModal from '../../pages/user/post/UserPostReport';
import OneToOneVideoCall from '../../pages/user/chat/OneToOneVideoCall';

const UserWrapper = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AuthUser><UserLogin /></AuthUser>} />
        <Route path="/signup" element={<AuthUser><UserSignUp /></AuthUser>} />
        {/* <Route path="/" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignUp />}/> */}
        <Route path="/otp-verify" element={<VerifyOTP />} />

        <Route path='/forgot-password' element={<ForgetPassword></ForgetPassword>}/>
        <Route path='/reset_password/:id' element={<ResetPassword></ResetPassword>}/>

        <Route path="/home" element={<PrivateRoute><UserHome /></PrivateRoute>} />
        <Route path="/create-post" element={<PrivateRoute><CreatePostPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><UserProfilePage /></PrivateRoute>} />
        <Route path="/profile/:userId" element={<PrivateRoute><UserProfilePage /></PrivateRoute>} />
        
        <Route path="/edit-profile/:userId" element={<PrivateRoute><EditUserProfile /></PrivateRoute>} />
        <Route path="/profile-setup" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path='/post-detail/:postId' element={<PrivateRoute><PostDetailPage/></PrivateRoute>}/>

        <Route path='/search' element={<PrivateRoute><SearchModal/></PrivateRoute>}/>


        <Route path='/suggestions' element={<PrivateRoute><Suggestion/></PrivateRoute>}/>

        <Route path='/messages' element={<PrivateRoute><Messages/></PrivateRoute>}/>
        <Route path='/explore' element={<PrivateRoute><Explore/></PrivateRoute>}/>


        <Route path='/reportpost' element={<PrivateRoute><ReportModal/></PrivateRoute>}/>
        <Route path="/video-call/:roomId" element={<PrivateRoute><OneToOneVideoCall /></PrivateRoute>} />



      </Routes>
    </div>
  );
};

export default UserWrapper;


