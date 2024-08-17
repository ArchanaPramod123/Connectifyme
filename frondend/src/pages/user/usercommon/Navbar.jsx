import {jwtDecode} from 'jwt-decode';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaSearch, FaBell, FaEnvelope, FaUserCircle, FaSignOutAlt, FaPlus,FaCompass } from 'react-icons/fa'; 
import UserLogout from '../UserLogout';
import CreatePostPage from '../post/CreatePost'; 
import SearchModal from '../SearchModel';
import { useSelector } from 'react-redux';

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const Logo = styled(Link)`
  color: black;
  font-size: 33px;
  margin-bottom: 40px;
  font-family: 'Style Script', cursive;
  text-decoration: none;
`;

const NavIcons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const LogoutButton = styled.div`
  display: flex;
  align-items: center;
  color: #181818;
  background: 0;
  margin: 15px 0;
  padding: 10px 20px;
  border-radius: 15px;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
  position: absolute;
  bottom: 20px;
  width: 80%;

  &:hover {
    background-color: #f0f0f0;
    color: #000;
  }

  svg {
    margin-right: 15px;
  }
`;

const NavIcon = styled.div`
  color: #181818;
  margin: 15px 0;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 80%;
  padding: 10px 20px;
  border-radius: 15px;
  transition: background 0.3s, color 0.3s;

  &:hover {
    background-color: #f0f0f0;
    color: #000;
  }

  a {
    text-decoration: none;
    color: inherit;
    display: flex;
    align-items: center;
    width: 100%;
  }

  span {
    margin-left: 10px;
  }
`;

const SidebarFooter = styled.div`
  margin-top: auto;
  margin-bottom: 20px;
  width: 80%;
`;

const NavBar = ({ fetchPosts }) => {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const {profile_picture } = useSelector((state) => state.auth);
  const backendUrl='http://127.0.0.1:8000';


  const openSearchModal = () => setIsSearchModalOpen(true);
  const closeSearchModal = () => setIsSearchModalOpen(false);


  const openCreatePostModal = () => {
    setIsCreatePostModalOpen(true);
  };

  const closeCreatePostModal = () => {
    setIsCreatePostModalOpen(false);
  };
  const accessToken = localStorage.getItem('access');
  let decoded = jwtDecode(accessToken);
  console.log("user decode",decoded.name);

  return (
    <SidebarContainer>
      <Logo to="/user/home">Connectify</Logo>
      <NavIcons>
        <NavIcon>
          <Link to="/user/home">
            <FaHome />
            <span>Home</span>
          </Link>
        </NavIcon>
        <NavIcon onClick={openSearchModal}>
          <FaSearch />
          <span>Search</span>
        </NavIcon>
        <NavIcon>
          <Link to="/user/notifications">
            <FaBell />
            <span>Notifications</span>
          </Link>
        </NavIcon>
        <NavIcon>
          <Link to="/user/messages">
            <FaEnvelope />
            <span>Messages</span>
          </Link>
         

        </NavIcon>
        <NavIcon>
          <Link to="/user/explore"> {/* Update link */}
            <FaCompass />
            <span>Explore</span>
          </Link>
        </NavIcon>
        <NavIcon onClick={openCreatePostModal}>
          <FaPlus />
          <span>Create Post</span>
        </NavIcon>
        {/* <NavIcon>
          <Link to="/user/profile">
            <FaUserCircle />
            <span>Profile</span>
          </Link>
          </NavIcon> */}


<NavIcon>
  <Link to="/user/profile">
    {profile_picture ? (
      <img
        src={`${backendUrl}${profile_picture}`}
        alt="Profile"
        style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          marginRight: '10px',
        }}
      />
    ) : (
      <FaUserCircle />
    )}
    <span>Profile</span>
  </Link>
</NavIcon>
        <NavIcon>
        <FaSignOutAlt />
          <UserLogout /> {/* Use UserLogout as a component */}
        </NavIcon>
      </NavIcons>
      {/* <SidebarFooter>
        <NavIcon>
          <FaSignOutAlt />
          <span>Logout</span>
        </NavIcon>
      </SidebarFooter> */}
      <CreatePostPage
        isOpen={isCreatePostModalOpen}
        onRequestClose={closeCreatePostModal}
        fetchPosts={fetchPosts}
      />
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={closeSearchModal}
      />
    </SidebarContainer>
  );
};

export default NavBar;
