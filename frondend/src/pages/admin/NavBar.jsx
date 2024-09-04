import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { set_Authentication } from '../../Redux/Authentication/authenticationSlice';
import { BsGrid1X2Fill, BsPeopleFill, BsListCheck, BsMenuButtonWideFill, BsBoxArrowRight } from 'react-icons/bs';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');

    dispatch(set_Authentication({
      isAuthenticated: false,
      isAdmin: false,
    }));
    navigate('/admin');
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <aside className="w-64 bg-gray-800 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2">
            <li>
              <Link to="/admin/adminhome" className="flex items-center p-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded">
                <BsGrid1X2Fill className="mr-3" /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/adminhome/userlist" className="flex items-center p-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded">
                <BsPeopleFill className="mr-3" /> Users
              </Link>
            </li>
            <li>
              <Link to="/admin/adminhome/reports" className="flex items-center p-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded">
                <BsListCheck className="mr-3" /> Reports
              </Link>
            </li>
            <li>
              <Link to="/admin/adminhome/blockuser" className="flex items-center p-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded">
                <BsMenuButtonWideFill className="mr-3" /> Block Users
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-auto">
          <button onClick={handleLogout} className="flex items-center p-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded w-full">
            <BsBoxArrowRight className="mr-3" /> Logout
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Navbar;
