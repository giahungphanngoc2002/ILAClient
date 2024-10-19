import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useDropzone } from 'react-dropzone';
import _ from 'lodash';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Sử dụng icon từ react-icons

const ClassDivision = () => {
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [fileName, setFileName] = useState('');
    const [openClass, setOpenClass] = useState(null); // Trạng thái cho lớp mở

    // Dữ liệu các lớp chuyên cố định
    const fixedClasses = [
        { className: "10/1", specialization: "Chuyên Toán", students: [] },
        { className: "10/2", specialization: "Chuyên Văn", students: [] },
        { className: "10/3", specialization: "Chuyên Lý", students: [] },
        { className: "10/4", specialization: "Chuyên Anh", students: [] },
        { className: "10/5", specialization: "Chuyên Địa", students: [] },
        { className: "10/6", specialization: "Chuyên Tin", students: [] },
        { className: "10/7", specialization: "Chuyên Hoá", students: [] },
        { className: "10/8", specialization: "Chuyên Sử", students: [] },
        { className: "10/9", specialization: "Chuyên Sinh", students: [] }
    ];

    // Hàm để đọc file Excel khi người dùng tải lên
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            setFileName(file.name);

            const reader = new FileReader();
            reader.onload = (e) => {
                const binaryStr = e.target.result;
                const workbook = XLSX.read(binaryStr, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

                // Parse dữ liệu từ file Excel
                const parsedStudents = sheet.slice(1).map((row) => ({
                    id: row[0],
                    score: row[1],
                    preference: row[2], // Môn chuyên
                    name: row[3], // Môn chuyên
                }));
                console.log(parsedStudents);
                setStudents(parsedStudents);
            };
            reader.readAsBinaryString(file);
        }
    });

    // Hàm phân lớp cho học sinh
    const assignClasses = () => {
        const classAssignment = _.cloneDeep(fixedClasses); // Giữ nguyên cấu trúc lớp

        let unassignedStudents = [];

        // Phân học sinh vào các lớp theo môn chuyên họ đăng ký
        students.forEach(student => {
            const assignedClass = classAssignment.find(
                (classItem) => classItem.specialization === student.preference
            );

            if (assignedClass) {
                assignedClass.students.push(student);
            } else {
                unassignedStudents.push(student); // Những học sinh không có môn chuyên phù hợp
            }
        });

        // Sắp xếp các học sinh không có môn chuyên theo điểm
        const sortedUnassignedStudents = _.sortBy(unassignedStudents, 'score');

        // Phân đều học sinh không có môn chuyên vào các lớp
        sortedUnassignedStudents.forEach((student, index) => {
            const classIndex = index % classAssignment.length;
            classAssignment[classIndex].students.push(student);
        });

        // Cập nhật danh sách lớp đã phân
        setClasses(classAssignment);
    };

    // Hàm để mở hoặc đóng danh sách học sinh của lớp
    const toggleView = (index) => {
        if (openClass === index) {
            setOpenClass(null); // Nếu đang mở thì đóng lại
        } else {
            setOpenClass(index); // Mở lớp được chọn
        }
    };

    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    console.log(`${currentYear}_${nextYear}`);

    return (
        <div className="container mx-auto p-5">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Phân chia lớp học</h2>

            <div className="flex items-center justify-center mb-6">
                <label
                    htmlFor="file-upload"
                    className="block bg-blue-500 text-white px-6 py-3 rounded-full cursor-pointer shadow-lg hover:bg-blue-600 transition duration-200"
                >
                    Chọn tệp
                </label>
                <input
                    id="file-upload"
                    {...getInputProps()}
                    style={{ display: 'none' }}
                />
                <span className="ml-3 text-gray-600 italic">
                    {fileName ? fileName : "Không có tệp nào được chọn"}
                </span>
            </div>

            <div className="text-center text-sm text-gray-500 mb-8">
                Supported formats: .xlsx. Max size: 5MB.
            </div>

            <div className="text-center">
                <button
                    className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-600 transition duration-200"
                    onClick={assignClasses}
                    disabled={!students.length}
                >
                    Phân lớp
                </button>
            </div>

            <div className="mt-10">
                {classes.length > 0 && (
                    <table className="table-auto w-full bg-white shadow-lg rounded-lg border-collapse">
                        <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
                            <tr>
                                <th className="px-6 py-3 border-b">Mã lớp</th>
                                <th className="px-6 py-3 border-b">Miêu tả</th>
                                <th className="px-6 py-3 border-b">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map((classItem, index) => (
                                <React.Fragment key={index}>
                                    <tr className="hover:bg-gray-100 transition duration-200">
                                        <td className="px-6 py-4 border-b">{classItem.className}</td>
                                        <td className="px-6 py-4 border-b">{classItem.specialization}</td>
                                        <td className="px-6 py-4 border-b text-center">
                                            <button
                                                onClick={() => toggleView(index)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                {openClass === index ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                                            </button>
                                        </td>
                                    </tr>

                                    {openClass === index && (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-4 bg-gray-50">
                                                <table className="table-auto w-full">
                                                    <thead>
                                                        <tr>
                                                            <th className="px-4 py-2 border-b">Tên học sinh</th>
                                                            <th className="px-4 py-2 border-b">Mã học sinh</th>
                                                            <th className="px-4 py-2 border-b">Điểm</th>
                                                            <th className="px-4 py-2 border-b">Nguyện vọng</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {classItem.students.map((student) => (
                                                            <tr key={student.id} className="hover:bg-gray-100">
                                                                <td className="px-4 py-2 border-b">{student.name}</td>
                                                                <td className="px-4 py-2 border-b">{student.id}</td>
                                                                <td className="px-4 py-2 border-b">{student.score}</td>
                                                                <td className="px-4 py-2 border-b">{student.preference}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    );
};

export default ClassDivision;
