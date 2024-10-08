const NotificationItem = ({ id, type, label, description, status, date, isNew, markAsRead }) => {
    const typeColors = {
        announcement: 'bg-blue-500 text-white',
        message: 'bg-yellow-500 text-white'
    };

    const typeLabels = {
        announcement: 'School Announcement',
        message: 'New Message'
    };

    return (
        <div
            className={`flex items-start py-3 px-4 border-b border-gray-200 ${isNew ? 'bg-blue-100' : ''} cursor-pointer`}
            onClick={() => markAsRead(id)}
        >
            <button className="p-2 text-gray-500 hover:text-gray-700">✖</button>
            <div className="flex flex-col w-full pl-3">
                <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${typeColors[status]}`}>{typeLabels[status]}</span>
                    <h4 className="font-semibold text-gray-800">{label}</h4>
                    {isNew && <span className="text-xs text-red-500 font-semibold">New</span>}
                </div>
                <p className="text-sm text-gray-600">{description}</p>
                <div className="text-sm text-gray-500 mt-1">{date}</div>
            </div>
        </div>
    );
};

export default NotificationItem;