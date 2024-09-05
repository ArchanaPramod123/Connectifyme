// import React, { useEffect, useRef, useState } from "react";
// import styled from "styled-components";
// import { BASE_URL } from "../../../utils/constants";
// import NavBar from "../usercommon/Navbar";
// import { useSelector } from "react-redux";
// import axios from 'axios'
// import { useNavigate } from "react-router-dom";
// import contactListApi from "../chat/apiCall/contactListApi";
// import getChatMessageApi from "../chat/apiCall/getChatMessagesApi";
// import messageSeenApi from "../chat/apiCall/messageSeenApi";
// import IncomingVideoCallAlert from "./IncomingVideoCallAlert";

// const MessagePage = styled.div`
//   display: flex;
//   height: 100vh;
// `;

// const NavContainer = styled.div`
//   width: 16.5%;
//   background-color: #faf7f4;
//   top: 0;
//   bottom: 0;
//   position: fixed;
//   border-right: double;
// `;

// const MessageContentWrapper = styled.div`
//   width: 100%;
//   display: flex;
//   flex-direction: column; /* Display children in a column */
//   padding-left: 16.5%;
//   background-color: #faf7f4;
// `;

// const MessageContainer = styled.div`
//   margin: 0;
//   flex: 0.8;
//   display: grid;
//   grid-template-columns: 1fr 2fr;
//   font-family: Arial, Helvetica, sans-serif;
//   padding: 0em 0em 2em 5em;
//   margin-top: 4em;
//   margin-bottom: 2em;
// `;

// const ProfileInfo = styled.div`
//   .name {
//     font-size: 1.5em;
//     margin-bottom: 0;
//     font-weight: 600;
//   }

//   .about {
//     font-size: 1em;
//     color: #545454;
//   }

//   .stats {
//     margin-left: -17px;
//   }

//   .profile-content {
//     margin-left: 1rem; /* Adjust the margin as needed */
//   }
// `;

// const ChatInput = styled.div`
//   position: fixed;
//   bottom: 25px;
//   width: 44%;
//   background-color: #c2c2c2;
//   padding: 1rem;
//   border-radius: 1rem;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   z-index: 1000;
// `;

// const TopBar = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 1em;
//   border-bottom: 1px solid #ccc;
// `;

// const Messages = () => {
//   const { user_id, name, email, isAuthenticated } = useSelector(
//     (state) => state.auth
//   );
//   const [profiles, setProfiles] = useState([]);
//   const [ws, setWs] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [bg, setBg] = useState(false);
//   const [dpChat, setDpChat] = useState(null);
//   const [videoCallDetails, setVideoCallDetails] = useState(null);
//   const [profilePicture, setProfilePicture] = useState("");

//   const navigate = useNavigate();
//   useEffect(() => {
//     const fetchProfilePicture = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/api/profile_pic/`, {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem("access")}`
//           }
//         });
//         setProfilePicture(response.data.profile_picture);
//         console.log("zzzzzzzzzzzzzzzzzzzzzzzzzz");

//       } catch (error) {
//         console.error("Error fetching profile picture:", error);
//       }
//     };

//     fetchProfilePicture();
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const result = await contactListApi();
//         setProfiles(result.results);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     if (isAuthenticated) {
//       fetchData();
//     }
//   }, [isAuthenticated]);

//   useEffect(() => {
//     if (ws) {
//       ws.onmessage = (event) => {
//         console.log("teh event data WebSocket message:", event.data);
//         const message = JSON.parse(event.data);
//         console.log("Received WebSocket message:", message);

//         if (message.type === "video_call" && message.callee === email) {
//           setVideoCallDetails({
//             caller: message.caller,
//             roomId: message.room_id,
//           });
//         } else if (message.type === "chat_message") {
//           setMessages((prevMessages) => [...prevMessages, message]);
//         } else {
//           console.error("Unknown message type received");
//         }
//       };
//     }
//   }, [ws, email]);

//   const handleAcceptCall = () => {
//     navigate(`/user/video-call/${videoCallDetails.roomId}`);
//   };

//   const handleDeclineCall = () => {
//     setVideoCallDetails(null);
//   };

//   const ref = useChatScroll(messages);

//   function useChatScroll(dep) {
//     const ref = useRef();
//     useEffect(() => {
//       if (ref.current) {
//         ref.current.scrollTop = ref.current.scrollHeight;
//       }
//     }, [dep]);
//     return ref;
//   }

//   const handleSendMessage = () => {
//     if (ws && inputMessage.trim() !== "") {
//       ws.send(JSON.stringify({ message: inputMessage }));
//       setInputMessage("");
//     }
//   };

//   const joinChatroom = async (chatroomId, userId, dp_image) => {
//     try {
//       setBg(true);
//       setDpChat(dp_image);

//       const accessToken = localStorage.getItem("access");
//       const websocketProtocol =
//         window.location.protocol === "https:" ? "wss://" : "ws://";
//       const wsUrl = `${websocketProtocol}127.0.0.1:8000/ws/chat/${chatroomId}/?token=${accessToken}`;
//       const newChatWs = new WebSocket(wsUrl);

//       newChatWs.onopen = async () => {
//         const previousMessages = await getChatMessageApi(chatroomId);
//         setMessages(previousMessages);

//         await messageSeenApi(userId);
//         setProfiles((prevProfiles) =>
//           prevProfiles.map((profile) =>
//             profile.id === chatroomId
//               ? { ...profile, unseen_message_count: 0 }
//               : profile
//           )
//         );
//       };

//       newChatWs.onmessage = (event) => {
//         const message = JSON.parse(event.data);
//         console.log("the event data-----------", event.data);
//         console.log("the video cal------------", message.type);

//         if (message.type === "video_call" && message.callee === email) {
//           setVideoCallDetails({
//             caller: message.caller,
//             roomId: message.room_id,
//           });
//         } else {
//           setMessages((prevMessages) => [...prevMessages, message]);
//         }
//       };

//       setWs(newChatWs);
//     } catch (error) {
//       console.error("Failed to join chatroom:", error);
//     }
//   };

//   const handleVideoCall = (calleeEmail, chatroomId) => {
//     console.log("Chatroom ID:", chatroomId);
//     if (ws) {
//       const callerEmail = email;

//       ws.send(
//         JSON.stringify({
//           type: "video_call",
//           caller: callerEmail,
//           callee: calleeEmail,
//           room_id: chatroomId,
//         })
//       );

//       navigate(`/user/video-call/${chatroomId}`);
//     } else {
//       console.error("WebSocket connection is not established.");
//     }
//   };

//   if (!isAuthenticated) {
//     navigate("/");
//   }

