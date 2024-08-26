
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import Spinner from './Spinner.jsx';

// function ForgetPassword() {
//   const [f_pass, setF_pass] = useState("");
//   const [formError, setFormError] = useState('');
//   const baseURL = 'http://127.0.0.1:8000/';
//   const navigate = useNavigate();
//   const [isSpinner, setIsSpiner] = useState(false);

//   const handleInputChange = (event) => {
//     setF_pass(event.target.value);
//   };

//   const handleSubmit = async (e) => {
//     console.log(f_pass);
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("email", e.target.email.value);
//     setIsSpiner(true);

//     try {
//       const response = await axios.post(baseURL + 'api/forgot_pass/', formData);

//       if (response.status === 200) {
//         setFormError('');
//         toast.success('Password reset link sent to email!', {
//           position: "top-center",
//         });
//         setIsSpiner(false);
//         navigate('/user');
//       } else {
//         setFormError(response.data.message);
//       }
//     } catch (error) {
//       setFormError('Something went wrong. Please try again.');
//       setIsSpiner(false);
//     }
//   };

//   return (
//     <div>
//       {!isSpinner && (
//         <div className='flex w-full h-screen bg-blue-50'>
//           <div className='hidden md:inline md:w-2/5'>
//             <div className='mt-16 mx-4 md:w-full'>
//               <h3 className='font-sans text-3xl font-bold drop-shadow-md text-blue-800'>
//                 Find your Dream Job Now
//               </h3>
//               <p className='text-blue-500 font-semibold'>
//                 5 lakh+ jobs for you to explore
//               </p>
//             </div>
//           </div>
//           <div className='w-full h-screen md:w-3/5 flex justify-end'>
//             <div className='bg-white w-full h-full md:rounded-l-lg shadow-2xl'>
//               <div className='flex h-full'>
//                 <div className="flex items-center justify-center w-full">
//                   <div className="flex items-center">
//                     <form onSubmit={handleSubmit} className="flex flex-col w-full h-full pb-6 text-center">
//                       <p className="mb-4 text-grey-700">Enter your email</p>
//                       <input
//                         id="email"
//                         type="email"
//                         placeholder="example@gmail.com"
//                         className="flex items-center w-full px-4 py-3 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-3 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
//                         onChange={handleInputChange}
//                       />
//                       {formError && (
//                         <div className='flex justify-start mb-5 pl-3 text-red-600'>
//                           <p>{formError}</p>
//                         </div>
//                       )}
//                       <button type='submit' className="w-full px-4 py-3 mb-3 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500">
//                         Send OTP
//                       </button>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {isSpinner && (
//         <div className='flex w-full h-screen justify-center items-center'>
//           <Spinner />
//         </div>
//       )}
//     </div>
//   );
// }

// export default ForgetPassword;








import React, { useState } from 'react';
import {Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from './Spinner.jsx';
import backgroundImage from '../assets/bg.jpg'; // Add your background image

function ForgetPassword() {
  const [f_pass, setF_pass] = useState("");
  const [formError, setFormError] = useState('');
  const baseURL = 'http://127.0.0.1:8000/';
  const navigate = useNavigate();
  const [isSpinner, setIsSpiner] = useState(false);

  const handleInputChange = (event) => {
    setF_pass(event.target.value);
  };

  const handleSubmit = async (e) => {
    console.log(f_pass);
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", e.target.email.value);
    setIsSpiner(true);

    try {
      const response = await axios.post(baseURL + 'api/forgot_pass/', formData);

      if (response.status === 200) {
        setFormError('');
        toast.success('Password reset link sent to email!', {
          position: "top-center",
        });
        setIsSpiner(false);
        navigate('/user');
      } else {
        setFormError(response.data.message);
      }
    } catch (error) {
      setFormError('Something went wrong. Please try again.');
      setIsSpiner(false);
    }
  };

  return (
    <div
      className="relative bg-cover bg-center h-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-80"></div>

      <div className="relative z-10 container mx-auto text-center text-white max-w-lg p-6 bg-black bg-opacity-50 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Reset Your Password</h2>
        <p className="mb-4 text-gray-300">Enter your email to receive a password reset link</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              className="w-full p-3 rounded-lg bg-gray-800 bg-opacity-50 text-white placeholder-gray-400"
              onChange={handleInputChange}
              required
            />
          </div>
          {formError && (
            <div className="flex justify-start mb-5 pl-3 text-red-600">
              <p>{formError}</p>
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300"
            disabled={isSpinner}
          >
            {isSpinner ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
        <p className="mt-4">
          Remembered your password? <Link to="/user/login" className="text-blue-400 hover:underline">Login</Link>
        </p>
      </div>

      {isSpinner && (
        <div className="flex w-full h-screen justify-center items-center absolute top-0 left-0 z-20">
          <Spinner />
        </div>
      )}
    </div>
  );
}

export default ForgetPassword;
