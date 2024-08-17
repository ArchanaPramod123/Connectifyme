import React, { useEffect, useState } from 'react';
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify } from 'react-icons/bs';
import { BsPeopleFill, BsListCheck, BsMenuButtonWideFill } from 'react-icons/bs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AdminNavBar from './NavBar';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
    const [totalUsers, setTotalUsers] = useState([]);
    const [totalPosts, setTotalPosts] = useState([]);
    const [totalReportedPosts, setTotalReportedPosts] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const users = await userListApi();
                setTotalUsers(users);

                const posts = await postsListApi();
                setTotalPosts(posts);

                const reportedPosts = await reportedPostsListApi();
                setTotalReportedPosts(reportedPosts);

                setChartData([
                    { name: 'Total Users', value: users.length },
                    { name: 'Total Posts', value: posts.length },
                    { name: 'Total Reported Posts', value: reportedPosts.length },
                ]);

                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, []);

    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                {/* <AdminNavBar /> */}
                <div className="md:col-span-3">
                    <header className="flex justify-between items-center p-4 bg-gray-800 shadow-md">
                        <button className="md:hidden text-gray-400">
                            <BsJustify size={24} />
                        </button>
                        <div className="hidden md:flex items-center space-x-4">
                            <BsSearch size={24} className="text-gray-400" />
                        </div>
                        <div className="flex items-center space-x-4">
                            <BsFillBellFill size={24} className="text-gray-400" />
                            <BsFillEnvelopeFill size={24} className="text-gray-400" />
                            <BsPersonCircle size={24} className="text-gray-400" />
                        </div>
                    </header>
                    <main className="p-6">
                        <h3 className="text-xl font-semibold mb-6">DASHBOARD</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-blue-600 p-4 rounded-md shadow-md flex flex-col justify-between">
                                <div className="flex justify-between items-center">
                                    <h3>POSTS</h3>
                                    <BsListCheck size={30} className="text-white" />
                                </div>
                                <h1 className="text-2xl font-bold mt-4">{totalPosts?.length || 0}</h1>
                            </div>
                            <div className="bg-orange-500 p-4 rounded-md shadow-md flex flex-col justify-between">
                                <div className="flex justify-between items-center">
                                    <h3>USERS</h3>
                                    <BsPeopleFill size={30} className="text-white" />
                                </div>
                                <h1 className="text-2xl font-bold mt-4">{totalUsers?.length || 0}</h1>
                            </div>
                            <div className="bg-red-600 p-4 rounded-md shadow-md flex flex-col justify-between">
                                <div className="flex justify-between items-center">
                                    <h3>REPORTS</h3>
                                    <BsMenuButtonWideFill size={30} className="text-white" />
                                </div>
                                <h1 className="text-2xl font-bold mt-4">{totalReportedPosts?.length || 0}</h1>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                            <div className="bg-gray-800 p-4 rounded-md shadow-md">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart
                                        data={chartData}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="value" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-md shadow-md">
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart
                                        data={chartData}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
