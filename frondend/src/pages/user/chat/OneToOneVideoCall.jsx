// import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
// import { useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { useRef, useEffect } from "react";

// const OneToOneVideoCall = () => {
//   let { roomId } = useParams();
//   const containerRef = useRef(null);
//   const navigate = useNavigate();

//   const { user_id } = useSelector((state) => state.authenticationUser);
//   const zpRef = useRef(null);

//   const handleLeaveRoom = () => {
//     console.log("Leaving room...");
//     if (zpRef.current) {
//       zpRef.current.destroy();
//       zpRef.current = null;
//     }
//     navigate(`/chat`);
//   };

//   useEffect(() => {
//     const startVideoCall = async () => {
//       try {
//         const appID = 1102882029;
//         const serverSecret = "53f2eadffc8927cdebad035ede61a24a";
//         const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
//           appID,
//           serverSecret,
//           roomId,
//           Date.now().toString(),
//           user_id
//         );

//         const zp = ZegoUIKitPrebuilt.create(kitToken);
//         zpRef.current = zp;

//         zp.joinRoom({
//           container: containerRef.current,
//           scenario: {
//             mode: ZegoUIKitPrebuilt.OneToOneVideoCall,
//           },
//           turnOnCameraWhenJoining: true,
//           turnOnMicrophoneWhenJoining: true,
//           showPreJoinView: false,
//           onLeaveRoom: handleLeaveRoom,
//         });
//       } catch (error) {
//         console.error("Error generating kit token:", error);
//       }
//     };

//     startVideoCall();
//   }, [roomId, user_id, navigate]);

//   return (
//     <div className="w-screen h-screen">
//       <div className="w-full h-full" ref={containerRef} />
//     </div>
//   );
// };

// export default OneToOneVideoCall;













import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useRef, useEffect } from "react";

const OneToOneVideoCall = () => {
    let { roomId } = useParams();
    const containerRef = useRef(null);
    const navigate = useNavigate();
  
    const { user_id } = useSelector((state) => state.auth); // Adjusted to match your auth state
    const zpRef = useRef(null);
  
    const handleLeaveRoom = () => {
      if (zpRef.current) {
        zpRef.current.destroy();
        zpRef.current = null;
      }
      navigate(`/chat`);
    };
  
    useEffect(() => {
      const startVideoCall = async () => {
        try {
          const appID = 1102882029;
          const serverSecret = "53f2eadffc8927cdebad035ede61a24a";
          const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomId,
            Date.now().toString(),
            user_id
          );
  
          const zp = ZegoUIKitPrebuilt.create(kitToken);
          zpRef.current = zp;
  
          zp.joinRoom({
            container: containerRef.current,
            scenario: {
              mode: ZegoUIKitPrebuilt.OneToOneVideoCall,
            },
            turnOnCameraWhenJoining: true,
            turnOnMicrophoneWhenJoining: true,
            showPreJoinView: false,
            onLeaveRoom: handleLeaveRoom,
          });
        } catch (error) {
          console.error("Error generating kit token:", error);
        }
      };
  
      startVideoCall();
    }, [roomId, user_id, navigate]);
  
    return (
      <div className="w-screen h-screen">
        <div className="w-full h-full" ref={containerRef} />
      </div>
    );
  };
  
  export default OneToOneVideoCall;
  