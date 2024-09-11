import { FaBell, FaFlag } from 'react-icons/fa';

export const TopBar = () => {
    return (
      <div className="flex items-center justify-between bg-white p-4 shadow-sm">
        {/* Search bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search or type"
            className="border border-gray-300 rounded-full pl-4 pr-10 py-2 focus:outline-none"
          />
          <span className="absolute right-3 top-2 text-gray-400">
            🔍 {/* You can replace with an actual search icon */}
          </span>
        </div>
  
        {/* Icons */}
        <div className="flex items-center space-x-4">
          <FaFlag className="text-gray-500 cursor-pointer" />
          <FaBell className="text-gray-500 cursor-pointer" />
          <img
            src="https://via.placeholder.com/40" // Replace with actual image URL
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      </div>
    );
  };