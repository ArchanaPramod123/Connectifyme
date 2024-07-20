import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaSearch, FaBell, FaEnvelope, FaUserCircle, FaSignOutAlt, FaPlus } from 'react-icons/fa'; 
import UserLogout from '../UserLogout';

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
    display: flex;
    align-items: center;
    text-decoration: none;
    color: inherit;
    width: 100%;
  }
`;

const NavIconLabel = styled.span`
  margin-left: 15px;
  font-size: 18px;
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

const NavBar = () => {
  const logout = UserLogout(); // Get the logout function

  return (
    <SidebarContainer>
      <Logo to="/">Connectify</Logo>
      <NavIcons>
        <NavIcon>
          <Link to="/user/home">
            <FaHome />
            <NavIconLabel>Home</NavIconLabel>
          </Link>
        </NavIcon>
        <NavIcon>
          <Link to="/search">
            <FaSearch />
            <NavIconLabel>Search</NavIconLabel>
          </Link>
        </NavIcon>
        <NavIcon>
          <Link to="/notifications">
            <FaBell />
            <NavIconLabel>Notifications</NavIconLabel>
          </Link>
        </NavIcon>
        <NavIcon>
          <Link to="/messages">
            <FaEnvelope />
            <NavIconLabel>Messages</NavIconLabel>
          </Link>
        </NavIcon>
        <NavIcon>
          <Link to="/user/profile">
            <FaUserCircle />
            <NavIconLabel>Profile</NavIconLabel>
          </Link>
        </NavIcon>
        <NavIcon>
          <Link to="/user/create-post">
            <FaPlus />
            <NavIconLabel>Create Post</NavIconLabel>
          </Link>
        </NavIcon>
        <LogoutButton onClick={logout}> {/* Call logout on click */}
          <FaSignOutAlt />
          <NavIconLabel>Logout</NavIconLabel>
        </LogoutButton>
      </NavIcons>
    </SidebarContainer>
  );
};

export default NavBar;
