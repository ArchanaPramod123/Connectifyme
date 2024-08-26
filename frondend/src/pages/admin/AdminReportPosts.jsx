import React, { useState, useEffect } from 'react';
import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000';
const AdminReportPosts = () => {
    const [reports, setReports] = useState([]); 

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = localStorage.getItem('access');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const response = await axios.get(`${baseUrl}/api/admin/reports/`, config);
                
                if (Array.isArray(response.data)) {
                    setReports(response.data); 
                } else {
                    console.error('Unexpected response data:', response.data);
                    setReports([]); 
                }
            } catch (error) {
                console.error('Error fetching reports:', error);
                setReports([]); 
            }
        };

        fetchReports();
    }, []);

    const handleBlockUnblock = async (postId, isActive) => {
        const token = localStorage.getItem('access');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const action = isActive ? 'block' : 'unblock';
            await axios.patch(`${baseUrl}api/admin/reports/${postId}/`, { action }, config);
            // Update the reports list after blocking/unblocking
            setReports(prevReports =>
                prevReports.map(report =>
                    report.post.id === postId ? { ...report, is_active: !isActive } : report
                )
            );
        } catch (error) {
            console.error('Error updating post status:', error);
        }
    };

    return (
        <div className="flex-grow bg-gray-100 p-4 overflow-auto">
            <h2 className="text-2xl font-bold mb-4">Report Post List</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Report Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Post Owner</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Reporter</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Reason</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Created At</th>
                            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">active</th> */}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {reports.length > 0 ? (
                            reports.map((report) => (
                                // console.log("the post image is",report.post_image);
                              
                                <tr key={report.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {/* <img src={report.post_image} alt="Post" className="h-12 w-12 rounded-full" />
                                         */}
                                         <img 
  src={`${baseUrl}${report.post_image}`} 
  alt="Post" 
  className="h-20 w-20" 
/>

                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{report.post_owner}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{report.reporter_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{report.reason}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{report.created_at}</td>
                                    {/* <td className="px-6 py-4 whitespace-nowrap">
                                    {report.is_active ? 'Active' : 'Blocked'}
                                </td> */}


                                
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleBlockUnblock(report.post.id, report.is_active)}
                                            className={`px-4 py-2 rounded ${
                                                report.is_active ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                                            }`}
                                        >
                                            {report.is_active ? 'Block' : 'Unblock'}
                                        </button>
                                    </td>
                                </tr>
                                
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center">
                                    No reports found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminReportPosts;
