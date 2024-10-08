import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import { createContext, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// Create and export SidebarContext
export const SidebarContext = createContext();

export default function Sidebar({ children, expanded, setExpanded }) {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  console.log(user)
  return (
    <aside className={`h-screen ${expanded ? "w-64" : "w-20"} transition-width duration-300`}>
      <nav className="fixed h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className={`flex items-center justify-center no-underline overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }} // Styling button to look like a link
          >
            <img src="/images/logoILA.png" alt="Logo" className="h-16 scale-150" />
            <p className="text-4xl m-0 text-blue-600 tracking-widest font-bold">ILA</p>
          </button>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3 overflow-y-auto">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt=""
            className="w-10 h-10 rounded-md"
          />
          <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
            <div className="leading-4">
              <h4 className="font-semibold">John Doe</h4>
              <span className="text-xs text-gray-600">johndoe@gmail.com</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
}
