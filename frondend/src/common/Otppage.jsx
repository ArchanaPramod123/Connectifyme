import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from '../assets/bg.jpg';
import { Toaster, toast } from 'sonner';

import Swal from 'sweetalert2';

const Otppage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [otpValue, setOtpValue] = useState('');
  const [resend, setResend] = useState(false);
  const email = localStorage.getItem('email');
  
  const navigate = useNavigate();
  const twoDigits = (num) => String(num).padStart(2, '0');
  const baseURL = 'http://127.0.0.1:8000/';
  const [minute, setMinute] = useState(1);
  const [second, setSecond] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (second > 0) {
        setSecond((prevSecond) => prevSecond - 1);
      } else {
        if (minute === 0) {
          clearInterval(interval);
          setResend(true);
        } else {
          setSecond(59);
          setMinute((prevMinute) => prevMinute - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [minute, second]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(baseURL + 'api/verify-otp/', { otp: otpValue, email });
      setLoading(false);
      localStorage.removeItem('email');
      navigate('/user'); 
    } catch (err) {
      setLoading(false);
      console.error('Error verifying OTP:', err);
    }
  };

  const handleResendOTP = async () => {
    if (loading) return;
    try {
      const response = await axios.post(`${baseURL}api/resend-otp/`, { email });
      setMinute(1);
      setSecond(30);
      setResend(false);
      // Swal.fire({
      //   position: 'top-end',
      //   icon: 'success',
      //   title: 'OTP sent',
      //   showConfirmButton: false,
      //   timer: 1500,
      // });
      toast.success('OTP sent to your email again');


    } catch (error) {
      // console.error('Error resending OTP:', error);
      toast.error('Error resending OTP');

    }
  };

  return (
    <div
      className="relative bg-cover bg-center h-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-80"></div>

      <div className="relative z-10 container mx-auto text-center text-white max-w-lg p-6 bg-black bg-opacity-50 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">OTP Verification</h2>

        <form onSubmit={handleSubmit} method='POST' className="flex flex-col w-full h-full pb-6 text-center">
          <h3 className="mb-3 text-4xl font-extrabold text-dark-grey-900">Enter OTP</h3>
          <p className="mb-4 text-grey-700">OTP sent to {email}</p>
          <div className="flex items-center mb-3">
            <hr className="h-0 border-b border-solid border-grey-500 grow" />
          </div>
          {/* <input
            name="otp"
            placeholder={resend ? "Please resend OTP" : "Enter OTP"}
            required
            onChange={(e) => setOtpValue(e.target.value)}
            className="flex items-center w-full px-4 py-3 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
          /> */}
          <input
            name="otp"
            placeholder={resend ? "Please resend OTP" : "Enter OTP"}
            required
            onChange={(e) => setOtpValue(e.target.value)}
            className="flex items-center w-full px-4 py-3 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-black rounded-2xl"/>

          <div className='mb-5 flex justify-start px-3'>
            <p className='text-xs font-medium text-green-500'>Resend OTP in: <span className='text-red-600'>{twoDigits(minute)}:{twoDigits(second)}</span></p>
          </div>
          {resend ? (
            <p onClick={handleResendOTP} className="cursor-pointer w-full px-4 py-3 mb-3 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-red-600 focus:ring-4 focus:ring-red-100 bg-red-500">
              Resend OTP
            </p>
          ) : (
            <button type='submit' className="w-full px-4 py-3 mb-3 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Otppage;
