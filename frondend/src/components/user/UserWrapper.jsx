import React from 'react'
import {Routes,Route,useNavigate} from 'react-router-dom'
import UserLogin from '../../pages/user/UserLogin'
import UserSignUp from '../../pages/user/UserSignup'
import UserHome from '../../pages/user/UserHome'
import VerifyOTP from '../../common/Otppage'
import CreatePostPage from '../../pages/user/post/CreatePost'
import UserProfilePage from '../../pages/user/UserProfilePage'


const UserWrapper = () => {
  return (
    <div>
        <Routes>
            <Route path='/' element={<UserLogin></UserLogin>}> </Route>
            <Route path='/signup' element={<UserSignUp></UserSignUp>}></Route>
            <Route path='/otp-verify' element={<VerifyOTP></VerifyOTP>}></Route>
            <Route path='/home' element={<UserHome></UserHome>}></Route>
            <Route path='/create-post' element={<CreatePostPage/>}></Route>
            <Route path='/profile' element={<UserProfilePage/>}></Route>
        </Routes>
      
    </div>
  )
}

export default UserWrapper
