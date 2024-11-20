import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import SummaryStudent from '../../components/SummaryStudent/SummaryStudent';
import SummaryAttendanceAndAward from '../../components/SummaryAttendaceAndAward/SummaryAttendanceAndAward';
import { HiClipboardList } from 'react-icons/hi';
import * as ScoreSbujectService from "../../services/ScoreSbujectService";
import * as ClassService from "../../services/ClassService";
import { useSelector } from 'react-redux';

const ScoreTableStudent = () => {
    const user = useSelector((state) => state.user);
    const [grades, setGrades] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState("1"); // Mặc định là Kỳ 1
    const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
    const [error, setError] = useState(null); // Trạng thái lỗi
    const [studentId, setStudentId] = useState(user?.id);
    const [classes, setClasses] = useState([]);
    const [classSubject, setClassSubject] = useState(null);

    useEffect(() => {
        setStudentId(user?.id);
    }, [user]);

    // Hàm riêng để tìm class chứa user.id
    const findUserClass = (allClasses, userId) => {
        if (!Array.isArray(allClasses)) {
            console.error('All classes is not a valid array:', allClasses);
            return null;
        }

        const foundClass = allClasses.find((classItem) => {
            return (
                Array.isArray(classItem.studentID) &&
                classItem.studentID.some((student) =>
                    typeof student === 'string'
                        ? student === userId
                        : student._id === userId
                )
            );
        });

        if (!foundClass) {
            console.warn('No class found for user:', userId);
        }

        return foundClass;
    };

    // Hàm chính để fetch classes và tìm class
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const allClasses = await ClassService.getAllClass();
                console.log('All Classes:', allClasses);

                setClasses(allClasses?.data || []);

                const userClass = findUserClass(allClasses?.data || [], user.id);
                if (userClass && userClass.subjectGroup?.SubjectsId) {
                    setClassSubject(userClass.subjectGroup.SubjectsId);
                } else {
                    console.error("Không tìm thấy classSubject phù hợp!");
                }
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };

        fetchClasses();
    }, [user.id]);

    // Hàm gọi API và định dạng lại dữ liệu
    const fetchScores = async (semester) => {
        if (!classSubject || !Array.isArray(classSubject)) {
            console.error("classSubject chưa được khởi tạo hoặc không hợp lệ:", classSubject);
            setError('Dữ liệu môn học chưa sẵn sàng. Vui lòng thử lại!');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Lấy dữ liệu điểm từ API
            const rawData = await ScoreSbujectService.getAllScoreByStudentIdAndSemester(studentId, semester);
            console.log("Raw Data:", rawData);

            // Kiểm tra nếu rawData không có dữ liệu
            if (!rawData || rawData.length === 0) {
                console.warn(`Không có dữ liệu điểm trả về cho kỳ ${semester}`);
                // Thiết lập dữ liệu điểm rỗng cho tất cả các môn học
                setGrades(prev => ({
                    ...prev,
                    [semester]: classSubject.map(subject => ({
                        subject: subject.nameSubject,
                        regular: [],
                        midterm: [],
                        final: [],
                    })),
                }));
                return;
            }

            // Gộp dữ liệu từ classSubject và rawData
            const formattedData = classSubject.map(subject => {
                const subjectData = rawData.find(item => item.subjectId.nameSubject === subject.nameSubject);

                if (subjectData) {
                    const regularScores = subjectData.scores
                        .filter(score => score.type === "thuongXuyen")
                        .map(score => score.score);
                    const midtermScores = subjectData.scores
                        .filter(score => score.type === "giuaKi")
                        .map(score => score.score);
                    const finalScores = subjectData.scores
                        .filter(score => score.type === "cuoiKi")
                        .map(score => score.score);

                    return {
                        subject: subject.nameSubject,
                        regular: regularScores,
                        midterm: midtermScores,
                        final: finalScores,
                    };
                } else {
                    // Nếu không tìm thấy dữ liệu cho môn học này
                    return {
                        subject: subject.nameSubject,
                        regular: [],
                        midterm: [],
                        final: [],
                    };
                }
            });

            // Cập nhật dữ liệu điểm vào state
            setGrades(prev => ({
                ...prev,
                [semester]: formattedData,
            }));
        } catch (err) {
            console.error("Error fetching scores:", err.message || err);
            setError('Không thể tải dữ liệu điểm. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (classSubject && Array.isArray(classSubject) && !grades[selectedSemester]) {
            fetchScores(selectedSemester);
        }
    }, [selectedSemester, studentId, classSubject]);

    const handleSemesterChange = (semester) => {
        setSelectedSemester(semester);
    };

    const calculateAverage = (scores) => {
        return scores.length > 0
            ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
            : "N/A";
    };

    const onBack = () => {
        window.history.back();
    };

    console.log(grades)

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

            <div className="w-4/5 rounded-xl overflow-hidden p-6">
                <div className="flex items-center mb-6">
                    <HiClipboardList className="text-blue-600 w-6 h-6 mr-2" />
                    <span className="text-xl font-bold text-blue-600">Bảng điểm</span>
                </div>

                {loading && <p className="text-blue-500">Đang tải dữ liệu...</p>}
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
                                        {grade.subject}
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
