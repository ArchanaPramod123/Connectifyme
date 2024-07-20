import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/bg.jpg';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

const UserSignUp = () => {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const baseURL = 'http://127.0.0.1:8000/';

  const SignupSchema = Yup.object().shape({
    full_name: Yup.string()
      .min(3, 'Too Short!')
      .matches(/^[A-Z][a-zA-Z]/, 'First letter should be capital')
      .max(30, 'Too Long!')
      .required('Full Name is required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password should be minimum 8 characters')
      .matches(/[A-Z]/, 'Password should have at least one uppercase')
      .matches(/[a-z]/, 'Password should have at least one lowercase')
      .matches(/[0-9]/, 'Password should have at least one number')
      .matches(/[!@#$%^&*]/, 'Password should have at least one special character')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required')
      .nullable(),
    phone: Yup.string().nullable(),
  });

  const [values, setValues] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: null });
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      await SignupSchema.validate(values, { abortEarly: false });

      if (values.password !== values.confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Passwords do not match!',
        });
        return;
      }

      const formData = new FormData();
      formData.append('full_name', values.full_name);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('phone', values.phone);

      const response = await axios.post(baseURL + 'api/register/', formData);

      if (response.status === 200) {
        localStorage.setItem('email', values.email);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'OTP sent',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate('/user/otp-verify');
      }
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = {};
        error.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
        setFormErrors(errors);
      } else {
        console.error('Signup error:', error);
        setFormErrors({ general: 'An error occurred during signup. Please try again.' });
      }
    }
  };

  return (
    <div
      className="relative bg-cover bg-center h-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-80"></div>

      <div className="relative z-10 container mx-auto text-center text-white max-w-lg p-6 bg-black bg-opacity-50 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Sign Up for Connectify</h2>
        <form onSubmit={handleOnSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={values.full_name}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 ${
                formErrors.full_name ? 'border-red-500' : ''
              }`}
              required
            />
            {formErrors.full_name && (
              <p className="text-red-500 text-xs mt-1">{formErrors.full_name}</p>
            )}
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 ${
                formErrors.email ? 'border-red-500' : ''
              }`}
              required
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 ${
                formErrors.password ? 'border-red-500' : ''
              }`}
              required
            />
            {formErrors.password && (
              <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
            )}
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={values.confirmPassword}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 ${
                formErrors.confirmPassword ? 'border-red-500' : ''
              }`}
              required
            />
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
            )}
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={values.phone}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 bg-opacity-50 text-white placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300"
          >
            Sign Up
          </button>
        </form>
        {formErrors.general && <p className="mt-4 text-red-500">{formErrors.general}</p>}
        <p className="mt-4">
          Already have an account?{' '}
          <Link to={'/user'} className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserSignUp;
