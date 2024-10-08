import React, { useState } from 'react';
import NotificationItem from './NotificationItem';

const initialNotifications = [
    { id: 1, type: 'School Announcement', label: 'New School Policy Updates', description: 'Check out the latest updates from the administration.', status: 'announcement', date: '24 Nov 2018 at 9:30 AM', isNew: true },
    { id: 2, type: 'New Message', label: 'Message from your Teacher', description: 'Your teacher has sent a new assignment update.', status: 'message', date: '24 Nov 2018 at 10:00 AM', isNew: true },
    { id: 3, type: 'School Announcement', label: 'Upcoming Parent-Teacher Meeting', description: 'Don\'t forget the parent-teacher meeting on Friday.', status: 'announcement', date: '24 Nov 2018 at 11:00 AM', isNew: true },
    { id: 4, type: 'New Message', label: 'Message from Classmate', description: 'Darren sent a message regarding the group project.', status: 'message', date: '24 Nov 2018 at 12:00 PM', isNew: false }
];

const Notifications = () => {
    const [notifications, setNotifications] = useState(initialNotifications);

    const markAsRead = (id) => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
                notification.id === id ? { ...notification, isNew: false } : notification
            )
        );
    };

    // Hàm đếm số lượng thông báo mới
    const countNewNotifications = () => {
        return notifications.filter(notification => notification.isNew).length;
    };

    return (
        <div className="mx-auto bg-white rounded-lg shadow-md mt-8" style={{ width: '70%' }}>
            
            {notifications.map((notification) => (
                <NotificationItem key={notification.id} {...notification} markAsRead={markAsRead} />
            ))}
        </div>
    );
};

export default Notifications;