//   return (
//     <MessagePage>
//       <NavContainer>
//         <NavBar />
//       </NavContainer>
//       <MessageContentWrapper>
//         <div className="flex h-screen  p-2">
//           <div className="flex flex-col flex-grow w-3/5 mt-5 p-1 m-2 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.27),0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-lg overflow-hidden">
//             {bg ? (
//               <>
//                 <div
//                   ref={ref}
//                   className="flex flex-col flex-grow h-0 p-4 overflow-auto mb-5"
//                 >
//                   {messages?.length > 0 ? (
//                     messages?.map((message, index) =>
//                       message?.sender_email === email ? (
//                         <div
//                           key={index}
//                           className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end"
//                         >
//                           <div>
//                             <div className="bg-green-500 text-white p-1 rounded-l-lg rounded-br-lg">
//                               <p className="text-sm m-1">
//                                 {message.message
//                                   ? message.message
//                                   : message.text}
//                               </p>
//                             </div>
//                             <span className="text-xs text-gray-500 leading-none">
//                               {message.created} ago
//                             </span>
//                           </div>
//                           <img
//                             className="flex-shrink-0 h-10 w-10 rounded-full"
//                             src={`${BASE_URL}${profilePicture}`}
//                             alt="authentication_user"
//                           />
//                         </div>
//                       ) : (
//                         <div
//                           key={index}
//                           className="flex w-full mt-2 space-x-3 max-w-xs"
//                         >
//                           <img
//                             className="flex-shrink-0 h-10 w-10 rounded-full"
//                             src={`${BASE_URL}` + dpChat}
//                             alt="authentication_user"
//                           />
//                           <div>
//                             <div className="bg-gray-300 p-1 rounded-r-lg rounded-bl-lg">
//                               <p className="text-sm m-1">
//                                 {message.message
//                                   ? message.message
//                                   : message.text}
//                               </p>
//                             </div>
//                             <span className="text-xs text-gray-500 leading-none">
//                               {message.created} ago
//                             </span>
//                           </div>
//                         </div>
//                       )
//                     )
//                   ) : (
//                     <div className="flex flex-col flex-grow p-4 overflow-auto">
//                       <p className="mx-auto my-auto ">No messages yet.</p>
//                     </div>
//                   )}

//                   <div className="flex-grow"></div>

//                   <ChatInput>
//                     <div className="relative flex w-full flex-wrap items-stretch">
//                       <input
//                         type="text"
//                         value={inputMessage}
//                         onChange={(e) => setInputMessage(e.target.value)}
//                         className="relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid border-[#4b2848] bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
//                         aria-describedby="button-addon1"
//                       />
//                       <button
//                         className="relative z-[2] flex items-center rounded-r bg-primary px-6 py-2.5 text-xs font-medium uppercase leading-tight text-[#4b2848] shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
//                         type="button"
//                         id="button-addon1"
//                         onClick={handleSendMessage}
//                       >
//                         Send
//                       </button>
//                     </div>
//                   </ChatInput>
//                 </div>
//               </>
//             ) : (
//               <div className="flex flex-col flex-grow p-4 overflow-auto">
//                 <p className="mx-auto my-auto ">No messages yet.</p>
//               </div>
//             )}
//           </div>

//           <div className="flex w-2/5 flex-grow mt-5 p-2 m-2 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.27),0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-lg overflow-hidden">
//             <div className="overflow-y-auto w-full">
//               <div className="p-2">
//                 <div>
//                   <div className="flex items-center w-full p-2 text-base font-bold text-gray-900 bg-gray-200 rounded-lg">
//                     <h6 className="font-extrabold">Messages</h6>
//                   </div>
//                 </div>

//                 {profiles && profiles.length > 0 ? (
//                   profiles
//                     .filter((profile) => profile?.members?.[0])
//                     .map((profile) => (
//                       <div key={profile.id}>
//                         <div
//                           onClick={() =>
//                             joinChatroom(
//                               profile.id,
//                               profile.members[0].id,
//                               profile.members[0].profile_picture
//                             )
//                           }
//                           className="flex items-center rounded-lg m-1 cursor-pointer bg-gray-300 p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]"
//                         >
//                           {profile.unseen_message_count > 0 && (
//                             <div className="top-0 left-0 bg-red-500 text-white px-2 py-1 rounded-full w-6 h-6 flex items-center justify-center">
//                               {profile.unseen_message_count}
//                             </div>
//                           )}
//                           <img
//                             className="w-14 rounded-full h-14  mr-2"
//                             src={BASE_URL + profile.members[0].profile_picture}
//                             alt="profile"
//                           />
//                           <div className="flex-grow">
//                             <h5 className="mb-1 text-sm font-medium leading-tight text-neutral-800 text-start">
//                               {profile.members[0].username}
//                             </h5>
//                           </div>
//                           <svg
//                             className="w-6 h-6 text-gray-800 "
//                             aria-hidden="true"
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="24"
//                             height="24"
//                             fill="none"
//                             onClick={() =>
//                               handleVideoCall(
//                                 profile.members[0].email,
//                                 profile.id
//                               )
//                             }
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               stroke="currentColor"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M14 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 11-6-2V9l6-2v10Z"
//                             />
//                           </svg>
//                         </div>
//                       </div>
//                     ))
//                 ) : (
//                   <p>No profiles available.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </MessageContentWrapper>
//       {videoCallDetails && (
//         <IncomingVideoCallAlert
//           caller={videoCallDetails.caller}
//           onAccept={handleAcceptCall}
//           onDecline={handleDeclineCall}
//         />
//       )}
//     </MessagePage>
//   );
// };

// export default Messages;




// import React, { useEffect, useRef, useState } from "react";
// import styled from "styled-components";
// import { BASE_URL } from "../../../utils/constants";
// import NavBar from "../usercommon/Navbar";
// import { useSelector } from "react-redux";
// import axios from 'axios'
// import { useNavigate } from "react-router-dom";
// import contactListApi from "../chat/apiCall/contactListApi";
// import getChatMessageApi from "../chat/apiCall/getChatMessagesApi";
// import messageSeenApi from "../chat/apiCall/messageSeenApi";
// import IncomingVideoCallAlert from "./IncomingVideoCallAlert";
// import { FaPaperclip } from "react-icons/fa"; // Import the icon

// const MessagePage = styled.div`
//   display: flex;
//   height: 100vh;
// `;

// const NavContainer = styled.div`
//   width: 16.5%;
//   background-color: #faf7f4;
//   top: 0;
//   bottom: 0;
//   position: fixed;
//   border-right: double;
// `;

// const MessageContentWrapper = styled.div`
//   width: 100%;
//   display: flex;
//   flex-direction: column; /* Display children in a column */
//   padding-left: 16.5%;
//   background-color: #faf7f4;
// `;

// const MessageContainer = styled.div`
//   margin: 0;
//   flex: 0.8;
//   display: grid;
//   grid-template-columns: 1fr 2fr;
//   font-family: Arial, Helvetica, sans-serif;
//   padding: 0em 0em 2em 5em;
//   margin-top: 4em;
//   margin-bottom: 2em;
// `;

// const ProfileInfo = styled.div`
//   .name {
//     font-size: 1.5em;
//     margin-bottom: 0;
//     font-weight: 600;
//   }

//   .about {
//     font-size: 1em;
//     color: #545454;
//   }

//   .stats {
//     margin-left: -17px;
//   }

//   .profile-content {
//     margin-left: 1rem; /* Adjust the margin as needed */
//   }
// `;

// // const ChatInput = styled.div`
// //   position: fixed;
// //   bottom: 25px;
// //   width: 44%;
// //   background-color: #c2c2c2;
// //   padding: 1rem;
// //   border-radius: 1rem;
// //   display: flex;
// //   align-items: center;
// //   justify-content: space-between;
// //   z-index: 1000;
// // `;
// const ChatInput = styled.div`
//   position: fixed;
//   bottom: 25px;
//   width: 44%;
//   background-color: #c2c2c2;
//   padding: 1rem;
//   border-radius: 1rem;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   z-index: 1000;
// `;

// const TopBar = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 1em;
//   border-bottom: 1px solid #ccc;
// `;

// const Messages = () => {
//   const { user_id, name, email, isAuthenticated } = useSelector(
//     (state) => state.auth
//   );
//   const [profiles, setProfiles] = useState([]);
//   const [ws, setWs] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [bg, setBg] = useState(false);
//   const [dpChat, setDpChat] = useState(null);
//   const [videoCallDetails, setVideoCallDetails] = useState(null);
//   const [profilePicture, setProfilePicture] = useState("");
//   const [mediaFile, setMediaFile] = useState(null);

