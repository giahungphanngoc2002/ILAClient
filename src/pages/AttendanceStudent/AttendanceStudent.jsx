import React, { useState } from 'react';

const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const periods = ["Tiết 1", "Tiết 2", "Tiết 3", "Tiết 4", "Tiết 5", "Tiết 6", "Tiết 7", "Tiết 8", "Tiết 9", "Tiết 10"];
const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);

const attendanceData = {
    "2024-11-01": { periods: { 1: { hasExcuse: true }, 3: { hasExcuse: false }, 7: { hasExcuse: true } } },
    "2024-11-02": { periods: { 2: { hasExcuse: false }, 4: { hasExcuse: true }, 9: { hasExcuse: false } } },
    // Thêm các ngày khác vào đây...
};

const AttendanceTable = () => {
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

    return (
        <div className="p-4">
            <div className="flex flex-wrap gap-4 mb-4">
                <select
                    className="p-2 border rounded"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                    <option>Năm</option>
                    {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
                <select
                    className="p-2 border rounded"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                    <option>Tháng</option>
                    {months.map((month) => (
                        <option key={month} value={month}>{month}</option>
                    ))}
                </select>
                <select className="p-2 border rounded">
                    <option>Tuần</option>
                </select>
                <select className="p-2 border rounded">
                    <option>Ngày</option>
                </select>
                <select className="p-2 border rounded">
                    <option>Khối</option>
                    <option>10</option>
                </select>
                <select className="p-2 border rounded">
                    <option>Lớp</option>
                    <option>10/10</option>
                </select>
<input type="text" placeholder="Mã học sinh" className="p-2 border rounded" />
                <input type="text" placeholder="Tên học sinh" className="p-2 border rounded" />
            </div>

            <table className="w-full border-collapse bg-white">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2 text-center" rowSpan="2">Tiết học</th>
                        {Array.from({ length: daysInMonth }, (_, i) => (
                            <th key={i} className="border p-2 text-center">{String(i + 1).padStart(2, '0')}</th>
                        ))}
                    </tr>
                    <tr className="bg-gray-100">
                        {Array.from({ length: daysInMonth }, (_, i) => (
                            <th key={i} className="border p-2 text-center">
                                {getDayOfWeek(i + 1)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {periods.map((period, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                            <td className="border p-2 text-center">{period}</td>
                            {Array.from({ length: daysInMonth }, (_, i) => {
                                const attendanceStatus = getAttendanceStatus(i + 1, index + 1);
                                return (
                                    <td key={i} className="border p-2 text-center">
                                        {attendanceStatus ? (
                                            <span
                                                className={`px-2 py-1 rounded ${attendanceStatus.hasExcuse ? "bg-green-300" : "bg-red-300"
                                                    }`}
                                            >
                                                {attendanceStatus.hasExcuse ? "CP" : "KP"}
                                            </span>
                                        ) : (
                                            <input type="checkbox" className="form-checkbox" />
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

export default AttendanceTable;