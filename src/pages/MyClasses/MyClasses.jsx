import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaUserGraduate, FaClipboardList, FaFileAlt, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as ClassService from "../../services/ClassService";
import { useSelector } from 'react-redux';

function MyClasses() {
    const user = useSelector((state) => state.user);
    const [teacherId, setTeacherId] = useState(user?.id);
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null); // To store selected class details
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchYear, setSearchYear] = useState(""); // State to store selected year

    const navigate = useNavigate();

    useEffect(() => {
        setTeacherId(user?.id);
    }, [user]);

    useEffect(() => {
        const fetchSubject = async () => {
            setIsLoading(true);
            try {
                const response = await ClassService.getAllSubjectClassesByTeacherId(teacherId);

                // Logging the full response to check the structure
                console.log('Full API response data:', response);

                // Now extract the data properly
                if (response && response.data && response.data.classes) {
                    setClasses(response.data.classes); // Properly extract classes
                } else {
                    console.error('Unexpected API response structure', response);
                    setClasses([]); // Set empty array if classes are missing
                }

                setIsError(false);
            } catch (error) {
                setIsError(true);
                console.error('Error fetching schedule data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (teacherId) {
            fetchSubject();
        }
    }, [teacherId]);

    // Handle search year change
    const handleSearchChange = (e) => {
        setSearchYear(e.target.value);
    };

    // Filter classes based on the selected year (searchYear)
    const filteredClasses = classes.filter(classItem => {
        console.log("search", searchYear, "data", classItem.year)
        return classItem.year.includes(searchYear);
    });

    const handleSelectClass = (classItem, subject) => {
        setSelectedClass({ ...classItem, selectedSubject: subject });
        setIsModalOpen(true);
    };

    const handleClose = () => setIsModalOpen(false);

    const handleGoToGradeTable = (idSubject, idClass, semester) => {
        navigate(`/manage/gradeTable/${idSubject}/${idClass}/${semester}`);
    };

    const handleGoToTeachingMaterial = () => {
        navigate(`/manage/teachingMaterial`);
    };

    const handleGoToAttendanceTable = () => {
        navigate(`/manage/attendanceTable`);
    };

    const handleGoToQuestionManage = () => {
        navigate(`/manage/questionManage`);
    };

    return (
        <div className="container mx-auto p-6">

            {/* Search dropdown for filtering by year */}
            <div className="mb-6 relative max-w-md flex justify-start">
                {/* Biểu tượng kính lúp */}
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

                {/* Dropdown chọn năm học */}
                <select
                    value={searchYear}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 ease-in-out"
                >
                    <option value="">Chọn năm học</option>
                    <option value="2023-2024">2023-2024</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                </select>
            </div>

            {/* Separate cards for each subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12 px-4">
                {filteredClasses.flatMap((classItem) =>
                    classItem.subjects.map((subject, idx) => (
                        <div
                            key={`${classItem._id}-${subject._id}-${idx}`}
                            className="bg-white p-8 rounded-2xl shadow-xl cursor-pointer hover:shadow-2xl transition-all ease-in-out transform hover:scale-105"
                            onClick={() => handleSelectClass(classItem, subject)}
                        >
                            {/* Hình ảnh minh họa */}
                            <img
                                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDE0fHxjbGFzc3Jvb218ZW58MHx8fHwxNjk4NDI2MDM2&ixlib=rb-4.0.3&q=80&w=1080"
                                alt="Classroom"
                                className="mb-6 w-full h-40 object-cover rounded-lg"
                            />

                            {/* Tiêu đề lớp học */}
                            <h2 className="text-2xl font-bold text-blue-700 mb-4">
                                {classItem.nameClass.trim()}
                            </h2>

                            {/* Môn học */}
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                Môn học: {subject.nameSubject}
                            </h3>

                            {/* Năm học */}
                            <h3 className="text-lg text-gray-700 mb-3">
                                Năm học: {classItem.year}
                            </h3>

                            {/* Số học sinh */}
                            <p className="text-gray-600">
                                <FaUserGraduate className="inline-block text-blue-600 mr-2" /> Số học sinh: {classItem.studentID.length}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* Modal for selected class details */}
            <Modal show={isModalOpen} onHide={handleClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết lớp học: {selectedClass?.nameClass}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Grade Table */}
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                <FaClipboardList className="inline-block mr-2" /> Chấm Điểm
                            </h3>
                            <p>Tổng hợp điểm số của học sinh.</p>
                            <Button
                                onClick={() =>
                                    handleGoToGradeTable(
                                        selectedClass.selectedSubject._id,
                                        selectedClass._id,
                                        selectedClass.selectedSubject.semester
                                    )
                                }
                                variant="primary"
                            >
                                Truy cập bảng điểm
                            </Button>
                        </div>

                        {/* Attendance Table */}
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                <FaClipboardList className="inline-block mr-2" /> Điểm Danh
                            </h3>
                            <p>Tổng hợp điểm danh của học sinh.</p>
                            <Button variant="success" onClick={handleGoToAttendanceTable}>
                                Truy cập điểm danh
                            </Button>
                        </div>

                        {/* Teaching Material */}
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                <FaFileAlt className="inline-block mr-2" /> Tài Liệu Học Tập
                            </h3>
                            <p>Quản lý tài liệu và bài giảng cho lớp.</p>
                            <Button onClick={handleGoToTeachingMaterial} variant="warning">
                                Quản lý tài liệu
                            </Button>
                        </div>

                        {/* Question Management */}
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                <FaClipboardList className="inline-block mr-2" /> Tự học
                            </h3>
                            <p>Quản lý các câu hỏi cho học sinh tự học tại nhà.</p>
                            <Button onClick={handleGoToQuestionManage} variant="danger">
                                Quản lý câu hỏi
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

}

export default MyClasses;
