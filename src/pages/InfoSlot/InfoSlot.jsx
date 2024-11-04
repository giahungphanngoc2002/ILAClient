import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaChalkboardTeacher, FaBook, FaDoorOpen, FaClock } from 'react-icons/fa';
import { Modal, Button, Spinner } from 'react-bootstrap';
import * as ScheduleService from "../../services/ScheduleService";

const InfoSlot = ({ show, handleClose, idSchedule, idSlot, slotTime }) => {
    const [data, setData] = useState(null);
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!idSchedule || !idSlot) return;

            try {
                const result = await ScheduleService.getDetailSlotById(idSchedule, idSlot);
                const scheduleDay = result.data.schedule.dayOfWeek;
                const slotData = result.data.schedule.slots.find(slot => slot._id === idSlot);

                setData(slotData);
                setSchedule(scheduleDay);
                setLoading(false);
            } catch (error) {
                setError("Failed to load slot details");
                setLoading(false);
            }
        };

        fetchData();
    }, [idSchedule, idSlot]);

    const DetailItem = ({ icon: Icon, label, value, color }) => (
        <div className="d-flex align-items-center mb-3">
            <Icon className={`text-${color} me-2`} size={20} />
            <strong className="me-2">{label}:</strong>
            <span>{value}</span>
        </div>
    );

    console.log(slotTime)

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Thông tin tiết học</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="d-flex justify-content-center">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : (
                    <div>
                        <DetailItem icon={FaCalendarAlt} label="Date" value={schedule} color="primary" />
                        <DetailItem icon={FaClock} label="Slot" value={data.slotNumber} color="info" />
                        <DetailItem icon={FaBook} label="Subject" value={data.subjectId.nameSubject} color="success" />
                        <DetailItem icon={FaChalkboardTeacher} label="Teacher" value={data.subjectId.teacherId.name} color="secondary" />
                        <DetailItem icon={FaDoorOpen} label="Room" value={data.classId.nameClass} color="danger" />
                        <DetailItem icon={FaClock} label="Time" value={`${slotTime.start} - ${slotTime.end}`} color="info" />
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default InfoSlot;
