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
        <div className="flex items-center mb-3">
            <div className="w-1/5 flex items-center">
                <Icon className={`text-${color} mr-2`} size={20} />
                <strong className="mr-2">{label}:</strong>
            </div>
            <div className="w-4/3">
                <span>{value}</span>
            </div>
        </div>
    );

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Sổ Đầu Bài</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                    <div className="flex items-center mb-2">
                        <strong className="w-1/5">Absent Students:</strong>
                        <div className="w-4/5">
                            {studentAbsent.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                    {studentAbsent.map((student, index) => (
                                        <div
                                            key={student._id}
                                            className="flex items-center p-2 border rounded-md bg-gray-50 shadow-sm"
                                        >
                                            <FaChalkboardTeacher className="text-red-500 mr-3" size={20} />
                                            <span className="flex-1">
                                                {index + 1}. {student.studentId.name}
                                            </span>
                                            <strong
                                                className={`ml-3 ${student.isExcused ? "text-green-500" : "text-red-500"
                                                    }`}
                                            >
                                                {student.isExcused ? "Có Phép" : "Không Phép"}
                                            </strong>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No absent students</p>
                            )}
                        </div>
                    </div>
                </div>


            </Modal.Body>
        </Modal>
    );
};

export default InfoNoteBook;