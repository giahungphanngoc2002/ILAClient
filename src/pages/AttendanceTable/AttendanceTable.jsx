import React, { useState } from 'react';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaFileExcel } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const studentsData = [
  { name: 'Nguyễn Văn A', status: [true, false, true, true, false, true, false, true, true, false, true, true, true, false, true, false, true, true, false, true] },
  { name: 'Trần Thị B', status: [true, true, false, false, true, true, false, true, false, true, false, true, true, true, false, true, true, false, true, false] },
  // Thêm dữ liệu sinh viên khác...
];

const AttendanceTable = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const filteredStudents = studentsData.filter((student) =>
    student.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredStudents.map((student) => ({
        Name: student.name,
        ...student.status.reduce((acc, cur, idx) => ({ ...acc, [`Period ${idx + 1}`]: cur ? 'O' : 'X' }), {}),
        Absences: student.status.filter(status => !status).length,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
    XLSX.writeFile(workbook, 'attendance.xlsx');
  };

  const handleBackMyClass = () => {
    navigate('/teacher/myClass');
  };

  return (
    <div className="overflow-x-auto p-4 min-h-screen">
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Tìm kiếm học sinh..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-full px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex items-center space-x-2">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg flex items-center hover:bg-green-700 transition duration-300"
            onClick={handleDownloadExcel}
          >
            <FaFileExcel className="mr-2" /> Tải xuống Excel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg flex items-center hover:bg-blue-600 transition duration-300"
            onClick={handleBackMyClass}
          >
            <FaArrowLeft className="mr-2" /> Trở về
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
              <th className="px-4 py-2 font-bold border-b border-gray-300 sticky left-0" style={{ minWidth: '200px', maxWidth: '200px', whiteSpace: 'nowrap' }}>
                Họ và Tên
              </th>
              {Array.from({ length: studentsData[0].status.length }).map((_, idx) => (
                <th key={idx} className="px-4 py-2 font-bold border-b border-gray-300 text-center">{idx + 1}</th>
              ))}
              <th className="px-4 py-2 font-bold border-b border-gray-300">Số tiết vắng</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={index} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <td className="border px-4 py-2 font-semibold text-left sticky left-0" style={{ minWidth: '200px', maxWidth: '200px', whiteSpace: 'nowrap' }}>
                  {student.name}
                </td>
                {student.status.map((status, idx) => (
                  <td key={idx} className="border px-4 py-2 text-center">
                    <div className="flex justify-center items-center">
                      {status ? (
                        <FaCheckCircle className="text-green-500" title="Present" />
                      ) : (
                        <FaTimesCircle className="text-red-500" title="Absent" />
                      )}
                    </div>
                  </td>
                ))}
                <td className="border px-4 py-2 text-center">
                  {student.status.filter(status => !status).length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
