import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLogin from '../../pages/admin/AdminLogin';
import AdminHome from '../../pages/admin/AdminHome';

const AdminWrapper = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route path="/adminhome/*" element={<AdminHome />} />
    </Routes>
  );
};

export default AdminWrapper;
