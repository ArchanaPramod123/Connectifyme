import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { BASE_URL } from "../../../utils/constants";
import NavBar from "../usercommon/Navbar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import contactListApi from "../chat/apiCall/contactListApi";
import getChatMessageApi from "../chat/apiCall/getChatMessagesApi";
import messageSeenApi from "../chat/apiCall/messageSeenApi";

const MessagePage = styled.div`
  display: flex;
  height: 100vh;
`;

const NavContainer = styled.div`
  width: 16.5%;
  background-color: #faf7f4;
  top: 0;
  bottom: 0;
  position: fixed;
  border-right: double;
`;

const MessageContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column; /* Display children in a column */
  padding-left: 16.5%;
  background-color: #faf7f4;
`;

const MessageContainer = styled.div`
  margin: 0;
  flex: 0.8;
  display: grid;
  grid-template-columns: 1fr 2fr;
  font-family: Arial, Helvetica, sans-serif;
  padding: 0em 0em 2em 5em;
  margin-top: 4em;
  margin-bottom: 2em;
`;

const ProfileInfo = styled.div`
  .name {
    font-size: 1.5em;
    margin-bottom: 0;
    font-weight: 600;
  }

  .about {
    font-size: 1em;
    color: #545454;
  }

  .stats {
    margin-left: -17px;
  }

  .profile-content {
    margin-left: 1rem; /* Adjust the margin as needed */
  }
`;

const ChatInput = styled.div`
  position: fixed;
  bottom: 25px;
  width: 44%;
  background-color: #c2c2c2;
  padding: 1rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
