import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import PostDetailPage from "../profile/PostDetailPage";
import notificationSeenApi from "./notificationSeenApi";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 10px;
  margin-bottom: 15px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 500;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const NotificationItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eaeaea;
  &:last-child {
    border-bottom: none;
  }
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledTableRow = styled.tr`
  border-width: 0px;
  td {
    border-bottom: 0px none rgb(254, 254, 254);
    border-width: 0;
    width: 32%;
    &:hover {
      cursor: pointer;
      background-color: #ebeaea !important;
    }
  }
`;

const Notifications = ({
  isVisible,
  onClose,
  notification,
  removeNotification,
}) => {
  const navigate = useNavigate();
  const [showPostDetailModal, setShowPostDetailModal] = useState(false);
  const [postId, setPostId] = useState(null);

  const sortedNotifications = Array.isArray(notification)
    ? [...notification].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
      })
    : [];

  const seenNotifications = {};

  if (!isVisible) return null;

  const handleClose = () => {
    onClose();
  };

  const closePostModal = () => {
    setShowPostDetailModal(false);
  };

  const getNotificationMessage = (notification) => {
    const { notification_type, post, comment } = notification;

    if (post) {
      if (notification_type === "comment") {
        return "commented on your post";
      } else if (notification_type === "like") {
        return "liked your post";
      } else if (notification_type === "post") {
        return "created a new post";
      } else if (notification_type === "blocked") {
        return "blocked your post";
      }
    } else if (comment) {
      if (notification_type === "comment") {
        return "replied to your comment";
      }
    }
    return "has started following you";
  };

  const onClick = async (notificationId, email, notificationType, postId) => {
    try {
      if (
        notificationType === "like" ||
        notificationType === "comment" ||
        notificationType === "post"
      ) {
        if (!seenNotifications[notificationId]) {
          seenNotifications[notificationId] = true;
          setPostId(postId);
          setShowPostDetailModal(true);
        }
      } else if (notificationType === "blocked") {
        console.log("Blocked");
      } else {
        navigate(`/profile/${email}`);
      }
      await notificationSeenApi(notificationId);
      console.log("Notification id:", notificationId);
      console.log("Email:", email);
      console.log("Notification type id:", notificationType);
      console.log("Post id:", postId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Notifications</ModalTitle>
          <CloseButton onClick={handleClose}>&times;</CloseButton>
        </ModalHeader>
        {/* <div>
          {sortedNotifications.length === 0 ? (
            <p>No new notifications.</p>
          ) : (
            sortedNotifications.map((note, index) => (
              <NotificationItem key={index}>
                <div onClick={() => onClick(note.id, note.from_user.email, note.notification_type, note.post)}>
                  <p>
                    {note.notification_type === 'blocked'
                      ? 'Admin blocked your post'
                      : `${note.from_user.name} ${note.from_user.username} ${getNotificationMessage(note)}`}
                  </p>
                </div>
                <button onClick={() => removeNotification(note.id)}>Dismiss</button>
              </NotificationItem>
            ))
          )}
        </div> */}

        {sortedNotifications && sortedNotifications?.length > 0 ? (
          sortedNotifications.map((note, index) => (
            <StyledTableRow key={index}>
              {console.log("Notification:", note)}
              {console.log("postid:", note.post)}
              <td>
                <div
                  className="flex items-center"
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={`${note.from_user.profile_picture}`}
                    alt="User Display Pic"
                    style={{
                      width: "40px",
                      height: "40px",
                      marginRight: "10px",
                      borderRadius: "50%",
                    }}
                  />
                  <p
                    className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm public hover:bg-neutral-100 active:no-underline cursor-pointer"
                    onClick={() =>
                      onClick(
                        note.id,
                        note.from_user.email,
                        note.notification_type,
                        note.post
                      )
                    }
                    data-te-dropdown-item-ref
                  >
                    {note.notification_type === "blocked"
                      ? "Admin blocked your post"
                      : `${note.from_user.username} ${getNotificationMessage(
                          note
                        )}`}
                  </p>
                </div>
              </td>
            </StyledTableRow>
          ))
        ) : (
          <p>No notifications</p>
        )}
      </ModalContent>
      {showPostDetailModal && (
        <PostDetailPage
          postID={postId}
          onClose={closePostModal}
          isPostDetailOpen={showPostDetailModal}
        />
      )}
    </ModalOverlay>
  );
};

export default Notifications;
