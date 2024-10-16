import React, { useState } from 'react';
import { CalendarClock, Bell, User, Settings, School } from "lucide-react";
import Sidebar from '../Sidebar/Sidebar';
import { SidebarItem } from '../Sidebar/SidebarItem';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DefaultSidebar = () => {
    const [expanded, setExpanded] = useState(false);
    const [activeItem, setActiveItem] = useState(''); // Thêm state cho active item
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    console.log(user)

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

    const goToClassDivision = () => {
        setActiveItem('Chia lớp');
        navigate('/teacher/classDivision');
    };

    const goToManageSchedule = () => {
        setActiveItem('Thời khoá biểu');
        navigate('/teacher/manageSchedule');
    };

    return (
        <Sidebar expanded={expanded} setExpanded={setExpanded}>
            {user.role === "Teacher" &&
                (
                    <>
                        <SidebarItem
                            icon={<CalendarClock size={20} />}
                            text="Lịch làm việc"
                            active={activeItem === 'Lịch làm việc'}
                            onClick={goToScheduleTeacher}
                        />
                        <SidebarItem
                            icon={<School size={20} />}
                            text="Quản lý lớp"
                            active={activeItem === 'Quản lý lớp'}
                            onClick={goToMyClass}
                        />
                        <SidebarItem
                            icon={<User size={20} />}
                            text="Thông tin cá nhân"
                            active={activeItem === 'Thông tin cá nhân'}
                            onClick={goToProfile}
                        />
                        <SidebarItem
                            icon={<Bell size={20} />}
                            text="Thông báo"
                            active={activeItem === 'Thông báo'}
                            onClick={goToNotification}
                        />
                        <SidebarItem
                            icon={<CalendarClock size={20} />}
                            text="Thời khoá biểu"
                            active={activeItem === 'Thời khoá biểu'}
                            onClick={goToManageSchedule}
                        />
                        <SidebarItem
                            icon={<Bell size={20} />}
                            text="Chia lớp"
                            active={activeItem === 'Chia lớp'}
                            onClick={goToClassDivision}
                        />
                    </>
                )
            }
            {user.role === "Admin" && (
                <>
                </>
            )}
        </Sidebar>
    );
};

export default DefaultSidebar;
