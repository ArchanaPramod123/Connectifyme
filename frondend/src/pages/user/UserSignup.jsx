import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/bg.jpg';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Toaster, toast } from 'sonner';
import * as Yup from 'yup';

const UserSignUp = () => {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [values, setValues] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const baseURL = import.meta.env.VITE_BASE_URL;
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
        // Swal.fire({
        //   icon: 'error',
        //   title: 'Oops...',
        //   text: 'Passwords do not match!',
        // });
        toast.error('Passwords do not match!');
        return;
      }

      const formData = new FormData();
      formData.append('full_name', values.full_name);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('phone', values.phone);

      const response = await axios.post(baseURL + '/api/register/', formData);

      if (response.status === 200) {
        localStorage.setItem('email', values.email);
        // Swal.fire({
        //   position: 'top-end',
        //   icon: 'success',
        //   title: 'OTP sent',
        //   showConfirmButton: false,
        //   timer: 1500,
        // });
        toast.success('OTP sent to your email');
        
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
        // console.error('Signup error:', error);
        toast.error("Signup error")
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



// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import { Toaster, toast } from 'sonner';
// import * as Yup from 'yup';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import backgroundImage from '../../assets/bg.jpg';

// const UserSignUp = () => {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const baseURL = import.meta.env.VITE_BASE_URL;

//   const SignupSchema = Yup.object().shape({
//     full_name: Yup.string()
//       .min(3, 'Too Short!')
//       .matches(/^[A-Z][a-zA-Z]/, 'First letter should be capital')
//       .max(30, 'Too Long!')
//       .required('Full Name is required'),
//     email: Yup.string()
//       .email('Invalid email')
//       .required('Email is required'),
//     password: Yup.string()
//       .min(8, 'Password should be minimum 8 characters')
//       .matches(/[A-Z]/, 'Password should have at least one uppercase')
//       .matches(/[a-z]/, 'Password should have at least one lowercase')
//       .matches(/[0-9]/, 'Password should have at least one number')
//       .matches(/[!@#$%^&*]/, 'Password should have at least one special character')
//       .required('Password is required'),
//     confirmPassword: Yup.string()
//       .oneOf([Yup.ref('password'), null], 'Passwords must match')
//       .required('Confirm Password is required')
//       .nullable(),
//     phone: Yup.string().nullable(),
//   });

//   const handleOnSubmit = async (values) => {
//     try {
//       await SignupSchema.validate(values, { abortEarly: false });

//       const formData = new FormData();
//       formData.append('full_name', values.full_name);
//       formData.append('email', values.email);
//       formData.append('password', values.password);
//       formData.append('phone', values.phone);

//       const response = await axios.post(baseURL + '/api/register/', formData);

//       if (response.status === 200) {
//         localStorage.setItem('email', values.email);
//         toast.success('OTP sent to your email');
//         navigate('/user/otp-verify');
//       }
//     } catch (error) {
//       if (error.name === 'ValidationError') {
//         const errors = {};
//         error.inner.forEach((e) => {
//           errors[e.path] = e.message;
//         });
//         setFormErrors(errors);
//       } else {
//         toast.error("Signup error");
//       }
//     }
//   };

//   return (
//     <div className='flex flex-col md:flex-row justify-center h-screen bg-white'>
//       <div className='flex items-center justify-center md:w-1/2 hover:scale-105 transition-transform duration-500'>
//         <div className='max-w-md w-full shadow-lg p-6'>
//           <h2 className='text-2xl font-semibold text-center mb-6 mt-2'>Sign Up for Connectify</h2>

//           <Formik
//             initialValues={{
//               full_name: '',
//               email: '',
//               password: '',
//               confirmPassword: '',
//               phone: '',
//             }}
//             validationSchema={SignupSchema}
//             onSubmit={handleOnSubmit}
//           >
//             <Form className="max-w-md mx-auto">
//               <div className="relative z-0 w-full mb-4 group">
//                 <Field 
//                   type="text" 
//                   name="full_name" 
//                   id="full_name" 
//                   autoComplete="off"
//                   className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
//                   placeholder=" " 
//                 />
//                 <label 
//                   htmlFor="full_name" 
//                   className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//                 >
//                   Full Name
//                 </label>
//                 <ErrorMessage name="full_name" component="div" className="text-red-600 text-xs" />
//               </div>

//               <div className="relative z-0 w-full mb-4 group">
//                 <Field 
//                   type="email" 
//                   name="email" 
//                   id="email" 
//                   autoComplete="off"
//                   className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
//                   placeholder=" " 
//                 />
//                 <label 
//                   htmlFor="email" 
//                   className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//                 >
//                   Email
//                 </label>
//                 <ErrorMessage name="email" component="div" className="text-red-600 text-xs" />
//               </div>

//               <div className="relative z-0 w-full mb-4 group">
//                 <Field 
//                   type={showPassword ? "text" : "password"} 
//                   name="password" 
//                   id="password" 
//                   autoComplete="off"
//                   className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
//                   placeholder=" " 
//                 />
//                 <label 
//                   htmlFor="password" 
//                   className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//                 >
//                   Password
//                 </label>
//                 <span 
//                   className="absolute right-3 top-3 cursor-pointer" 
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? 
//                     <svg className="w-6 h-6 text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 28 28">
//                       <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
//                       <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
//                     </svg>
//                   : 
//                     <svg className="w-6 h-6 text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 28 28">
//                       <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
//                     </svg>
//                   } 
//                 </span>
//                 <ErrorMessage name="password" component="div" className="text-red-600 text-xs" />
//               </div>

//               <div className="relative z-0 w-full mb-8 group">
//                 <Field 
//                   type={showConfirmPassword ? "text" : "password"} 
//                   name="confirmPassword" 
//                   id="confirmPassword" 
//                   autoComplete="off"
//                   className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
//                   placeholder=" " 
//                 />
//                 <label 
//                   htmlFor="confirmPassword" 
//                   className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//                 >
//                   Confirm Password
//                 </label>
//                 <span 
//                   className="absolute right-3 top-3 cursor-pointer" 
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 >
//                   {showConfirmPassword ? 
//                     <svg className="w-6 h-6 text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 28 28">
//                       <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
//                       <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
//                     </svg>
//                   : 
//                     <svg className="w-6 h-6 text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 28 28">
//                       <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
//                     </svg>
//                   } 
//                 </span>
//                 <ErrorMessage name="confirmPassword" component="div" className="text-red-600 text-xs" />
//               </div>

//               <div className="relative z-0 w-full mb-6 group">
//                 <Field 
//                   type="tel" 
//                   name="phone" 
//                   id="phone" 
//                   autoComplete="off"
//                   className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
//                   placeholder=" " 
//                 />
//                 <label 
//                   htmlFor="phone" 
//                   className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//                 >
//                   Phone
//                 </label>
//                 <ErrorMessage name="phone" component="div" className="text-red-600 text-xs" />
//               </div>

//               <button 
//                 type="submit" 
//                 className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
//               >
//                 Sign Up
//               </button>
//             </Form>
//           </Formik>

//           <div className="flex justify-center items-center mt-6">
//             <span className="text-sm">Already have an account?</span>
//             <Link to='/user/login' className="text-blue-600 text-sm font-semibold ml-2">Login</Link>
//           </div>
//         </div>
//       </div>

//       <div className="hidden md:flex md:w-1/2">
//         <img src={backgroundImage} alt="background" className="object-cover w-full h-full" />
//       </div>

//       <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
//     </div>
//   );
// };

// export default UserSignUp;































// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import backgroundImage from '../../assets/bg.jpg';
// import axios from 'axios';
// import { toast } from 'sonner';
// import * as Yup from 'yup';

// const UserSignUp = () => {
//   const navigate = useNavigate();
//   const [formErrors, setFormErrors] = useState({});
//   const [values, setValues] = useState({
//     full_name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     phone: '',
//   });
//   const baseURL = import.meta.env.VITE_BASE_URL;

//   const SignupSchema = Yup.object().shape({
//     full_name: Yup.string()
//       .min(3, 'Too Short!')
//       .matches(/^[A-Z][a-zA-Z]/, 'First letter should be capital')
//       .max(30, 'Too Long!')
//       .required('Full Name is required'),
//     email: Yup.string()
//       .email('Invalid email')
//       .required('Email is required'),
//     password: Yup.string()
//       .min(8, 'Password should be minimum 8 characters')
//       .matches(/[A-Z]/, 'Password should have at least one uppercase')
//       .matches(/[a-z]/, 'Password should have at least one lowercase')
//       .matches(/[0-9]/, 'Password should have at least one number')
//       .matches(/[!@#$%^&*]/, 'Password should have at least one special character')
//       .required('Password is required'),
//     confirmPassword: Yup.string()
//       .oneOf([Yup.ref('password'), null], 'Passwords must match')
//       .required('Confirm Password is required')
//       .nullable(),
//     phone: Yup.string().nullable(),
//   });

//   const handleChange = (e) => {
//     setValues({ ...values, [e.target.name]: e.target.value });
//     if (formErrors[e.target.name]) {
//       setFormErrors({ ...formErrors, [e.target.name]: null });
//     }
//   };

//   const handleOnSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await SignupSchema.validate(values, { abortEarly: false });

//       if (values.password !== values.confirmPassword) {
//         toast.error('Passwords do not match!');
//         return;
//       }

//       const formData = new FormData();
//       formData.append('full_name', values.full_name);
//       formData.append('email', values.email);
//       formData.append('password', values.password);
//       formData.append('phone', values.phone);

//       const response = await axios.post(baseURL + '/api/register/', formData);

//       if (response.status === 200) {
//         localStorage.setItem('email', values.email);
//         toast.success('OTP sent to your email');
//         navigate('/user/otp-verify');
//       }
//     } catch (error) {
//       if (error.name === 'ValidationError') {
//         const errors = {};
//         error.inner.forEach((e) => {
//           errors[e.path] = e.message;
//         });
//         setFormErrors(errors);
//       } else {
//         toast.error("Signup error");
//         setFormErrors({ general: 'An error occurred during signup. Please try again.' });
//       }
//     }
//   };

//   return (
//     <div
//       className="relative bg-cover bg-center h-screen flex items-center justify-center"
//       style={{ backgroundImage: `url(${backgroundImage})` }}
//     >
//       <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-70"></div>

//       <div className="relative z-10 container mx-auto p-6 max-w-3xl bg-black bg-opacity-60 rounded-lg">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="flex items-center justify-center">
//             <img src={backgroundImage} alt="Sign Up" className="w-full h-full object-cover rounded-lg" />
//           </div>
          
//           <div className="flex flex-col justify-center p-4">
//             <h2 className="text-4xl font-bold text-white mb-4 text-center">Sign Up for Connectify</h2>
            
//             {formErrors.general && (
//               <div className="alert alert-danger text-red-500 mb-4">{formErrors.general}</div>
//             )}
            
//             <form onSubmit={handleOnSubmit} className="space-y-4">
//               <div>
//                 <input
//                   type="text"
//                   name="full_name"
//                   placeholder="Full Name"
//                   value={values.full_name}
//                   onChange={handleChange}
//                   className={`w-full p-3 rounded-lg bg-gray-800 bg-opacity-70 text-white placeholder-gray-400 border ${formErrors.full_name ? 'border-red-500' : 'border-transparent'}`}
//                   required
//                 />
//                 {formErrors.full_name && (
//                   <p className="text-red-500 text-xs mt-1">{formErrors.full_name}</p>
//                 )}
//               </div>
              
//               <div>
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Email"
//                   value={values.email}
//                   onChange={handleChange}
//                   className={`w-full p-3 rounded-lg bg-gray-800 bg-opacity-70 text-white placeholder-gray-400 border ${formErrors.email ? 'border-red-500' : 'border-transparent'}`}
//                   required
//                 />
//                 {formErrors.email && (
//                   <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
//                 )}
//               </div>
              
//               <div>
//                 <input
//                   type="password"
//                   name="password"
//                   placeholder="Password"
//                   value={values.password}
//                   onChange={handleChange}
//                   className={`w-full p-3 rounded-lg bg-gray-800 bg-opacity-70 text-white placeholder-gray-400 border ${formErrors.password ? 'border-red-500' : 'border-transparent'}`}
//                   required
//                 />
//                 {formErrors.password && (
//                   <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
//                 )}
//               </div>
              
//               <div>
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   placeholder="Confirm Password"
//                   value={values.confirmPassword}
//                   onChange={handleChange}
//                   className={`w-full p-3 rounded-lg bg-gray-800 bg-opacity-70 text-white placeholder-gray-400 border ${formErrors.confirmPassword ? 'border-red-500' : 'border-transparent'}`}
//                   required
//                 />
//                 {formErrors.confirmPassword && (
//                   <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
//                 )}
//               </div>
              
//               <div>
//                 <input
//                   type="text"
//                   name="phone"
//                   placeholder="Phone Number"
//                   value={values.phone}
//                   onChange={handleChange}
//                   className="w-full p-3 rounded-lg bg-gray-800 bg-opacity-70 text-white placeholder-gray-400 border border-transparent"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="w-full py-3 rounded-lg bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white font-bold hover:opacity-80 transition-opacity duration-300"
//               >
//                 Sign Up
//               </button>
//             </form>
            
//             <div className="mt-4 text-center text-white">
//               Already have an account?{' '}
//               <Link to="/user" className="text-blue-400 hover:underline">
//                 Login
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserSignUp;
