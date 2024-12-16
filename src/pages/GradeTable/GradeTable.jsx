import React, { useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { FaFileExcel, FaSearch, FaArrowLeft } from 'react-icons/fa';
import { useParams } from "react-router-dom";
import * as ScoreSubjectService from "../../services/ScoreSbujectService";
import * as SubjectService from "../../services/SubjectService";
import * as ClassService from "../../services/ClassService";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { toast } from "react-toastify";
import { Spin } from "antd";
const GradeTable = () => {
    const [students, setStudents] = useState([]);
    const { idClass, idSubject, semester } = useParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterScore, setFilterScore] = useState("");
    const [semesterFilter, setSemesterFilter] = useState(""); // Bộ lọc kỳ
    const [studentInClass, setStudentInClass] = useState([]);
    const [classDetail, setClassDetail] = useState();
    const [subject, setSubject] = useState()
    const [subjectPhu, setSubjectPhu] = useState()
    const [loading, setLoading] = useState(false);
    const [evaluates, setEvaluates] = useState(null);
    const [year, setYear] = useState("");
    const [semesters, setSemesters] = useState([])
    const [semester1, setSemester1] = useState([])
    const [semester2, setSemester2] = useState([])
    const [isSemesterEndToday, setIsSemesterEndToday] = useState(false);
    const [isSemesterEndTodaySemester1, setIsSemesterEndTodaySemester1] = useState(false);
    const [isSemesterEndTodaySemester2, setIsSemesterEndTodaySemester2] = useState(false);



    useEffect(() => {
        const fetchClassDetails = async () => {
            try {
                setLoading(true); // Bắt đầu tải
                const response = await ClassService.getDetailClass(idClass);
                setClassDetail(response?.data)
                setStudentInClass(response?.data?.studentID);
                setYear(response?.data.year)
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết lớp:", error);
            } finally {
                setLoading(false); // Kết thúc tải
            }
        };

        if (idClass) {
            fetchClassDetails();
        }
    }, [idClass]);

    useEffect(() => {
        const filterSemester = semesters.find((semester) => semester._id === semesterFilter);
        if (filterSemester) {
            // Cập nhật semester1 và semester2
            if (filterSemester.nameSemester == "1") {
                
                setSemester1(filterSemester);
                setSemester2([]);
            }
            if (filterSemester.nameSemester == "2") {
                setSemester2(filterSemester);
                setSemester1([]);
            }
        }
    }, [semesterFilter, semesters]); // Chỉ phụ thuộc vào semesterFilter và semesters

    useEffect(() => {
        const currentDate = new Date().toLocaleDateString("en-GB"); // Lấy ngày hiện tại

        // Kiểm tra và cập nhật trạng thái cho kỳ 1 (semester1)
        if (semester1) {
            // Nếu có semester1, kiểm tra ngày kết thúc và cập nhật isSemesterEndTodaySemester1
            setIsSemesterEndTodaySemester1(semester1.dateEnd <>currentDate);
        } else {
            // Nếu không có semester1, đảm bảo là false
            setIsSemesterEndTodaySemester1(false);
        }

        // Kiểm tra và cập nhật trạng thái cho kỳ 2 (semester2)
        if (semester2) {
            // Nếu có semester2, kiểm tra ngày kết thúc và cập nhật isSemesterEndTodaySemester2
            setIsSemesterEndTodaySemester2(semester2.dateEnd === currentDate);
        } else {
            // Nếu không có semester2, đảm bảo là false
            setIsSemesterEndTodaySemester2(false);
        }
    }, [semester1, semester2]);
    // Phụ thuộc vào semester1 và semester2



    console.log(isSemesterEndToday)
    console.log(semester1)
    console.log(semester2)

    useEffect(() => {
        if (semester2) {
            const currentDate = new Date().toLocaleDateString("en-GB");
            setIsSemesterEndToday(semester2.dateEnd === currentDate);
        }
    }, [semester2]); // Phụ thuộc vào semester2




    useEffect(() => {
        if (semesters.length > 0) {
            setSemesterFilter(semesters[0]._id);
        }
    }, [semesters]);

    useEffect(() => {
        const fetchYear = async () => {
            try {
                setLoading(true); // Bắt đầu tải
                const response = await SubjectService.getAllSemesterByYear(year);
                setSemesters(response?.semesters)
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết lớp:", error);
            } finally {
                setLoading(false); // Kết thúc tải
            }
        };
        if (year) {
            fetchYear();
        }

    }, [year]);

    useEffect(() => {
        if (Array.isArray(classDetail?.SubjectsId)) {
            const foundSubject = classDetail?.SubjectsId.find(subject => subject._id === idSubject);
            setSubject(foundSubject);  // Cập nhật subject vào state
        } else {
            // console.error('subjectGroup is not an array or is missing.');
        }
    }, [classDetail, idSubject]);



    useEffect(() => {
        const fetchScores = async () => {
            try {
                setLoading(true); // Bắt đầu trạng thái tải
                const scoresData = await ScoreSubjectService.getAllScoresBySubjectSemester(idSubject, idClass, semesterFilter);

                // const filterSemester = semesters.find((semester) => semester._id === semesterFilter);

                // console.log(filterSemester.nameSemester);

                // Kiểm tra nếu không có dữ liệu điểm, tạo bảng điểm rỗng
                const scoresByStudentId = scoresData?.reduce((acc, detail) => {
                    const filteredScores = detail.scores.filter(score => score.semester === semesterFilter);
                    const scores = { diemThuongXuyen: [], diemGiuaKi: [], diemCuoiKi: [] };
                    filteredScores.forEach((score) => {
                        switch (score.type) {
                            case "thuongXuyen":
                                scores.diemThuongXuyen.push(score.score);
                                break;
                            case "giuaKi":
                                scores.diemGiuaKi.push(score.score);
                                break;
                            case "cuoiKi":
                                scores.diemCuoiKi.push(score.score);
                                break;
                            default:
                                break;
                        }
                    });

                    acc[detail.studentId._id] = {
                        id: detail.studentId._id,
                        name: detail.studentId.name,
                        email: detail.studentId.email,
                        nameClass: detail.classId.nameClass,
                        nameSubject: scoresData.nameSubject, // Hoặc detail.nameSubject nếu đúng
                        scoreId: detail._id, // hoặc nếu bạn cần lấy từ trường khác
                        ...scores,
                    };

                    return acc;
                }, {});
                // Gộp dữ liệu với danh sách sinh viên chưa có điểm
                const completeStudentList = studentInClass.map((student) => {
                    const existingStudent = scoresByStudentId ? scoresByStudentId[student._id] : null;
                    if (existingStudent) {
                        return existingStudent;
                    }

                    return {
                        id: student._id,
                        name: student.name,
                        email: student.email,
                        diemThuongXuyen: [],
                        diemGiuaKi: [],
                        diemCuoiKi: [],
                        scoreId: null,
                    };
                });

                setStudents(completeStudentList);
            } catch (error) {
                console.error("Error fetching scores:", error);

                // Nếu xảy ra lỗi, khởi tạo danh sách rỗng
                const emptyStudentList = studentInClass.map((student) => ({
                    id: student._id,
                    name: student.name,
                    email: student.email,
                    diemThuongXuyen: [],
                    diemGiuaKi: [],
                    diemCuoiKi: [],
                    scoreId: null,
                }));

                setStudents(emptyStudentList);
            } finally {
                setLoading(false); // Kết thúc trạng thái tải
            }
        };

        fetchScores();
    }, [idClass, idSubject, semesterFilter, studentInClass]);

    const calculateAverage = (grades) =>
        grades.length > 0
            ? (grades.reduce((sum, grade) => sum + grade, 0) / grades.length).toFixed(1)
            : 0;

    const calculateAverageSubject = (regular = [], midterm = [], final = [], subject) => {
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

    const handleDownloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            filteredStudents.map((student) => ({
                "Họ Tên": student.name,
                "Điểm Thường Xuyên": student.diemThuongXuyen.join(", "),
                "Điểm Giữa Kỳ": student.diemGiuaKi.join(", "),
                "Điểm Cuối Kỳ": student.diemCuoiKi.join(", "),
                "Trung Bình": (
                    (calculateAverage(student.diemThuongXuyen) * 1 +
                        calculateAverage(student.diemGiuaKi) * 2 +
                        calculateAverage(student.diemCuoiKi) * 3) / 6
                ).toFixed(1),
            }))
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Bảng Điểm");
        XLSX.writeFile(workbook, "BangDiem.xlsx");
    };

    const handleScoreChange = useCallback((type, index, value, studentId) => {
        setStudents(prevStudents =>
            prevStudents.map(student => {
                if (student.id === studentId) {
                    const updatedStudent = {
                        ...student,
                        scoreId: student.scoreId, // Giữ nguyên scoreId
                        diemThuongXuyen: Array.isArray(student.diemThuongXuyen) ? [...student.diemThuongXuyen] : [],
                        diemGiuaKi: Array.isArray(student.diemGiuaKi) ? [...student.diemGiuaKi] : [],
                        diemCuoiKi: Array.isArray(student.diemCuoiKi) ? [...student.diemCuoiKi] : [],
                    };

                    if (type === "diemThuongXuyen" && index !== undefined) {
                        updatedStudent.diemThuongXuyen[index] = value ? parseFloat(value) : 0;
                    } else if (type === "diemGiuaKi") {
                        updatedStudent.diemGiuaKi = value ? [parseFloat(value)] : [];
                    } else if (type === "diemCuoiKi") {
                        updatedStudent.diemCuoiKi = value ? [parseFloat(value)] : [];
                    }

                    return updatedStudent;
                }
                return student;
            })
        );
    }, []);



    const filteredStudents = students.filter((student) => {
        const averageScore = (
            (calculateAverage(student.diemThuongXuyen) * 1 +
                calculateAverage(student.diemGiuaKi) * 2 +
                calculateAverage(student.diemCuoiKi) * 3) / 6
        ).toFixed(1);

        const matchName = student?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchScore =
            filterScore === "" ||
            (filterScore === "high" && averageScore >= 8) ||
            (filterScore === "low" && averageScore < 8);

        return matchName && matchScore;
    });

    const onBack = () => {
        window.history.back();
    }



    const handleSubmitScore = async () => {
        setLoading(true);
        try {
            // Sử dụng studentsRef để đảm bảo lấy giá trị students lúc hiện tại
            const scoresData = students.map(student => {
                // Kiểm tra và chỉ lấy điểm nếu có điểm
                const scores = [
                    ...student.diemThuongXuyen.length > 0
                        ? student.diemThuongXuyen.map(score => ({ type: "thuongXuyen", score, semester: semesterFilter }))
                        : [],
                    ...student.diemGiuaKi.length > 0
                        ? student.diemGiuaKi.map(score => ({ type: "giuaKi", score, semester: semesterFilter }))
                        : [],
                    ...student.diemCuoiKi.length > 0
                        ? student.diemCuoiKi.map(score => ({ type: "cuoiKi", score, semester: semesterFilter }))
                        : []
                ];

                // Nếu không có điểm gì thì bỏ qua
                if (scores.length === 0) {
                    return null;
                }

                const scoreId = student.scoreId || null;

                return { studentId: student.id, subjectId: idSubject, classId: idClass, scores, scoreId };
            }).filter(scoreData => scoreData !== null); // Loại bỏ các sinh viên không có điểm

            if (scoresData.length === 0) {
                toast.info("No scores to submit.");
                return;
            }
            console.log(scoresData)

            // Tạo một mảng promises để xử lý tất cả các yêu cầu
            const scorePromises = scoresData.map(scoreData => {
                if (scoreData.scoreId) {
                    console.log("Updating score for studentId:", scoreData.studentId);
                    return ScoreSubjectService.updateScore(scoreData.scoreId, scoreData);
                } else {
                    console.log("Creating new score for studentId:", scoreData.studentId);
                    return ScoreSubjectService.createScore(scoreData);
                }
            });

            // Chờ tất cả các promises được thực thi
            await Promise.all(scorePromises);

            // Hiển thị toast khi tất cả đã hoàn thành
            toast.success("All scores have been successfully uploaded!");
        } catch (error) {
            toast.error("An error occurred while submitting scores.");
        } finally {
            setLoading(false);
        }
    };

    const handleUploadExcel = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const data = event.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });

            if (workbook.SheetNames.length > 0) {
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const json = XLSX.utils.sheet_to_json(worksheet);

                // Đảm bảo rằng các dữ liệu trong Excel có đúng cấu trúc
                const updatedStudents = students.map(student => {
                    const studentData = json.find(item => item["Họ Tên"] === student.name);

                    if (studentData) {
                        return {
                            ...student,
                            diemThuongXuyen: studentData["Điểm Thường Xuyên"]?.split(",").map(v => parseFloat(v.trim())) || [],
                            diemGiuaKi: studentData["Điểm Giữa Kỳ"] ? [parseFloat(studentData["Điểm Giữa Kỳ"])] : [],
                            diemCuoiKi: studentData["Điểm Cuối Kỳ"] ? [parseFloat(studentData["Điểm Cuối Kỳ"])] : []
                        };
                    }

                    return student;
                });

                setStudents(updatedStudents);  // Cập nhật lại students state
            } else {
                console.error('No sheets found in the Excel file');
            }
        };

        reader.readAsBinaryString(file);
    }

    console.log(semesterFilter)
    console.log(semester1 && semester1.nameSemester == "1" && isSemesterEndTodaySemester1)

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <Spin spinning={loading} size="large">
                <Breadcrumb
                    title={`Bảng Điểm Môn ${subjectPhu ? subjectPhu.nameSubject : subject?.nameSubject} Lớp ${classDetail?.nameClass}`}
                    buttonText="Lưu điểm"
                    onButtonClick={handleSubmitScore}
                    onBack={onBack}
                />

                <div className="mt-16"></div>

                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <FaSearch className="text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm học sinh..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                        />

                        {/* Bộ lọc kỳ */}
                        <select
                            value={semesterFilter}
                            onChange={(e) => setSemesterFilter(e.target.value)}
                            className="px-4 py-2 mx-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                        >
                            {semesters.map((semester) => (
                                <option key={semester.id} value={semester._id}>
                                    {semester.nameSemester}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filterScore}
                            onChange={(e) => setFilterScore(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                        >
                            <option value="">Lọc theo loại điểm</option>
                            <option value="high">Điểm cao ({"\u2265"}8)</option>
                            <option value="low">Điểm thấp (&lt;8)</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg flex items-center hover:bg-green-700 transition duration-300"
                            onClick={() => document.getElementById("fileInput").click()}
                        >
                            <FaFileExcel className="mr-2" /> Tải lên Excel
                        </button>
                        <input
                            type="file"
                            id="fileInput"
                            accept=".xlsx, .xls"
                            onChange={handleUploadExcel}
                            style={{ opacity: 0, position: "absolute", zIndex: -1 }}
                        />
                        <button
                            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg flex items-center hover:bg-green-700 transition duration-300"
                            onClick={handleDownloadExcel}
                        >
                            <FaFileExcel className="mr-2" /> Tải xuống Excel
                        </button>
                        {/* <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg flex items-center hover:bg-blue-600 transition duration-300"
                            onClick={() => window.history.back()}
                        >
                            <FaArrowLeft className="mr-2" /> Trở về
                        </button> */}
                    </div>
                </div>

                {/* Bảng điểm */}
                {/* <Spin spinning={loading} size="large"> */}
                <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
                    <table className="table-auto w-full border-collapse">
                        <thead>
                            <tr className="text-left uppercase tracking-wider">
                                <th style={{ width: "25%" }} className="border px-4 py-2">Họ Tên</th>
                                <th className="border px-4 py-2">Điểm Thường Xuyên</th>
                                <th style={{ width: "15%" }} className="border px-4 py-2">Điểm Giữa Kỳ</th>
                                <th style={{ width: "15%" }} className="border px-4 py-2">Điểm Cuối Kỳ</th>
                                <th style={{ width: "15%" }} className="border px-4 py-2">Trung Bình</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-3">
                                            <input
                                                type="text"
                                                value={student.name}
                                                readOnly
                                                className="w-full border rounded px-2 py-1 bg-gray-100"
                                            />
                                        </td>
                                        <td className="border px-4 py-2">
                                            <div className="grid grid-cols-2 gap-2">
                                                {[...Array(subject.nameSubject === "Toán" ? 4 : 3)].map((_, idx) => (
                                                    <input
                                                        key={`thuongXuyen-${idx}`}
                                                        type="number"
                                                        disabled={semester1 && semester1.nameSemester == "1" && isSemesterEndTodaySemester1 || semester2 && semester2.nameSemester == "2" && isSemesterEndTodaySemester2}
                                                        value={student.diemThuongXuyen[idx] || ''}
                                                        onChange={(e) => handleScoreChange('diemThuongXuyen', idx, e.target.value, student.id)}
                                                        onInput={(e) => {
                                                            let value = e.target.value;
                                                            // Chỉ cho phép nhập giá trị từ 0 đến 10
                                                            if (value < 0) e.target.value = 0;
                                                            if (value > 10) e.target.value = 10;
                                                        }}
                                                        className="w-full border rounded px-2 py-1"
                                                    />
                                                ))}
                                            </div>
                                        </td>

                                        <td className="border px-4 py-2">
                                            <input
                                                type="number"
                                                value={student.diemGiuaKi || ''}
                                                disabled={semester1 && semester1.nameSemester == "1" && isSemesterEndTodaySemester1 || semester2 && semester2.nameSemester == "2" && isSemesterEndTodaySemester2}
                                                onChange={(e) => handleScoreChange('diemGiuaKi', null, e.target.value, student.id)}
                                                onInput={(e) => {
                                                    let value = e.target.value;
                                                    // Chỉ cho phép nhập giá trị từ 0 đến 10
                                                    if (value < 0) e.target.value = 0;
                                                    if (value > 10) e.target.value = 10;
                                                }}
                                                className="w-full border rounded px-2 py-1"
                                            />
                                        </td>
                                        <td className="border px-4 py-2">
                                            <input
                                                type="number"
                                                value={student.diemCuoiKi || ''}
                                                disabled={semester1 && semester1.nameSemester == "1" && isSemesterEndTodaySemester1 || semester2 && semester2.nameSemester == "2" && isSemesterEndTodaySemester2}
                                                onChange={(e) => handleScoreChange('diemCuoiKi', null, e.target.value, student.id)}
                                                onInput={(e) => {
                                                    let value = e.target.value;
                                                    // Chỉ cho phép nhập giá trị từ 0 đến 10
                                                    if (value < 0) e.target.value = 0;
                                                    if (value > 10) e.target.value = 10;
                                                }}
                                                className="w-full border rounded px-2 py-1"
                                                min="0"
                                                max="10"
                                            />
                                        </td>

                                        <td className="border px-4 py-3 font-semibold text-blue-700">
                                            {calculateAverageSubject(student.diemThuongXuyen, student.diemGiuaKi, student.diemCuoiKi, subject.nameSubject)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">Không có điểm để hiển thị.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Spin>
        </div>
    );
};

export default GradeTable;