//   const navigate = useNavigate();
//   useEffect(() => {
//     const fetchProfilePicture = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/api/profile_pic/`, {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem("access")}`
//           }
//         });
//         setProfilePicture(response.data.profile_picture);
//         console.log("zzzzzzzzzzzzzzzzzzzzzzzzzz");

//       } catch (error) {
//         console.error("Error fetching profile picture:", error);
//       }
//     };

//     fetchProfilePicture();
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const result = await contactListApi();
//         setProfiles(result.results);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     if (isAuthenticated) {
//       fetchData();
//     }
//   }, [isAuthenticated]);

//   useEffect(() => {
//     if (ws) {
//       ws.onmessage = (event) => {
//         console.log("teh event data WebSocket message:", event.data);
//         const message = JSON.parse(event.data);
//         console.log("Received WebSocket message:", message);

//         if (message.type === "video_call" && message.callee === email) {
//           setVideoCallDetails({
//             caller: message.caller,
//             roomId: message.room_id,
//           });
//         } else if (message.type === "chat_message") {
//           setMessages((prevMessages) => [...prevMessages, message]);
//         } else {
//           console.error("Unknown message type received");
//         }
//       };
//     }
//   }, [ws, email]);

//   const handleAcceptCall = () => {
//     navigate(`/user/video-call/${videoCallDetails.roomId}`);
//   };

//   const handleDeclineCall = () => {
//     setVideoCallDetails(null);
//   };

//   const ref = useChatScroll(messages);

//   function useChatScroll(dep) {
//     const ref = useRef();
//     useEffect(() => {
//       if (ref.current) {
//         ref.current.scrollTop = ref.current.scrollHeight;
//       }
//     }, [dep]);
//     return ref;
//   }

//   const handleSendMessage = () => {
//     if (ws && (inputMessage.trim() !== "" || mediaFile)) {
//       const messageData = { message: inputMessage };

//       if (mediaFile) {
//         messageData.media = mediaFile;
//       }

//       ws.send(JSON.stringify(messageData));
//       setInputMessage("");
//       setMediaFile(null);
//     }
//   };

//   useEffect(() => {
//     if (ws) {
//       ws.onclose = () => {
//         console.log("WebSocket closed, attempting to reconnect...");
//         setTimeout(() => joinChatroom(chatroomId, userId, dp_image), 5000);
//       };
//     }
//   }, [ws]);
//   const handleMediaChange = (event) => {
//     const file = event.target.files[0];
//     setMediaFile(file);
//   };

//   const joinChatroom = async (chatroomId, userId, dp_image) => {
//     try {
//       setBg(true);
//       setDpChat(dp_image);

//       const accessToken = localStorage.getItem("access");
//       const websocketProtocol =
//         window.location.protocol === "https:" ? "wss://" : "ws://";
//       const wsUrl = `${websocketProtocol}127.0.0.1:8000/ws/chat/${chatroomId}/?token=${accessToken}`;
//       const newChatWs = new WebSocket(wsUrl);

//       newChatWs.onopen = async () => {
//         const previousMessages = await getChatMessageApi(chatroomId);
//         setMessages(previousMessages);

//         await messageSeenApi(userId);
//         setProfiles((prevProfiles) =>
//           prevProfiles.map((profile) =>
//             profile.id === chatroomId
//               ? { ...profile, unseen_message_count: 0 }
//               : profile
//           )
//         );
//       };

//       newChatWs.onmessage = (event) => {
//         const message = JSON.parse(event.data);
//         console.log("the event data-----------", event.data);
//         console.log("the video cal------------", message.type);

//         if (message.type === "video_call" && message.callee === email) {
//           setVideoCallDetails({
//             caller: message.caller,
//             roomId: message.room_id,
//           });
//         } else {
//           setMessages((prevMessages) => [...prevMessages, message]);
//         }
//       };

//       setWs(newChatWs);
//     } catch (error) {
//       console.error("Failed to join chatroom:", error);
//     }
//   };

//   const handleVideoCall = (calleeEmail, chatroomId) => {
//     console.log("Chatroom ID:", chatroomId);
//     if (ws) {
//       const callerEmail = email;

//       ws.send(
//         JSON.stringify({
//           type: "video_call",
//           caller: callerEmail,
//           callee: calleeEmail,
//           room_id: chatroomId,
//         })
//       );

//       navigate(`/user/video-call/${chatroomId}`);
//     } else {
//       console.error("WebSocket connection is not established.");
//     }
//   };

//   if (!isAuthenticated) {
//     navigate("/");
//   }

//   return (
//     <MessagePage>
//       <NavContainer>
//         <NavBar />
//       </NavContainer>
//       <MessageContentWrapper>
//         <div className="flex h-screen  p-2">
//           <div className="flex flex-col flex-grow w-3/5 mt-5 p-1 m-2 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.27),0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-lg overflow-hidden">
//             {bg ? (
//               <>
//                 <div
//                   ref={ref}
//                   className="flex flex-col flex-grow h-0 p-4 overflow-auto mb-5"
//                 >
//                   {messages?.length > 0 ? (
//                     messages?.map((message, index) =>
//                       message?.sender_email === email ? (
//                         <div
//                           key={index}
//                           className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end"
//                         >
//                           <div>
//                             <div className="bg-green-500 text-white p-1 rounded-l-lg rounded-br-lg">
//                               <p className="text-sm m-1">
//                                 {message.message
//                                   ? message.message
//                                   : message.text}
//                               </p>
//                             </div>
//                             <span className="text-xs text-gray-500 leading-none">
//                               {message.created} ago
//                             </span>
//                           </div>
//                           <img
//                             className="flex-shrink-0 h-10 w-10 rounded-full"
//                             src={`${BASE_URL}${profilePicture}`}
//                             alt="authentication_user"
//                           />
//                         </div>
//                       ) : (
//                         <div
//                           key={index}
//                           className="flex w-full mt-2 space-x-3 max-w-xs"
//                         >
//                           <img
//                             className="flex-shrink-0 h-10 w-10 rounded-full"
//                             src={`${BASE_URL}` + dpChat}
//                             alt="authentication_user"
//                           />
//                           <div>
//                             <div className="bg-gray-300 p-1 rounded-r-lg rounded-bl-lg">
//                               <p className="text-sm m-1">
//                                 {message.message
//                                   ? message.message
//                                   : message.text}
//                               </p>
//                             </div>
//                             <span className="text-xs text-gray-500 leading-none">
//                               {message.created} ago
//                             </span>
//                           </div>
//                         </div>
//                       )
//                     )
//                   ) : (
//                     <div className="flex flex-col flex-grow p-4 overflow-auto">
//                       <p className="mx-auto my-auto ">No messages yet.</p>
//                     </div>
//                   )}

//                   <div className="flex-grow"></div>

//                   <ChatInput>
//                     <div className="relative flex w-full flex-wrap items-stretch">
//                      {/* Media Input Button */}
//                     <input
//                       type="file"
//                       accept="image/*, video/*"
//                       id="mediaInput"
//                       style={{ display: "none" }}
//                       onChange={handleMediaChange}
//                     />
//                     <label htmlFor="mediaInput">
//                       <FaPaperclip
//                         style={{
//                           fontSize: "24px",
//                           color: "#4b2848",
//                           cursor: "pointer",
//                           marginRight: "10px",
//                         }}
//                       />
//                     </label>
//                       <input
//                         type="text"
//                         value={inputMessage}
//                         onChange={(e) => setInputMessage(e.target.value)}
//                         className="relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid border-[#4b2848] bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
//                         aria-describedby="button-addon1"
//                       />
//                       <button
//                         className="relative z-[2] flex items-center rounded-r bg-primary px-6 py-2.5 text-xs font-medium uppercase leading-tight text-[#4b2848] shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
//                         type="button"
//                         id="button-addon1"
//                         onClick={handleSendMessage}
//                       >
//                         Send
//                       </button>
//                     </div>
//                   </ChatInput>
//                 </div>
//               </>
//             ) : (
//               <div className="flex flex-col flex-grow p-4 overflow-auto">
//                 <p className="mx-auto my-auto ">No messages yet.</p>
//               </div>
//             )}
//           </div>

