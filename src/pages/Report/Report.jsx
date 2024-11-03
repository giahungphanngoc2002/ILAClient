import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ReportComponent = () => {
    const navigate = useNavigate();

    const userRole = 'teacher'; // Vai trò người dùng: "teacher" hoặc "principal"

    // Dữ liệu mẫu cho danh sách báo cáo
    const [reports, setReports] = useState([
        { id: 1, title: 'Báo cáo học tập', content: 'Nội dung báo cáo học tập...', date: '2024-11-01', status: 'Đang soạn thảo' },
        { id: 2, title: 'Báo cáo nề nếp', content: 'Nội dung báo cáo nề nếp...', date: '2024-10-25', status: 'Đã gửi' },
        { id: 3, title: 'Báo cáo lớp chủ nhiệm', content: 'Nội dung báo cáo lớp chủ nhiệm...', date: '2024-09-15', status: 'Cần chỉnh sửa' }
    ]);

    const [selectedReport, setSelectedReport] = useState(null);
    const [showReportForm, setShowReportForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [attachment, setAttachment] = useState(null);

    // Hàm tạo báo cáo mới
    const handleCreateReport = () => {
        navigate('/manage/report/formReport')
    };

    // Chọn báo cáo từ danh sách
    const handleSelectReport = (report) => {
        setSelectedReport(report);
        setShowReportForm(false);
    };

    // Gửi báo cáo mới

    // Cập nhật báo cáo khi cần chỉnh sửa
    const handleUpdateReport = () => {
        if (selectedReport && selectedReport.status === 'Cần chỉnh sửa') {
            setReports(reports.map((report) =>
                report.id === selectedReport.id ? { ...report, content: newContent, status: 'Đã gửi' } : report
            ));
            setSelectedReport(null);
        }
    };

    // Phản hồi báo cáo (hiệu trưởng)
    const handleRespondReport = (response) => {
        if (selectedReport) {
            setReports(reports.map((report) =>
                report.id === selectedReport.id ? { ...report, status: 'Cần chỉnh sửa', response } : report
            ));
            setSelectedReport(null);
        }
    };

    // Chấp nhận báo cáo (hiệu trưởng)
    const handleAcceptReport = () => {
        if (selectedReport) {
            setReports(reports.map((report) =>
                report.id === selectedReport.id ? { ...report, status: 'Đã chấp nhận' } : report
            ));
            setSelectedReport(null);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-8">Quản lý Báo cáo</h1>

            {/* Danh sách báo cáo */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Danh sách báo cáo</h2>
                <button
                    onClick={handleCreateReport}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg mb-4">
                    Tạo báo cáo mới
                </button>
                <table className="w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="border-b bg-gray-100">
                            <th className="p-4 text-left">Tiêu đề</th>
                            <th className="p-4 text-left">Ngày</th>
                            <th className="p-4 text-left">Trạng thái</th>
                            <th className="p-4">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report.id} className="border-b">
                                <td className="p-4">{report.title}</td>
                                <td className="p-4">{report.date}</td>
                                <td className="p-4">{report.status}</td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleSelectReport(report)}
                                        className="px-2 py-1 bg-blue-500 text-white rounded">
                                        Xem chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Form tạo/chỉnh sửa báo cáo */}


            {/* Hiển thị chi tiết báo cáo */}
            {selectedReport && (
                <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Chi tiết báo cáo</h2>
                    <p><strong>Tiêu đề:</strong> {selectedReport.title}</p>
                    <p><strong>Ngày:</strong> {selectedReport.date}</p>
                    <p><strong>Trạng thái:</strong> {selectedReport.status}</p>
                    <p className="mb-4"><strong>Nội dung:</strong> {selectedReport.content}</p>

                    {/* Chức năng dành cho hiệu trưởng */}
                    {userRole === 'principal' && (
                        <div className="space-x-2">
                            <button
                                onClick={() => handleRespondReport("Phản hồi từ hiệu trưởng")}
                                className="px-4 py-2 bg-yellow-500 text-white rounded">
                                Phản hồi
                            </button>
                            <button
                                onClick={handleAcceptReport}
                                className="px-4 py-2 bg-green-500 text-white rounded">
                                Chấp nhận
                            </button>
                        </div>
                    )}

                    {/* Chức năng dành cho giáo viên khi báo cáo cần chỉnh sửa */}
                    {userRole === 'teacher' && selectedReport.status === 'Cần chỉnh sửa' && (
                        <div className="mt-4">
                            <textarea
                                placeholder="Chỉnh sửa nội dung báo cáo"
                                className="w-full p-2 border border-gray-300 rounded mb-4"
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                            ></textarea>
                            <button
                                onClick={handleUpdateReport}
                                className="px-4 py-2 bg-blue-500 text-white rounded">
                                Gửi lại
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReportComponent;
