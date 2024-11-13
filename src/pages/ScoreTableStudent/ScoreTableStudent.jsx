import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import SummaryStudent from '../../components/SummaryStudent/SummaryStudent';
import SummaryAttendanceAndAward from '../../components/SummaryAttendaceAndAward/SummaryAttendanceAndAward';
import { HiClipboardList } from 'react-icons/hi';


const ScoreTableStudent = () => {
    const [grades, setGrades] = useState([]);

    useEffect(() => {
        // Dữ liệu mẫu API với thang điểm 10
        const fetchGrades = () => {
            const data = [
                {
                    subject: 'Toán',
                    regular: [8.0, 8.5, 8.3 , 8.3 ,8.5],
                    midterm: [9.0, 8.7],
                    final: [8.7, 8.9]
                },
                {
                    subject: 'Vật lý',
                    regular: [9.0, 8.8, 8.9],
                    midterm: [8.5, 8.6],
                    final: [8.2, 8.4]
                },
                {
                    subject: 'Hóa học',
                    regular: [7.5, 7.8, 7.9],
                    midterm: [8.3, 8.2],
                    final: [9.1, 9.0]
                },
                {
                    subject: 'Lịch sử',
                    regular: [8.0, 7.9, 8.1],
                    midterm: [7.8, 8.0],
                    final: [8.4, 8.5]
                },
                {
                    subject: 'Văn học',
                    regular: [9.5, 9.3, 9.4],
                    midterm: [9.2, 9.1],
                    final: [9.8, 9.7]
                },
                {
                    subject: 'Văn học',
                    regular: [9.5, 9.3, 9.4],
                    midterm: [9.2, 9.1],
                    final: [9.8, 9.7]
                },
                {
                    subject: 'Văn học',
                    regular: [9.5, 9.3, 9.4],
                    midterm: [9.2, 9.1],
                    final: [9.8, 9.7]
                },
                {
                    subject: 'Văn học',
                    regular: [9.5, 9.3, 9.4],
                    midterm: [9.2, 9.1],
                    final: [9.8, 9.7]
                },
                {
                    subject: 'Văn học',
                    regular: [9.5, 9.3, 9.4],
                    midterm: [9.2, 9.1],
                    final: [9.8, 9.7]
                },
                {
                    subject: 'Văn học',
                    regular: [9.5, 9.3, 9.4],
                    midterm: [9.2, 9.1],
                    final: [9.8, 9.7]
                },
                {
                    subject: 'Văn học',
                    regular: [9.5, 9.3, 9.4],
                    midterm: [9.2, 9.1],
                    final: [9.8, 9.7]
                },
            ];
            setGrades(data);
        };

        fetchGrades();
    }, []);

    // Hàm tính điểm trung bình
    const calculateAverage = (scores) => {
        return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
    };

    const onBack = () => {

    }



    return (
        <div className="flex flex-col items-center justify-center min-h-screen  p-6">
            <Breadcrumb title="Gửi thông báo đa phương tiện"
                buttonText="Gửi thông báo"
                onBack={onBack}
                displayButton={false}
            />
            <div className="pt-8"></div>

            <div className='w-4/5'>
                <SummaryStudent />
                <SummaryAttendanceAndAward />
            </div>
            <div className="w-4/5 rounded-xl overflow-hidden p-6">
                <div className="flex items-center mb-6">
                    <HiClipboardList className="text-blue-600 w-6 h-6 mr-2" />
                    <span className="text-xl font-bold text-blue-600">Bảng điểm</span>
                </div>
                <table className="w-full border-collapse text-left table-fixed  bg-white">
                    <thead>
                        <tr className="bg-blue-100 text-blue-700 text-lg font-semibold">
                            <th className="w-1/4 px-4 py-4 border border-blue-200">Môn học</th>
                            <th className="w-1/4 px-4 py-4 border border-blue-200 text-center">Điểm Thường Xuyên</th>
                            <th className="w-1/4 px-4 py-4 border border-blue-200 text-center">Điểm Giữa Kỳ</th>
                            <th className="w-1/4 px-4 py-4 border border-blue-200 text-center">Điểm Cuối Kỳ</th>
                            <th className="w-1/4 px-4 py-4 border border-blue-200 text-center">Trung Bình</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grades.map((grade, index) => (
                            <tr key={index} className="hover:bg-blue-50 text-gray-700 text-lg">
                                <td className="px-4 py-4 border border-gray-200">{grade.subject}</td>
                                <td className="px-4 py-4 border border-gray-200 text-center">
                                    <div className="grid grid-cols-3 gap-1">
                                        {grade.regular.map((score, idx) => (
                                            <div key={idx} className="p-1 border border-gray-300 rounded-md">
                                                {score}
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 py-4 border border-gray-200 text-center">
                                    <div className="grid grid-cols-3 gap-1">
                                        {grade.midterm.map((score, idx) => (
                                            <div key={idx} className="p-1 border border-gray-300 rounded-md">
                                                {score}
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 py-4 border border-gray-200 text-center">
                                    <div className="grid grid-cols-3 gap-1">
                                        {grade.final.map((score, idx) => (
                                            <div key={idx} className="p-1 border border-gray-300 rounded-md">
                                                {score}
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 py-4 border border-gray-200 text-center font-semibold">
                                    {calculateAverage([
                                        ...grade.regular,
                                        ...grade.midterm,
                                        ...grade.final
                                    ])}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScoreTableStudent;
