import axios from "axios";



const NOTIFICATION_API_URL =
    process.env.NODE_ENV === "production"
        ? "https://ila-server-2-3bw0.onrender.com/api/notification"
        : "http://localhost:3001/api/notification";

// Tạo thông báo
export const createNotification = async (notificationData) => {
    const res = await axios.post(`${NOTIFICATION_API_URL}/createNotification`, notificationData);
    return res.data;
};

// Lấy tất cả thông báo
export const getAllNotifications = async () => {
    const res = await axios.get(`${NOTIFICATION_API_URL}/allNotification`);
    return res.data;
};

// Lấy thông báo cho một người nhận cụ thể
export const getNotificationsForReceiver = async (receiverId) => {
    const res = await axios.get(`${NOTIFICATION_API_URL}/notifications/${receiverId}`);
    return res.data;
};

// Lấy chi tiết thông báo theo ID
export const getDetailNotificationById = async (id) => {
    const res = await axios.get(`${NOTIFICATION_API_URL}/detailsNotification/${id}`);
    return res.data;
};

export const getAllNotificationsBySenderId = async (senderId) => {
    const res = await axios.get(`${NOTIFICATION_API_URL}/notificationsSender/${senderId}`);
    return res.data;
};
