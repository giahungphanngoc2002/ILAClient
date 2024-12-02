import React, { useEffect, useState,useRef  } from "react";
import * as XLSX from "xlsx";
import { FaFileExcel, FaSearch, FaArrowLeft } from 'react-icons/fa';
import { useParams } from "react-router-dom";
import * as ScoreSubjectService from "../../services/ScoreSbujectService";
import * as ClassService from "../../services/ClassService";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { toast } from "react-toastify";
const GradeTable = () => {
    const [students, setStudents] = useState([]);
    const { idClass, idSubject, semester } = useParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterScore, setFilterScore] = useState("");
    const [semesterFilter, setSemesterFilter] = useState(1); // Bộ lọc kỳ
    const [studentInClass, setStudentInClass] = useState([]);
    const [classDetail, setClassDetail] = useState();
    const [subject, setSubject] = useState()
    const [loading, setLoading] = useState(false);

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

    console.log(classDetail)

    useEffect(() => {
        // Kiểm tra nếu classDetail và subjectGroup có sẵn và subjectGroup là một mảng
        if (Array.isArray(classDetail?.subjectGroup?.SubjectsId)) {
            const foundSubject = classDetail.subjectGroup?.SubjectsId.find(subject => subject._id === idSubject);
            setSubject(foundSubject);  // Cập nhật subject vào state
        } else {
            console.error('subjectGroup is not an array or is missing.');
        }
    }, [classDetail, idSubject]);

    console.log(subject)

    // Lấy điểm của học sinh
    useEffect(() => {
        const fetchScores = async () => {
            try {
                const scoresData = await ScoreSubjectService.getAllScoresBySubjectSemester(idSubject, idClass, semesterFilter);
                console.log("Fetched scores data:", scoresData);  // Debug log để kiểm tra dữ liệu trả về
    
                // Tạo đối tượng với key là studentId để dễ dàng tìm kiếm
                const scoresByStudentId = scoresData.reduce((acc, detail) => {
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
                    const existingStudent = scoresByStudentId[student._id];
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
            }
        };
    
        fetchScores();
    }, [idClass, idSubject, semesterFilter, studentInClass]);
    

    console.log("123student",students)

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
                        updatedStudent.diemThuongXuyen[index] = parseFloat(value) || 0;
                    } else if (type === "diemGiuaKi") {
                        // Nếu là điểm giữa kỳ, thay thế toàn bộ mảng với 1 phần tử
                        updatedStudent.diemGiuaKi = [parseFloat(value) || 0];  // Mảng chứa 1 phần tử
                    } else if (type === "diemCuoiKi") {
                        // Nếu là điểm cuối kỳ, thay thế toàn bộ mảng với 1 phần tử
                        updatedStudent.diemCuoiKi = [parseFloat(value) || 0];  // Mảng chứa 1 phần tử
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
    
            for (const scoreData of scoresData) {
                if (scoreData.scoreId) {
                    await ScoreSubjectService.updateScore(scoreData.scoreId, scoreData);
                    toast.success(`Score updated for student ID: ${scoreData.studentId}`);
                } else {
                    await ScoreSubjectService.createScore(scoreData);
                    toast.success(`Score created for student ID: ${scoreData.studentId}`);
                }
            }
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
    
            // Kiểm tra xem workbook có chứa các sheet không
            if (workbook.SheetNames.length > 0) {
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const json = XLSX.utils.sheet_to_json(worksheet);
                
                // Parse và upload data to your backend or set state as necessary
                console.log(json);
            } else {
                console.error('No sheets found in the Excel file');
            }
        };
    
        reader.readAsBinaryString(file);
    }



    return (
        <div className="container mx-auto p-6 min-h-screen">
            <Breadcrumb
                title={`Bảng Điểm Môn ${subject?.nameSubject} Lớp ${classDetail?.nameClass}`}
                buttonText="Lưu điểm"
                onButtonClick={handleSubmitScore}
                onBack={onBack}
            />

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
                        onClick={handleUploadExcel}
                    >
                        <FaFileExcel className="mr-2" /> Tải lên Excel
                    </button>
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
                        {filteredStudents.map((student, index) => (
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
                                        {[...Array(4)].map((_, idx) => (
                                            <input
                                                key={`thuongXuyen-${idx}`}
                                                type="number"
                                                value={student.diemThuongXuyen[idx] || ''}
                                                onChange={(e) => handleScoreChange('diemThuongXuyen', idx, e.target.value, student.id)}
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
                                        className="w-full border rounded px-2 py-1"
                                    />
                                </td>
                                <td className="border px-4 py-2">
                                    <input
                                        type="number"
                                        value={student.diemCuoiKi || ''}
                                        onChange={(e) => handleScoreChange('diemCuoiKi', null, e.target.value, student.id)}
                                        className="w-full border rounded px-2 py-1"
                                    />
                                </td>

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
