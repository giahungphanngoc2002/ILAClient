import React, { useState } from 'react';
import { CalendarClock, Bell, User, Settings, School } from "lucide-react";
import Sidebar from '../Sidebar/Sidebar';
import { SidebarItem } from '../Sidebar/SidebarItem';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MdLogout } from "react-icons/md";
import * as UserService from "../../services/UserService";
import { resetUser } from "../../redux/slices/userSlide";

const DefaultSidebar = () => {
    const [expanded, setExpanded] = useState(false);
    const dispatch = useDispatch();
    const [activeItem, setActiveItem] = useState(''); // Thêm state cho active item
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    console.log(user)

    const handleLogout = async () => {
        await UserService.logoutUser();
        localStorage.removeItem("access_token");
        dispatch(resetUser());
        navigate("/");
    };

    const goToScheduleTeacher = () => {
        setActiveItem('Lịch làm việc');
        navigate('/manage/calender');
    };

    const goToMyClass = () => {
        setActiveItem('Quản lý lớp');
        navigate('/manage/myClass');
    };

    const goToProfile = () => {
        setActiveItem('Thông tin cá nhân');
        navigate('/manage/profile');
    };

    const goToNotification = () => {
        setActiveItem('Thông báo');
        navigate('/manage/notification');
    };

    const goToClassDivision = () => {
        setActiveItem('Chia lớp');
        navigate('/manage/classDivision');
    };

    const goToManageSchedule = () => {
        setActiveItem('Thời khoá biểu');
        navigate('/manage/manageSchedule');
    };

    const goToTimeTable = () => {
        setActiveItem('Thời khoá biểu');
        navigate('/student/timeTable');
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

                    </>
                )
            }
            <SidebarItem
                icon={<Bell size={20} />}
                text="Thông báo"
                active={activeItem === 'Thông báo'}
                onClick={goToNotification}
            />
            <SidebarItem
                icon={<MdLogout size={20} />}
                text="Đăng xuất"
                active={activeItem === 'Đăng xuất'}
                onClick={handleLogout}
            />

            {user.role === "Admin" && (
                <>
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
            )}
            {user.role === "User" && (
                <>
                    <SidebarItem
                        icon={<CalendarClock size={20} />}
                        text="Thời khoá biểu"
                        active={activeItem === 'Thời khoá biểu'}
                        onClick={goToTimeTable}
                    />
                    <SidebarItem
                        icon={<Bell size={20} />}
                        text="Chia lớp"
                        active={activeItem === 'Chia lớp'}
                        onClick={goToClassDivision}
                    />
                </>
            )}
        </Sidebar>
    );
};

export default DefaultSidebar;
