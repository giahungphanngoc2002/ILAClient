import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { format, getISOWeek } from 'date-fns';
import { vi } from 'date-fns/locale';

// Các dữ liệu mẫu cho học sinh
const students = [
    { id: 1, name: "Nguyễn Văn A", class: "10A" },
    { id: 2, name: "Trần Thị B", class: "10A" },
    { id: 3, name: "Lê Văn C", class: "10A" },
    { id: 4, name: "Phạm Thị D", class: "10A" },
    { id: 5, name: "Ngô Văn E", class: "10A" },
    { id: 6, name: "Đinh Thị F", class: "10A" },
    { id: 7, name: "Lý Văn G", class: "10A" },
    { id: 8, name: "Vũ Thị H", class: "10A" },
    { id: 9, name: "Trịnh Văn I", class: "10A" },
    { id: 10, name: "Hoàng Thị K", class: "10A" }
];

function AddAbsenceRequest() {
    const [title, setTitle] = useState("");
    const [reason, setReason] = useState("");
    const [nameFilter, setNameFilter] = useState("");
    const [classFilter, setClassFilter] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [selectedPeriods, setSelectedPeriods] = useState([]); // State để lưu các tiết được chọn

    const handleFileChange = (e) => {
        // Handle file upload logic here
    };

    const handleSelectAllToggle = () => {
        // Handle select all logic here
    };

    const handleStudentToggle = (id) => {
        setSelectedStudent((prev) =>
            prev === id ? null : id
        );
    };

    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        (classFilter ? student.class === classFilter : true)
    );

    const handlePeriodToggle = (period) => {
        setSelectedPeriods((prev) =>
            prev.includes(period) ? prev.filter(p => p !== period) : [...prev, period]
        );
    };

    const handleSubmit = () => {
        // Logic để xử lý khi bấm nút Lưu đơn
    };

    const onBack = () => {
        window.history.back();
    };

    console.log(dateRange);

    function getDatesBetween(startDate, endDate) {
        let dates = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    }

    let result = getDatesBetween(dateRange[0], dateRange[1]);

    console.log(result);

    function getDateInfo(dateRange) {
        return dateRange.map(date => {
            const dayOfWeek = format(date, 'EEEE', { locale: vi });
            const weekOfYear = getISOWeek(date);
            const year = format(date, 'yyyy');

            return { day: dayOfWeek, week: weekOfYear, year: year };
        });
    }

    console.log(getDateInfo(result));

    return (
        <div>
            <Breadcrumb
                title="Thêm đơn nghỉ học"
                buttonText="Lưu đơn"
                onButtonClick={handleSubmit}
                onBack={onBack}
            />

            <div style={{ height: '60px' }}></div>

            <div className="px-8 bg-gray-100 mt-8">
                <div className="flex gap-4 h-[calc(100vh-150px)]">
                    <div className="w-1/2 bg-white p-4 rounded-lg shadow overflow-y-auto">
                        <label className="block font-medium mb-2">Phạm vi ngày nghỉ</label>
                        <DatePicker
                            selectsRange
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(update) => setDateRange(update)}
                            isClearable
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
                            placeholderText="Chọn phạm vi ngày nghỉ"
                        />

                        <label className="block font-medium mb-2">Chọn số tiết nghỉ</label>
                        <div className="grid grid-cols-5 gap-2 mb-4">
                            {[...Array(10)].map((_, index) => (
                                <label key={index} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        value={index + 1}
                                        checked={selectedPeriods.includes(index + 1)}
                                        onChange={() => handlePeriodToggle(index + 1)}
                                    />
                                    Tiết {index + 1}
                                </label>
                            ))}
                        </div>
                        <label className="block font-medium mb-2">Lý do nghỉ học</label>
                        <ReactQuill
                            value={reason}
                            onChange={setReason}
                            className="w-full h-40 mb-4 text-gray-800"
                        />
                    </div>

                    <div className="w-1/2 bg-white p-4 rounded-lg shadow overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Chọn học sinh</h2>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Lọc theo tên"
                                    value={nameFilter}
                                    onChange={(e) => setNameFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>

                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border">STT</th>
                                    <th className="py-2 px-4 border">Họ tên</th>
                                    <th className="py-2 px-4 border">Lớp</th>
                                    <th className="py-2 px-4 border text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectAll}
                                            onChange={handleSelectAllToggle}
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student, index) => (
                                    <tr key={student.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                                        <td className="py-2 px-4 border">{index + 1}</td>
                                        <td className="py-2 px-4 border">{student.name}</td>
                                        <td className="py-2 px-4 border">{student.class}</td>
                                        <td className="py-2 px-4 border text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedStudent === student.id}
                                                onChange={() => handleStudentToggle(student.id)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddAbsenceRequest;