//           <div className="flex w-2/5 flex-grow mt-5 p-2 m-2 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.27),0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-lg overflow-hidden">
//             <div className="overflow-y-auto w-full">
//               <div className="p-2">
//                 <div>
//                   <div className="flex items-center w-full p-2 text-base font-bold text-gray-900 bg-gray-200 rounded-lg">
//                     <h6 className="font-extrabold">Messages</h6>
//                   </div>
//                 </div>

//                 {profiles && profiles.length > 0 ? (
//                   profiles
//                     .filter((profile) => profile?.members?.[0])
//                     .map((profile) => (
//                       <div key={profile.id}>
//                         <div
//                           onClick={() =>
//                             joinChatroom(
//                               profile.id,
//                               profile.members[0].id,
//                               profile.members[0].profile_picture
//                             )
//                           }
//                           className="flex items-center rounded-lg m-1 cursor-pointer bg-gray-300 p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]"
//                         >
//                           {profile.unseen_message_count > 0 && (
//                             <div className="top-0 left-0 bg-red-500 text-white px-2 py-1 rounded-full w-6 h-6 flex items-center justify-center">
//                               {profile.unseen_message_count}
//                             </div>
//                           )}
//                           <img
//                             className="w-14 rounded-full h-14  mr-2"
//                             src={BASE_URL + profile.members[0].profile_picture}
//                             alt="profile"
//                           />
//                           <div className="flex-grow">
//                             <h5 className="mb-1 text-sm font-medium leading-tight text-neutral-800 text-start">
//                               {profile.members[0].username}
//                             </h5>
//                           </div>
//                           <svg
//                             className="w-6 h-6 text-gray-800 "
//                             aria-hidden="true"
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="24"
//                             height="24"
//                             fill="none"
//                             onClick={() =>
//                               handleVideoCall(
//                                 profile.members[0].email,
//                                 profile.id
//                               )
//                             }
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               stroke="currentColor"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M14 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 11-6-2V9l6-2v10Z"
//                             />
//                           </svg>
//                         </div>
//                       </div>
//                     ))
//                 ) : (
//                   <p>No profiles available.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </MessageContentWrapper>
//       {videoCallDetails && (
//         <IncomingVideoCallAlert
//           caller={videoCallDetails.caller}
//           onAccept={handleAcceptCall}
//           onDecline={handleDeclineCall}
//         />
//       )}
//     </MessagePage>
//   );
// };

// export default Messages;

// import React, { useEffect, useRef, useState } from "react";
// import styled from "styled-components";
// import { BASE_URL, WEBSOCKET_BASE_URL } from "../../../utils/constants";
// import NavBar from "../usercommon/Navbar";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import contactListApi from "../chat/apiCall/contactListApi";
// import getChatMessageApi from "../chat/apiCall/getChatMessagesApi";
// import messageSeenApi from "../chat/apiCall/messageSeenApi";
// import IncomingVideoCallAlert from "./IncomingVideoCallAlert";
// import { FaPaperclip } from "react-icons/fa"; // Import the icon

// const MessagePage = styled.div`
//   display: flex;
//   height: 100vh;
// `;

// const NavContainer = styled.div`
//   width: 16.5%;
//   background-color: #faf7f4;
//   top: 0;
//   bottom: 0;
//   position: fixed;
//   border-right: double;
// `;

// const MessageContentWrapper = styled.div`
//   width: 100%;
//   display: flex;
//   flex-direction: column; /* Display children in a column */
//   padding-left: 16.5%;
//   background-color: #faf7f4;
// `;

// const MessageContainer = styled.div`
//   margin: 0;
//   flex: 0.8;
//   display: grid;
//   grid-template-columns: 1fr 2fr;
//   font-family: Arial, Helvetica, sans-serif;
//   padding: 0em 0em 2em 5em;
//   margin-top: 4em;
//   margin-bottom: 2em;
// `;

// const ProfileInfo = styled.div`
//   .name {
//     font-size: 1.5em;
//     margin-bottom: 0;
//     font-weight: 600;
//   }

//   .about {
//     font-size: 1em;
//     color: #545454;
//   }

//   .stats {
//     margin-left: -17px;
//   }

//   .profile-content {
//     margin-left: 1rem; /* Adjust the margin as needed */
//   }
// `;

// const ChatInput = styled.div`
//   position: fixed;
//   bottom: 25px;
//   width: 44%;
//   background-color: #c2c2c2;
//   padding: 1rem;
//   border-radius: 1rem;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   z-index: 1000;
// `;

// const TopBar = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 1em;
//   border-bottom: 1px solid #ccc;
// `;

// const Messages = () => {
//   const { user_id, name, email, isAuthenticated } = useSelector(
//     (state) => state.auth
//   );
//   const [profiles, setProfiles] = useState([]);
//   const [ws, setWs] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [bg, setBg] = useState(false);
//   const [dpChat, setDpChat] = useState(null);
//   const [videoCallDetails, setVideoCallDetails] = useState(null);
//   const [profilePicture, setProfilePicture] = useState("");
//   const [mediaFile, setMediaFile] = useState(null);
//   const [selectedMedia, setSelectedMedia] = useState(null);

//   const navigate = useNavigate();
//   useEffect(() => {
//     const fetchProfilePicture = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/api/profile_pic/`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("access")}`,
//           },
//         });
//         setProfilePicture(response.data.profile_picture);
//       } catch (error) {
//         console.error("Error fetching profile picture:", error);
//       }
//     };

//     fetchProfilePicture();
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const result = await contactListApi();
//         setProfiles(result.results);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     if (isAuthenticated) {
//       fetchData();
//     }
//   }, [isAuthenticated]);

//   useEffect(() => {
//     if (ws) {
//       ws.onmessage = (event) => {
//         const message = JSON.parse(event.data);

//         if (message.type === "video_call" && message.callee === email) {
//           setVideoCallDetails({
//             caller: message.caller,
//             roomId: message.room_id,
//           });
//         } else if (message.type === "chat_message") {
//           setMessages((prevMessages) => [...prevMessages, message]);
//         } else {
//           console.error("Unknown message type received");
//         }
//       };
//     }
//   }, [ws, email]);

//   const handleAcceptCall = () => {
//     navigate(`/user/video-call/${videoCallDetails.roomId}`);
//   };

//   const handleDeclineCall = () => {
//     setVideoCallDetails(null);
//   };

//   const ref = useRef();

//   useEffect(() => {
//     if (ref.current) {
//       ref.current.scrollTop = ref.current.scrollHeight;
//     }
//   }, [messages]);
//   const handleSendMessage = () => {
//     if (ws && (inputMessage.trim() !== "" || mediaFile)) {
//       const messageData = {
//         message: inputMessage,
//         type: mediaFile ? "media" : "text",
//         mediaType: mediaFile ? mediaFile.type : null,
//       };
  
//       if (mediaFile) {
//         const reader = new FileReader();
//         reader.onload = () => {
//           const base64Data = reader.result.split(",")[1];
//           messageData.media = base64Data;
  
