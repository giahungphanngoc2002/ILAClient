import axios from "axios";

export const createNotification = async (notificationData) => {
    const res = await axios.post(`http://localhost:3001/api/notification/createNotification`, notificationData);
    return res.data;
};

export const getAllNotifications = async () => {
    const res = await axios.get(`http://localhost:3001/api/notification/allNotification`);
    return res.data;
};

export const getNotificationsForReceiver = async (receiverId) => {
   
        const response = await axios.get(`http://localhost:3001/api/notification/notifications/${receiverId}`);
        return response.data;
    
};

export const getDetailNotificationById = async (id) => {
    const res = await axios.get(`http://localhost:3001/api/notification/detailsNotification/${id}`);
    return res.data;
};
