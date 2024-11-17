import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import SummaryStudent from '../../components/SummaryStudent/SummaryStudent';
import SummaryAttendanceAndAward from '../../components/SummaryAttendaceAndAward/SummaryAttendanceAndAward';
import { HiClipboardList } from 'react-icons/hi';
import * as ScoreSbujectService from "../../services/ScoreSbujectService";
import { useSelector } from 'react-redux';

const ScoreTableStudent = () => {
    const user = useSelector((state) => state.user);
    const [grades, setGrades] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState("1"); // Mặc định là Kỳ 1
    const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
    const [error, setError] = useState(null); // Trạng thái lỗi
    const [studentId, setStudentId] = useState(user?.id);

    useEffect(() => {
        setStudentId(user?.id);
    }, [user]);

    // Hàm gọi API và định dạng lại dữ liệu
    const fetchScores = async (semester) => {
        setLoading(true);
        setError(null);

        try {
            const rawData = await ScoreSbujectService.getAllScoreByStudentIdAndSemester(studentId, semester);

            // Định dạng lại dữ liệu
            const formattedData = rawData.map(item => {
                const subjectName = item.subjectId.nameSubject;
                const regularScores = item.scores.filter(score => score.type === "thuongXuyen").map(score => score.score);
                const midtermScores = item.scores.filter(score => score.type === "giuaKi").map(score => score.score);
                const finalScores = item.scores.filter(score => score.type === "cuoiKi").map(score => score.score);

                return {
                    subject: subjectName,
                    regular: regularScores,
                    midterm: midtermScores,
                    final: finalScores,
                };
            });

            setGrades(prev => ({
                ...prev,
                [semester]: formattedData, // Lưu theo kỳ
            }));
        } catch (err) {
            setError('Không thể tải dữ liệu điểm. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    // Gọi fetchScores khi `selectedSemester` hoặc `studentId` thay đổi
    useEffect(() => {
        if (!grades[selectedSemester]) {
            fetchScores(selectedSemester);
        }
    }, [selectedSemester, studentId]);

    const handleSemesterChange = (semester) => {
        setSelectedSemester(semester);
    };

    // Hàm tính điểm trung bình
    const calculateAverage = (scores) => {
        return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
    };

    const onBack = () => {
        // Handle back button logic
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <Breadcrumb
                title="Gửi thông báo đa phương tiện"
                buttonText="Gửi thông báo"
                onBack={onBack}
                displayButton={false}
            />
            <div className="pt-8"></div>

            <div className='w-4/5'>
            <SummaryStudent studentId={studentId} selectedSemester={selectedSemester} />

                <SummaryAttendanceAndAward />
            </div>

            {/* Chọn kỳ học */}
            <div className="flex gap-2 mb-6">
                <button
                    className={`px-4 py-2 rounded-lg font-semibold ${selectedSemester === "1" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                    onClick={() => handleSemesterChange("1")}
                >
                    Kỳ 1
                </button>
                <button
                    className={`px-4 py-2 rounded-lg font-semibold ${selectedSemester === "2" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                    onClick={() => handleSemesterChange("2")}
                >
                    Kỳ 2
                </button>
            </div>

            {/* Bảng điểm */}
            <div className="w-4/5 rounded-xl overflow-hidden p-6">
                <div className="flex items-center mb-6">
                    <HiClipboardList className="text-blue-600 w-6 h-6 mr-2" />
                    <span className="text-xl font-bold text-blue-600">Bảng điểm</span>
                </div>

                {/* Hiển thị trạng thái tải */}
                {loading && <p className="text-blue-500">Đang tải dữ liệu...</p>}

                {/* Hiển thị lỗi */}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && grades[selectedSemester] && (
                    <table className="w-full border-collapse text-left table-fixed bg-white">
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
                            {grades[selectedSemester]?.map((grade, index) => (
                                <tr key={index} className="hover:bg-blue-50 text-gray-700 text-lg">
                                    <td className="px-4 py-4 border border-gray-200">
                                    {grade.subject.replace("Chuyên Đề", "").trim()}
                                    </td>
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
                )}
            </div>
        </div>
    );
};

export default ScoreTableStudent;