//           ws.send(JSON.stringify(messageData));
//           setInputMessage("");
//           setMediaFile(null);
//         };
//         reader.onerror = () => {
//           console.error("Error reading media file:", reader.error);
//         };
//         reader.readAsDataURL(mediaFile);
//       } else {
//         ws.send(JSON.stringify(messageData));
//         setInputMessage("");
//       }
//     }
//   };
  
//   const handleMediaChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const preview = URL.createObjectURL(file);
//       setSelectedMedia({
//         file,
//         preview,
//         type: file.type,
//       });
//       setInputMessage(`Media attached: ${file.name}`);
//       setMediaFile(file);
//     }
//   };

//   const joinChatroom = async (chatroomId, userId, dp_image) => {
//     try {
//       setBg(true);
//       setDpChat(dp_image);

//       const accessToken = localStorage.getItem("access");
//       const websocketProtocol =
//         window.location.protocol === "https://" ? "wss://" : "ws://";
//       const wsUrl = `${websocketProtocol}${WEBSOCKET_BASE_URL}/ws/chat/${chatroomId}/?token=${accessToken}`;
//       const newChatWs = new WebSocket(wsUrl);

//       newChatWs.onopen = async () => {
//         const previousMessages = await getChatMessageApi(chatroomId);
//         setMessages(previousMessages);

//         await messageSeenApi(userId);
//         setProfiles((prevProfiles) =>
//           prevProfiles.map((profile) =>
//             profile.id === chatroomId
//               ? { ...profile, unseen_message_count: 0 }
//               : profile
//           )
//         );
//       };

//       newChatWs.onmessage = (event) => {
//         const message = JSON.parse(event.data);

//         if (message.type === "video_call" && message.callee === email) {
//           setVideoCallDetails({
//             caller: message.caller,
//             roomId: message.room_id,
//           });
//         } else {
//           setMessages((prevMessages) => [...prevMessages, message]);
//         }
//       };

//       setWs(newChatWs);
//     } catch (error) {
//       console.error("Failed to join chatroom:", error);
//     }
//   };

//   const handleVideoCall = (calleeEmail, chatroomId) => {
//     if (ws) {
//       const callerEmail = email;

//       ws.send(
//         JSON.stringify({
//           type: "video_call",
//           caller: callerEmail,
//           callee: calleeEmail,
//           room_id: chatroomId,
//         })
//       );

//       navigate(`/user/video-call/${chatroomId}`);
//     } else {
//       console.error("WebSocket connection is not established.");
//     }
//   };

//   if (!isAuthenticated) {
//     navigate("/");
//   }
//   const MediaPreview = ({ media }) => {
//     if (!media) return null;
  
//     return (
//       <div className="media-preview mt-2">
//         {media.type.startsWith("image/") ? (
//           <img
//             src={`data:${media.type};base64,${media.preview}`}
//             alt="Preview"
//             style={{ maxWidth: "100%", maxHeight: "150px" }}
//           />
//         ) : media.type.startsWith("video/") ? (
//           <video
//             controls
//             src={`data:${media.type};base64,${media.preview}`}
//             style={{ maxWidth: "100%", maxHeight: "150px" }}
//           />
//         ) : media.type.startsWith("audio/") ? (
//           <audio controls src={`data:${media.type};base64,${media.preview}`} />
//         ) : (
//           <p>Unsupported media type</p>
//         )}
//       </div>
//     );
//   };
  
  
//   return (
//     <MessagePage>
//       <NavContainer>
//         <NavBar />
//       </NavContainer>
//       <MessageContentWrapper>
//         <div className="flex h-screen  p-2">
//           <div className="flex flex-col flex-grow w-3/5 mt-5 p-1 m-2 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.27),0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-lg overflow-hidden">
//             {bg ? (
//               <>
//                 <div
//                   ref={ref}
//                   className="flex flex-col flex-grow h-0 p-4 overflow-auto mb-5"
//                 >
//                   {messages?.length > 0 ? (
//                     messages?.map((message, index) =>
//                       message?.sender_email === email ? (
//                         <div
//                           key={index}
//                           className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end"
//                         >
//                           <div>
//                             <div className="bg-green-500 text-white p-1 rounded-l-lg rounded-br-lg">
//                               {message?.media ? (
//                                 message?.mediaType.startsWith("image/") ? (
//                                   <img
//                                     src={`data:${message.mediaType};base64,${message.media}`}
//                                     alt="Sent media"
//                                   />
//                                 ) : (
//                                   <video controls>
//                                     <source
//                                       src={`data:${message.mediaType};base64,${message.media}`}
//                                       type={message.mediaType}
//                                     />
//                                     Your browser does not support the video tag.
//                                   </video>
//                                 )
//                               ) : (
//                                 <p className="text-sm m-1">
//                                   {message.message
//                                     ? message.message
//                                     : message.text}
//                                 </p>
//                               )}

//                             </div>
//                             <span className="text-xs text-gray-500 leading-none">
//                               {message.created} ago
//                             </span>
//                           </div>
//                           <img
//                             className="flex-shrink-0 h-10 w-10 rounded-full"
//                             src={`${BASE_URL}${profilePicture}`}
//                             alt="authentication_user"
//                           />
//                         </div>
//                       ) : (
//                         <div
//                           key={index}
//                           className="flex w-full mt-2 space-x-3 max-w-xs"
//                         >
//                           <img
//                             className="flex-shrink-0 h-10 w-10 rounded-full"
//                             src={`${BASE_URL}${dpChat}`}
//                             alt="authentication_user"
//                           />
//                           <div>
//                             <div className="bg-gray-300 p-1 rounded-r-lg rounded-bl-lg">
//                               {message?.media ? (
//                                 message?.mediaType.startsWith("image/") ? (
//                                   <img
//                                     src={`data:${message?.mediaType};base64,${message?.media}`}
//                                     alt="Sent media"
//                                   />
//                                 ) : (
//                                   <video controls>
//                                     <source
//                                       src={`data:${message?.mediaType};base64,${message?.media}`}
//                                       type={message?.mediaType}
//                                     />
//                                     Your browser does not support the video tag.
//                                   </video>
//                                 )
//                               ) : (
//                                 <p className="text-sm m-1">
//                                   {message.message
//                                     ? message.message
//                                     : message.text}
//                                 </p>
//                               )}
//                             </div>
//                             <span className="text-xs text-gray-500 leading-none">
//                               {message.created} ago
//                             </span>
//                           </div>
//                         </div>
//                       )
//                     )
//                   ) : (
//                     <div className="flex flex-col flex-grow p-4 overflow-auto">
//                       <p className="mx-auto my-auto">No messages yet.</p>
//                     </div>
//                   )}

//                   <div className="flex-grow"></div>
//                   <ChatInput>
//                     <input
//                       type="file"
//                       accept="image/*,video/*,audio/*"
//                       id="media-upload"
//                       onChange={handleMediaChange}
//                       style={{ display: "none" }}
//                     />
//                     <label htmlFor="media-upload">
//                       <FaPaperclip />
//                     </label>
//                     <textarea
//                       value={inputMessage}
//                       onChange={(e) => setInputMessage(e.target.value)}
//                       placeholder="Type a message"
//                       style={{ flex: 1, marginRight: "10px" }}
//                     />
//                     <button
//                       onClick={handleSendMessage}
//                       style={{
//                         backgroundColor: "#007bff",
//                         color: "white",
//                         padding: "10px",
//                         borderRadius: "5px",
//                       }}
//                     >
//                       Send
//                     </button>
//                   </ChatInput>
//                 </div>
//               </>
//             ) : (
//               <div className="flex flex-col flex-grow p-4 overflow-auto">
//                 <p className="mx-auto my-auto ">No messages yet.</p>
//               </div>
//             )}
//           </div>

