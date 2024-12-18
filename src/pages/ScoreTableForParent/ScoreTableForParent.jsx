import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import SummaryStudent from '../../components/SummaryStudent/SummaryStudent';
import SummaryAttendanceAndAward from '../../components/SummaryAttendaceAndAward/SummaryAttendanceAndAward';
import { HiClipboardList } from 'react-icons/hi';
import * as ScoreSbujectService from "../../services/ScoreSbujectService";
import * as ClassService from "../../services/ClassService";
import * as SubjectService from "../../services/SubjectService";
import * as ScheduleService from "../../services/ScheduleService";
import { useParams } from 'react-router-dom';

const ScoreTableForParent = () => {
    const [grades, setGrades] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [classes, setClasses] = useState([]);
    const [classSubject, setClassSubject] = useState(null);
    const [classSubjectPhu, setClassSubjectPhu] = useState();
    const [years, setYears] = useState([]);
    const [subjectEvaluate, setSubjectEvaluate] = useState([]);
    const [timeTables, setTimeTables] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [countAbsent, setCountAbsent] = useState();
    const [userClasses, setUserClasses] = useState([])
    const [year, setYear] = useState("")
    const [semesters, setSemesters] = useState([])
    const [selectedClass, setSelectedClass] = useState();
    const [selectedNameSemester, setSelectedNameSemester] = useState();
    const [achivement, setAchivement] = useState();
    const [block, setBlock] = useState();

    const { studentId } = useParams();

    console.log(studentId)


    useEffect(() => {
        const fetchTimeTables = async () => {
            setIsLoading(true);
            try {
                const timeTablesData = await ScheduleService.getClassAndTimeTableByStudentId(studentId);
                const data = processTimeTable(timeTablesData.data);
                setTimeTables(data);
                const totals = countTotalAbsencesAndExcused(data);
                setCountAbsent(totals)
            } catch (error) {
                console.error("Error fetching time tables:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTimeTables();
    }, [studentId]);


    function getDateOfWeek(year, week, dayOfWeek) {
        const firstDayOfYear = new Date(year, 0, 1);
        const daysOffset = (week - 1) * 7;
        const firstDayOfWeek = new Date(firstDayOfYear);
        firstDayOfWeek.setDate(firstDayOfYear.getDate() + daysOffset);

        const daysOfWeek = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
        const dayIndex = daysOfWeek.indexOf(dayOfWeek);
        if (dayIndex === -1) {
            throw new Error("Ngày không hợp lệ");
        }

        const resultDate = new Date(firstDayOfWeek);
        resultDate.setDate(firstDayOfWeek.getDate() + dayIndex);

        const yearResult = resultDate.getFullYear();
        const monthResult = (resultDate.getMonth() + 1).toString().padStart(2, '0');
        const dayResult = resultDate.getDate().toString().padStart(2, '0');

        return `${yearResult}-${monthResult}-${dayResult}`;
    }

    function processTimeTable(data) {
        const result = {};

        data.timeTables.forEach(timeTable => {
            timeTable.scheduleIds.forEach(schedule => {
                const date = getDateOfWeek(timeTable.year, timeTable.week, schedule.dayOfWeek);

                // Lấy thông tin các slot có học sinh vắng
                const slotData = {};
                schedule.slots.forEach(slot => {
                    // Kiểm tra attendanceStatus trước, nếu học sinh có mặt và không có trong danh sách absent
                    if (slot.attendanceStatus.status === true && slot.absentStudentId.length === 0) {
                        slotData[slot.slotNumber] = { status: "present" };
                    } else {
                        // Nếu có học sinh vắng, duyệt qua danh sách absentStudentId
                        slot.absentStudentId.forEach(absent => {
                            if (absent.isExcused === false) {
                                slotData[slot.slotNumber] = { status: "absent" };
                            } else if (absent.isExcused === true) {
                                slotData[slot.slotNumber] = { status: "excused" };
                            }
                        });
                    }
                });

                if (Object.keys(slotData).length > 0) {
                    result[date] = { slots: slotData };
                }
            });
        });

        return result;
    }

    function countTotalAbsencesAndExcused(timeTablesData) {
        let totalAbsent = 0;
        let totalExcused = 0;

        // Lọc qua tất cả các ngày
        Object.keys(timeTablesData).forEach(date => {
            const dayData = timeTablesData[date];

            // Lọc qua từng slot trong ngày
            Object.keys(dayData.slots).forEach(slotNumber => {
                const slot = dayData.slots[slotNumber];

                // Đếm tổng số vắng mặt và có phép
                if (slot.status === "absent") {
                    totalAbsent++;
                } else if (slot.status === "excused") {
                    totalExcused++;
                }
            });
        });

        return { totalAbsent, totalExcused };
    }

    // Hàm riêng để tìm class chứa user.id
    const findUserClass = (allClasses, userId) => {
        if (!Array.isArray(allClasses)) {
            console.error('All classes is not a valid array:', allClasses);
            return null;
        }

        const foundClass = allClasses.filter((classItem) => {
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

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const allClasses = await ClassService.getAllClass();
                setClasses(allClasses?.data || []);
                const userClass = findUserClass(allClasses?.data || [], studentId);
                console.log(userClass)
                setUserClasses(userClass)
                setYear(userClass[0].year)
                setBlock(userClass[0].blockID._id)
                const filterUserClass = userClass.find((classItem) => {
                    return classItem._id === selectedClass;
                });
                if (filterUserClass && filterUserClass?.SubjectsId) {
                    setClassSubject(filterUserClass?.SubjectsId);
                } else {
                }
                if (filterUserClass && filterUserClass?.SubjectsPhuId) {
                    setClassSubjectPhu(filterUserClass?.SubjectsPhuId || []);
                } else {
                    console.error("Không tìm thấy classSubject phù hợp!");
                }
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };
        fetchClasses();
    }, [studentId, selectedClass]);

    console.log(block)

    useEffect(() => {
        const fetchYear = async () => {
            try {
                setLoading(true); // Bắt đầu tải
                const response = await SubjectService.getAllSemesterByBlockAndYear(block, year);
                setSemesters(response?.semesters)
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết lớp:", error);
            } finally {
                setLoading(false); // Kết thúc tải
            }
        };
        if (year && block) {
            fetchYear();
        }

    }, [year , block]);

    const filterSubjectEvaluationsByUserId = () => {
        if (!Array.isArray(classSubjectPhu)) {
            console.warn('classSubjectPhu is not an array or is undefined');
            return [];  // Trả về mảng rỗng nếu classSubjectPhu không hợp lệ
        }

        return classSubjectPhu.map(subject => {
            const userEvaluate = subject.evaluate.filter(evaluation => evaluation.StudentId === studentId);
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
    }, [classSubjectPhu]);

    useEffect(() => {
        if (userClasses.length > 0) {
            setSelectedClass(userClasses[0]._id);
        }
    }, [userClasses]);

    useEffect(() => {
        if (semesters.length > 0) {
            // Tự động chọn kỳ 1 (giả sử kỳ 1 là phần tử đầu tiên trong mảng)
            setSelectedSemester(semesters[0]._id);
            setSelectedNameSemester(semesters[0].nameSemester)
        }
    }, [semesters]);

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

    // Hàm gọi API và định dạng lại dữ liệu
    const fetchScores = async (semester, classId) => {
        if (!classSubject || !Array.isArray(classSubject)) {
            console.error("classSubject chưa được khởi tạo hoặc không hợp lệ:", classSubject);
            setError('Dữ liệu môn học chưa sẵn sàng. Vui lòng thử lại!');
            return;
        }

        setLoading(true);
        setError(null);

        const findSemester = semesters.find((smt) => {
            return smt._id === semester
        })

        try {
            // Lấy dữ liệu điểm từ API
            const rawData = await ScoreSbujectService.getAllScoreByStudentIdSemesterAndClass(studentId, semester, classId);
            if (!rawData || rawData.data.length === 0) {
                setGrades(prev => ({
                    ...prev,
                    [findSemester.nameSemester]: classSubject.map(subject => ({
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

            setGrades(prev => ({
                ...prev,
                [findSemester.nameSemester]: formattedData,
            }));
        } catch (err) {
            // console.error("Error fetching scores:", err.message || err);
            setGrades(prev => ({
                ...prev,
                [findSemester.nameSemester]: classSubject.map(subject => ({
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
        for (const semester of semesters) {
            fetchScores(semester._id, selectedClass);
        }
    }, [selectedClass, classSubject, selectedSemester, semesters]);

    const handleSemesterChange = (semesterId) => {
        const findSemester = semesters.find((semester) => {
            return semester._id === semesterId
        })
        setSelectedSemester(semesterId);
        setSelectedNameSemester(findSemester.nameSemester);
    };


    const onBack = () => {
        window.history.back();
    };


    const calculateAverageSubject = (regular = [], midterm = [], final = [], subject) => {
        // Kiểm tra điều kiện nhập vào
        if ((subject === "Toán" && regular.length !== 4) || (subject !== "Toán" && regular.length !== 3) || midterm.length !== 1 || final.length !== 1) {
            return 'Chưa có';
        }

        // Kiểm tra kiểu dữ liệu của input
        if (!Array.isArray(regular) || !Array.isArray(midterm) || !Array.isArray(final)) {
            throw new Error("All inputs must be arrays.");
        }

        // Tính tổng trọng số
        const totalWeight = (regular.length * 1) + (midterm.length * 2) + (final.length * 3);
        // Tính tổng điểm với trọng số
        let totalScore = 0;

        // Tính tổng điểm cho phần regular
        for (let i = 0; i < regular.length; i++) {
            totalScore += regular[i] * 1;
        }

        // Tính tổng điểm cho phần midterm
        for (let i = 0; i < midterm.length; i++) {
            totalScore += midterm[i] * 2;
        }

        // Tính tổng điểm cho phần final
        for (let i = 0; i < final.length; i++) {
            totalScore += final[i] * 3;
        }

        // Tính điểm trung bình
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
                return;
            }

            // Tính trung bình cho từng môn học trong kỳ
            const averagesForSemester = semesterGrades.map((grade) => {
                const { subject, regular, midterm, final } = grade;
                const average = calculateAverageSubject(regular, midterm, final, subject);

                return {
                    semester,
                    subject,
                    average,
                };
            });

            allAverages.push(...averagesForSemester);
        });

        return allAverages;
    };


    const averages = getAllSubjectAverages();


    const getAllEvaluate = () => {
        if (!subjectEvaluate || !Array.isArray(subjectEvaluate)) {
            console.warn('subjectEvaluate is not an array or is undefined');
            return [];
        }
        const evaluations = [];

        subjectEvaluate.forEach(subject => {
            if (subject.evaluate && Array.isArray(subject.evaluate)) {
                const evaluationsForSubject = subject.evaluate.map(evaluation => ({
                    semester: evaluation.semester,
                    evaluate: evaluation.evaluate,
                    subject: subject.nameSubject,
                }));
                evaluations.push(...evaluationsForSubject);
            }
        });

        return evaluations;
    };

    const evaluates = getAllEvaluate()

    console.log(achivement)

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
                <SummaryStudent
                    studentId={studentId}
                    selectedSemester={selectedSemester}
                    evaluates={evaluates}
                    averages={averages}
                    semesters={semesters}
                    setAchivement={setAchivement}
                />

                <SummaryAttendanceAndAward
                    countAbsent={countAbsent}
                    achivement={achivement}
                />
            </div>

            <div className="flex gap-2 mb-6">
                {semesters.map((semester) => (
                    <button
                        className={`px-4 py-2 rounded-lg font-semibold ${selectedSemester === semester._id
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                            }`}
                        onClick={() => handleSemesterChange(semester._id)}
                    >
                        Kỳ {semester.nameSemester}
                    </button>
                ))}
            </div>

            <div className="mb-6">
                <select
                    value={selectedClass} // Đây sẽ là classItem._id
                    onChange={(e) => setSelectedClass(e.target.value)} // Cập nhật selectedClass với _id
                    className="px-4 py-2 rounded-lg border border-gray-300"
                >
                    <option value="">Chọn Năm Học</option>
                    {userClasses.map((classItem) => (
                        <option key={classItem._id} value={classItem._id}> {/* value là _id */}
                            {classItem.year}
                        </option>
                    ))}
                </select>
            </div>

            <div className="w-4/5 rounded-xl overflow-hidden p-6">
                <div className="flex items-center mb-6">
                    <HiClipboardList className="text-blue-600 w-6 h-6 mr-2" />
                    <span className="text-xl font-bold text-blue-600">Bảng điểm</span>
                </div>

                {loading && <p className="text-blue-500">Đang tải dữ liệu...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && grades[selectedNameSemester] && (
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
                            {grades[selectedNameSemester]?.map((grade, index) => (
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

export default ScoreTableForParent;