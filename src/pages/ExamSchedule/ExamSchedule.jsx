import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const ExamScheduler = () => {
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [events, setEvents] = useState([]);

    const addExam = () => {
        if (selectedClass && selectedSubject && date && time) {
            const start = new Date(`${date}T${time}`);
            const end = new Date(start.getTime() + 60 * 60 * 1000); // Giả sử mỗi kỳ thi kéo dài 1 giờ

            const newEvent = {
                title: `${selectedClass} - ${selectedSubject}`,
                start: start,
                end: end,
            };

            setEvents([...events, newEvent]);
            setSelectedClass('');
            setSelectedSubject('');
            setDate('');
            setTime('');
        } else {
            alert('Vui lòng điền đầy đủ thông tin!');
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
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Chọn khối lớp</option>
                            <option value="10">Khối 10</option>
                            <option value="11">Khối 11</option>
                            <option value="12">Khối 12</option>
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
                            <option value="Toán">Toán</option>
                            <option value="Lý">Lý</option>
                            <option value="Hóa">Hóa</option>
                            <option value="Văn">Văn</option>
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
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="p-2 border rounded w-full"
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
                />
            </div>
        </div>
    );
};

export default ExamScheduler;