//           <div className="flex w-2/5 flex-grow mt-5 p-2 m-2 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.27),0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-lg overflow-hidden">
//             <div className="overflow-y-auto w-full">
//               <div className="p-2">
//                 <div>
//                   <div className="flex items-center w-full p-2 text-base font-bold text-gray-900 bg-gray-200 rounded-lg">
//                     <h6 className="font-extrabold">Messages</h6>
//                   </div>
//                 </div>

//                 {profiles && profiles.length > 0 ? (
//                   profiles
//                     .filter((profile) => profile?.members?.[0])
//                     .map((profile) => (
//                       <div key={profile.id}>
//                         <div
//                           onClick={() =>
//                             joinChatroom(
//                               profile.id,
//                               profile.members[0].id,
//                               profile.members[0].profile_picture
//                             )
//                           }
//                           className="flex items-center rounded-lg m-1 cursor-pointer bg-gray-300 p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]"
//                         >
//                           {profile.unseen_message_count > 0 && (
//                             <div className="top-0 left-0 bg-red-500 text-white px-2 py-1 rounded-full w-6 h-6 flex items-center justify-center">
//                               {profile.unseen_message_count}
//                             </div>
//                           )}
//                           <img
//                             className="w-14 rounded-full h-14  mr-2"
//                             src={BASE_URL + profile.members[0].profile_picture}
//                             alt="profile"
//                           />
//                           <div className="flex-grow">
//                             <h5 className="mb-1 text-sm font-medium leading-tight text-neutral-800 text-start">
//                               {profile.members[0].username}
//                             </h5>
//                           </div>
//                           <svg
//                             className="w-6 h-6 text-gray-800 "
//                             aria-hidden="true"
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="24"
//                             height="24"
//                             fill="none"
//                             onClick={() =>
//                               handleVideoCall(
//                                 profile.members[0].email,
//                                 profile.id
//                               )
//                             }
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               stroke="currentColor"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M14 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 11-6-2V9l6-2v10Z"
//                             />
//                           </svg>
//                         </div>
//                       </div>
//                     ))
//                 ) : (
//                   <p>No profiles available.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </MessageContentWrapper>
//       {videoCallDetails && (
//         <IncomingVideoCallAlert
//           caller={videoCallDetails.caller}
//           onAccept={handleAcceptCall}
//           onDecline={handleDeclineCall}
//         />
//       )}
//     </MessagePage>
//   );
// };

// export default Messages;









// import React, { useEffect, useRef, useState } from "react";
// import styled from "styled-components";
// import { BASE_URL, WEBSOCKET_BASE_URL } from "../../../utils/constants";
// import NavBar from "../usercommon/Navbar";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import contactListApi from "../chat/apiCall/contactListApi";
// import getChatMessageApi from "../chat/apiCall/getChatMessagesApi";
// import messageSeenApi from "../chat/apiCall/messageSeenApi";
// import IncomingVideoCallAlert from "./IncomingVideoCallAlert";
// import { FaPaperclip } from "react-icons/fa"; 

// const MessagePage = styled.div`
//   display: flex;
//   height: 100vh;
// `;

// const NavContainer = styled.div`
//   width: 16.5%;
//   background-color: #faf7f4;
//   top: 0;
//   bottom: 0;
//   position: fixed;
//   border-right: double;
// `;

// const MessageContentWrapper = styled.div`
//   width: 100%;
//   display: flex;
//   flex-direction: column; /* Display children in a column */
//   padding-left: 16.5%;
//   background-color: #faf7f4;
// `;

// const MessageContainer = styled.div`
//   margin: 0;
//   flex: 0.8;
//   display: grid;
//   grid-template-columns: 1fr 2fr;
//   font-family: Arial, Helvetica, sans-serif;
//   padding: 0em 0em 2em 5em;
//   margin-top: 4em;
//   margin-bottom: 2em;
// `;

// const ProfileInfo = styled.div`
//   .name {
//     font-size: 1.5em;
//     margin-bottom: 0;
//     font-weight: 600;
//   }

//   .about {
//     font-size: 1em;
//     color: #545454;
//   }

//   .stats {
//     margin-left: -17px;
//   }

//   .profile-content {
//     margin-left: 1rem; /* Adjust the margin as needed */
//   }
// `;

// const ChatInput = styled.div`
//   position: fixed;
//   bottom: 25px;
//   width: 44%;
//   background-color: #c2c2c2;
//   padding: 1rem;
//   border-radius: 1rem;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   z-index: 1000;
// `;

// const TopBar = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 1em;
//   border-bottom: 1px solid #ccc;
// `;

// const Messages = () => {
//   const { user_id, name, email, isAuthenticated } = useSelector(
//     (state) => state.auth
//   );
//   const [profiles, setProfiles] = useState([]);
//   const [ws, setWs] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [bg, setBg] = useState(false);
//   const [dpChat, setDpChat] = useState(null);
//   const [videoCallDetails, setVideoCallDetails] = useState(null);
//   const [profilePicture, setProfilePicture] = useState("");
//   const [mediaFile, setMediaFile] = useState(null);
//   const [selectedMedia, setSelectedMedia] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch profile picture
//     // Fetch contacts
//   }, [isAuthenticated]);

//   useEffect(() => {
//     if (ws) {
//       ws.onmessage = (event) => {
//         const message = JSON.parse(event.data);

//         if (message.type === "video_call" && message.callee === email) {
//           setVideoCallDetails({
//             caller: message.caller,
//             roomId: message.room_id,
//           });
//         } else if (message.type === "chat_message") {
//           setMessages((prevMessages) => [...prevMessages, message]);
//         } else {
//           console.error("Unknown message type received");
//         }
//       };
//     }
//   }, [ws, email]);

//   const handleSendMessage = () => {
//     if (ws && (inputMessage.trim() !== "" || mediaFile)) {
//       const messageData = {
//         message: inputMessage,
//         type: mediaFile ? "media" : "text",
//         mediaType: mediaFile ? mediaFile.type : null,
//       };

//       if (mediaFile) {
//         const reader = new FileReader();
//         reader.onload = () => {
//           const base64Data = reader.result.split(",")[1];
//           messageData.media = base64Data;

//           ws.send(JSON.stringify(messageData));
//           setInputMessage("");
//           setMediaFile(null);
//         };
//         reader.onerror = () => {
//           console.error("Error reading media file:", reader.error);
//         };
//         reader.readAsDataURL(mediaFile);
//       } else {
//         ws.send(JSON.stringify(messageData));
//         setInputMessage("");
//       }
//     }
//   };

//   const handleMediaChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const preview = URL.createObjectURL(file);
//       setSelectedMedia({
//         file,
//         preview,
//         type: file.type,
//       });
//       setInputMessage(`Media attached: ${file.name}`);
//       setMediaFile(file);
//     }
//   };

//   const joinChatroom = async (chatroomId, userId, dp_image) => {
//     try {
//       setBg(true);
//       setDpChat(dp_image);

//       const accessToken = localStorage.getItem("access");
//       const websocketProtocol =
//         window.location.protocol === "https://" ? "wss://" : "ws://";
//       const wsUrl = `${websocketProtocol}${WEBSOCKET_BASE_URL}/ws/chat/${chatroomId}/?token=${accessToken}`;
//       const newChatWs = new WebSocket(wsUrl);

//       newChatWs.onopen = async () => {
//         const previousMessages = await getChatMessageApi(chatroomId);
//         setMessages(previousMessages);

