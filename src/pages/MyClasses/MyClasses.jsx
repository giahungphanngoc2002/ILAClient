import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaUserGraduate, FaCalendarAlt, FaClock, FaFileAlt, FaClipboardList } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function MyClasses() {
    const [classes, setClasses] = useState([
        {
            id: 1,
            name: 'Toán - Lớp 12A',
            students: 30,
            days: 'Thứ 2, Thứ 4, Thứ 6',
            time: '08:00 - 10:00',
        },
        {
            id: 2,
            name: 'Lý - Lớp 11B',
            students: 25,
            days: 'Thứ 3, Thứ 5',
            time: '10:30 - 12:00',
        },
        {
            id: 3,
            name: 'Hóa - Lớp 12C',
            students: 28,
            days: 'Thứ 2, Thứ 4',
            time: '01:00 - 02:30',
        },
        {
            id: 4,
            name: 'Tiếng Anh - Lớp 12C',
            students: 28,
            days: 'Thứ 2, Thứ 4',
            time: '01:00 - 02:30',
        },
        {
            id: 4,
            name: 'Tiếng Anh - Lớp 12C',
            students: 28,
            days: 'Thứ 2, Thứ 4',
            time: '01:00 - 02:30',
        },
        {
            id: 4,
            name: 'Tiếng Anh - Lớp 12C',
            students: 28,
            days: 'Thứ 2, Thứ 4',
            time: '01:00 - 02:30',
        },
        {
            id: 4,
            name: 'Tiếng Anh - Lớp 12C',
            students: 28,
            days: 'Thứ 2, Thứ 4',
            time: '01:00 - 02:30',
        },
        {
            id: 4,
            name: 'Tiếng Anh - Lớp 12C',
            students: 28,
            days: 'Thứ 2, Thứ 4',
            time: '01:00 - 02:30',
        },
        {
            id: 4,
            name: 'Tiếng Anh - Lớp 12C',
            students: 28,
            days: 'Thứ 2, Thứ 4',
            time: '01:00 - 02:30',
        },
        {
            id: 4,
            name: 'Tiếng Anh - Lớp 12C',
            students: 28,
            days: 'Thứ 2, Thứ 4',
            time: '01:00 - 02:30',
        },
        {
            id: 4,
            name: 'Tiếng Anh - Lớp 12C',
            students: 28,
            days: 'Thứ 2, Thứ 4',
            time: '01:00 - 02:30',
        },
        {
            id: 4,
            name: 'Tiếng Anh - Lớp 12C',
            students: 28,
            days: 'Thứ 2, Thứ 4',
            time: '01:00 - 02:30',
        },
        {
            id: 4,
            name: 'Tiếng Anh - Lớp 12C',
            students: 28,
            days: 'Thứ 2, Thứ 4',
            time: '01:00 - 02:30',
        },
    ]);

    const [selectedClass, setSelectedClass] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleSelectClass = (classItem) => {
        setSelectedClass(classItem);
        setIsModalOpen(true); // Mở Modal khi chọn lớp học
    };

    const handleClose = () => setIsModalOpen(false);

    const handleGoToGradeTable = () => {
        navigate(`/teacher/gradeTable/`);
    }

    const handleGoToTeachingMaterial = () => {
        navigate(`/teacher/teachingMaterial`);
    }

    const handleGoToAttendanceTable = () => {
        navigate(`/teacher/attendanceTable`);
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold text-blue-600 mb-6">Lớp Học Của Tôi</h1>

            {/* Danh sách các lớp học */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {classes.map((classItem) => (
                    <div
                        key={classItem.id}
                        className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
                        onClick={() => handleSelectClass(classItem)}
                    >
                        <h3 className="text-lg font-bold text-gray-800">{classItem.name}</h3>
                        <p className="text-gray-600"><FaUserGraduate className="inline-block mr-2" /> Số học sinh: {classItem.students}</p>
                        <p className="text-gray-600"><FaCalendarAlt className="inline-block mr-2" /> Ngày học: {classItem.days}</p>
                        <p className="text-gray-600"><FaClock className="inline-block mr-2" /> Giờ học: {classItem.time}</p>
                    </div>
                ))}
            </div>

            {/* Modal chi tiết lớp học */}
            <Modal show={isModalOpen} onHide={handleClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết lớp học: {selectedClass?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Chấm điểm */}
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2"><FaClipboardList className="inline-block mr-2" /> Chấm Điểm</h3>
                            <p>Tổng hợp điểm số của học sinh.</p>
                            <Button onClick={handleGoToGradeTable} variant="primary">Truy cập bảng điểm</Button>
                        </div>

                        {/* Chấm công */}
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2"><FaClipboardList className="inline-block mr-2" /> Điểm Danh</h3>
                            <p>Tổng hợp điểm danh của học sinh.</p>
                            <Button variant="success" onClick={handleGoToAttendanceTable}>Truy cập điểm danh</Button>
                        </div>

                        {/* Tài liệu học tập */}
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2"><FaFileAlt className="inline-block mr-2" /> Tài Liệu Học Tập</h3>
                            <p>Quản lý tài liệu và bài giảng cho lớp.</p>
                            <Button onClick={handleGoToTeachingMaterial} variant="warning">Quản lý tài liệu</Button>
                        </div>

                        {/* Bài tập */}
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2"><FaClipboardList className="inline-block mr-2" /> Bài Tập</h3>
                            <p>Quản lý bài tập và tình trạng nộp bài.</p>
                            <Button variant="danger">Quản lý bài tập</Button>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Đóng</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default MyClasses;
