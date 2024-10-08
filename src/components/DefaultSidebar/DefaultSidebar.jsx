// MainComponent.js
import React from 'react';
import { CalendarClock, Bell, User, Settings } from "lucide-react";
import Sidebar from '../Sidebar/Sidebar';
import { SidebarItem } from '../Sidebar/SidebarItem';
import { useNavigate } from 'react-router-dom';

const DefaultSidebar = () => {
    const [expanded, setExpanded] = React.useState(false);
    const navigate = useNavigate();

    const goToScheduleTeacher = () => {
        navigate('/teacher/calender')
    }

    const goToMyClass = () => {
        navigate('/teacher/myClass')
    }
    return (
        <Sidebar expanded={expanded} setExpanded={setExpanded}>
            <SidebarItem
                icon={<CalendarClock size={20} />}
                text="Lịch làm việc"
                onClick={goToScheduleTeacher}
            />
            <SidebarItem
                icon={<User size={20} />}
                text="Quản lý lớp"
                onClick={goToMyClass}
            />
            <SidebarItem
                icon={<Settings size={20} />}
                text="Settings"
            // onClick={() => setActiveContent("Settings")}
            />
            <SidebarItem
                icon={<Bell size={20} />}
                text="Notifications"
            // onClick={() => setActiveContent("Notifications")}
            />
        </Sidebar>

    );
};

export default DefaultSidebar;
