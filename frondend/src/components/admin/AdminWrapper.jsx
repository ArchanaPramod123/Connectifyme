import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLogin from '../../pages/admin/AdminLogin';
import AdminHome from '../../pages/admin/AdminHome';
import AdminUserProfilePage from '../../pages/admin/AdminUserProfile';
import AdminReportPosts from '../../pages/admin/AdminReportPosts';
const AdminWrapper = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route path="/adminhome/*" element={<AdminHome />} />
      <Route path="/user/:userId" element={<AdminUserProfilePage></AdminUserProfilePage>} />
      <Route path="/admin/reports" element={<AdminReportPosts />} /> 
    </Routes>
  );
};

export default AdminWrapper;
