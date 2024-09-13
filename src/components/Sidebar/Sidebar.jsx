import { NavLink } from 'react-router-dom';
import { FaHome, FaCar, FaUserShield, FaShoppingCart, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';

export const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white shadow-lg">
      {/* Logo Section */}
      <div className="flex items-center justify-center py-6 border-b border-blue-500">
        <NavLink to="/" className="text-3xl font-bold tracking-wider no-underline text-white">ILA</NavLink>
      </div>

      {/* Menu Items */}
      <nav className="mt-10">
        <ul className="space-y-2 p-0">
          <li>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `flex items-center p-4 mx-3 rounded-lg no-underline transition-colors duration-300 text-lg font-medium ${isActive ? 'bg-blue-500 text-white shadow-md' : 'text-blue-200 hover:bg-blue-700 hover:shadow-lg'
                }`
              }
            >
              <FaHome className="mr-3 text-xl" />
              <span>Tổng quát</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/user"
              className={({ isActive }) =>
                `flex items-center p-4 mx-3 rounded-lg no-underline transition-colors duration-300 text-lg font-medium ${isActive ? 'bg-blue-500 text-white shadow-md' : 'text-blue-200 hover:bg-blue-700 hover:shadow-lg'
                }`
              }
            >
              <FaUserShield className="mr-3 text-xl" />
              <span>Tài khoản</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/class"
              className={({ isActive }) =>
                `flex items-center p-4 mx-3 rounded-lg no-underline transition-colors duration-300 text-lg font-medium ${isActive ? 'bg-blue-500 text-white shadow-md' : 'text-blue-200 hover:bg-blue-700 hover:shadow-lg'
                }`
              }
            >
              <FaCar className="mr-3 text-xl" />
              <span>Lớp học</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/revenue"
              className={({ isActive }) =>
                `flex items-center p-4 mx-3 rounded-lg no-underline transition-colors duration-300 text-lg font-medium ${isActive ? 'bg-blue-500 text-white shadow-md' : 'text-blue-200 hover:bg-blue-700 hover:shadow-lg'
                }`
              }
            >
              <FaShoppingCart className="mr-3 text-xl" />
              <span>Doanh thu</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/reviews"
              className={({ isActive }) =>
                `flex items-center p-4 mx-3 rounded-lg no-underline transition-colors duration-300 text-lg font-medium ${isActive ? 'bg-blue-500 text-white shadow-md' : 'text-blue-200 hover:bg-blue-700 hover:shadow-lg'
                }`
              }
            >
              <FaCalendarAlt className="mr-3 text-xl" />
              <span>Đánh giá</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/logout"
              className={({ isActive }) =>
                `flex items-center p-4 mx-3 rounded-lg no-underline transition-colors duration-300 text-lg font-medium ${isActive ? 'bg-red-500 text-white shadow-md' : 'text-red-200 hover:bg-red-700 hover:shadow-lg'
                }`
              }
            >
              <FaSignOutAlt className="mr-3 text-xl" />
              <span>Đăng xuất</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};
