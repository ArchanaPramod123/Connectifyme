import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './NavBar';
import Dashboard from './Dashboard';
import UserList from './UserList';
import Reports from './AdminReportPosts';
import BlockUser from './BlockUser';

const AdminHome = () => {
  return (
    <div className="flex">
      <Navbar />
      <div className="w-full">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/userlist" element={<UserList />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/blockuser" element={<BlockUser />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminHome;
