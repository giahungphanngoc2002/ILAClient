import { AiFillBell, AiOutlineClockCircle } from 'react-icons/ai'; // Notification and time icons
import { FaUserTie, FaSchool } from 'react-icons/fa'; // Role icons

const NotificationItem = ({
    _id,
    title,
    content,
    status,
    senderId,
    createdAt,
    isNew,
    markAsRead
}) => {
    const typeLabels = {
        announcement: 'School Announcement',
        message: 'New Message'
    };

    // Set background color based on `isNew` status
    const backgroundColor = isNew ? 'bg-blue-100' : 'bg-white';

    // Define styles and labels based on sender's role
    const roleLabel = senderId?.role === "Teacher" ? "Giáo viên bộ môn" : senderId?.role === "Admin" ? "Ban giám hiệu" : "Notification";
    const roleBadgeColor = senderId?.role === "Teacher" ? 'bg-blue-500' : senderId?.role === "Admin" ? 'bg-blue-600' : 'bg-gray-500';

    // Icon based on role
    const roleIcon = senderId?.role === "Teacher" ? <FaUserTie className="text-white" /> : senderId?.role === "Admin" ? <FaSchool className="text-white" /> : <AiFillBell className="text-white" />;

    return (
        <div className="flex justify-center w-full">
            <div
                className={`w-[70%] flex items-start py-4 px-6 border-b border-gray-200 ${backgroundColor} cursor-pointer hover:bg-blue-50 transition duration-150`}
                onClick={() => markAsRead(_id)}
            >
                {/* Left Badge Icon for Role */}
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${roleBadgeColor}`}>
                    {roleIcon}
                </div>

                {/* Right Section: Main Content */}
                <div className="flex flex-col w-full pl-4 space-y-2">
                    {/* Notification Header */}
                    <div className="flex items-center space-x-3">
                        {/* Badge Label */}
                        <span className={`text-xs px-3 py-1 rounded-full font-medium text-white ${roleBadgeColor}`}>
                            {roleLabel}
                        </span>
                        <h4 className="font-semibold ml-2 mb-0">{title}</h4>

                        {/* "New" Indicator */}
                        {isNew && (
                            <span className="flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                            </span>
                        )}
                    </div>

                    {/* Notification Content */}
                    <p className="text-sm text-gray-700 leading-snug">{content}</p>

                    {/* Footer: Sender's Name and Date */}
                    <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                        {/* Sender */}
                        <div className="flex items-center space-x-1">
                            <FaUserTie className="text-blue-600" />
                            <span>Người gửi: {senderId?.name || "Unknown"}</span>
                        </div>

                        {/* Date with Clock Icon */}
                        <div className="flex items-center space-x-1">
                            <AiOutlineClockCircle className="text-blue-600" />
                            <time>{new Date(createdAt).toLocaleDateString()} {new Date(createdAt).toLocaleTimeString()}</time>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default NotificationItem;
