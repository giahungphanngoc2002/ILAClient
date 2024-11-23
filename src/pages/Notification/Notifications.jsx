import React, { useState, useEffect } from 'react';
import NotificationItem from './NotificationItem';
import { useSelector } from 'react-redux';
import * as NotificationService from "../../services/NotificationService";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useSelector((state) => state.user);
    const [receiverId, setReceiverId] = useState(user?.id);

    console.log(user?.id)
    useEffect(() => {
        setReceiverId(user?.id);
    }, [user]);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!receiverId) return; // Chỉ tiếp tục nếu có receiverId

            try {
                const response = await NotificationService.getNotificationsForReceiver(receiverId);
                setNotifications(response.data); // Lấy mảng thông báo từ `response.data`
                console.log("response", response)
            } catch (err) {
                setError("Failed to load notifications");
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [receiverId]);

    console.log(notifications);

    const markAsRead = (_id) => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
                notification._id === _id ? { ...notification, isNew: false } : notification
            )
        );
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="mx-auto bg-white rounded-lg shadow-md mt-8" style={{ width: '70%' }}>
            {notifications.map((notification) => (
                <NotificationItem key={notification._id} {...notification} markAsRead={markAsRead} />
            ))}
        </div>
    );
};

export default Notifications;