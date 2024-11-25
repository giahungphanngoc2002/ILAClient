import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import * as NotificationService from "../../services/NotificationService";
import { useSelector } from "react-redux";

function HistorySendNotification() {
    const [selectedEmailId, setSelectedEmailId] = useState(null);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const [emails, setEmails] = useState([]);
    const user = useSelector((state) => state.user);

    useEffect(() => {
        // Hàm gọi API và cập nhật state
        const fetchNotifications = async () => {
            try {
                const data = await NotificationService.getAllNotificationsBySenderId(user?.id);
                setEmails(data.notifications); // Giả sử API trả về dữ liệu trong `data`
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        };

        fetchNotifications();
    }, [user?.id]);
    console.log(emails)

    useEffect(() => {

        const fetchNotificationDetail = async () => {
            if (selectedEmailId) {
                try {
                    const data = await NotificationService.getDetailNotificationById(selectedEmailId);
                    setSelectedEmail(data.data); // Giả sử API trả về dữ liệu trong `data`
                } catch (error) {
                    console.error("Failed to fetch notification details:", error);
                }
            }
        };

        fetchNotificationDetail();
    }, [selectedEmailId]);

    const filteredEmails = emails?.filter((email) =>
        email?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group emails by date in the format 'yyyy-mm-dd' and sort dates in descending order
    const groupedEmails = filteredEmails?.reduce((acc, email) => {
        const day = new Date(email.createdAt).toISOString().split('T')[0];
        if (!acc[day]) acc[day] = [];
        acc[day].push(email);
        return acc;
    }, {});

    const sortedDays = Object.keys(groupedEmails).sort((a, b) =>
        new Date(b) - new Date(a)
    );

    const goToCreateNotification = () => {
        if (user.role === "Teacher") {
            navigate('/manage/notificationToStudent');
        } else if (user.role === "Admin") {
            navigate('/manage/notificationToSchool');
        }
    };

    return (
        <div className="flex h-screen p-6">
            {/* Danh sách email */}
            <div className="bg-white w-1/3 border-r px-4 pb-4 overflow-y-auto h-full"
                style={{ borderTopLeftRadius: "16px", borderBottomLeftRadius: "16px" }}
            >
                <div
                    className="sticky top-0 bg-white z-10 pt-4"
                    style={{
                        paddingBottom: "8px",
                    }}
                >
                    <div className="flex justify-between mb-2">
                        <h2 className="text-xl font-semibold">Lịch sử gửi thông báo</h2>
                        <button onClick={goToCreateNotification} className="bg-blue-500 p-3 rounded"><GoPlus className="text-white" size={20} /></button>
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="space-y-2">
                    {sortedDays.length > 0 ? (
                        sortedDays.map((day) => (
                            <div key={day}>
                                {/* Header for each day */}
                                <div className="flex items-center rounded-lg py-2">
                                    <FaChevronDown className="text-gray-600 mx-2" />
                                    <p className="font-semibold text-gray-800 flex-grow m-0">
                                        {new Date(day).toLocaleDateString("vi-VN")}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    {groupedEmails[day].map((email) => (
                                        <div
                                            key={email._id}
                                            onClick={() => setSelectedEmailId(email._id)}
                                            className={`p-4 cursor-pointer rounded-lg shadow-sm border ${selectedEmailId === email._id
                                                ? "bg-blue-100 border-blue-500"
                                                : "bg-gray-50 border-gray-300"
                                                } hover:bg-blue-50 transition duration-200`}
                                        >
                                            <div className="flex justify-between">
                                                <p className="font-semibold text-gray-800">{email.title}</p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {new Date(email.createdAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1 truncate">{email.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full pt-10">
                            <img src="/images/nodata_icon.svg" alt="No data" className="mb-2" />
                            <p className="text-gray-500">Không có dữ liệu</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chi tiết email */}
            <div className="bg-white w-2/3 p-4 overflow-y-auto h-full"
                style={{ borderTopRightRadius: "16px", borderBottomRightRadius: "16px" }}
            >
                <div className="border-b">
                    <h2 className="text-xl font-semibold mb-4">Chi tiết thông báo</h2>
                </div>
                {selectedEmail ? (
                    <div>
                        <div className="border-b">
                            <h3 className="font-medium text-lg my-3">Tiêu đề</h3>
                            <p className="mb-4">{selectedEmail.title}</p>
                        </div>
                        <div className="border-b">
                            <h3 className="font-medium text-lg my-3">Nội dung</h3>
                            <p className="mb-4">{selectedEmail.content}</p>
                        </div>
                        <h3 className="font-medium text-lg mb-2">Người gửi</h3>
                        <p className="mb-4">{selectedEmail.senderId.name} ({selectedEmail.senderId.email})</p>
                        <h3 className="font-medium text-lg mb-2">Danh sách người nhận</h3>
                        <ul className="list-disc pl-5">
                            {selectedEmail.receiverId.map((recipient) => (
                                <li key={recipient._id}>{recipient.name} ({recipient.email})</li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="text-gray-500">Vui lòng chọn một thông báo để xem chi tiết.</p>
                )}
            </div>
        </div>
    );
}

export default HistorySendNotification;
