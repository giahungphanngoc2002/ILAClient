import { ChevronLast, ChevronFirst } from "lucide-react";
import { createContext } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiMoreHorizontal } from "react-icons/fi";

// Create and export SidebarContext
export const SidebarContext = createContext();

export default function Sidebar({ children, expanded, setExpanded }) {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  console.log(user.avatar === "")

  return (
    <aside
      className={`h-screen transition-all duration-300 overflow-x-hidden`}
      style={{ width: expanded ? "16%" : "84px" }}
    >
      <nav className="fixed h-full flex flex-col bg-white border-r shadow-sm">
        <div className="px-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className={`flex items-center justify-center no-underline overflow-hidden transition-all ${expanded ? "w-full" : "w-0"}`}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          >
            <img src="/images/logoILA.png" alt="Logo" className="h-16 scale-150" />
            <p className="text-4xl m-0 text-blue-600 tracking-widest font-bold">ILA</p>
          </button>

          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-transform duration-300"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3 overflow-y-auto">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <img
            src={user.avatar === "" ? "/images/sbcf-default-avatar.webp" : user.avatar}
            alt="User Avatar"
            className="w-10 h-10 rounded-md"
          />
          <div className={`overflow-hidden transition-all ${expanded ? "w-full ml-3" : "w-0"}`}>
            <div className="leading-4 flex items-center">
              <h4 className="font-semibold truncate">{user.name}</h4>
              {/* <FiMoreHorizontal className="ml-2 cursor-pointer" /> */}
            </div>
          </div>
        </div>
      </nav>
    </aside>

  );
}