//         await messageSeenApi(userId);
//         setProfiles((prevProfiles) =>
//           prevProfiles.map((profile) =>
//             profile.id === chatroomId
//               ? { ...profile, unseen_message_count: 0 }
//               : profile
//           )
//         );
//       };

//       newChatWs.onmessage = (event) => {
//         const message = JSON.parse(event.data);

//         if (message.type === "video_call" && message.callee === email) {
//           setVideoCallDetails({
//             caller: message.caller,
//             roomId: message.room_id,
//           });
//         } else {
//           setMessages((prevMessages) => [...prevMessages, message]);
//         }
//       };

//       setWs(newChatWs);
//     } catch (error) {
//       console.error("Failed to join chatroom:", error);
//     }
//   };

//   const handleVideoCall = (calleeEmail, chatroomId) => {
//     if (ws) {
//       const callerEmail = email;

//       ws.send(
//         JSON.stringify({
//           type: "video_call",
//           caller: callerEmail,
//           callee: calleeEmail,
//           room_id: chatroomId,
//         })
//       );

//       navigate(`/user/video-call/${chatroomId}`);
//     } else {
//       console.error("WebSocket connection is not established.");
//     }
//   };

//   if (!isAuthenticated) {
//     navigate("/");
//   }

//   const MediaPreview = ({ media }) => {
//     if (!media) return null;

//     return (
//       <div className="media-preview mt-2">
//         {media.type.startsWith("image/") ? (
//           <img
//             src={`data:${media.type};base64,${media.preview}`}
//             alt="Preview"
//             style={{ maxWidth: "100%", maxHeight: "150px" }}
//           />
//         ) : media.type.startsWith("video/") ? (
//           <video
//             controls
//             src={`data:${media.type};base64,${media.preview}`}
//             style={{ maxWidth: "100%", maxHeight: "150px" }}
//           />
//         ) : media.type.startsWith("audio/") ? (
//           <audio controls src={`data:${media.type};base64,${media.preview}`} />
//         ) : (
//           <p>Unsupported media type</p>
//         )}
//       </div>
//     );
//   };

//   return (
//     <MessagePage>
//       <NavContainer>
//         <NavBar />
//       </NavContainer>
//       <MessageContentWrapper>
//         <div className="flex h-screen p-2">
//           <div className="flex flex-col flex-grow w-3/5 mt-5 p-1 m-2 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.27),0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-lg overflow-hidden">
//             {bg ? (
//               <>
//                 <div
//                   ref={ref}
//                   className="flex flex-col flex-grow h-0 p-4 overflow-auto mb-5"
//                 >
//                   {messages.length > 0 ? (
//                     messages.map((message, index) => (
//                       <div
//                         key={index}
//                         className={`flex w-full mt-2 space-x-3 max-w-xs ${
//                           message.sender_email === email ? "ml-auto justify-end" : ""
//                         }`}
//                       >
//                         {message.sender_email !== email && (
//                           <img
//                             className="flex-shrink-0 h-10 w-10 rounded-full"
//                             src={`${BASE_URL}${dpChat}`}
//                             alt="profile"
//                           />
//                         )}
//                         <div>
//                           <div
//                             className={`p-1 ${
//                               message.sender_email === email
//                                 ? "bg-green-500 text-white rounded-l-lg rounded-br-lg"
//                                 : "bg-gray-300 rounded-r-lg rounded-bl-lg"
//                             }`}
//                           >
//                             {message.type === "media" ? (
//                               <MediaPreview
//                                 media={{ type: message.mediaType, preview: message.media }}
//                               />
//                             ) : (
//                               <p className="text-sm m-1">
//                                 {message.message || message.text}
//                               </p>
//                             )}
//                           </div>
//                           <span className="text-xs text-gray-500 leading-none">
//                             {message.created} ago
//                           </span>
//                         </div>
//                         {message.sender_email === email && (
//                           <img
//                             className="flex-shrink-0 h-10 w-10 rounded-full"
//                             src={`${BASE_URL}${profilePicture}`}
//                             alt="profile"
//                           />
//                         )}
//                       </div>
//                     ))
//                   ) : (
//                     <div className="flex flex-col flex-grow p-4 overflow-auto">
//                       <p className="mx-auto my-auto">No messages yet.</p>
//                     </div>
//                   )}
//                   <div className="flex-grow"></div>
//                   <ChatInput>
//                     <input
//                       type="file"
//                       accept="image/*,video/*,audio/*"
//                       id="media-upload"
//                       onChange={handleMediaChange}
//                       style={{ display: "none" }}
//                     />
//                     <label htmlFor="media-upload">
//                       <FaPaperclip />
//                     </label>
//                     <textarea
//                       value={inputMessage}
//                       onChange={(e) => setInputMessage(e.target.value)}
//                       placeholder="Type a message"
//                       style={{ flex: 1, marginRight: "10px" }}
//                     />
//                     <button
//                       onClick={handleSendMessage}
//                       style={{
//                         backgroundColor: "#007bff",
//                         color: "white",
//                         padding: "10px",
//                         borderRadius: "5px",
//                       }}
//                     >
//                       Send
//                     </button>
//                   </ChatInput>
//                 </div>
//               </>
//             ) : (
//               <div className="flex flex-col flex-grow p-4 overflow-auto">
//                 <p className="mx-auto my-auto">No messages yet.</p>
//               </div>
//             )}
//           </div>
//           <div className="flex w-2/5 flex-grow mt-5 p-2 m-2 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.27),0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-lg overflow-hidden">
//             <div className="overflow-y-auto w-full">
//               <div className="p-2">
//                 <div>
//                   <div className="flex items-center w-full p-2 text-base font-bold text-gray-900 bg-gray-200 rounded-lg">
//                     <h6 className="font-extrabold">Messages</h6>
//                   </div>
//                 </div>

//                 {profiles && profiles.length > 0 ? (
//                   profiles
//                     .filter((profile) => profile?.members?.[0])
//                     .map((profile) => (
//                       <div key={profile.id}>
//                         <div
//                           onClick={() =>
//                             joinChatroom(
//                               profile.id,
//                               profile.members[0].id,
//                               profile.members[0].profile_picture
//                             )
//                           }
//                           className="flex items-center rounded-lg m-1 cursor-pointer bg-gray-300 p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]"
//                         >
//                           {profile.unseen_message_count > 0 && (
//                             <div className="top-0 left-0 bg-red-500 text-white px-2 py-1 rounded-full w-6 h-6 flex items-center justify-center">
//                               {profile.unseen_message_count}
//                             </div>
//                           )}
//                           <img
//                             className="w-14 rounded-full h-14 mr-2"
//                             src={BASE_URL + profile.members[0].profile_picture}
//                             alt="profile"
//                           />
//                           <div className="flex-grow">
//                             <h5 className="mb-1 text-sm font-medium leading-tight text-neutral-800 text-start">
//                               {profile.members[0].username}
//                             </h5>
//                           </div>
//                           <svg
//                             className="w-6 h-6 text-gray-800"
//                             aria-hidden="true"
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="24"
//                             height="24"
//                             fill="none"
//                             onClick={() =>
//                               handleVideoCall(
//                                 profile.members[0].email,
//                                 profile.id
//                               )
//                             }
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               stroke="currentColor"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M14 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 11-6-2V9l6-2v10Z"
//                             />
//                           </svg>
//                         </div>
//                       </div>
//                     ))
//                 ) : (
//                   <p>No profiles available.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </MessageContentWrapper>
//       {videoCallDetails && (
//         <IncomingVideoCallAlert
//           caller={videoCallDetails.caller}
//           onAccept={handleAcceptCall}
//           onDecline={handleDeclineCall}
//         />
//       )}
//     </MessagePage>
//   );
// };

// export default Messages;

























