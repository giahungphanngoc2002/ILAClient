import React, { useState } from "react";
import * as XLSX from "xlsx";
import { FaFileExcel, FaSearch, FaArrowLeft } from 'react-icons/fa'; // Thêm biểu tượng

const GradeTable = () => {
    const [students, setStudents] = useState([
        { name: "Nguyen Van A", oral: [8, 10], test15: [7, 9], test45: [8], final: [9] },
        { name: "Tran Thi B", oral: [7, 5], test15: [6, 8], test45: [9], final: [8] },
        { name: "Le Van C", oral: [9, 6], test15: [8, 7], test45: [7], final: [6] },
        { name: "Hoang Thi D", oral: [10, 9], test15: [9, 8], test45: [10], final: [9] },
        { name: "Phan Van E", oral: [6, 5], test15: [5, 7], test45: [6], final: [7] },
        { name: "Dang Thi F", oral: [8, 7], test15: [7, 9], test45: [8], final: [8] },
        { name: "Vo Van G", oral: [7, 6], test15: [8, 6], test45: [7], final: [7] },
        { name: "Nguyen Thi H", oral: [10, 9], test15: [9, 10], test45: [9], final: [10] },
        { name: "Pham Van I", oral: [6, 5], test15: [7, 8], test45: [6], final: [7] },
        { name: "Tran Thi J", oral: [9, 8], test15: [8, 9], test45: [9], final: [8] },
        { name: "Le Thi K", oral: [8, 7], test15: [7, 9], test45: [8], final: [9] },
        { name: "Nguyen Van L", oral: [6, 7], test15: [8, 9], test45: [7], final: [6] },
        { name: "Hoang Van M", oral: [10, 10], test15: [9, 8], test45: [10], final: [10] },
        { name: "Vo Thi N", oral: [9, 9], test15: [9, 10], test45: [9], final: [9] },
        { name: "Pham Van O", oral: [7, 6], test15: [7, 8], test45: [7], final: [6] },
        { name: "Nguyen Thi P", oral: [8, 8], test15: [8, 9], test45: [8], final: [9] },
        { name: "Tran Van Q", oral: [10, 9], test15: [9, 8], test45: [10], final: [9] },
        { name: "Le Van R", oral: [6, 7], test15: [7, 8], test45: [6], final: [7] },
        { name: "Hoang Thi S", oral: [9, 10], test15: [10, 9], test45: [10], final: [10] },
        { name: "Vo Van T", oral: [7, 8], test15: [7, 6], test45: [7], final: [7] },
        { name: "Nguyen Van U", oral: [10, 10], test15: [9, 10], test45: [9], final: [10] },
        { name: "Tran Thi V", oral: [8, 7], test15: [7, 8], test45: [8], final: [8] },
        { name: "Le Van W", oral: [6, 5], test15: [5, 6], test45: [7], final: [6] },
        { name: "Pham Thi X", oral: [9, 8], test15: [8, 9], test45: [9], final: [8] },
        { name: "Nguyen Van Y", oral: [10, 10], test15: [9, 10], test45: [10], final: [10] },
        { name: "Tran Van Z", oral: [8, 9], test15: [8, 7], test45: [9], final: [8] },
        { name: "Le Thi A1", oral: [7, 6], test15: [6, 7], test45: [7], final: [7] },
        { name: "Pham Van A2", oral: [9, 9], test15: [9, 8], test45: [9], final: [9] },
        { name: "Nguyen Thi A3", oral: [8, 8], test15: [7, 9], test45: [8], final: [9] },
        { name: "Tran Van A4", oral: [10, 9], test15: [9, 10], test45: [10], final: [9] }
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterScore, setFilterScore] = useState("");

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
                        calculateAverage(student.final) * 4) /
                    10
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
                calculateAverage(student.final) * 4) /
            10
        ).toFixed(1);

        const matchName = student.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchScore =
            filterScore === "" ||
            (filterScore === "high" && averageScore >= 8) ||
            (filterScore === "low" && averageScore < 8);

        return matchName && matchScore;
    });

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-center">Bảng Điểm Môn Toán Lớp 10/1</h1>

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
                                            calculateAverage(student.final) * 4) /
                                        10
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
