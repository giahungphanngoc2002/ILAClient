import React, { useEffect, useState, useRef } from "react";
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
    const [semesterFilter, setSemesterFilter] = useState(1); // Bộ lọc kỳ
    const [studentInClass, setStudentInClass] = useState([]);
    const [classDetail, setClassDetail] = useState();
    const [subject, setSubject] = useState()
    const [subjectPhu, setSubjectPhu] = useState()
    const [loading, setLoading] = useState(false);
    const [evaluates, setEvaluates] = useState(null);

    // Lấy danh sách học sinh trong lớp
    useEffect(() => {
        const fetchClassDetails = async () => {
            try {
                setLoading(true); // Bắt đầu tải
                const response = await ClassService.getDetailClass(idClass);
                setClassDetail(response?.data)
                setStudentInClass(response?.data?.studentID);
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
        // Kiểm tra nếu classDetail và subjectGroup có sẵn và subjectGroup là một mảng
        if (Array.isArray(classDetail?.SubjectsId)) {
            const foundSubject = classDetail?.SubjectsId.find(subject => subject._id === idSubject);
            setSubject(foundSubject);  // Cập nhật subject vào state
        } else {
            console.error('subjectGroup is not an array or is missing.');
        }

        // Lấy thêm SubjectsPhuId nếu có
        if (Array.isArray(classDetail?.SubjectsPhuId)) {
            const foundPhuSubject = classDetail?.SubjectsPhuId.find(subject => subject._id === idSubject);
            setSubjectPhu(foundPhuSubject);  // Cập nhật phuSubject vào state
        } else {
            console.error('SubjectsPhuId is not an array or is missing.');
        }
    }, [classDetail, idSubject]);

    useEffect(() => {
        const fetchEvalutes = async () => {
            try {
                setLoading(true);
                const response = await SubjectService.getAllEvaluateSemester(idClass, idSubject, semesterFilter);
                setEvaluates(Array.isArray(response.data) ? response.data : []); // Ensure evaluates is an array
            } catch (error) {
                console.error("Lỗi khi lấy danh sách đánh giá:", error);
            } finally {
                setLoading(false); // Kết thúc tải
            }
        };

        if (idClass) {
            fetchEvalutes();
        }
    }, [semesterFilter, idClass, idSubject]);
    // Lấy điểm của học sinh

    console.log(evaluates)
    useEffect(() => {
        const fetchScores = async () => {
            try {
                const scoresData = await ScoreSubjectService.getAllScoresBySubjectSemester(idSubject, idClass, semesterFilter);
                console.log("Fetched scores data:", scoresData);  // Debug log để kiểm tra dữ liệu trả về

                // Kiểm tra nếu không có dữ liệu điểm, tạo bảng điểm rỗng
                const scoresByStudentId = scoresData?.reduce((acc, detail) => {
                    const filteredScores = detail.scores.filter(score => score.semester === parseInt(semesterFilter));
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
                        diemCuoiKi: []
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
                    diemCuoiKi: []
                }));

                setStudents(emptyStudentList);
            }
        };

        fetchScores();
    }, [idClass, idSubject, semesterFilter, studentInClass]);


    const calculateAverage = (grades) =>
        grades.length > 0
            ? (grades.reduce((sum, grade) => sum + grade, 0) / grades.length).toFixed(1)
            : 0;

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

    const handleScoreChange = (type, index, value, studentId) => {
        setStudents(prevStudents =>
            prevStudents.map(student => {
                if (student.id === studentId) {
                    const updatedStudent = {
                        ...student,
                        diemThuongXuyen: Array.isArray(student.diemThuongXuyen) ? [...student.diemThuongXuyen] : [],
                        diemGiuaKi: Array.isArray(student.diemGiuaKi) ? [...student.diemGiuaKi] : [],
                        diemCuoiKi: Array.isArray(student.diemCuoiKi) ? [...student.diemCuoiKi] : []
                    };

                    // Cập nhật điểm tùy theo loại
                    if (type === "diemThuongXuyen" && index !== undefined) {
                        // Nếu là điểm thường xuyên, cập nhật theo index
                        if (value.trim() === "") {
                            updatedStudent.diemThuongXuyen[index] = '';
                        } else {
                            updatedStudent.diemThuongXuyen[index] = parseFloat(value) || 0;  // Cập nhật điểm thường xuyên
                        }
                    } else if (type === "diemGiuaKi") {
                        if (value.trim() === "") {
                            updatedStudent.diemGiuaKi = [];  // Xoá hoàn toàn mảng khi không có giá trị
                        } else {
                            updatedStudent.diemGiuaKi = [parseFloat(value) || 0];  // Cập nhật điểm giữa kỳ
                        }
                    } else if (type === "diemCuoiKi") {
                        if (value.trim() === "") {
                            updatedStudent.diemCuoiKi = [];  // Xoá hoàn toàn mảng khi không có giá trị
                        } else {
                            updatedStudent.diemCuoiKi = [parseFloat(value) || 0];  // Cập nhật điểm cuối kỳ
                        }
                    }

                    return updatedStudent;
                }
                return student;
            })
        );
    };

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

    const studentsRef = useRef(students);

    useEffect(() => {
        studentsRef.current = students;  // Cập nhật students vào ref mỗi khi students thay đổi
    }, [students]);


    const handleSubmitScore = async () => {
        if (loading) return;

        setLoading(true);
        try {
            // Sử dụng studentsRef để đảm bảo lấy giá trị students lúc hiện tại
            const scoresData = studentsRef.current.map(student => {
                const scores = [
                    ...student.diemThuongXuyen.map(score => ({ type: "thuongXuyen", score, semester: semesterFilter })),
                    ...student.diemGiuaKi.map(score => ({ type: "giuaKi", score, semester: semesterFilter })),
                    ...student.diemCuoiKi.map(score => ({ type: "cuoiKi", score, semester: semesterFilter }))
                ];

                const scoreId = student.scoreId || null;

                return { studentId: student.id, subjectId: idSubject, classId: idClass, scores, scoreId };
            });

            // Tạo một mảng promises để xử lý tất cả các yêu cầu
            const scorePromises = scoresData.map(scoreData => {
                if (scoreData.scoreId) {
                    return ScoreSubjectService.updateScore(scoreData.scoreId, scoreData);
                } else {
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

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <Spin spinning={loading} size="large">
            <Breadcrumb
                title={`Bảng Điểm Môn ${subjectPhu ? subjectPhu.nameSubject : subject?.nameSubject} Lớp ${classDetail?.nameClass}`}
                buttonText="Lưu điểm"
                onButtonClick={handleSubmitScore}
                onBack={onBack}
            />
        </Spin>

            <div className="mt-16"></div>


            {/* Tìm kiếm, lọc và chọn kỳ */}
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
                        <option value="1">Kỳ 1</option>
                        <option value="2">Kỳ 2</option>
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
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg flex items-center hover:bg-blue-600 transition duration-300"
                        onClick={() => window.history.back()}
                    >
                        <FaArrowLeft className="mr-2" /> Trở về
                    </button>
                </div>
            </div>

            {/* Bảng điểm */}
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
                                        {calculateAverageSubject(student.diemThuongXuyen, student.diemGiuaKi, student.diemCuoiKi)}
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
        </div>
    );
};

export default GradeTable;
