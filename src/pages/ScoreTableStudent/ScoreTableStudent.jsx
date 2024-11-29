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
    const [selectedYear, setSelectedYear] = useState("2024-2025"); // Năm học
    const [years, setYears] = useState([]); // Khởi tạo years là mảng rỗng thay 

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

    const getSchoolYears = (yearRange, block) => {
        const [startYear, endYear] = yearRange.split('-').map(Number);
    
        let result = [];
    
        // Đảm bảo "2024-2025" luôn có trong danh sách
        if (startYear === 2024 && endYear === 2025) {
            result.push("2024-2025");
        }
    
        // Kiểm tra và tính toán năm học cho lớp 10, 11, 12
        if (block === 10) {
            result.push(`${startYear + 1}-${endYear + 1}`);
            result.push(`${startYear + 2}-${endYear + 2}`);
        } else if (block === 11) {
            result.push(`${startYear - 1}-${endYear - 1}`);
            result.push(`${startYear + 1}-${endYear + 1}`);
        } else if (block === 12) {
            result.push(`${startYear - 1}-${endYear - 1}`);
            result.push(`${startYear + 2}-${endYear + 2}`);
        }
    
        return result;
    }

    // Hàm chính để fetch classes và tìm class
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const allClasses = await ClassService.getAllClass();
                console.log('All Classes:', allClasses);

                setClasses(allClasses?.data || []);

                const calculatedSchoolYears = allClasses?.data.map(classItem => {
                    console.log('Processing classItem:', classItem);
                    console.log('classItem.year:', classItem?.year);  // Kiểm tra year
                    console.log('classItem.blockID.nameBlock:', classItem?.blockID?.nameBlock);  // Kiểm tra block
                    
                    const block = parseInt(classItem?.blockID?.nameBlock, 10);  // Chuyển thành số nguyên
                    const years = getSchoolYears(classItem?.year, block);
                    console.log('Returned years:', years);  // Kiểm tra giá trị trả về từ getSchoolYears
                    
                    return years.length > 0 ? years : null;  // Trả về null nếu mảng trống
                }).filter(year => year !== null).flat();
                    
                console.log('Calculated School Years:', calculatedSchoolYears); 
                setYears([...new Set(calculatedSchoolYears)]); // Kiểm tra kết quả cuối cùng
    
                // Set giá trị mặc định cho selectedYear nếu có "2024-2025"
                if (calculatedSchoolYears.includes("2024-2025") && !selectedYear) {
                    setSelectedYear("2024-2025");
                }

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
    console.log(classSubject)

    // Hàm gọi API và định dạng lại dữ liệu
    const fetchScores = async (semester, year) => {
        if (!classSubject || !Array.isArray(classSubject)) {
            console.error("classSubject chưa được khởi tạo hoặc không hợp lệ:", classSubject);
            setError('Dữ liệu môn học chưa sẵn sàng. Vui lòng thử lại!');
            return;
        }
    
        setLoading(true);
        setError(null);
    
        try {
            // Lấy dữ liệu điểm từ API
            const rawData = await ScoreSbujectService.getAllScoreByStudentIdSemesterAndClass(studentId, semester, year);
            console.log("Raw Data:", rawData);
    
            // Kiểm tra nếu rawData không có dữ liệu
            if (!rawData || rawData.data.length === 0) {
                console.warn(`Không có dữ liệu điểm trả về cho kỳ ${semester}`);
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
                // Tìm điểm của môn học này từ rawData
                const subjectData = rawData.data.find(item => item.subjectId.nameSubject === subject.nameSubject);
    
                if (subjectData) {
                    // Lọc điểm theo loại (thuongXuyen, giuaKi, cuoiKi)
                    const regularScores = subjectData.scores.filter(score => score.type === "thuongXuyen").map(score => score.score);
                    const midtermScores = subjectData.scores.filter(score => score.type === "giuaKi").map(score => score.score);
                    const finalScores = subjectData.scores.filter(score => score.type === "cuoiKi").map(score => score.score);
    
                    return {
                        subject: subject.nameSubject,
                        regular: regularScores,
                        midterm: midtermScores,
                        final: finalScores,
                    };
                } else {
                    return {
                        subject: subject.nameSubject,
                        regular: [],
                        midterm: [],
                        final: [],
                    };
                }
            });
    
            console.log("Formatted Data:", formattedData);
    
            setGrades(prev => ({
                ...prev,
                [semester]: formattedData,
            }));
        } catch (err) {
            console.error("Error fetching scores:", err.message || err);
            setGrades(prev => ({
                ...prev,
                [semester]: classSubject.map(subject => ({
                    subject: subject.nameSubject,
                    regular: [],
                    midterm: [],
                    final: [],
                })),
            }));
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        if (classSubject && Array.isArray(classSubject) && selectedYear && selectedSemester) {
            fetchScores(selectedSemester, selectedYear); // Gọi API với semester và year
        }
    }, [selectedSemester, selectedYear, studentId, classSubject]);

    const handleSemesterChange = (semester) => {
        setSelectedSemester(semester);
    };

    // const calculateAverage = (regularScores, midtermScores, finalScores) => {
    //     // Kiểm tra nếu mảng rỗng hoặc không hợp lệ
    //     if (!Array.isArray(regularScores) || !Array.isArray(midtermScores) || !Array.isArray(finalScores)) {
    //         console.error("Một trong các mảng không hợp lệ!");
    //         return "N/A";
    //     }
    
    //     // Lọc ra những điểm hợp lệ (không phải null hoặc undefined)
    //     const totalScores = [
    //         ...regularScores.filter(score => score != null).map(score => score * 1),  // Điểm Thường Xuyên hệ số 1
    //         ...midtermScores.filter(score => score != null).map(score => score * 2),  // Điểm Giữa Kỳ hệ số 2
    //         ...finalScores.filter(score => score != null).map(score => score * 3),    // Điểm Cuối Kỳ hệ số 3
    //     ];
    
    //     // Tính tổng điểm có hệ số
    //     const sumScores = totalScores.reduce((acc, score) => acc + score, 0);
    
    //     // Tổng hệ số là 1 + 2 + 3 = 6
    //     const totalWeights = regularScores.length + midtermScores.length * 2 + finalScores.length * 3;
    
    //     // Tránh chia cho 0 nếu không có điểm hợp lệ
    //     if (totalWeights === 0) {
    //         return "N/A";
    //     }
    
    //     // Chia cho tổng hệ số (6)
    //     const average = sumScores / totalWeights;  // Chia cho tổng hệ số đúng
    //     return average > 0 ? average.toFixed(2) : "N/A";
    // };
    
    
    
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

            <div className="mb-6">
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}  // Cập nhật state khi người dùng chọn năm học
                    className="px-4 py-2 rounded-lg border border-gray-300"
                >
                    <option value="">Chọn Năm Học</option>
                    {years.length > 0 ? (
                        years.map((year, idx) => (
                            <option key={idx} value={year}>
                                {year}
                            </option>
                        ))
                    ) : (
                        <option value="">Không có năm học nào</option>
                    )}
                </select>
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
