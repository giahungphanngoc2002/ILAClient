import React, { useState, useEffect } from 'react';
import NotificationItem from './NotificationItem';
import { useSelector } from 'react-redux';
import * as NotificationService from "../../services/NotificationService";
import { IoNotificationsOffOutline } from "react-icons/io5";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useSelector((state) => state.user);
    const [receiverId, setReceiverId] = useState(user?.id);

    console.log(user?.id);
    useEffect(() => {
        setReceiverId(user?.id);
    }, [user]);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!receiverId) return; // Chỉ tiếp tục nếu có receiverId

            try {
                const response = await NotificationService.getNotificationsForReceiver(receiverId);
                setNotifications(response.data); // Lấy mảng thông báo từ response.data
                console.log("response", response);
            } catch (err) {
                setError("Chưa có thông báo mới nhất");
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

    if (error || notifications.length === 0) {
        return (
            <div
                className="flex flex-col justify-center items-center"
                style={{
                    textAlign: 'center',
                    padding: '20px',
                    height: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <IoNotificationsOffOutline
                    style={{
                        fontSize: '80px', // Kích thước icon lớn hơn
                        color: '#666',
                        marginBottom: '20px',
                    }}
                />
                <div style={{ fontSize: '16px', color: '#666' }}>
                    {error ? "Chưa có thông báo nào mới nhất" : "Chưa có thông báo nào mới nhất"}
                </div>
            </div>
        );
    }

    return (
        <div>
            {notifications.map((notification) => (
                <NotificationItem key={notification._id} {...notification} markAsRead={markAsRead} />
            ))}
        </div>
    );
};

export default Notifications;
