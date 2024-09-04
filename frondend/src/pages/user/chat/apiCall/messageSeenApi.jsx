import axiosInstance from "../../../../utils/axiosInstance";
const messageSeenApi = async (userId) => {
    try {
      const response = await axiosInstance({
        url: `/chat/seen/${userId}/`,
        method: "GET",
      });
      if (response.status === 200) {
        console.log("message seen", response.data);
        return response.data;
      } else {
        console.log(response.error);
      }
    } catch (error) {
      console.error(error);
    }
  };
export default messageSeenApi