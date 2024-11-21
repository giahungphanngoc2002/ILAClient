import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { FaFileExcel, FaSearch, FaArrowLeft } from 'react-icons/fa';
import { useParams } from "react-router-dom";
import * as ScoreSubjectService from "../../services/ScoreSbujectService";
import * as ClassService from "../../services/ClassService";

const GradeTable = () => {
    const [students, setStudents] = useState([]);
    const { idClass, idSubject, semester } = useParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterScore, setFilterScore] = useState("");
    const [semesterFilter, setSemesterFilter] = useState(1); // Thêm state cho bộ lọc kỳ
    const [studentInClass, setStudentInClass] = useState([]);
    const [loading, setLoading] = useState();


    useEffect(() => {
        const fetchClassDetails = async () => {
            try {
                setLoading(true); // Bắt đầu tải
                const response = await ClassService.getDetailClass(idClass);
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
        const fetchScores = async () => {
            try {
                const scoresData = await ScoreSubjectService.getAllScoresBySubjectSemester(idSubject, idClass, semesterFilter);
                const studentsWithScores = scoresData.map((detail) => {
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

                    return {
                        id: detail.studentId._id,
                        name: detail.studentId.name,
                        email: detail.studentId.email,
                        nameClass: detail.classId.nameClass,
                        nameSubject: scoresData.nameSubject,
                        ...scores
                    };
                });

                // Gộp danh sách học sinh chưa có điểm
                const completeStudentList = studentInClass.map((student) => {
                    const existingStudent = studentsWithScores.find(s => s.id === student._id);
                    if (existingStudent) {
                        return existingStudent; // Nếu đã có điểm, sử dụng dữ liệu từ `studentsWithScores`
                    }
                    return {
                        id: student._id,
                        name: student.name,
                        email: student.email,
                        diemThuongXuyen: [],
                        diemGiuaKi: [],
                        diemCuoiKi: []
                    }; // Nếu chưa có điểm, khởi tạo với các giá trị trống
                });

                setStudents(completeStudentList);
            } catch (error) {
                console.error("Error fetching scores:", error);
            }
        };

        fetchScores();
    }, [idClass, idSubject, semesterFilter, studentInClass]);



    const calculateAverage = (grades) =>
        grades.length > 0
            ? (grades.reduce((sum, grade) => sum + grade, 0) / grades.length).toFixed(1)
            : 0;

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

    const nameClass = students.length > 0 ? students[0].nameClass : "";
    const nameSubject = students.length > 0 ? students[0].nameSubject : "";


    console.log(students)
    return (
        <div className="container mx-auto p-6 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-center">Bảng Điểm Môn {nameSubject} Lớp {nameClass}</h1>

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
                        {/* Thêm các lựa chọn kỳ khác nếu cần */}
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
                        <tr className="bg-blue-500 text-left text-white uppercase tracking-wider">
                            <th className="border px-4 py-3">Họ Tên</th>
                            <th className="border px-4 py-3">Điểm Thường Xuyên</th>
                            <th className="border px-4 py-3">Điểm Giữa Kỳ</th>
                            <th className="border px-4 py-3">Điểm Cuối Kỳ</th>
                            <th className="border px-4 py-3">Trung Bình</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student, index) => (
                            <tr
                                key={index}
                                className={`${index % 2 === 0 ? "bg-blue-100" : "bg-blue-50"
                                    } hover:bg-blue-200 transition duration-200`}
                            >
                                <td className="border px-4 py-3">{student.name}</td>
                                <td className="border px-4 py-3">{student.diemThuongXuyen.join(", ")}</td>
                                <td className="border px-4 py-3">{student.diemGiuaKi.join(", ")}</td>
                                <td className="border px-4 py-3">{student.diemCuoiKi.join(", ")}</td>
                                <td className="border px-4 py-3 font-semibold text-blue-700">
                                    {(
                                        (calculateAverage(student.diemThuongXuyen) * 1 +
                                            calculateAverage(student.diemGiuaKi) * 2 +
                                            calculateAverage(student.diemCuoiKi) * 3) /
                                        6
                                    ).toFixed(1)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GradeTable;
