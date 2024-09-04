import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const UserList = () => {
    const [users, setUsers] = useState([]);
     const baseURL = import.meta.env.VITE_BASE_URL;    const navigate = useNavigate();

    const handleViewProfile = (userId) => {
        navigate(`/admin/user/${userId}`);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('access');
                const response = await axios.get(baseURL+'/api/user-list/', {
                                        headers: {
                                            Authorization: `Bearer ${token}`
                                        }
                                    });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleBlockUnblock = async (userId, isActive) => {
        try {
            const token = localStorage.getItem('access');
            const url = `${baseURL}/api/user-block-unblock/${userId}/`;
            const response = await axios.patch(url, { is_active: !isActive }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(users.map(user =>
                user.id === userId ? { ...user, is_active: !user.is_active } : user
            ));
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    return (
        <div className="flex-grow bg-gray-100 p-4 overflow-auto">
            <h2 className="text-2xl font-bold mb-4">User List</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Profile Picture</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Full Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Username</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Reported Post Count</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img
                                        src={`${baseURL}${user.profile_picture}` || '/default-profile.png'}
                                        alt="Profile"
                                        className="h-10 w-10 rounded-full"
                                    />
                                </td>
                                <td
                                    className="px-6 py-4 whitespace-nowrap cursor-pointer text-blue-500 hover:underline"
                                    onClick={() => handleViewProfile(user.id)}
                                >
                                    {user.full_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.reported_post_count}
                                    {user.reported_post_count > 5 && (
                                        <span className="text-red-500 ml-2">(User has more than 5 reported posts!Block user)</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.is_active ? 'Active' : 'Blocked'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleBlockUnblock(user.id, user.is_active)}
                                        className={`px-4 py-2 rounded ${user.is_active ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                                            }`}
                                    >
                                        {user.is_active ? 'Block' : 'Unblock'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;
