const NotificationItem = ({ 
    _id, 
    title, 
    content, 
    status, 
    createdAt, 
    isNew, 
    markAsRead 
}) => {
    const typeColors = {
        announcement: 'bg-blue-500 text-white',
        message: 'bg-yellow-500 text-white'
    };

    const typeLabels = {
        announcement: 'School Announcement',
        message: 'New Message'
    };

    // Đặt màu nền dựa trên trạng thái `isNew`
    const backgroundColor = isNew ? 'bg-blue-100' : 'bg-white';

    return (
        <div
            className={`flex items-start py-3 px-4 border-b border-gray-200 ${backgroundColor} cursor-pointer`}
            onClick={() => markAsRead(_id)}
        >
            <button className="p-2 text-gray-500 hover:text-gray-700">✖</button>
            <div className="flex flex-col w-full pl-3">
                <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${typeColors[status] || 'bg-gray-300'}`}>
                        {typeLabels[status] || 'Notification'}
                    </span>
                    <h4 className="font-semibold text-gray-800">{title}</h4>
                    {isNew && <span className="text-xs text-red-500 font-semibold">New</span>}
                </div>
                <p className="text-sm text-gray-600">{content}</p>
                <div className="text-sm text-gray-500 mt-1">{new Date(createdAt).toLocaleString()}</div>
            </div>
        </div>
    );
};

export default NotificationItem;
