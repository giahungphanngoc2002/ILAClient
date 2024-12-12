import React, { useEffect, useState } from 'react';
import * as BlockService from "../../services/BlockService";


const CreateClass = () => {
    const [nameClass, setNameClass] = useState('');
    const [year, setYear] = useState('');
    const [blocks, setBlocks] = useState([]);
    const [block, setBlock] = useState('');

    const [teacherHR, setTeacherHR] = useState('');
    const [subjectGroup, setSubjectGroup] = useState('');
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [selectedTeachers, setSelectedTeachers] = useState({});


    // Dữ liệu mẫu về các môn học theo nhóm môn học
    const subjectData = {
        "Nhóm 1": [
            { name: "Toán", teachers: ["Nguyễn Văn A", "Trần Thị B", "Lê Minh C"] },
            { name: "Lý", teachers: ["Nguyễn Văn B", "Phạm Thị D"] }
        ],
        "Nhóm 2": [
            { name: "Hóa", teachers: ["Nguyễn Văn C", "Lê Minh D"] },
            { name: "Sinh", teachers: ["Nguyễn Văn D", "Trần Thị E"] }
        ],
        "Nhóm 3": [
            { name: "Văn", teachers: ["Nguyễn Văn E", "Lê Minh F"] },
            { name: "Sử", teachers: ["Nguyễn Văn F", "Phạm Thị G"] }
        ]
    };


    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                const blocksData = await BlockService.getAllBlocks();
                setBlocks(blocksData);
            } catch (error) {
                console.error("Error fetching blocks:", error);
            }
        };
        fetchBlocks();
    }, []);

    const handleCreateClass = () => {
        if (!nameClass || !year || !block || !teacherHR || !subjectGroup) {
            setMessage('Vui lòng nhập đầy đủ thông tin.');
            return;
        }

        setMessage('Lớp học mới đã được tạo thành công!');
        // Clear form after creation
        setNameClass('');
        setYear('');
        setBlock('');
        setTeacherHR('');
        setSubjectGroup('');
    };

    // Mở modal khi chọn nhóm môn
    const handleSubjectGroupChange = (e) => {
        const selectedGroup = e.target.value;
        setSubjectGroup(selectedGroup);
        if (selectedGroup) {
            setSelectedSubjects(subjectData[selectedGroup] || []);
            setIsModalOpen(true); // Mở modal khi có nhóm môn học được chọn
        }
    };

    // Xử lý khi chọn giáo viên trong modal
    const handleTeacherChange = (subjectIndex, teacher) => {
        setSelectedTeachers(prevState => ({
            ...prevState,
            [subjectIndex]: teacher
        }));
    };

    // Đóng modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="h-screen max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-4">Tạo Lớp Học Mới</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tên lớp học</label>
                    <input
                        type="text"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={nameClass}
                        onChange={(e) => setNameClass(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Năm học</label>
                    <input
                        type="text"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Khối lớp</label>
                    <select
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={block}
                        onChange={(e) => setBlock(e.target.value)}
                    >
                        <option value="">Chọn khối lớp</option>
                        {blocks?.map((block) => (
                            <option key={block._id} value={block._id}>
                                {block.nameBlock}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Nhóm môn học</label>
                    <select
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={subjectGroup}
                        onChange={handleSubjectGroupChange}
                    >
                        <option value="">Chọn nhóm môn</option>
                        <option value="Nhóm 1">Nhóm 1</option>
                        <option value="Nhóm 2">Nhóm 2</option>
                        <option value="Nhóm 3">Nhóm 3</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Giáo viên chủ nhiệm</label>
                    <select
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={teacherHR}
                        onChange={(e) => setTeacherHR(e.target.value)}
                    >
                        <option value="">Chọn giáo viên chủ nhiệm</option>
                        <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                        <option value="Nguyễn Văn B">Nguyễn Văn B</option>
                        <option value="Nguyễn Văn C">Nguyễn Văn C</option>
                    </select>
                </div>

                {message && (
                    <div className="mt-4 text-center text-sm font-semibold text-green-500">{message}</div>
                )}

                <div className="mt-6">
                    <button
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                        onClick={handleCreateClass}
                    >
                        Tạo Lớp Học Mới
                    </button>
                </div>
            </div>

            {/* Modal for displaying subjects with select for teachers */}
            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">Chọn giáo viên cho các môn học</h3>
                        <ul>
                            {selectedSubjects.map((subject, subjectIndex) => (
                                <li key={subjectIndex} className="mb-4">
                                    <div className="font-medium">{subject.name}</div>
                                    <div className="text-sm text-gray-500">
                                        <label className="block text-sm font-medium text-gray-700">Chọn giáo viên</label>
                                        <select
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            value={selectedTeachers[subjectIndex] || ''}
                                            onChange={(e) => handleTeacherChange(subjectIndex, e.target.value)}
                                        >
                                            <option value="">Chọn giáo viên</option>
                                            {subject.teachers.map((teacher, index) => (
                                                <option key={index} value={teacher}>{teacher}</option>
                                            ))}
                                        </select>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 text-center">
                            <button
                                className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                onClick={closeModal}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateClass;