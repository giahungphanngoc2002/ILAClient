import { FaBell, FaFlag, FaSearch } from 'react-icons/fa';

export const TopBar = () => {
  return (
    <div className="flex items-center justify-between bg-white p-4 shadow-lg">
      {/* Search bar */}
      <div className="relative w-full max-w-sm">
        <input
          type="text"
          placeholder="Search or type..."
          className="w-full border border-gray-300 rounded-full pl-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
          <FaSearch />
        </span>
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-6">
        <FaFlag className="text-gray-500 hover:text-blue-500 transition-colors duration-200 cursor-pointer" />
        <FaBell className="text-gray-500 hover:text-blue-500 transition-colors duration-200 cursor-pointer" />
        <img
          src="https://via.placeholder.com/40" // Replace with actual image URL
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500"
        />
      </div>
    </div>
  );

};