import React, { useState } from 'react';
import { CalendarClock, Bell, User, Settings, School } from "lucide-react";
import Sidebar from '../Sidebar/Sidebar';
import { SidebarItem } from '../Sidebar/SidebarItem';
import { useNavigate } from 'react-router-dom';

const DefaultSidebar = () => {
    const [expanded, setExpanded] = useState(false);
    const [activeItem, setActiveItem] = useState(''); // Thêm state cho active item
    const navigate = useNavigate();

    const goToScheduleTeacher = () => {
        setActiveItem('Lịch làm việc');
        navigate('/teacher/calender');
    };

    const goToMyClass = () => {
        setActiveItem('Quản lý lớp');
        navigate('/teacher/myClass');
    };

    const goToProfile = () => {
        setActiveItem('Thông tin cá nhân');
        navigate('/teacher/profile');
    };

    const goToNotification = () => {
        setActiveItem('Thông báo');
        navigate('/teacher/notification');
    };

    return (
        <Sidebar expanded={expanded} setExpanded={setExpanded}>
            <SidebarItem
                icon={<CalendarClock size={20} />}
                text="Lịch làm việc"
                active={activeItem === 'Lịch làm việc'} // Kiểm tra nếu item này đang active
                onClick={goToScheduleTeacher}
            />
            <SidebarItem
                icon={<School size={20} />}
                text="Quản lý lớp"
                active={activeItem === 'Quản lý lớp'} // Kiểm tra nếu item này đang active
                onClick={goToMyClass}
            />
            <SidebarItem
                icon={<User size={20} />}
                text="Thông tin cá nhân"
                active={activeItem === 'Thông tin cá nhân'} // Kiểm tra nếu item này đang active
                onClick={goToProfile}
            />
            <SidebarItem
                icon={<Bell size={20} />}
                text="Thông báo"
                active={activeItem === 'Thông báo'} // Kiểm tra nếu item này đang active
                onClick={goToNotification}
            />
        </Sidebar>
    );
};

export default DefaultSidebar;
