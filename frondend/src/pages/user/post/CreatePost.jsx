import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import CropImage from "./crop/CropImage";
import { Toaster, toast } from "sonner";

const CreatePostContainer = styled.div`
  width: 600px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const TextArea = styled.textarea`
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  resize: none;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "0",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

const CreatePostPage = ({ isOpen, onRequestClose, fetchPosts }) => {
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    if (!isOpen) {
      setBody("");
      setImage(null);
      setCroppedImage(null);
      setError(null);
      setIsCropping(false);
    }
  }, [isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("body", body);
    if (croppedImage) {
      const file = await blobToFile(croppedImage, "croppedImage.jpg");
      formData.append("img", file);
    }

    try {
      await axios.post(baseURL + "/post/create-post/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      fetchPosts();
      toast.success("Post created successfully");
      navigate("/user/home");
      onRequestClose();
    } catch (error) {
      setError("Error creating post");
      toast.error("Failed to create post");
    }
  };

  const handleCropComplete = (croppedUrl) => {
    setCroppedImage(croppedUrl);
    setIsCropping(false);
  };

  const blobToFile = async (blobUrl, fileName) => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={modalStyles}
      ariaHideApp={false}
    >
      {isCropping ? (
        <CropImage
          imgUrl={image}
          aspectInit={1}
          setCroppedImg={handleCropComplete}
        />
      ) : (
        <CreatePostContainer>
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <TextArea
              placeholder="What's on your mind?"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows="4"
            />
            <div className="w-[300px] h-[300px]">
              <img className="w-full" src={croppedImage} alt="" />
            </div>
            <Input type="file" onChange={handleImageChange} />
            {error && <p>{error}</p>}
            <Button
              className="hover:bg-red-500 transition ease-in"
              type="submit"
            >
              Create Post
            </Button>
          </Form>
        </CreatePostContainer>
      )}
    </Modal>
  );
};

export default CreatePostPage;
