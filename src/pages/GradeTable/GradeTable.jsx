import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { FaFileExcel, FaSearch, FaArrowLeft } from 'react-icons/fa';
import { useParams } from "react-router-dom";
import * as ScoreSubjectService from "../../services/ScoreSbujectService";

const GradeTable = () => {
    const [students, setStudents] = useState([]);
    const { idClass, idSubject, semester } = useParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterScore, setFilterScore] = useState("");

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const scoresData = await ScoreSubjectService.getAllScoresBySubjectSemester(idSubject, idClass, semester);

                // Cấu trúc lại dữ liệu cho phù hợp với bảng
                const formattedStudents = scoresData.scoreDetailId.map((detail) => {
                    const scores = { oral: [], test15: [], test45: [], final: [] };
                    
                    detail.scores.forEach((score) => {
                        switch (score.type) {
                            case "mieng":
                                scores.oral.push(score.score);
                                break;
                            case "15-minute":
                                scores.test15.push(score.score);
                                break;
                            case "1 tiet":
                                scores.test45.push(score.score);
                                break;
                            case "final":
                                scores.final.push(score.score);
                                break;
                            default:
                                break;
                        }
                    });

                    return {
                        name: detail.studentId.name,
                        email: detail.studentId.email,
                        nameClass: detail.classId.nameClass,
                        nameSubject: scoresData.nameSubject,
                        ...scores
                    };
                });

                setStudents(formattedStudents);
            } catch (error) {
                console.error("Error fetching scores:", error);
            }
        };

        fetchScores();
    }, [idClass, idSubject, semester]);
    console.log("formattedStudents",students)

    const calculateAverage = (grades) =>
        grades.length > 0
            ? (grades.reduce((sum, grade) => sum + grade, 0) / grades.length).toFixed(1)
            : 0;

    const handleDownloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            filteredStudents.map((student) => ({
                "Họ Tên": student.name,
                "Điểm Miệng": student.oral.join(", "),
                "Điểm 15 Phút": student.test15.join(", "),
                "Điểm 1 Tiết": student.test45.join(", "),
                "Điểm Học Kỳ": student.final.join(", "),
                "Trung Bình": (
                    (calculateAverage(student.oral) * 1 +
                        calculateAverage(student.test15) * 2 +
                        calculateAverage(student.test45) * 3 +
                        calculateAverage(student.final) * 4) / 10
                ).toFixed(1),
            }))
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Bảng Điểm");
        XLSX.writeFile(workbook, "BangDiem.xlsx");
    };

    const filteredStudents = students.filter((student) => {
        const averageScore = (
            (calculateAverage(student.oral) * 1 +
                calculateAverage(student.test15) * 2 +
                calculateAverage(student.test45) * 3 +
                calculateAverage(student.final) * 4) / 10
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


    return (
        <div className="container mx-auto p-6 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-center">Bảng Điểm Môn {nameSubject} Lớp {nameClass}</h1>

            {/* Tìm kiếm và lọc */}
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
                </div>

                <select
                    value={filterScore}
                    onChange={(e) => setFilterScore(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                >
                    <option value="">Lọc theo loại điểm</option>
                    <option value="high">Điểm cao ({"\u2265"}8)</option>
                    <option value="low">Điểm thấp (&lt;8)</option>
                </select>

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
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="table-auto w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-left text-gray-600 uppercase tracking-wider">
                            <th className="border px-4 py-2">Họ Tên</th>
                            <th className="border px-4 py-2">Điểm Miệng</th>
                            <th className="border px-4 py-2">Điểm 15 Phút</th>
                            <th className="border px-4 py-2">Điểm 1 Tiết</th>
                            <th className="border px-4 py-2">Điểm Học Kỳ</th>
                            <th className="border px-4 py-2">Trung Bình</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student, index) => (
                            <tr key={index} className="bg-white hover:bg-gray-50 border-t border-gray-300">
                                <td className="border px-4 py-2">{student.name}</td>
                                <td className="border px-4 py-2">{student.oral.join(", ")}</td>
                                <td className="border px-4 py-2">{student.test15.join(", ")}</td>
                                <td className="border px-4 py-2">{student.test45.join(", ")}</td>
                                <td className="border px-4 py-2">{student.final.join(", ")}</td>
                                <td className="border px-4 py-2">
                                    {(
                                        (calculateAverage(student.oral) * 1 +
                                            calculateAverage(student.test15) * 2 +
                                            calculateAverage(student.test45) * 3 +
                                            calculateAverage(student.final) * 4) / 10
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
