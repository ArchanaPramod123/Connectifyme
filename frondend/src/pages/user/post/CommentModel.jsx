import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaEllipsisV } from "react-icons/fa";
import axios from "axios";
import styled from "styled-components";

const ModalBackground = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 50%;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: gray;
  cursor: pointer;
`;

const Form = styled.form`
  display: flex;
  margin-bottom: 20px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
`;

const CommentSection = styled.div`
  max-height: 300px;
  overflow-y: auto;
  padding-right: 15px; /* space for the scrollbar */
  margin-right: -15px; /* hide the scrollbar */
`;

const CommentContainer = styled.div`
  border-top: 1px solid #ccc;
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CommentContent = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const CommentText = styled.div`
  display: flex;
  flex-direction: column;
  word-break: break-word;
`;

const UserName = styled.span`
  font-weight: bold;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
`;

const Menu = styled.div`
  position: absolute;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: ${(props) => (props.show ? "block" : "none")};
`;

const MenuItem = styled.button`
  background: none;
  border: none;
  padding: 10px;
  width: 100%;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const EditForm = styled.form`
  display: flex;
  margin-bottom: 20px;
`;

const EditInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
`;

const EditSubmitButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
`;

const EmojiPickerContainer = styled.div`
  position: absolute;
  bottom: 60px;
  right: 0;
  z-index: 1000;
`;

const CommentModal = ({ postId, isOpen, onClose }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [showMenu, setShowMenu] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  const getToken = () => {
    return localStorage.getItem("access");
  };

  useEffect(() => {
    if (isOpen) {
      axios
        .get(`http://127.0.0.1:8000/post/comments/${postId}/`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setComments(response.data);
        })
        .catch((error) => {
          console.error("Error fetching comments:", error);
        });
    }
  }, [isOpen, postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/post/comment-post/${postId}/`,
        { body: comment },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setComments(response.data);
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/post/comment-delete/${commentId}/`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleUpdateComment = (commentId, currentText) => {
    setEditingComment(commentId);
    setEditCommentText(currentText);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/post/comment-update/${editingComment}/`,
        { body: editCommentText },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setComments(
        comments.map((comment) =>
          comment.id === editingComment ? response.data : comment
        )
      );
      setEditingComment(null);
      setEditCommentText("");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackground>
      <ModalContainer>
        <div className="w-[750px] h-[400px]">
          <div className="flex justify-end">
            <CloseButton onClick={onClose}>&times;</CloseButton>
          </div>
          {editingComment ? (
            <EditForm onSubmit={handleEditSubmit}>
              <EditInput
                type="text"
                value={editCommentText}
                onChange={(e) => setEditCommentText(e.target.value)}
                placeholder="Edit your comment"
              />
              <EditSubmitButton type="submit">Update</EditSubmitButton>
            </EditForm>
          ) : (
            <Form onSubmit={handleCommentSubmit}>
              <Input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment"
              />
              <SubmitButton type="submit">Comment</SubmitButton>
            </Form>
          )}
          <CommentSection>
            {comments.map((comment) => (
              <CommentContainer key={comment.id}>
                <CommentContent>
                  {comment.profile_picture ? (
                    <ProfileImage
                      src={`http://127.0.0.1:8000${comment.profile_picture}`}
                      alt="Profile"
                    />
                  ) : (
                    <ProfileImage
                      src="path/to/default/profile/picture.jpg"
                      alt="Default Profile"
                    />
                  )}
                  <CommentText>
                    <UserName>{comment.user_full_name}</UserName>
                    <p>{comment.body}</p>
                    <span className="text-gray-500 text-sm">
                      {comment.created_time} ago
                    </span>
                  </CommentText>
                </CommentContent>
                <MenuButton
                  onClick={() =>
                    setShowMenu(comment.id === showMenu ? null : comment.id)
                  }
                >
                  <FaEllipsisV />
                  <Menu show={comment.id === showMenu}>
                    <MenuItem
                      onClick={() =>
                        handleUpdateComment(comment.id, comment.body)
                      }
                    >
                      <FaEdit /> Update
                    </MenuItem>
                    <MenuItem onClick={() => handleDeleteComment(comment.id)}>
                      <FaTrash /> Delete
                    </MenuItem>
                  </Menu>
                </MenuButton>
              </CommentContainer>
            ))}
          </CommentSection>
        </div>
      </ModalContainer>
    </ModalBackground>
  );
};

export default CommentModal;
