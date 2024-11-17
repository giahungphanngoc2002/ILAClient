import React, { useState, useEffect } from 'react';
import { FaGraduationCap } from 'react-icons/fa';
import { RiStarFill } from "react-icons/ri";
import { HiClipboardList } from 'react-icons/hi';
import * as ClassService from "../../services/ClassService";

const SummaryStudent = ({ studentId, selectedSemester }) => {
    const [conduct, setConduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConduct = async () => {
            if (!studentId || !selectedSemester) return;

            setLoading(true);
            setError(null);
            try {
                const data = await ClassService.getConductByStudentIdAndSemester(studentId, selectedSemester);
                setConduct(data);
            } catch (err) {
                setError('Không thể tải dữ liệu hạnh kiểm');
            } finally {
                setLoading(false);
            }
        };

        fetchConduct();
    }, [studentId, selectedSemester]);

    const data = [
        {
            icon: <FaGraduationCap className="w-6 h-6" />,
            title: "Điểm trung bình",
            score: "8.5", // Giả sử điểm trung bình từ API khác
            details: [
                { label: 'Học kỳ 1', value: '8' },
                { label: 'Học kỳ 2', value: '8.8' },
            ],
            bgColor: "bg-green-500"
        },
        {
            icon: <RiStarFill className="w-6 h-6 text-purple-500" />,
            title: "Học lực",
            score: "Giỏi", // Giả sử học lực từ API khác
            details: [
                { label: 'Học kỳ 1', value: 'Giỏi' },
                { label: 'Học kỳ 2', value: 'Giỏi' },
            ],
            bgColor: "bg-purple-500"
        },
        {
            icon: <RiStarFill className="w-6 h-6 text-orange-500" />,
            title: "Hạnh kiểm",
            score: conduct?.typeConduct || "Đang tải...",
            details: [
                { label: `Học kỳ ${selectedSemester}`, value: conduct?.typeConduct || "Đang tải..." }
            ],
            bgColor: "bg-orange-500"
        },
    ];

    return (
        <div className="w-full p-6 flex flex-col">
            <div className="flex items-center mb-6">
                <HiClipboardList className="text-blue-600 w-6 h-6 mr-2" />
                <span className="text-xl font-bold text-blue-600">TỔNG KẾT</span>
            </div>
            {loading && <p className="text-blue-500">Đang tải dữ liệu...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex flex-col md:flex-row gap-4 w-full items-center justify-between">
                {data.map((item, index) => (
                    <div key={index} className="flex flex-col bg-white rounded-lg p-4 shadow-md w-full md:w-1/3">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <div className={`p-2 ${item.bgColor} text-white rounded-full`}>
                                    {item.icon}
                                </div>
                                <span className="font-semibold text-lg">{item.title}</span>
                            </div>
                            <p className="font-semibold text-lg m-0">{item.score}</p>
                        </div>
                        <hr className="my-2" />
                        <div className="space-y-2">
                            {item.details.map((detail, detailIndex) => (
                                <div key={detailIndex} className="flex justify-between">
                                    <span>{detail.label}</span>
                                    <span className="font-medium">{detail.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SummaryStudent;
