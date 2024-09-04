import axiosInstance from '../../../utils/axiosInstance'

const notificationSeenApi = async (notificationId) => {
    try {
      const response = await axiosInstance({
        url: `/post/notifications-seen/${notificationId}/`,
        method: "GET",
      });
      if (response.status === 200) {
        console.log("notification seen", response.data);
        return response.data;
      } else {
        console.log(response.error);
      }
    } catch (error) {
      return error
    }
  };

export default notificationSeenApi