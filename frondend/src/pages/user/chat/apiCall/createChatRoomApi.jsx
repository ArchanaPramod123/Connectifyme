import axiosInstance from "../../../../utils/axiosInstance";

const createChatRoomApi = async (userId) => {
    try {
      const response = await axiosInstance({
        url: `/chat/create-room/${userId}/`,
        method: 'POST',
      });
      if (response.status === 200) {
        console.log("chat room api", response.data);
        return response.data;
      }else if(response.status === 200){
        console.log("chat room created", response.data);
        return response.data;
      } else {
        console.log(response.error);
      }
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

export default createChatRoomApi
  

