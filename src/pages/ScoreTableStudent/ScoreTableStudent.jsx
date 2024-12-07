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
    const [selectedSemester, setSelectedSemester] = useState("1");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [studentId, setStudentId] = useState(user?.id);
    const [classes, setClasses] = useState([]);
    const [classSubject, setClassSubject] = useState(null);
    const [classSubjectPhu, setClassSubjectPhu] = useState();
    const [selectedYear, setSelectedYear] = useState("2024-2025");
    const [years, setYears] = useState([]);
    const [subjectEvaluate, setSubjectEvaluate] = useState([]);


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

                    const block = parseInt(classItem?.blockID?.nameBlock, 10);
                    const years = getSchoolYears(classItem?.year, block);

                    return years.length > 0 ? years : null;
                }).filter(year => year !== null).flat();

                console.log('Calculated School Years:', calculatedSchoolYears);
                setYears([...new Set(calculatedSchoolYears)]);

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
                if (userClass && userClass.subjectGroup?.SubjectsPhuId) {
                    setClassSubjectPhu(userClass?.subjectGroup?.SubjectsPhuId || []);
                } else {
                    console.error("Không tìm thấy classSubject phù hợp!");
                }
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };
        fetchClasses();
    }, [user.id]);

    const filterSubjectEvaluationsByUserId = () => {
        if (!Array.isArray(classSubjectPhu)) {
            console.warn('classSubjectPhu is not an array or is undefined');
            return [];  // Trả về mảng rỗng nếu classSubjectPhu không hợp lệ
        }

        return classSubjectPhu.map(subject => {
            const userEvaluate = subject.evaluate.filter(evaluation => evaluation.StudentId === user.id);

            // Nếu có đánh giá của học sinh, trả về môn học và các đánh giá
            if (userEvaluate.length > 0) {
                return {
                    nameSubject: subject.nameSubject,
                    evaluate: userEvaluate
                };
            }
            return null;
        }).filter(subject => subject !== null);
    };

    useEffect(() => {
        setSubjectEvaluate(filterSubjectEvaluationsByUserId());
    }, [classSubjectPhu, user.id]);

    // console.log(subjectEvaluate)

    const filterBySemester = () => {
        if (!subjectEvaluate || !Array.isArray(subjectEvaluate)) {
            console.warn('subjectEvaluate is not an array or is undefined');
            return []; // Trả về mảng rỗng nếu dữ liệu không hợp lệ
        }

        // Lọc các đánh giá theo kỳ học
        return subjectEvaluate.map(subject => {
            const filteredEvaluates = subject.evaluate.filter(evaluation => evaluation.semester == selectedSemester);

            if (filteredEvaluates.length > 0) {
                return {
                    subject: subject.nameSubject,
                    evaluations: filteredEvaluates.map(evaluation => ({
                        evaluate: evaluation.evaluate,
                        semester: evaluation.semester
                    }))
                };
            } else {
                // Nếu không có đánh giá cho kỳ học, hiển thị thông báo "Chưa có"
                return {
                    subject: subject.nameSubject,
                    evaluations: [{
                        evaluate: "Chưa có",
                        semester: selectedSemester
                    }]
                };
            }
        });
    };


    // console.log(classSubjectPhu)

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
            // console.error("Error fetching scores:", err.message || err);
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
        if (classSubject && Array.isArray(classSubject) && selectedYear) {
            // Lấy dữ liệu cho cả 2 kỳ
            fetchScores('1', selectedYear); // Kỳ 1
            fetchScores('2', selectedYear); // Kỳ 2
        }
    }, [selectedYear, classSubject]);

    const handleSemesterChange = (semester) => {
        setSelectedSemester(semester);
    };

    const onBack = () => {
        window.history.back();
    };


    const calculateAverageSubject = (regular = [], midterm = [], final = [], subject) => {
        // Kiểm tra nếu các mảng có đúng số lượng phần tử
        if ((subject === "Toán" && regular.length !== 4) || (subject !== "Toán" && regular.length !== 3) || midterm.length !== 1 || final.length !== 1) {
            return 'Chưa có';  // Hoặc bạn có thể trả về null hoặc một giá trị khác.
        }

        // Check if all inputs are arrays
        if (!Array.isArray(regular) || !Array.isArray(midterm) || !Array.isArray(final)) {
            throw new Error("All inputs must be arrays.");
        }

        const totalWeight = (regular.length * 1) + (midterm.length * 2) + (final.length * 3);
        const totalScore =
            regular.reduce((sum, score) => sum + score, 0) * 1 +
            midterm.reduce((sum, score) => sum + score, 0) * 2 +
            final.reduce((sum, score) => sum + score, 0) * 3;

        return (totalScore / totalWeight).toFixed(2);
    };

    const getAllSubjectAverages = () => {
        if (!grades || Object.keys(grades).length === 0) {
            console.warn('Không có dữ liệu điểm cho bất kỳ kỳ học nào!');
            return [];
        }

        const allAverages = [];

        // Duyệt qua từng kỳ trong grades
        Object.keys(grades).forEach((semester) => {
            const semesterGrades = grades[semester];
            if (!semesterGrades || semesterGrades.length === 0) {
                // console.warn(`Không có dữ liệu điểm cho kỳ ${semester}!`);
                return;
            }

            // Tính trung bình cho từng môn học trong kỳ
            const averagesForSemester = semesterGrades.map((grade) => {
                const { subject, regular, midterm, final } = grade;
                const average = calculateAverageSubject(regular, midterm, final, subject);

                return {
                    semester, // Thêm thông tin kỳ học
                    subject,
                    average,
                };
            });

            allAverages.push(...averagesForSemester);
        });

        return allAverages;
    };


    const averages = getAllSubjectAverages();
    // console.log("Tất cả trung bình môn học:", averages);

    // console.log(grades)

    const getAllEvaluate = () => {
        if (!subjectEvaluate || !Array.isArray(subjectEvaluate)) {
            console.warn('subjectEvaluate is not an array or is undefined');
            return []; // Trả về mảng rỗng nếu subjectEvaluate không hợp lệ
        }

        // Khởi tạo mảng để lưu trữ các đánh giá
        const evaluations = [];

        subjectEvaluate.forEach(subject => {
            // Lọc các đánh giá theo kỳ học và lưu vào mảng evaluations
            if (subject.evaluate && Array.isArray(subject.evaluate)) {
                const evaluationsForSubject = subject.evaluate.map(evaluation => ({
                    semester: evaluation.semester,
                    evaluate: evaluation.evaluate,
                    subject: subject.nameSubject, // Chỉ lưu tên môn học, không phải toàn bộ object subject
                }));

                // Thêm các đánh giá của môn học vào mảng evaluations
                evaluations.push(...evaluationsForSubject);
            }
        });

        return evaluations;
    };

    const evaluates = getAllEvaluate()

    // console.log(evaluates)



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
                <SummaryStudent studentId={studentId} selectedSemester={selectedSemester} evaluates={evaluates} averages={averages} />

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
                                        {calculateAverageSubject(grade.regular, grade.midterm, grade.final, grade.subject)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="w-4/5 rounded-xl overflow-hidden p-6">
                <div className="flex items-center mb-6">
                    <HiClipboardList className="text-blue-600 w-6 h-6 mr-2" />
                    <span className="text-xl font-bold text-blue-600">Bảng đánh giá</span>
                </div>

                {loading && <p className="text-blue-500">Đang tải dữ liệu...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && (
                    <table className="w-full border-collapse text-left table-fixed bg-white">
                        <thead>
                            <tr className="bg-blue-100 text-blue-700 text-lg font-semibold">
                                <th className="w-1/4 px-4 py-4 border border-blue-200">Môn học</th>
                                <th className="w-1/4 px-4 py-4 border border-blue-200 text-center">Đánh giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterBySemester().map((subject, index) => (
                                <tr key={index} className="hover:bg-blue-50 text-gray-700 text-lg">
                                    <td className="px-4 py-4 border border-gray-200">
                                        {subject.subject}
                                    </td>
                                    <td className="px-4 py-4 border border-gray-200 text-center">
                                        {subject.evaluations.map((evaluation, idx) => (
                                            <div key={idx} className="p-1 border border-gray-300 rounded-md">
                                                {evaluation.evaluate}
                                            </div>
                                        ))}
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
