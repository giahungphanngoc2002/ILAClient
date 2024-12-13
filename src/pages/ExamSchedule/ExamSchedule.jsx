import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import * as BlockService from "../../services/BlockService";
import * as SubjectService from "../../services/SubjectService";
import * as ExamScheduleService from "../../services/ExamScheduleService";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
const localizer = momentLocalizer(moment);

const ExamScheduler = () => {

    const [selectedBlock, setSelectedBlock] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [date, setDate] = useState('');
    const [timeStart, setTimeStart] = useState('');
    const [timeEnd, setTimeEnd] = useState('');
    const [events, setEvents] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [showModal, setShowModal] = useState(false); // Trạng thái hiển thị Modal
    const [selectedEvent, setSelectedEvent] = useState(null); // Lưu sự kiện được chọn
    const [nameBlock, setNameBlock] = useState(null); 

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


    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const subjectsData = await SubjectService.getAllSubjectbyBlock(nameBlock);
                setSubjects(subjectsData);
            } catch (error) {
                console.error("Error fetching blocks:", error);
            }
        };
        fetchSubjects();
    }, [nameBlock]);
    console.log("su", subjects)

    

    useEffect(() => {
        const fetchExamSchedules = async () => {
            try {
                const examSchedules = await ExamScheduleService.getAllExamSchedules();
                console.log(examSchedules);

                // Chuyển đổi dữ liệu từ API sang định dạng của react-big-calendar
                const mappedEvents = examSchedules?.data?.map((schedule) => ({
                    id: schedule._id, // Đảm bảo id chứa giá trị schedule._id
                    title: `${schedule.blockId.nameBlock} - ${schedule.subjectId.nameSubject}`,
                    start: new Date(`${schedule.day}T${schedule.timeStart}`),
                    end: new Date(`${schedule.day}T${schedule.timeEnd}`),
                }));

                setEvents(mappedEvents);
            } catch (error) {
                console.error("Error fetching exam schedules:", error);
                toast.error("Không thể tải dữ liệu lịch thi.");
            }
        };

        fetchExamSchedules();
    }, []);
    console.log("123123", events)

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedEvent(null); // Reset sự kiện khi đóng Modal
    };
    useEffect(() => {
        if (selectedBlock) {
            const blockName = blocks.find(block => block._id === selectedBlock)?.nameBlock || 'Unknown Block';
            setNameBlock(blockName);
        }
    }, [selectedBlock, blocks]);

    const addExam = async () => {
        if (selectedBlock && selectedSubject && date && timeStart) {
            const start = new Date(`${date}T${timeStart}`);
            const end = new Date(start.getTime() + 60 * 60 * 1000); // Giả sử mỗi kỳ thi kéo dài 1 giờ

            const blockName = blocks.find(block => block._id === selectedBlock)?.nameBlock || 'Unknown Block';
            
            const subjectName = subjects.find(subject => subject._id === selectedSubject)?.nameSubject || 'Unknown Subject';

            console.log(blockName)
            console.log(subjectName)
            const newEvent = {
                blockId: selectedBlock,
                subjectId: selectedSubject,
                day: date,
                timeStart: timeStart,
                timeEnd: timeEnd,
            };

            try {
                // Gửi request tạo lịch thi
                const response = await ExamScheduleService.createExamSchedule(newEvent);

                // Thêm sự kiện vào lịch sau khi tạo thành công
                setEvents([
                    ...events,
                    {
                        title: `${blockName} - ${subjectName}`,
                        start: start,
                        end: end,
                    },
                ]);

                // Reset các trường
                setSelectedBlock('');
                setSelectedSubject('');
                setDate('');
                setTimeStart('');
                setTimeEnd('');

                toast.success("Lịch thi đã được thêm thành công!");
            } catch (error) {
                console.error("Error adding exam schedule:", error);
                toast.error("Có lỗi xảy ra khi thêm lịch thi.");
            }
        } else {
            alert("Vui lòng điền đầy đủ thông tin!");
        }
    };
    console.log("Events list:", events);

    const handleConfirmDelete = async () => {
        if (!selectedEvent) return;
        try {
            await ExamScheduleService.deleteExamSchedule(selectedEvent.id);
            setEvents(events.filter((e) => e.id !== selectedEvent.id));
            toast.success("Lịch thi đã được xóa thành công!");
        } catch (error) {
            console.error("Error deleting exam schedule:", error);
            toast.error("Có lỗi xảy ra khi xóa lịch thi.");
        } finally {
            handleCloseModal();
        }
    };


    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setDate(event.start.toISOString().split('T')[0]); // Lấy ngày từ sự kiện
        setTimeStart(event.start.toTimeString().slice(0, 5)); // Lấy giờ bắt đầu
        setTimeEnd(event.end.toTimeString().slice(0, 5)); // Lấy giờ kết thúc
        setShowModal(true);
    };

    const handleUpdateEvent = async () => {
        if (!selectedEvent || !date || !timeStart || !timeEnd) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        try {
            const updatedEvent = {
                id: selectedEvent.id,
                day: date,
                timeStart: timeStart,
                timeEnd: timeEnd,
            };

            console.log(updatedEvent)

            // Gửi yêu cầu cập nhật
            await ExamScheduleService.updateExamSchedule(selectedEvent.id, updatedEvent);

            // Cập nhật danh sách sự kiện trong state
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event.id === selectedEvent.id
                        ? {
                            ...event,
                            start: new Date(`${date}T${timeStart}`),
                            end: new Date(`${date}T${timeEnd}`),
                        }
                        : event
                )
            );

            toast.success("Lịch thi đã được cập nhật!");
        } catch (error) {
            console.error("Error updating exam schedule:", error);
            toast.error("Có lỗi xảy ra khi cập nhật lịch thi.");
        } finally {
            handleCloseModal();
        }
    };




    return (
        <div className="h-screen bg-gray-100 flex flex-col lg:flex-row overflow-hidden px-6 py-6">
            {/* Bên trái: Form nhập thông tin */}
            <div className=" w-screen w-full lg:w-1/2 h-full">

                <div className="flex flex-col gap-4 bg-white p-4 rounded shadow h-full">
                    <div>
                        <label className="block text-lg font-medium mb-2">Chọn Khối</label>
                        <select
                            value={selectedBlock}
                            onChange={(e) => setSelectedBlock(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Chọn khối lớp</option>
                            {blocks.map((block) => (
                                <option key={block._id} value={block._id}>
                                    {block.nameBlock}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-lg font-medium mb-2">Chọn Môn Thi</label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Chọn môn thi</option>
                            {subjects.map((subject) => (
                                <option key={subject._id} value={subject._id}>
                                    {subject.nameSubject}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-lg font-medium mb-2">Chọn Ngày và Giờ Thi</label>
                        <div className="flex gap-4">
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="p-2 border rounded w-full"
                            />
                            <input
                                type="time"
                                value={timeStart}
                                onChange={(e) => setTimeStart(e.target.value)}
                                className="p-2 border rounded w-full"
                            />
                            <input
                                type="time"
                                value={timeEnd}
                                onChange={(e) => setTimeEnd(e.target.value)}
                                className="p-2 border rounded w-full"
                                placeholder="Thời gian kết thúc"
                            />
                        </div>
                    </div>

                    <button onClick={addExam} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                        Thêm Lịch Thi
                    </button>
                </div>
            </div>

            {/* Bên phải: Lịch thi */}
            <div className="w-screen w-full lg:w-1/2 h-full p-2 bg-white rounded shadow overflow-auto">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    views={['month', 'week', 'day']}
                    defaultView="month"
                    onSelectEvent={handleEventClick} // Xử lý khi nhấp vào sự kiện
                />
            </div>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xóa Lịch Thi</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedEvent ? (
                        <>
                            <p>
                                Bạn đang chỉnh sửa lịch thi: <strong>{selectedEvent.title}</strong>
                            </p>
                            <div className="mt-3">
                                <label>Ngày:</label>
                                <input
                                    type="date"
                                    value={date} // Giá trị đã được đổ sẵn từ sự kiện
                                    onChange={(e) => setDate(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="mt-3">
                                <label>Giờ bắt đầu:</label>
                                <input
                                    type="time"
                                    value={timeStart} // Giá trị đã được đổ sẵn từ sự kiện
                                    onChange={(e) => setTimeStart(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="mt-3">
                                <label>Giờ kết thúc:</label>
                                <input
                                    type="time"
                                    value={timeEnd} // Giá trị đã được đổ sẵn từ sự kiện
                                    onChange={(e) => setTimeEnd(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                        </>
                    ) : (
                        "Không có lịch thi được chọn."
                    )}
                </Modal.Body>


                <Modal.Footer>
                    <Button variant="primary" onClick={handleUpdateEvent}>
                        Cập nhật
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Xóa
                    </Button>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Hủy
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ExamScheduler;
