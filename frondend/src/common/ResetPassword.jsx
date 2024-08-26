// import React, { useState, useEffect } from 'react';
// // import f_pass from '../../assets/forgot_pass.svg';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Formik, Field, Form, ErrorMessage } from 'formik';
// import { ResetPasswordSchema, initialValues } from './ResetValidation';
// import { toast } from 'react-toastify';

// function ResetPassword() {
//   const { id } = useParams();
//   const [formError, setFormError] = useState('');
//   const baseURL = 'http://127.0.0.1:8000/'// Ensure this is set in your .env file
//   const navigate = useNavigate();

//   const handleSubmit = async (values, { setSubmitting }) => {
//     const formData = new FormData();
//     formData.append('password', values.password);
//     formData.append('id', id);

//     try {
//       const response = await axios.post(`${baseURL}api/reset_password/${id}/`, formData);
//       console.log("the reset password time response",response);
      

//       if (response.status === 200) {
//         setFormError('');
//         toast.success('Password reset successful!', {
//           position: "top-center",
//         });
//         navigate('/user');
//       } else {
//         setFormError('Something went wrong. Please try again.');
//       }
//     } catch (error) {
//       setFormError('Error resetting password. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex w-full h-screen bg-blue-50">
//       <div className="hidden md:inline md:w-2/5">
//         <div className="mt-16 mx-4 md:w-full">
//           <h3 className="font-sans text-3xl font-bold drop-shadow-md text-blue-800">Find your Dream Job Now</h3>
//           <p className="text-blue-500 font-semibold">5 lakh+ jobs for you to explore</p>
//         </div>
//         {/* <div className="flex justify-center">
//           <img src={f_pass} alt="Forgot Password" className="w-96" />
//         </div> */}
//       </div>
//       <div className="w-full h-screen md:w-3/5 flex justify-end">
//         <div className="bg-white w-full h-full md:rounded-l-lg shadow-2xl">
//           <div className="flex h-full">
//             <div className="flex items-center justify-center w-full">
//               <div className="flex items-center">
//                 <Formik
//                   initialValues={initialValues}
//                   validationSchema={ResetPasswordSchema}
//                   onSubmit={handleSubmit}
//                 >
//                   {({ errors, touched, isSubmitting }) => (
//                     <Form className="flex flex-col w-full h-full pb-6 text-center">
//                       <p className="mb-4 text-grey-700">Reset Your Password</p>
//                       <div className="flex items-center mb-3">
//                         <hr className="h-0 border-b border-solid border-grey-500 grow" />
//                       </div>
//                       <Field
//                         id="password"
//                         name="password"
//                         type="password"
//                         placeholder="New Password"
//                         className={`flex items-center w-full px-4 py-3 ${errors.password && touched.password ? 'border-red-500' : 'mb-5'} mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl`}
//                       />
//                       <ErrorMessage name='password' component='div' className='text-red-500 text-sm mb-2' />

//                       <Field
//                         id="confirm_password"
//                         name="confirm_password"
//                         type="password"
//                         placeholder="Confirm New Password"
//                         className={`flex items-center w-full px-4 py-3 mr-2 text-sm font-medium ${errors.confirm_password && touched.confirm_password ? 'border-red-500' : 'mb-5'} outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl`}
//                       />
//                       <ErrorMessage name='confirm_password' component='div' className='text-red-500 text-sm mb-2' />

//                       {formError && (
//                         <div className='flex justify-start mb-5 pl-3 text-red-600'>
//                           <p>{formError}</p>
//                         </div>
//                       )}

//                       <button
//                         type='submit'
//                         disabled={isSubmitting}
//                         className="w-full px-4 py-3 mb-3 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500"
//                       >
//                         Submit
//                       </button>
//                     </Form>
//                   )}
//                 </Formik>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ResetPassword;














import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { ResetPasswordSchema, initialValues } from './ResetValidation';
import { toast } from 'react-toastify';
import backgroundImage from '../assets/bg.jpg'; 

function ResetPassword() {
  const { id } = useParams();
  const [formError, setFormError] = useState('');
  const baseURL = 'http://127.0.0.1:8000/';
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append('password', values.password);
    formData.append('id', id);

    try {
      const response = await axios.post(`${baseURL}api/reset_password/${id}/`, formData);
      if (response.status === 200) {
        setFormError('');
        toast.success('Password reset successful!', {
          position: "top-center",
        });
        navigate('/user');
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    } catch (error) {
      setFormError('Error resetting password. Please try again.');
    } finally {
      setSubmitting(false);
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
        <Formik
          initialValues={initialValues}
          validationSchema={ResetPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <Field
                  id="password"
                  name="password"
                  type="password"
                  placeholder="New Password"
                  className={`w-full p-3 rounded-lg bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 ${errors.password && touched.password ? 'border-red-500' : ''}`}
                />
                <ErrorMessage name='password' component='div' className='text-red-500 text-sm mb-2' />
              </div>

              <div className="mb-4">
                <Field
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  placeholder="Confirm New Password"
                  className={`w-full p-3 rounded-lg bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 ${errors.confirm_password && touched.confirm_password ? 'border-red-500' : ''}`}
                />
                <ErrorMessage name='confirm_password' component='div' className='text-red-500 text-sm mb-2' />
              </div>

              {formError && (
                <div className='flex justify-start mb-5 pl-3 text-red-600'>
                  <p>{formError}</p>
                </div>
              )}

              <button
                type='submit'
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default ResetPassword;
