import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { set_Authentication } from '../../Redux/Authentication/authenticationSlice';
import { set_user_basic_details } from '../../Redux/UserDetails/UserDetails';
import backgroundImage from '../../assets/bg.jpg';
import { Toaster, toast } from 'sonner';


const UserLogin = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { loading, error } = useSelector((state) => state.auth);
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
   const baseURL = import.meta.env.VITE_BASE_URL;
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('/user/home');
  //   }
  // }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(baseURL + '/api/login/', formData);
      console.log("i wnat to check the user_id is store",formData);
      

      if (response.status === 200) {
        const decodedToken = jwtDecode(response.data.access_token);

        localStorage.setItem('access', response.data.access_token);
        localStorage.setItem('refresh', response.data.refresh_token);
        console.log("user_iddddddddddddddddddddddddddddd",response.data.user_id);
        console.log("user_nameeeeeeeeeeeeeeeeeeeeeeeeeee",response.data.name);
        // console.log("user_profileeeeeeeeeeeeepiccccccccc",response.data.profile_picture);
        

        dispatch(
          set_Authentication({
            id:response.data.user_id,
            name: response.data.name,
            email: response.data.email,
            // profile_picture: response.data.profile_picture,
            isAuthenticated: true,
            isAdmin: response.data.isAdmin,
          })
          
          
        );
       

        dispatch(
          set_user_basic_details({
            name: response.data.name,
            email: response.data.email,
          })
        );

        console.log("response of the data in profile",response.data.profile_complete);
        if (response.data.profile_complete) {
          // console.log("pleaseeeeeeeee goooooooooooo toooooooooooooprofilr");
          toast.success('Successfuly login');

          navigate('/user/home');
          console.log("the userid thst go to the redux id",user_id);
        } else {
          // console.log("checkkkkkkkkkkkkkkkkkkkkkk");
          toast.info("Complete your account updation")
          navigate('/user/profile-setup');
        }
      }
    } catch (error) {
      setFormError('Invalid email or password');
      // console.log('error', error);
      // toast.error('invalid password or email')
    }
  };

  return (
    <div
      className="relative bg-cover bg-center h-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-80"></div>

      <div className="relative z-10 container mx-auto text-center text-white max-w-lg p-6 bg-black bg-opacity-50 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Login to Connectify</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 bg-opacity-50 text-white placeholder-gray-400"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 bg-opacity-50 text-white placeholder-gray-400"
              required
            />
          </div>
          {formError && <div className="flex justify-start mb-5 pl-3 text-red-600"><p>{formError}</p></div>}
          <p className="mt-4">
  Forgot your password? <Link to="/user/forgot-password" className="text-blue-400 hover:underline">Reset Password</Link>
</p>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300"
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>
        {error && <p className="mt-4 text-red-500">{error}</p>}
        <p className="mt-4">
          Don't have an account? <Link to="/user/signup/" className="text-blue-400 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
