import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { useSelector } from 'react-redux';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
`;

const ChatHeader = styled.div`
  padding: 20px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ddd;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: scroll;
  background-color: #fff;
`;

const ChatInputContainer = styled.div`
  padding: 20px;
  border-top: 1px solid #ddd;
  background-color: #f9f9f9;
`;

const ChatInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 16px;
`;

const Chat = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [socket, setSocket] = useState(null);
  
  const accessToken = localStorage.getItem('access');
  const user = jwtDecode(accessToken);
  const userId = useSelector(state => state.authentication_user.user_id);
  const baseURL = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${roomId}/`);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'chat_message') {
        setMessages(prevMessages => [...prevMessages, data]);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [roomId]);

  const handleSendMessage = () => {
    if (messageInput.trim() && socket) {
      socket.send(JSON.stringify({
        message: messageInput,
      }));
      setMessageInput('');
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <h3>Chat Room {roomId}</h3>
      </ChatHeader>
      <ChatMessages>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender_email}:</strong> {msg.message}
            <small>{msg.created}</small>
          </div>
        ))}
      </ChatMessages>
      <ChatInputContainer>
        <ChatInput 
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message here..."
        />
      </ChatInputContainer>
    </ChatContainer>
  );
};

export default Chat;
