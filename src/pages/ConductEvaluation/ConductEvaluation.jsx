import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';

const students = [
  { id: 1, name: 'Nguyễn Văn A' },
  { id: 2, name: 'Trần Thị B' },
  { id: 3, name: 'Lê Văn C' },
  { id: 4, name: 'Phạm Thị D' },
  { id: 5, name: 'Nguyễn Văn A' },
  { id: 6, name: 'Trần Thị B' },
  { id: 7, name: 'Lê Văn C' },
  { id: 8, name: 'Phạm Thị D' },
  { id: 9, name: 'Nguyễn Văn A' },
  { id: 10, name: 'Trần Thị B' },
  { id: 11, name: 'Lê Văn C' },
  { id: 12, name: 'Phạm Thị D' },
  { id: 13, name: 'Trần Thị B' },
  { id: 14, name: 'Lê Văn C' },
  { id: 15, name: 'Phạm Thị D' },
];

const conductOptions = ['Tốt', 'Khá', 'Trung Bình', 'Kém'];

const ConductEvaluationTable = () => {
  const [conduct, setConduct] = useState(
    students.reduce((acc, student) => {
      acc[student.id] = 'Tốt';
      return acc;
    }, {})
  );

  const handleConductChange = (studentId, option) => {
    setConduct((prevConduct) => ({
      ...prevConduct,
      [studentId]: option,
    }));
  };

  const onBack = () => {
    window.history.back()
  };

  const onSubmit = () => {

  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Breadcrumb
        title="Đánh giá hạnh kiểm học sinh"
        buttonText="Hoàn tất đánh giá"
        onBack={onBack}
        onButtonClick={onSubmit}
      />

      <div className="w-full h-[80vh] overflow-auto mt-8">
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
          <thead className="sticky top-0 bg-blue-500 text-white">
            <tr className="text-sm uppercase">
              <th className="px-4 py-3 border-b border-gray-300">STT</th>
              <th className="px-4 py-3 border-b border-gray-300">Tên Học Sinh</th>
              <th className="px-4 py-3 border-b border-gray-300">Hạnh Kiểm</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={`${student.id}-${index}`} className="hover:bg-blue-50">
                <td className="px-4 py-3 border-b border-gray-200">{index + 1}</td>
                <td className="px-4 py-3 border-b border-gray-200">{student.name}</td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <select
                    value={conduct[student.id] || ''}
                    onChange={(e) => handleConductChange(student.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Chọn hạnh kiểm</option>
                    {conductOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConductEvaluationTable;
