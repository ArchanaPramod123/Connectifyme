import React, { useState } from 'react';
import admin_img from '../../assets/bg.jpg';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { set_Authentication } from '../../Redux/Authentication/authenticationSlice';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const AdminLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const baseURL = import.meta.env.VITE_BASE_URL;    const [formError, setFormError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(baseURL + '/api/adminlogin/', {
                email: formData.email,
                password: formData.password
            });

            if (response.status === 200) {
                console.log("hoi hoi")
                console.log("the respone of the admin ",response)
                const decodedToken = jwtDecode(response.data.access_token);
                
                localStorage.setItem('access', response.data.access_token);
                localStorage.setItem('refresh', response.data.refresh_token);
                console.log("the admin logintime",response.data.user_id);
                console.log("the admin logintime",response.data.name);
                console.log("the admin logintime",response.data.email);
                console.log("the admin logintime",response.data.isAdmin);

                
                
                dispatch(
                    set_Authentication({
                        id: response.data.user_id,
                        name: response.data.name,
                        email: response.data.email,
                        isAuthenticated: true,
                        isAdmin: response.data.isAdmin,
                    })
                );

                if (decodedToken.isAdmin) {
                    navigate('/admin/adminhome');
                } else {
                    navigate('/admin');
                }
            }
        } catch (error) {
            setFormError('Invalid email or password');
            console.log('error', error);
        }
    };

    return (
        <div className="relative bg-cover bg-center h-screen flex items-center justify-center" style={{ backgroundImage: `url(${admin_img})` }}>
            <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-80"></div>

            <div className="relative z-10 container mx-auto text-center text-white max-w-lg p-6 bg-black bg-opacity-50 rounded-lg">
                <h2 className="text-3xl font-bold mb-4">Admin Login</h2>
                <form onSubmit={handleLoginSubmit}>
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
                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
