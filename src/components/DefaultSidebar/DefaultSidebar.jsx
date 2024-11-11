import React, { useState } from 'react';
import { CalendarClock, Bell, User, School, Search, Book } from "lucide-react";
import Sidebar from '../Sidebar/Sidebar';
import { SidebarItem } from '../Sidebar/SidebarItem';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MdLogout } from "react-icons/md";
import * as UserService from "../../services/UserService";
import { resetUser } from "../../redux/slices/userSlide";
import { FaBookReader } from "react-icons/fa";
import { TbReport } from 'react-icons/tb';
import { BiMailSend } from "react-icons/bi";
import { MdOutlineMessage } from "react-icons/md";
import { FaHome } from "react-icons/fa";

const DefaultSidebar = () => {
    const [expanded, setExpanded] = useState(false);
    const [activeItem, setActiveItem] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    // Định nghĩa các hàm điều hướng
    const goToNotification = () => {
        setActiveItem('Thông báo');
        navigate('/manage/notification');
    };

    const goToProfile = () => {
        setActiveItem('Thông tin cá nhân');
        navigate('/manage/profile');
    };

    const handleLogout = async () => {
        await UserService.logoutUser();
        localStorage.removeItem("access_token");
        dispatch(resetUser());
        navigate("/");
    };

    const goToHome = () => {
        setActiveItem('Trang chủ');
        navigate('/manage');
    }

    const sidebarItems = [
        { icon: <MdOutlineMessage size={20} />, text: "Tin nhắn", path: '/manage/message', role: "Teacher" },
        { icon: <CalendarClock size={20} />, text: "Thời khoá biểu", path: '/manage/manageSchedule', role: "Admin" },
        { icon: <Bell size={20} />, text: "Chia lớp", path: '/manage/classDivision', role: "Admin" },
        { icon: <Bell size={20} />, text: "Tạo lịch thi", path: '/manage/examSchedule', role: "Admin" },
        { icon: <MdOutlineMessage size={20} />, text: "Tin nhắn", path: '/student/message', role: "User" },
    ];

    const filteredItems = () => {
        return sidebarItems.filter(item =>
            item.text.toLowerCase().includes(searchTerm.toLowerCase())
        ).filter(item => item.role === user.role);
    };

    return (
        <Sidebar expanded={expanded} setExpanded={setExpanded}>
            <div className="flex flex-col h-full">
                <div className={``}>
                    <div
                        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md bg-gray-200 text-gray-600 cursor-pointer transition-colors group hover:bg-blue-50`}
                    >
                        <Search className="text-gray-500" size={20} />
                        {expanded && (
                            <input
                                type="text"
                                placeholder="Tìm kiếm"
                                style={{ fontSize: "16px" }}
                                className="ml-3 w-full text-ellipsis bg-transparent outline-none placeholder-gray-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật giá trị tìm kiếm
                            />
                        )}
                    </div>
                </div>
                <SidebarItem
                    key='Trang chủ'
                    icon={<FaHome size={20} />}
                    text='Trang chủ'
                    active={activeItem === 'Trang chủ'}
                    onClick={goToHome}
                />

                {filteredItems().map((item) => (
                    <SidebarItem
                        key={item.text}
                        icon={item.icon}
                        text={item.text}
                        active={activeItem === item.text}
                        onClick={() => {
                            setActiveItem(item.text);
                            navigate(item.path); // Chuyển hướng theo đường dẫn
                        }}
                    />
                ))}

                {/* Phần này nằm dưới cùng */}
                <div className="mt-auto">
                    <SidebarItem
                        icon={<Bell size={20} />}
                        text="Thông báo"
                        active={activeItem === 'Thông báo'}
                        onClick={goToNotification} // Đã định nghĩa
                    />
                    <SidebarItem
                        icon={<User size={20} />}
                        text="Thông tin cá nhân"
                        active={activeItem === 'Thông tin cá nhân'}
                        onClick={goToProfile} // Đã định nghĩa
                    />
                    <SidebarItem
                        icon={<MdLogout size={20} />}
                        text="Đăng xuất"
                        active={activeItem === 'Đăng xuất'}
                        onClick={handleLogout} // Đã định nghĩa
                    />
                </div>
            </div>
        </Sidebar>
    );
};

export default DefaultSidebar;