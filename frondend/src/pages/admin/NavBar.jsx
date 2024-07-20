import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { set_Authentication } from '../../Redux/Authentication/authenticationSlice'; 

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
      <aside className="w-64 bg-gray-800 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          {/* <button className="text-gray-400 hover:text-gray-200">
            
          </button> */}
        </div>
        <nav>
          <ul className="space-y-2">
            <li className="p-2">
              <Link to="/admin/adminhome" className="flex items-center space-x-2 hover:text-gray-200">
                <i className="material-icons">dashboard</i>
                
              </Link>
            </li>
            <li className="p-2">
              <Link to="/admin/adminhome/userlist" className="flex items-center space-x-2 hover:text-gray-200">
                <i className="material-icons">people</i>
              </Link>
            </li>
            <li className="p-2">
              <Link to="/admin/adminhome/reports" className="flex items-center space-x-2 hover:text-gray-200">
                <i className="material-icons">report</i>
              </Link>
            </li>
            <li className="p-2">
              <Link to="/admin/adminhome/blockuser" className="flex items-center space-x-2 hover:text-gray-200">
                <i className="material-icons">block</i>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-auto p-2">
          <button onClick={handleLogout} className="flex items-center space-x-2 hover:text-gray-200">
            <i className="material-icons">logout</i>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Navbar;
