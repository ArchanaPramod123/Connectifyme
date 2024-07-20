// import React, { useState } from 'react';
// import axios from 'axios';
// import styled from 'styled-components';
// import { useNavigate } from 'react-router-dom';

// const CreatePostContainer = styled.div`
//   max-width: 600px;
//   margin: 50px auto;
//   padding: 20px;
//   background-color: #fff;
//   border-radius: 8px;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
// `;

// const Form = styled.form`
//   display: flex;
//   flex-direction: column;
// `;

// const TextArea = styled.textarea`
//   margin-bottom: 10px;
//   padding: 10px;
//   border-radius: 4px;
//   border: 1px solid #ccc;
//   resize: none;
// `;

// const Input = styled.input`
//   margin-bottom: 10px;
//   padding: 10px;
//   border-radius: 4px;
//   border: 1px solid #ccc;
// `;

// const Button = styled.button`
//   padding: 10px;
//   background-color: #007bff;
//   color: #fff;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
// `;

// const CreatePostPage = () => {
//   const [body, setBody] = useState('');
//   const [image, setImage] = useState(null);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleImageChange = (e) => {
//     setImage(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append('body', body);
//     if (image) {
//       formData.append('img', image);
//     }

//     const token = localStorage.getItem('access');

//     try {
//       const response = await axios.post('http://localhost:8000/post/create-post/', formData, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (response.status === 201) { 
//         navigate('/user/home'); 
//       } else {
//         setError('Failed to create post');
//       }
//     } catch (error) {
//       setError('Error creating post: ' + error.response.data.detail);
//       console.error('Error creating post:', error);
//     }
//   };

//   return (
//     <CreatePostContainer>
//       <h2>Create a Post</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <Form onSubmit={handleSubmit}>
//         <TextArea
//           placeholder="What's on your mind?"
//           value={body}
//           onChange={(e) => setBody(e.target.value)}
//           required
//         />
//         <Input type="file" accept="image/*" onChange={handleImageChange} />
//         <Button type="submit">Post</Button>
//       </Form>
//     </CreatePostContainer>
//   );
// };

// export default CreatePostPage;


import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const CreatePostContainer = styled.div`
  max-width: 600px;
  margin: 50px auto;
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

const CreatePostPage = () => {
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('body', body);
    if (image) {
      formData.append('img', image);
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/post/create-post/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      navigate('/user/home');
    } catch (error) {
      setError('Error creating post');
    }
  };

  return (
    <CreatePostContainer>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <TextArea
          placeholder="What's on your mind?"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <Input type="file" onChange={(e) => setImage(e.target.files[0])} />
        {error && <p>{error}</p>}
        <Button type="submit">Create Post</Button>
      </Form>
    </CreatePostContainer>
  );
};

export default CreatePostPage;