`;

const Messages = () => {
  const { user_id, name, email, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  console.log(
    "the authentictaion_user details in the redux",
    user_id,
    name,
    email,
    isAuthenticated
  );

  const [profiles, setProfiles] = useState([]);
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [bg, setBg] = useState(false);
  const [dpChat, setDpChat] = useState(null);
  const [userProfilePicture, setUserProfilePicture] = useState(null);

  const navigate = useNavigate();
  // const {profile_picture} = useSelector((state) => state.auth.profile_picture);
  // const profilePictureUrl = useSelector((state) => state.auth.profile_picture);

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
        setMessages((prevMessage) => [...prevMessage, message]);

        setUserProfilePicture(data.user_profile.profile_picture);
      };
    }
  }, [ws]);

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
      // await createChatRoomApi(userId);

      const accessToken = localStorage.getItem("access");
      // const wsUrl = `127.0.0.1:8000/ws/chat/${chatroomId}/`;
      // console.log("the chatroom id of the message is ...",chatroomId);

      // const newChatWs = new WebSocket(wsUrl);

      const websocketProtocol =
        window.location.protocol === "https:" ? "wss://" : "ws://";
      const wsUrl = `${websocketProtocol}127.0.0.1:8000/ws/chat/${chatroomId}/?token=${accessToken}`;
      const newChatWs = new WebSocket(wsUrl);
      console.log("the newcat of the web socket is", newChatWs);

      newChatWs.onopen = async () => {
        const previousMessages = await getChatMessageApi(chatroomId);
        setMessages(previousMessages);
        // setMessages(previousMessages && Array.isArray(previousMessages) ? previousMessages : []);
        await messageSeenApi(userId);
        setProfiles((prevProfiles) => {
          return prevProfiles.map((profile) => {
            if (profile.id === chatroomId) {
              return { ...profile, unseen_message_count: 0 };
            }
            return profile;
          });
        });
      };
      newChatWs.onerror = (event) => {
        console.error("WebSocket error:", event);
      };

      newChatWs.onclose = (event) => {
        if (event.wasClean) {
          console.log(
            `WebSocket connection closed cleanly, code: ${event.code}, reason: ${event.reason}`
          );
        } else {
          console.error(
            `WebSocket connection closed abruptly, code: ${event.code}, reason: ${event.reason}`
          );
        }
      };
      newChatWs.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log(message);
      };

      setWs(newChatWs);
    } catch (error) {
      console.error(error);
    }
  };

  if (!isAuthenticated) {
    navigate("/");
  }

  return (
    <MessagePage>
      <NavContainer>
        <NavBar />
      </NavContainer>
      <MessageContentWrapper>
        <div className="flex h-screen  p-2">
          <div className="flex flex-col flex-grow w-3/5 mt-5 p-1 m-2 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.27),0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-lg overflow-hidden">
            {bg ? (
              <div
                ref={ref}
                className="flex flex-col flex-grow h-0 p-4 overflow-auto mb-5"
              >
                {messages?.length > 0 ? (
                  messages?.map((message, index) =>
                    message?.sender_email === email ? (
                      <div
                        key={index}
                        className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end"
                      >
                        <div>
                          <div className="bg-green-500 text-white p-1 rounded-l-lg rounded-br-lg">
                            <p className="text-sm m-1">
                              {message.message ? message.message : message.text}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 leading-none">
                            {message.created} ago
                          </span>
                        </div>
                        <img
                          className="flex-shrink-0 h-10 w-10 rounded-full"
                          // src={`${BASE_URL}${profile_picture}`}
                          src={`${BASE_URL}${user_id?.profile_picture}`}
                          alt="authentication_user"
                        />
                      </div>
                    ) : (
                      <div
                        key={index}
                        className="flex w-full mt-2 space-x-3 max-w-xs"
                      >
                        <img
                          className="flex-shrink-0 h-10 w-10 rounded-full"
                          src={`${BASE_URL}` + dpChat}
                          alt="authentication_user"
                        />
                        <div>
                          <div className="bg-gray-300 p-1 rounded-r-lg rounded-bl-lg">
                            <p className="text-sm m-1">
                              {message.message ? message.message : message.text}
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
                    <p className="mx-auto my-auto ">No messages yet.</p>
                  </div>
                )}

                <div className="flex-grow"></div>

                <ChatInput>
                  <div className="relative flex w-full flex-wrap items-stretch">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      className="relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid border-[#4b2848] bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                      aria-describedby="button-addon1"
                    />
                    <button
                      className="relative z-[2] flex items-center rounded-r bg-primary px-6 py-2.5 text-xs font-medium uppercase leading-tight text-[#4b2848] shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
                      type="button"
                      onClick={handleSendMessage}
                      id="button-addon1"
                      data-te-ripple-init
                      data-te-ripple-color="light"
                    >
                      <span className="material-symbols-outlined">send</span>
                    </button>
                  </div>
                </ChatInput>
              </div>
            ) : (
              <div className="flex flex-col flex-grow p-4 overflow-auto">
                <p className="mx-auto my-auto ">
                  Select person to start messaging
                </p>
              </div>
            )}
          </div>
          <div className="w-2/5 mt-5 p-1 m-2 overflow-y-auto bg-white rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.27),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
            {profiles ? (
              profiles.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() =>
                    joinChatroom(
                      profile.id,
                      profile.members[0].id,
                      profile.members[0].profile_picture
                    )
                  }
                  className="flex items-center rounded-lg m-1 cursor-pointer bg-gray-300 p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]"
                >
                  {profile.unseen_message_count > 0 && (
                    <div className="absolute top-0 left-0 bg-red-500 text-white px-2 py-1 rounded-full w-6 h-6 flex items-center justify-center">
                      {profile.unseen_message_count}
                    </div>
                  )}

                  <img
                    className="w-14 rounded-full h-14  mr-2"
                    src={BASE_URL + profile.members[0].profile_picture}
                    alt="profile"
                  />
                  <div className="flex-grow">
                    <h5 className="mb-1 text-sm font-medium leading-tight text-neutral-800 text-start">
                      {profile.members[0].username}
                    </h5>
                  </div>
                </div>
              ))
            ) : (
              <p>No profiles available.</p>
            )}
          </div>
        </div>
      </MessageContentWrapper>
    </MessagePage>
  );
};

export default Messages;
