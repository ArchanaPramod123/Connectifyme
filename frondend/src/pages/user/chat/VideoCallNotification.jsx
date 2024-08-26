import React from 'react';

const VideoCallNotification = ({ details, onAccept, onDecline }) => (
    <div className="notification-container">
        <p>{`${details.caller} is calling you...`}</p>
        <button onClick={onAccept}>Accept</button>
        <button onClick={onDecline}>Decline</button>
    </div>
);

export default VideoCallNotification;
