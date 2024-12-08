import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import * as ClassService from "../../services/ClassService";
import { useSelector } from 'react-redux';
import * as ScheduleService from "../../services/ScheduleService";
import { FaCheck, FaTimes, FaRegQuestionCircle } from 'react-icons/fa';
const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const periods = ["Tiết 1", "Tiết 2", "Tiết 3", "Tiết 4", "Tiết 5", "Tiết 6", "Tiết 7", "Tiết 8", "Tiết 9", "Tiết 10"];
const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);

const AttendanceStudent = () => {
    const user = useSelector((state) => state.user);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [studentId, setStudentId] = useState(user?.id);
    const [timeTables, setTimeTables] = useState([]);
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setStudentId(user?.id);
    }, [user]);


    useEffect(() => {
        const fetchTimeTables = async () => {
            setIsLoading(true);
            try {
                const timeTablesData = await ScheduleService.getClassAndTimeTableByStudentId(studentId);
                console.log(timeTablesData.data)
                const data = processTimeTable(timeTablesData.data);
                setTimeTables(data);
            } catch (error) {
                console.error("Error fetching time tables:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTimeTables();
    }, [studentId]);

    console.log(timeTables)


    const findUserClasses = (allClasses, userId) => {
        if (!Array.isArray(allClasses)) {
            console.error("All classes is not a valid array:", allClasses);
            return [];
        }

        const foundClasses = allClasses.filter((classItem) => {
            return (
                Array.isArray(classItem.studentID) &&
                classItem.studentID.some((student) =>
                    typeof student === "string"
                        ? student === userId
                        : student._id === userId
                ) &&
                classItem.year === result  // Kiểm tra năm của lớp
            );
        });

        if (foundClasses.length === 0) {
            console.warn("No class found for user:", userId);
        }

        return foundClasses;
    };


    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const allClasses = await ClassService.getAllClass();
                const userClass = findUserClasses(allClasses?.data || [], user.id);
            } catch (error) {
                console.error("Error fetching classes:", error);
            }
        };

        fetchClasses();
    }, [user.id]);

    const currentYearr = new Date().getFullYear();
    const result = `${currentYearr}-${currentYearr + 1}`;

    const getDayOfWeek = (day) => {
        const date = new Date(selectedYear, selectedMonth - 1, day);
        return daysOfWeek[date.getDay()];
    };

    const getAttendanceStatus = (day, slot) => {
        const dateKey = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return timeTables[dateKey]?.slots[slot];
    };

    const onBack = () => {
        window.history.back();
    }

    // Hàm chuyển đổi ngày trong tuần thành ngày cụ thể
    function getDateOfWeek(year, week, dayOfWeek) {
        const firstDayOfYear = new Date(year, 0, 1);
        const daysOffset = (week - 1) * 7;
        const firstDayOfWeek = new Date(firstDayOfYear);
        firstDayOfWeek.setDate(firstDayOfYear.getDate() + daysOffset);

        const daysOfWeek = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
        const dayIndex = daysOfWeek.indexOf(dayOfWeek);
        if (dayIndex === -1) {
            throw new Error("Ngày không hợp lệ");
        }

        const resultDate = new Date(firstDayOfWeek);
        resultDate.setDate(firstDayOfWeek.getDate() + dayIndex);

        const yearResult = resultDate.getFullYear();
        const monthResult = (resultDate.getMonth() + 1).toString().padStart(2, '0');
        const dayResult = resultDate.getDate().toString().padStart(2, '0');

        return `${yearResult}-${monthResult}-${dayResult}`;
    }

    // Chuyển đổi dữ liệu
    function processTimeTable(data) {
        const result = {};

        data.timeTables.forEach(timeTable => {
            timeTable.scheduleIds.forEach(schedule => {
                const date = getDateOfWeek(timeTable.year, timeTable.week, schedule.dayOfWeek);

                // Lấy thông tin các slot có học sinh vắng
                const slotData = {};
                schedule.slots.forEach(slot => {
                    // console.log(slot);
                    // Kiểm tra attendanceStatus trước, nếu học sinh có mặt và không có trong danh sách absent
                    if (slot.attendanceStatus.status === true && slot.absentStudentId.length === 0) {
                        slotData[slot.slotNumber] = { status: "present" };
                    } else {
                        // Nếu có học sinh vắng, duyệt qua danh sách absentStudentId
                        slot.absentStudentId.forEach(absent => {
                            if (absent.isExcused === false) {
                                slotData[slot.slotNumber] = { status: "absent" };
                            } else if (absent.isExcused === true) {
                                slotData[slot.slotNumber] = { status: "excused" };
                            }
                        });
                    }
                });

                if (Object.keys(slotData).length > 0) {
                    result[date] = { slots: slotData };
                }
            });
        });

        return result;
    }


    // In ra kết quả



    return (
        <div className="p-4" style={{ height: "100vh" }}>
            <Breadcrumb
                title="Xem điểm danh"
                onBack={onBack}
                displayButton={false}
            />

            <div className="pt-10"></div>

            {/* Filter Section */}
            <div className="bg-gray-100 py-4 rounded-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-gray-600 mb-1">Năm</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                        >
                            <option>Năm</option>
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-600 mb-1">Tháng</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        >
                            <option>Tháng</option>
                            {months.map((month) => (
                                <option key={month} value={month}>{month}</option>
                            ))}
                        </select>
                    </div>

                    {/* <div>
                        <label className="block text-gray-600 mb-1">Tuần</label>
                        <select className="w-full p-2 border rounded">
                            <option>Chọn tuần</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-600 mb-1">Khối</label>
                        <select className="w-full p-2 border rounded">
                            <option>Chọn khối</option>
                            <option>10</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-600 mb-1">Lớp</label>
                        <select className="w-full p-2 border rounded">
                            <option>Chọn lớp</option>
                            <option>10/10</option>
                        </select>
                    </div> */}

                    {/* <div>
                        <label className="block text-gray-600 mb-1">Mã học sinh</label>
                        <input
                            type="text"
                            placeholder="Nhập mã học sinh"
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 mb-1">Tên học sinh</label>
                        <input
                            type="text"
                            placeholder="Nhập tên học sinh"
                            className="w-full p-2 border rounded"
                        />
                    </div> */}
                </div>
            </div>

            {/* Attendance Table */}
            <table className="w-full border-collapse bg-white">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2 text-center w-24 h-12" rowSpan="2">Tiết học</th>
                        {Array.from({ length: daysInMonth }, (_, i) => (
                            <th key={i} className="border p-2 text-center w-12 h-12">{String(i + 1).padStart(2, '0')}</th>
                        ))}
                    </tr>
                    <tr className="bg-gray-100">
                        {Array.from({ length: daysInMonth }, (_, i) => (
                            <th key={i} className="border p-2 text-center w-12 h-12">
                                {getDayOfWeek(i + 1)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {periods.map((period, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                            <td className="border p-2 text-center w-24 h-12">{period}</td>
                            {Array.from({ length: daysInMonth }, (_, i) => {
                                const attendanceStatus = getAttendanceStatus(i + 1, index + 1);
                                return (
                                    <td key={i} className="border p-2 text-center w-12 h-12">
                                        {attendanceStatus ? (
                                            <span
                                                className={`flex items-center justify-center px-1 py-1 rounded ${attendanceStatus.status === 'present' ? "bg-green-300" :
                                                    attendanceStatus.status === 'absent' ? "bg-red-300" :
                                                        attendanceStatus.status === 'excused' ? "bg-yellow-300" : ""}`}
                                            >
                                                {attendanceStatus.status === 'excused' ? <FaRegQuestionCircle /> :
                                                    attendanceStatus.status === 'absent' ? <FaTimes /> : <FaCheck />}
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center">
                                            </span>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="bg-gray-100 py-4 rounded-md mb-6">

                <ul className="p-0">
                    <li>
                        <span className="flex items-center gap-2">
                            <FaCheck className="text-green-500" />
                            : Học sinh có mặt đầy đủ trong lớp.
                        </span>
                    </li>
                    <li>
                        <span className="flex items-center gap-2">
                            <FaTimes className="text-red-500" />
                            : Học sinh vắng mà không có lý do hợp lệ.
                        </span>
                    </li>
                    <li>
                        <span className="flex items-center gap-2">
                            <FaRegQuestionCircle className="text-yellow-500" />
                            : Học sinh vắng với lý do hợp lệ.
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default AttendanceStudent;