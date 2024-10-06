import React, { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { SidebarItem } from "../../components/Sidebar/SidebarItem";

import { CalendarClock, Bell, User, Settings } from "lucide-react";
import Calendar from "./Calender";
import MyClass from "./StudentTable";
import Dashboard from "../Dashboard/Dashboard";
import MyClasses from "../MyClasses/MyClasses";

const Admin = () => {
  const [activeContent, setActiveContent] = useState("Home");
  const [expanded, setExpanded] = useState(true);

  const renderContent = () => {
    switch (activeContent) {
      case "schedule":
        return <Calendar />;
      case "my-class":
        return <MyClasses />;
      case "Settings":
        return <h1 className="text-2xl font-bold">Settings</h1>;
      case "Notifications":
        return <h1 className="text-2xl font-bold">Notifications</h1>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar expanded={expanded} setExpanded={setExpanded}>
        {/* Sidebar items */}
        <SidebarItem
          icon={<CalendarClock size={20} />}
          text="Lịch làm việc"
          active={activeContent === "schedule"}
          alert={false}
          onClick={() => setActiveContent("schedule")}
        />
        <SidebarItem
          icon={<User size={20} />}
          text="Quản lý lớp"
          active={activeContent === "my-class"}
          alert={false}
          onClick={() => setActiveContent("my-class")}
        />
        <SidebarItem
          icon={<Settings size={20} />}
          text="Settings"
          active={activeContent === "Settings"}
          alert={false}
          onClick={() => setActiveContent("Settings")}
        />
        <SidebarItem
          icon={<Bell size={20} />}
          text="Notifications"
          active={activeContent === "Notifications"}
          alert={true}
          onClick={() => setActiveContent("Notifications")}
        />
      </Sidebar>

      {/* Main Content */}
      <div className={`flex-1 p-10 transition-all duration-300 ${expanded ? "ml-20" : "ml-20"}`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Admin;
