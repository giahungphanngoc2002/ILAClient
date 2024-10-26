import React, { useState } from 'react';

const AttendanceComponent = () => {
    const [selectedSubject, setSelectedSubject] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [summary, setSummary] = useState({
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5; // Số bản ghi trên mỗi trang

    const subjects = ['Toán', 'Vật Lý', 'Hóa Học']; // Các môn học

    // Dữ liệu điểm danh cứng
    const attendanceData = {
        Toán: [
            { date: '2024-10-01', slot: '1', status: '✔' },
            { date: '2024-10-02', slot: '2', status: '✘' },
            { date: '2024-10-03', slot: '3', status: '✘' },
            { date: '2024-10-04', slot: '1', status: '📝' },
            { date: '2024-10-05', slot: '1', status: '✔' },
            { date: '2024-10-06', slot: '2', status: '✔' },
            { date: '2024-10-07', slot: '1', status: '✘' },
            { date: '2024-10-08', slot: '2', status: '✔' },
        ],
        'Vật Lý': [
            { date: '2024-10-05', slot: '1', status: '✔' },
            { date: '2024-10-06', slot: '2', status: '✔' },
            { date: '2024-10-07', slot: '1', status: '✘' },
        ],
        'Hóa Học': [
            { date: '2024-10-08', slot: '1', status: '✔' },
            { date: '2024-10-09', slot: '2', status: '✔' },
            { date: '2024-10-10', slot: '1', status: '✔' },
        ],
    };

    // Xử lý chọn môn học
    const handleSubjectChange = (e) => {
        const subject = e.target.value;
        setSelectedSubject(subject);
        const subjectData = attendanceData[subject] || [];
        setFilteredData(subjectData);
        calculateSummary(subjectData);
        setCurrentPage(1); // Reset lại trang khi chọn môn mới
    };

    // Tính toán thống kê
    const calculateSummary = (data) => {
        const summaryData = {
            present: data.filter((item) => item.status === '✔').length,
            absent: data.filter((item) => item.status === '✘').length,
            excused: data.filter((item) => item.status === '📝').length,
        };
        setSummary(summaryData);
    };

    // Phân trang
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Xem Điểm Danh Cá Nhân Theo Môn</h1>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Chọn Môn Học</label>
<select
                    value={selectedSubject}
                    onChange={handleSubjectChange}
                    className="border border-gray-300 p-2 rounded-md w-full"
                >
                    <option value="">Chọn môn học</option>
                    {subjects.map((subject, idx) => (
                        <option key={idx} value={subject}>
                            {subject}
                        </option>
                    ))}
                </select>
            </div>
            {filteredData.length > 0 && (
                <>
                    <table className="table-auto w-full border border-gray-300 mb-4">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border px-4 py-2">Ngày học</th>
                                <th className="border px-4 py-2">Slot</th>
                                <th className="border px-4 py-2">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="border px-4 py-2">{item.date}</td>
                                    <td className="border px-4 py-2">{item.slot}</td>
                                    <td className="border px-4 py-2">{item.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-400' : 'bg-blue-500 text-white'}`}
                            disabled={currentPage === 1}
                        >
                            Trang trước
                        </button>
                        <p>
                            Trang {currentPage} trên {totalPages}
                        </p>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-400' : 'bg-blue-500 text-white'}`}
                            disabled={currentPage === totalPages}
                        >
                            Trang sau
                        </button>
                    </div>
                    <div className="mb-4 mt-4">
                        <h2 className="text-lg font-bold mb-2">Thống kê trạng thái</h2>
                        <p>✔ Có mặt: {summary.present}</p>
                        <p>✘ Vắng mặt: {summary.absent}</p>
                        <p>📝 Nghỉ có phép: {summary.excused}</p>
                    </div>
</>
            )}
        </div>
    );
};

export default AttendanceComponent;