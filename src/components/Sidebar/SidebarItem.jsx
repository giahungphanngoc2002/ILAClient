import { useContext } from "react";
import { SidebarContext } from './Sidebar';  // Now correctly imported

export function SidebarItem({ icon, text, active, alert, onClick }) {
    const { expanded } = useContext(SidebarContext);

    return (
        <li
            onClick={onClick}
            className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group 
            ${active ? "bg-gradient-to-tr from-blue-200 to-blue-100 text-blue-800" : "hover:bg-blue-50 text-gray-600"}`}
        >
            {icon}
            <span className={`overflow-hidden text-ellipsis whitespace-nowrap transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
                {text}
            </span>
            {alert && (
                <div className={`absolute right-2 w-2 h-2 rounded bg-blue-400 ${expanded ? "" : "top-2"}`} />
            )}
        </li>
    );
}