import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { useNavigate } from "react-router-dom";
const emails = [
    {
        id: 1,
        subject: "Chào mừng các em học sinh đến năm học mới",
        content: "Chúc mừng các em đã bắt đầu năm học mới! Hãy cùng nhau cố gắng học tập tốt nhé!",
        recipients: ["hoc_sinh1@example.com"],
        sent_time: "2024-08-20T08:00:00Z"
    },
    {
        id: 2,
        subject: "Thông báo lịch kiểm tra giữa kỳ",
        content: "Các em chú ý, tuần sau chúng ta sẽ có bài kiểm tra giữa kỳ. Hãy ôn tập kỹ các bài đã học nhé!",
        recipients: ["lop10a@example.com", "lop10b@example.com"],
        sent_time: "2024-10-10T09:00:00Z"
    },
    {
        id: 3,
        subject: "Kế hoạch dã ngoại cuối kỳ",
        content: "Nhà trường sẽ tổ chức một buổi dã ngoại cuối kỳ vào tuần sau. Các em nhớ chuẩn bị đầy đủ đồ dùng cần thiết.",
        recipients: ["lop11a@example.com", "lop11b@example.com"],
        sent_time: "2024-11-01T14:00:00Z"
    },
    {
        id: 4,
        subject: "Thông báo nghỉ học do bão",
        content: "Do ảnh hưởng của bão, nhà trường quyết định cho các em nghỉ học vào ngày mai. Hãy ở nhà an toàn và chuẩn bị bài tập nhé!",
        recipients: ["lop12a@example.com", "lop12b@example.com"],
        sent_time: "2024-11-04T07:00:00Z"
    },
    {
        id: 5,
        subject: "Hướng dẫn đăng ký thi đại học",
        content: "Các em học sinh lớp 12 lưu ý, nhà trường sẽ tổ chức buổi hướng dẫn đăng ký thi đại học vào cuối tuần này. Thầy cô sẽ giúp các em hoàn thành hồ sơ đăng ký.",
        recipients: ["lop12a@example.com", "lop12b@example.com"],
        sent_time: "2024-11-03T10:00:00Z"
    },
    {
        id: 6,
        subject: "Nhắc nhở hoàn thành bài tập về nhà",
        content: "Các em nhớ hoàn thành bài tập về nhà đã được giao. Hãy chuẩn bị tốt cho buổi học ngày mai nhé!",
        recipients: ["hoc_sinh3@example.com", "hoc_sinh4@example.com"],
        sent_time: "2024-11-03T18:00:00Z"
    },
    {
        id: 7,
        subject: "Thông báo kết quả thi giữa kỳ",
        content: "Các em thân mến, kết quả thi giữa kỳ đã được công bố. Các em có thể xem trên hệ thống hoặc liên hệ thầy cô để biết chi tiết.",
        recipients: ["lop10a@example.com", "lop10b@example.com", "lop11a@example.com"],
        sent_time: "2024-11-04T10:00:00Z"
    },
    {
        id: 8,
        subject: "Lịch thi cuối kỳ",
        content: "Các em chú ý, lịch thi cuối kỳ đã được lên kế hoạch. Các em hãy theo dõi bảng thông báo của trường để nắm rõ ngày thi của mình.",
        recipients: ["lop12a@example.com", "lop12b@example.com"],
        sent_time: "2024-11-04T12:30:00Z"
    },
    {
        id: 9,
        subject: "Thông báo lịch học bù",
        content: "Nhà trường sẽ tổ chức học bù vào cuối tuần để kịp tiến độ học tập. Các em lưu ý đi học đầy đủ.",
        recipients: ["lop10a@example.com", "lop10b@example.com", "lop11a@example.com", "lop11b@example.com"],
        sent_time: "2024-11-04T15:00:00Z"
    },
    {
        id: 10,
        subject: "Nhắc nhở về đồng phục học sinh",
        content: "Các em nhớ mặc đồng phục đúng quy định khi đến trường. Hãy tuân thủ để giữ hình ảnh đẹp trong môi trường học tập.",
        recipients: ["lop10a@example.com", "lop10b@example.com", "lop11a@example.com", "lop11b@example.com", "lop12a@example.com", "lop12b@example.com"],
        sent_time: "2024-11-04T08:30:00Z"
    }
];


function HistorySendNotification() {
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();


    // Filter emails by search term
    const filteredEmails = emails.filter((email) =>
        email.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group emails by date in the format 'yyyy-mm-dd' and sort dates in descending order
    const groupedEmails = filteredEmails.reduce((acc, email) => {
        const day = new Date(email.sent_time).toISOString().split('T')[0]; // Format as 'yyyy-mm-dd'
        if (!acc[day]) acc[day] = [];
        acc[day].push(email);
        return acc;
    }, {});

    const sortedDays = Object.keys(groupedEmails).sort((a, b) =>
        new Date(b) - new Date(a)
    );

    const goToCreateNotification = () => {
        navigate('/manage/notificationToStudent')
    }

    return (
        <div className="flex h-screen bg-white m-6 rounded-lg">
            {/* Danh sách email */}
            <div className="w-1/3 border-r p-4 overflow-y-auto h-full">
                <div>
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
                                        {new Date(day).toLocaleDateString("vi-VN")} {/* Convert back to dd/mm/yyyy format */}
                                    </p>
                                </div>
                                {/* Display all emails for each day without toggle */}
                                <div className="space-y-2">
                                    {groupedEmails[day].map((email) => (
                                        <div
                                            key={email.id}
                                            onClick={() => setSelectedEmail(email)}
                                            className={`p-4 cursor-pointer rounded-lg shadow-sm border ${selectedEmail?.id === email.id
                                                ? "bg-blue-100 border-blue-500"
                                                : "bg-gray-50 border-gray-300"
                                                } hover:bg-blue-50 transition duration-200`}
                                        >
                                            <div className="flex justify-between">
                                                <p className="font-semibold text-gray-800">{email.subject}</p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {new Date(email.sent_time).toLocaleTimeString()}
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
            <div className="w-2/3 p-4 overflow-y-auto h-full">
                <div className="border-b">
                    <h2 className="text-xl font-semibold mb-4">Chi tiết thông báo</h2>
                </div>
                {selectedEmail && (
                    <div>
                        <div className="border-b">
                            <h3 className="font-medium text-lg my-3">Tiêu đề</h3>
                            <p className="mb-4">{selectedEmail.subject}</p>
                        </div>
                        <div className="border-b">
                            <h3 className="font-medium text-lg my-3">Nội dung</h3>
                            <p className="mb-4">{selectedEmail.content}</p>
                        </div>
                        <h3 className="font-medium text-lg mb-2">Danh sách người nhận</h3>
                        <ul className="list-disc pl-5">
                            {selectedEmail.recipients.map((recipient, index) => (
                                <li key={index}>{recipient}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

        </div>
    );
}

export default HistorySendNotification;

