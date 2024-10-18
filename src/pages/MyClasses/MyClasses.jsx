import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaUserGraduate, FaClipboardList, FaFileAlt } from 'react-icons/fa';
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

    // Debugging: Log classes to ensure data is correctly set
    console.log("Classes data:", classes);

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
            <h1 className="text-2xl font-bold text-blue-600 mb-6">Lớp Học Của Tôi</h1>

            {/* Separate cards for each subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {classes.flatMap((classItem) =>
                    classItem.subjects.map((subject, idx) => (
                        <div
                            key={`${classItem._id}-${subject._id}-${idx}`}
                            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
                            onClick={() => handleSelectClass(classItem, subject)}
                        >
                            <h2 className="text-xl font-bold text-blue-600 mb-4">
                                {classItem.nameClass.trim()} - {classItem.year}
                            </h2>
                            <h3 className="text-lg font-bold text-gray-800">Môn học: {subject.nameSubject}</h3>
                            <p className="text-gray-600">
                                <FaUserGraduate className="inline-block mr-2" /> Số học sinh: {classItem.studentID.length}
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
