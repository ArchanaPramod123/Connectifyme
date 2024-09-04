import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  FaHome,
  FaSearch,
  FaBell,
  FaEnvelope,
  FaUserCircle,
  FaSignOutAlt,
  FaPlus,
  FaCompass,
} from "react-icons/fa";
import UserLogout from "../UserLogout";
import CreatePostPage from "../post/CreatePost";
import SearchModal from "../SearchModel";
import { useSelector } from "react-redux";
import getNotificationApi from "../post/getNotificationsApi";
import Notifications from "../post/Notifications";

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
  font-family: "Style Script", cursive;
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [notification, setNotification] = useState([]);

  const { user_id, name } = useSelector((state) => state.auth);
  const WEBSOCKET_BASE_URL = import.meta.env.VITE_WEBSOCKET;

  const openSearchModal = () => setIsSearchModalOpen(true);
  const closeSearchModal = () => setIsSearchModalOpen(false);

  const openCreatePostModal = () => {
    setIsCreatePostModalOpen(true);
  };

  const closeCreatePostModal = () => {
    setIsCreatePostModalOpen(false);
  };
  const accessToken = localStorage.getItem("access");
  let decoded = jwtDecode(accessToken);
  console.log("user decode", decoded.name);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNotificationApi();
        setNotification(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (user_id) {
      fetchData();
    }
  }, [user_id]);

  useEffect(() => {
    if (user_id) {
      const accessToken = localStorage.getItem("access");
      const websocketProtocol =
        window.location.protocol === "https://" ? "wss://" : "ws://";
      const socket = new WebSocket(
        `${websocketProtocol}${WEBSOCKET_BASE_URL}/ws/notification/?token=${accessToken}`
      );

      socket.onopen = () => {
        console.log("websocket connection established");
      };

      socket.onmessage = (event) => {
        const newNotification = JSON.parse(event.data);
        console.log(newNotification);
        if (newNotification.type === "notification") {
          setNotification((prevNotifications) => [
            ...prevNotifications,
            newNotification.payload,
          ]);
        }
      };

      socket.onclose = (event) => {
        console.log("Websocket connection closed", event);
      };
      return () => {
        socket.close();
      };
    }
  }, [user_id]);

  const removeNotification = (notificationIdToRemove) => {
    setNotification((prevNotifications) =>
      prevNotifications.filter(
        (notification) => notification.id !== notificationIdToRemove
      )
    );
  };

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
        {/* <NavIcon>
          <Link to="/user/notifications">
            <FaBell />
            <span>Notifications</span>
          </Link>
        </NavIcon> */}

        <NavIcon onClick={() => setShowNotifications(true)}>
          <FaBell />
          <span>Notification</span>
          <span
            className={`text-xs ml-2 text-blue-700 align-top${
              notification?.length === 0
                ? ""
                : "border border-black align-top rounded-full"
            }`}
          >
            {" "}
            {notification?.length === 0 ? "" : notification?.length}{" "}
          </span>
        </NavIcon>

        <NavIcon>
          <Link to="/user/messages">
            <FaEnvelope />
            <span>Messages</span>
          </Link>
        </NavIcon>
        <NavIcon>
          <Link to="/user/explore">
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
            {/* {profile_picture ? (
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
    ) : ( */}
            <FaUserCircle />
            {/* )} */}
            <span>Profile</span>
          </Link>
        </NavIcon>
        <NavIcon>
          <FaSignOutAlt />
          <UserLogout />
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
      <SearchModal isOpen={isSearchModalOpen} onClose={closeSearchModal} />
      <Notifications
        isVisible={showNotifications}
        onClose={() => setShowNotifications(false)}
        notification={notification}
        removeNotification={removeNotification}
      />
    </SidebarContainer>
  );
};

export default NavBar;
