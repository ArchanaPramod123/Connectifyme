import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const AlertOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
`;

const AlertBox = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  text-align: center;
`;

const Button = styled.button`
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const IncomingVideoCallAlert = ({ caller, roomId, onAccept, onDecline }) => {
  const navigate = useNavigate();

  const handleAccept = () => {
    onAccept();
    navigate(`/user/video-call/${roomId}`);
  };

  const handleDecline = () => {
    onDecline();
  };

  return (
    <AlertOverlay>
      <AlertBox>
        <h2>Incoming Video Call</h2>
        <p>{caller} is calling you.</p>
        <div>
          <Button onClick={handleAccept}>Accept</Button>
          <Button onClick={handleDecline}>Decline</Button>
        </div>
      </AlertBox>
    </AlertOverlay>
  );
};

export default IncomingVideoCallAlert;