import React, { useEffect, useRef, useState } from "react";
import { BASE_URL } from "../../../utils/constants";
import NavBar from "../usercommon/Navbar";
import { useSelector } from "react-redux";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import contactListApi from "../chat/apiCall/contactListApi";
import getChatMessageApi from "../chat/apiCall/getChatMessagesApi";
import messageSeenApi from "../chat/apiCall/messageSeenApi";
import IncomingVideoCallAlert from "./IncomingVideoCallAlert";

const Messages = () => {
  const { user_id, name, email, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const [profiles, setProfiles] = useState([]);
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [bg, setBg] = useState(false);
  const [dpChat, setDpChat] = useState(null);
  const [videoCallDetails, setVideoCallDetails] = useState(null);
  const [profilePicture, setProfilePicture] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/profile_pic/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access")}`,
          },
        });
        setProfilePicture(response.data.profile_picture);
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };
    fetchProfilePicture();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await contactListApi();
        setProfiles(result.results);
      } catch (error) {
        console.error(error);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "video_call" && message.callee === email) {
          setVideoCallDetails({
            caller: message.caller,
            roomId: message.room_id,
          });
        } else if (message.type === "chat_message") {
          setMessages((prevMessages) => [...prevMessages, message]);
        } else {
          console.error("Unknown message type received");
        }
      };
    }
  }, [ws, email]);

  const handleAcceptCall = () => {
    navigate(`/user/video-call/${videoCallDetails.roomId}`);
  };

  const handleDeclineCall = () => {
    setVideoCallDetails(null);
  };

  const ref = useChatScroll(messages);

  function useChatScroll(dep) {
    const ref = useRef();
    useEffect(() => {
      if (ref.current) {
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    }, [dep]);
    return ref;
  }

  const handleSendMessage = () => {
    if (ws && inputMessage.trim() !== "") {
      ws.send(JSON.stringify({ message: inputMessage }));
      setInputMessage("");
    }
  };

  const joinChatroom = async (chatroomId, userId, dp_image) => {
    try {
      setBg(true);
      setDpChat(dp_image);

      const accessToken = localStorage.getItem("access");
      const websocketProtocol =
        window.location.protocol === "https:" ? "wss://" : "ws://";
      const wsUrl = `${websocketProtocol}127.0.0.1:8000/ws/chat/${chatroomId}/?token=${accessToken}`;
      const newChatWs = new WebSocket(wsUrl);

      newChatWs.onopen = async () => {
        const previousMessages = await getChatMessageApi(chatroomId);
        setMessages(previousMessages);

        await messageSeenApi(userId);
        setProfiles((prevProfiles) =>
          prevProfiles.map((profile) =>
            profile.id === chatroomId
              ? { ...profile, unseen_message_count: 0 }
              : profile
          )
        );
      };

      newChatWs.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "video_call" && message.callee === email) {
          setVideoCallDetails({
            caller: message.caller,
            roomId: message.room_id,
          });
        } else {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      };

      setWs(newChatWs);
    } catch (error) {
      console.error("Failed to join chatroom:", error);
    }
  };

  const handleVideoCall = (calleeEmail, chatroomId) => {
    if (ws) {
      const callerEmail = email;

      ws.send(
        JSON.stringify({
          type: "video_call",
          caller: callerEmail,
          callee: calleeEmail,
          room_id: chatroomId,
        })
      );

      navigate(`/user/video-call/${chatroomId}`);
    } else {
      console.error("WebSocket connection is not established.");
    }
  };

  if (!isAuthenticated) {
    navigate("/");
  }

  return (
    <div className="flex h-screen">
      <div className="w-[16.5%] bg-[#faf7f4] border-r-2 border-double fixed h-full">
        <NavBar />
      </div>
      <div className="flex flex-col w-full pl-[16.5%] bg-[#faf7f4]">
        <div className="flex flex-grow p-2 h-screen">
          <div className="flex flex-col w-3/5 mt-5 p-1 m-2 bg-white shadow-lg rounded-lg overflow-hidden">
            {bg ? (
              <div ref={ref} className="flex flex-col p-4 overflow-auto mb-5">
                {messages?.length > 0 ? (
                  messages.map((message, index) =>
                    message?.sender_email === email ? (
                      <div
                        key={index}
                        className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end"
                      >
                        <div>
                          <div className="bg-green-500 text-white p-1 rounded-l-lg rounded-br-lg">
                            <p className="text-sm m-1">
                              {message.message || message.text}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 leading-none">
                            {message.created} ago
                          </span>
                        </div>
                        <img
                          className="h-10 w-10 rounded-full"
                          src={`${BASE_URL}${profilePicture}`}
                          alt="authentication_user"
                        />
                      </div>
                    ) : (
                      <div
                        key={index}
                        className="flex w-full mt-2 space-x-3 max-w-xs"
                      >
                        <img
                          className="h-10 w-10 rounded-full"
                          src={`${BASE_URL}${dpChat}`}
                          alt="authentication_user"
                        />
                        <div>
                          <div className="bg-gray-300 p-1 rounded-r-lg rounded-bl-lg">
                            <p className="text-sm m-1">
                              {message.message || message.text}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 leading-none">
                            {message.created} ago
                          </span>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="flex flex-col flex-grow p-4 overflow-auto">
                    <p className="mx-auto my-auto">No messages yet.</p>
                  </div>
                )}
                <div className="flex-grow"></div>
                <div className="fixed bottom-6 w-[44%] bg-gray-200 p-4 rounded-lg flex justify-between items-center">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="w-full p-2 border border-gray-400 rounded-l-md"
                    placeholder="Type a message..."
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-[#4b2848] text-white px-4 py-2 rounded-r-md"
                  >
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col flex-grow p-4 overflow-auto">
                <p className="mx-auto my-auto">No messages yet.</p>
              </div>
            )}
          </div>
          <div className="flex flex-grow w-2/5 mt-5 p-2 m-2 bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-y-auto w-full p-2">
              <div className="flex items-center bg-gray-200 p-2 rounded-lg">
                <h6 className="font-extrabold text-gray-900">Messages</h6>
              </div>
              {profiles?.length > 0 ? (
                profiles
                  .filter((profile) => profile?.members?.[0])
                  .map((profile) => (
                    <div
                      key={profile.id}
                      className="p-3 border border-gray-300 mt-3 flex items-center cursor-pointer rounded-lg hover:bg-[#c8bdbd]"
                      onClick={() =>
                        joinChatroom(
                          profile.id,
                          profile?.members?.[0]?.id,
                          profile?.members?.[0]?.profile_picture
                        )
                      }
                    >
                      <img
                        className="w-8 h-8 rounded-full"
                        src={`${BASE_URL}${profile?.members?.[0]?.profile_picture}`}
                        alt="profile_image"
                      />
                      <div className="ml-4">
                        <div className="font-bold">
                          {profile?.members?.[0]?.username}
                        </div>
                        <div className="text-xs text-gray-500">
                          {profile?.latest_message?.message
                            ? `${profile.latest_message.message.slice(0, 40)}...`
                            : "No message"}
                        </div>
                      </div>
                      {profile?.unseen_message_count > 0 && (
                        <span className="bg-[#dd2626] text-white text-xs ml-auto px-3 py-1 rounded-full">
                          {profile.unseen_message_count}
                        </span>
                      )}
                    </div>
                  ))
              ) : (
                <p>No contacts</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {videoCallDetails && (
        <IncomingVideoCallAlert
          videoCallDetails={videoCallDetails}
          onAccept={handleAcceptCall}
          onDecline={handleDeclineCall}
        />
      )}
    </div>
  );
};

export default Messages;
