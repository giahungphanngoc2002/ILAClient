import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';

const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const periods = ["Tiết 1", "Tiết 2", "Tiết 3", "Tiết 4", "Tiết 5", "Tiết 6", "Tiết 7", "Tiết 8", "Tiết 9", "Tiết 10"];
const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);

const attendanceData = {
    "2024-11-01": { periods: { 1: { hasExcuse: true }, 3: { hasExcuse: false }, 7: { hasExcuse: true } } },
    "2024-11-02": { periods: { 2: { hasExcuse: false }, 4: { hasExcuse: true }, 9: { hasExcuse: false } } },
    // Thêm các ngày khác vào đây...
};

const AttendanceStudent = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

    const getDayOfWeek = (day) => {
        const date = new Date(selectedYear, selectedMonth - 1, day);
        return daysOfWeek[date.getDay()];
    };

    const getAttendanceStatus = (day, period) => {
        const dateKey = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return attendanceData[dateKey]?.periods[period];
    };

    const onBack = () => {

    }

    return (
        <div className="p-4">
            <Breadcrumb
                title="Xem điểm danh"
                onBack={onBack}
                displayButton={false}
            />

            <div className="pt-10"></div>

            {/* Filter Section */}
            <div className="bg-gray-100 p-4 rounded-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-gray-600 mb-1">Năm</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                        >
                            <option>Năm</option>
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-600 mb-1">Tháng</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        >
                            <option>Tháng</option>
                            {months.map((month) => (
                                <option key={month} value={month}>{month}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-600 mb-1">Tuần</label>
                        <select className="w-full p-2 border rounded">
                            <option>Chọn tuần</option>
                            {/* Thêm các tuần nếu cần */}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-600 mb-1">Khối</label>
                        <select className="w-full p-2 border rounded">
                            <option>Chọn khối</option>
                            <option>10</option>
                            {/* Thêm các khối khác nếu cần */}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-600 mb-1">Lớp</label>
                        <select className="w-full p-2 border rounded">
                            <option>Chọn lớp</option>
                            <option>10/10</option>
                            {/* Thêm các lớp khác nếu cần */}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-600 mb-1">Mã học sinh</label>
                        <input
                            type="text"
                            placeholder="Nhập mã học sinh"
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 mb-1">Tên học sinh</label>
                        <input
                            type="text"
                            placeholder="Nhập tên học sinh"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>
            </div>

            {/* Attendance Table */}
            <table className="w-full border-collapse bg-white">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2 text-center w-24 h-12" rowSpan="2">Tiết học</th>
                        {Array.from({ length: daysInMonth }, (_, i) => (
                            <th key={i} className="border p-2 text-center w-12 h-12">{String(i + 1).padStart(2, '0')}</th>
                        ))}
                    </tr>
                    <tr className="bg-gray-100">
                        {Array.from({ length: daysInMonth }, (_, i) => (
                            <th key={i} className="border p-2 text-center w-12 h-12">
                                {getDayOfWeek(i + 1)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {periods.map((period, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                            <td className="border p-2 text-center w-24 h-12">{period}</td>
                            {Array.from({ length: daysInMonth }, (_, i) => {
                                const attendanceStatus = getAttendanceStatus(i + 1, index + 1);
                                return (
                                    <td key={i} className="border p-2 text-center w-12 h-12">
                                        {attendanceStatus ? (
                                            <span
                                                className={`px-1 py-1 rounded ${attendanceStatus.hasExcuse ? "bg-green-300" : "bg-red-300"
                                                    }`}
                                            >
                                                {attendanceStatus.hasExcuse ? "CP" : "KP"}
                                            </span>
                                        ) : (
                                            <span></span>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceStudent;
