import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import * as BlockService from "../../services/BlockService";
import * as SubjectService from "../../services/SubjectService";
import * as ExamScheduleService from "../../services/ExamScheduleService";
import { toast } from "react-toastify";
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
                const subjectsData = await SubjectService.getAllSubjects();
                setSubjects(subjectsData?.data);
            } catch (error) {
                console.error("Error fetching blocks:", error);
            }
        };
        fetchSubjects();
    }, []);
    console.log("su",subjects)

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
    console.log("123123",events)
   
    
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
                        start : start,
                        end :end,
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

    const deleteExam = async (event) => {
        console.log("Selected event to delete:", event); // Hiển thị toàn bộ sự kiện
        console.log("Event ID:", event.id); // Kiểm tra giá trị ID của sự kiện
    
        const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa lịch thi: "${event.title}"?`);
        if (!confirmDelete) return;
    
        try {
            console.log("Sending delete request for ID:", event.id); // Gửi yêu cầu xóa với ID
            await ExamScheduleService.deleteExamSchedule(event.id);
    
            console.log("Filtering events to remove ID:", event.id); // Loại bỏ sự kiện trên UI
            setEvents(events.filter((e) => e.id !== event.id));
    
            toast.success("Lịch thi đã được xóa thành công!");
        } catch (error) {
            console.error("Error deleting exam schedule:", error); // Hiển thị lỗi nếu có
            toast.error("Có lỗi xảy ra khi xóa lịch thi.");
        }
    };
    
    

    return (
        <div className=" bg-gray-100 flex flex-col lg:flex-row overflow-hidden px-4">
            {/* Bên trái: Form nhập thông tin */}
            <div className="h-screen w-screen w-full lg:w-1/2 h-full">
                
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
            <div className="h-screen w-screen w-full lg:w-1/2 h-full p-2 bg-white rounded shadow overflow-auto">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    views={['month', 'week', 'day']}
                    defaultView="month"
                    onSelectEvent={deleteExam} // Xử lý khi nhấp vào sự kiện
                />
            </div>
        </div>
    );
};

export default ExamScheduler;
