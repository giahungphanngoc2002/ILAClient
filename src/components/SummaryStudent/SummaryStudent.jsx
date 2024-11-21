import React, { useState, useEffect } from 'react';
import { FaGraduationCap } from 'react-icons/fa';
import { RiStarFill } from "react-icons/ri";
import { HiClipboardList } from 'react-icons/hi';
import * as ClassService from "../../services/ClassService";

const SummaryStudent = ({ studentId, selectedSemester }) => {
    const [conduct, setConduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [conduct1, setConduct1] = useState();
    const [conduct2, setConduct2] = useState();

    useEffect(() => {
        const fetchConduct = async () => {
            if (!studentId) return;

            setLoading(true);
            setError(null);
            try {
                const data = await ClassService.getConductByStudentIdAndSemester(studentId, 1);
                setConduct1(data);
            } catch (err) {
                setError('Không thể tải dữ liệu hạnh kiểm');
            } finally {
                setLoading(false);
            }
        };

        fetchConduct();
    }, [studentId]);

    useEffect(() => {
        const fetchConduct = async () => {
            if (!studentId) return;

            setLoading(true);
            setError(null);
            try {
                const data = await ClassService.getConductByStudentIdAndSemester(studentId, 2);
                setConduct2(data);
            } catch (err) {
                setError('Không thể tải dữ liệu hạnh kiểm');
            } finally {
                setLoading(false);
            }
        };

        fetchConduct();
    }, [studentId]);

    

    function tinhHanhKiem(hk1, hk2) {
        // Quy định mức hạnh kiểm theo thứ tự ưu tiên
        const mucHanhKiem = ["Yếu", "Trung bình", "Khá", "Tốt"];

        // Lấy chỉ số của hạnh kiểm học kỳ 1 và 2
        const indexHK1 = mucHanhKiem.indexOf(hk1);
        const indexHK2 = mucHanhKiem.indexOf(hk2);

        // Kiểm tra nếu có hạnh kiểm Yếu
        if (hk1 === "Yếu" || hk2 === "Yếu") {
            return "Yếu"; // Ưu tiên mức thấp nhất nếu có "Yếu"
        }

        // Nếu cả hai kỳ giống nhau
        if (indexHK1 === indexHK2) {
            return hk1;
        }

        // Nếu khác nhau, ưu tiên kỳ 2
        if (indexHK1 > indexHK2) {
            // Kỳ 1 cao hơn kỳ 2 -> hạ xuống mức của kỳ 2
            return hk2;
        } else {
            // Kỳ 1 thấp hơn kỳ 2 -> nâng lên mức giữa kỳ 1 và kỳ 2
            return mucHanhKiem[indexHK1 + 1];
        }
    }


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
            score: tinhHanhKiem(conduct1?.typeConduct, conduct2?.typeConduct) || "Đang tải...",
            details: [
                { label: `Học kỳ 1`, value: conduct1?.typeConduct || "Đang tải..." },
                { label: `Học kỳ 2`, value: conduct2?.typeConduct || "Đang tải..." }

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
