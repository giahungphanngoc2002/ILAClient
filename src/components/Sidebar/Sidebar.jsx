import { NavLink } from 'react-router-dom';
import { FaHome, FaCar, FaUserShield, FaShoppingCart, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';

export const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-blue-600 text-white">
      {/* Logo Section */}
      <div className="flex items-center justify-center py-4">
        <span className="text-3xl font-semibold">ILA</span>
      </div>

      {/* Menu Items */}
      <nav className="mt-8">
        <ul className="p-0">
          <li>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `flex items-center p-4 no-underline text-white ${isActive ? 'bg-blue-500' : 'hover:bg-blue-500'}`
              }
            >
              <FaHome className="mr-3" />
              <span>Tổng quát</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/user"
              className={({ isActive }) =>
                `flex items-center p-4 no-underline text-white ${isActive ? 'bg-blue-500' : 'hover:bg-blue-500'}`
              }
            >
              <FaUserShield className="mr-3" />
              <span>Tài khoản</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/class"
              className={({ isActive }) =>
                `flex items-center p-4 no-underline text-white ${isActive ? 'bg-blue-500' : 'hover:bg-blue-500'}`
              }
            >
              <FaCar className="mr-3" />
              <span>Lớp học</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/test123"
              className={({ isActive }) =>
                `flex items-center p-4 no-underline text-white ${isActive ? 'bg-blue-500' : 'hover:bg-blue-500'}`
              }
            >
              <FaShoppingCart className="mr-3" />
              <span>Doanh thu</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/test123"
              className={({ isActive }) =>
                `flex items-center p-4 no-underline text-white ${isActive ? 'bg-blue-500' : 'hover:bg-blue-500'}`
              }
            >
              <FaCalendarAlt className="mr-3" />
              <span>Đánh giá</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/test123"
              className={({ isActive }) =>
                `flex items-center p-4 no-underline text-white ${isActive ? 'bg-blue-500' : 'hover:bg-blue-500'}`
              }
            >
              <FaSignOutAlt className="mr-3" />
              <span>Đăng xuất</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};
