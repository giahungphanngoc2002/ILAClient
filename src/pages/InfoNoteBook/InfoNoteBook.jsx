import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaChalkboardTeacher, FaBook, FaDoorOpen, FaClock } from 'react-icons/fa';
import { Modal, Button, Spinner } from 'react-bootstrap';
import * as ScheduleService from "../../services/ScheduleService";

const InfoNoteBook = ({ show, handleClose, idSchedule, idSlot }) => {
    const [data, setData] = useState(null);
    const [studentAbsent, setStudentAbsent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    console.log(idSchedule, idSlot)
    useEffect(() => {
        const fetchData = async () => {

            try {
                const result = await ScheduleService.getDetailNoteBook(idSchedule, idSlot);
                console.log(result)
                setData(result.noteBook)
                setStudentAbsent(result.absentStudents)
            } catch (error) {
                setError("Failed to load slot details");

            } finally {

            }
        };

        fetchData();
    }, [idSchedule, idSlot]);
    console.log(data)
    console.log(studentAbsent)

    const DetailItem = ({ icon: Icon, label, value, color }) => (
        <div className="d-flex align-items-center mb-3">
            <Icon className={`text-${color} me-2`} size={20} />
            <strong className="me-2">{label}:</strong>
            <span>{value}</span>
        </div>
    );



    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Sổ Đầu Bài</Modal.Title>
            </Modal.Header>
            <Modal.Body>


                {/* Hiển thị thông tin NoteBook */}
                <DetailItem
                    icon={FaClock}
                    label="Slot Content"
                    value={data?.content || "N/A"}
                    color="info"
                />
                <DetailItem
                    icon={FaBook}
                    label="Score"
                    value={data?.scoreClass || "N/A"}
                    color="success"
                />

                {/* Hiển thị danh sách học sinh vắng mặt */}
                <div className="mb-3">
                    <strong>Absent Students:</strong>
                    {studentAbsent.length > 0 ? (
                        studentAbsent.map((student, index) => (
                            <div key={student._id} className="d-flex align-items-center mt-2">
                                <FaChalkboardTeacher className="text-danger me-2" size={20} />
                                <span>
                                    {index + 1}. {student.studentId.name} -{" "}
                                    <strong className={student.isExcused ? "text-success" : "text-danger"}>
                                        {student.isExcused ? "Có Phép" : "Không Phép"}
                                    </strong>
                                </span>
                            </div>
                        ))
                    ) : (
                        <p>No absent students</p>
                    )}
                </div>

            </Modal.Body>
        </Modal>
    );
};

export default InfoNoteBook;