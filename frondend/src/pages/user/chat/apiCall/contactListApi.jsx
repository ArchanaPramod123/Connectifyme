import axiosInstance from "../../../../utils/axiosInstance";

const contactListApi = async () => {
    try {
      const response = await axiosInstance({
        url: '/chat/chatrooms/',
        method: "GET",
      });
      
      if (response.status === 200) {
        console.log("contact lists for chat", response.data);
        return response.data;
      } else {
        console.log(response.error);
      }
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

export default contactListApi
  