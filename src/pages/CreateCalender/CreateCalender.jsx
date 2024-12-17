import React, { useEffect, useState } from "react";
import * as BlockService from "../../services/BlockService";
import * as ClassService from "../../services/ClassService";
import * as ScheduleService from "../../services/ScheduleService";
import { toast } from "react-toastify";
import { FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { useParams } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";

const timeSlots = [
    { slot: "Tiết 1" },
    { slot: "Tiết 2" },
    { slot: "Tiết 3" },
    { slot: "Tiết 4" },
    { slot: "Tiết 5" },
    { slot: "Tiết 6" },
    { slot: "Tiết 7" },
    { slot: "Tiết 8" },
    { slot: "Tiết 9" },
    { slot: "Tiết 10" },
];

const daysOfWeek = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

const CreateCalender = () => {
    const [selectedClass, setSelectedClass] = useState(null);
    const [schedule, setSchedule] = useState({});
    const [error, setError] = useState("");
    const [blocks, setBlocks] = useState([]);
    const [classDetail, setClassDetail] = useState(null);
    const [startWeek, setStartWeek] = useState(null);
    const [endWeek, setEndWeek] = useState(null);
    const [startYearWeek, setStartYearWeek] = useState({ year: "", week: "" });
    const [endYearWeek, setEndYearWeek] = useState({ year: "", week: "" });
    const [data, setData] = useState();
    const { idClass } = useParams();


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
        const fetchClassDetail = async () => {
            if (!idClass) return;
            try {
                const classData = await ClassService.getDetailClass(idClass);
                setClassDetail(classData?.data);
            } catch (error) {
                console.error("Error fetching class details:", error);
            }
        };
        fetchClassDetail();
    }, [idClass]);

    const transformData = (data) => {
        const result = [];

        // Duyệt qua từng ngày trong tuần
        daysOfWeek.forEach(day => {
            // Lọc các dữ liệu cho từng ngày
            const dayData = data.filter(item => item[day]);

            // Nếu có tiết học cho ngày đó
            if (dayData.length > 0) {
                const dayOfWeek = {
                    dayOfWeek: day,
                    slots: dayData.map(item => ({
                        slotNumber: `${item["Tiết học"]}`,
                        subjectId: item[day]
                    }))
                };
                result.push(dayOfWeek);
            } else {
                // Nếu không có tiết học, chỉ tạo một đối tượng với dayOfWeek và slots rỗng
                result.push({
                    dayOfWeek: day,
                    slots: []
                });
            }
        });

        // Lọc bỏ những phần có slots rỗng
        return result.filter(day => day.slots.length > 0);
    };


    console.log(classDetail)

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0]; // Lấy sheet đầu tiên
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet); // Chuyển đổi sheet thành mảng JSON

                // console.log(classDetail);

                const updatedData = jsonData.map(item => {
                    const updatedItem = { ...item };

                    // Duyệt qua các ngày trong lịch học và cập nhật thông tin môn học
                    Object.keys(updatedItem).forEach(day => {
                        const teacher = updatedItem[day];
                        const subject = [
                            ...classDetail?.SubjectsId,
                            ...classDetail?.SubjectsChuyendeId,
                            ...classDetail?.SubjectsPhuId
                        ].find(subject =>
                            teacher === `${subject.nameSubject} - ${subject.teacherId?.username}`
                        );
                        if (subject) {
                            updatedItem[day] = subject;
                        }
                    });

                    return updatedItem;
                });

                console.log(updatedData);

                const transformedData = transformData(updatedData);

                setData(transformedData);

                // Cập nhật schedule với dữ liệu đã chuyển đổi từ Excel
                transformedData.forEach((dayData) => {
                    timeSlots.forEach((slot) => {
                        const currentSchedule = dayData.slots.find(
                            s => s.slotNumber === slot.slot.replace('Tiết ', '')
                        );
                        console.log(currentSchedule);
                        if (currentSchedule) {
                            handleSelectSlot(
                                idClass,
                                dayData.dayOfWeek,
                                slot.slot,
                                JSON.stringify({
                                    subjectId: currentSchedule.subjectId?._id,
                                    subjectChuyendeId: currentSchedule.subjectChuyendeId?._id,
                                    subjectPhuId: currentSchedule.subjectPhuId?._id || null,
                                })
                            );
                        }
                    });
                });
            };
            reader.readAsBinaryString(file);
        }
    };

    console.log("data", data);
    console.log("schedule", schedule);


    const getYearAndWeekFromValue = (weekValue) => {
        const [year, week] = weekValue.split('-W');
        return { year, week };
    };

    const handleStartWeekChange = (e) => {
        const startWeekValue = e.target.value;
        setStartWeek(startWeekValue);
        setStartYearWeek(getYearAndWeekFromValue(startWeekValue));
    };

    const handleEndWeekChange = (e) => {
        const endWeekValue = e.target.value;
        setEndWeek(endWeekValue);
        setEndYearWeek(getYearAndWeekFromValue(endWeekValue));
    };

    // console.log(schedule)
    const handleSelectSlot = (classId, day, slot, subjectData) => {
        const { subjectId, subjectChuyendeId, subjectPhuId } = JSON.parse(subjectData);
        // console.log(subjectData)
        // console.log("Before update:", schedule);
        setSchedule((prev) => ({
            ...prev,
            [classId]: {
                ...prev[classId],
                [day]: {
                    ...(prev[classId]?.[day] || {}),
                    [slot]: {
                        subjectId,
                        subjectChuyendeId,
                        subjectPhuId
                    },
                },
            },
        }));
    };

    const isEndWeekGreaterThanStartWeek = (startYearWeek, endYearWeek) => {
        const startYear = parseInt(startYearWeek.year, 10);
        const endYear = parseInt(endYearWeek.year, 10);
        const startWeek = parseInt(startYearWeek.week, 10);
        const endWeek = parseInt(endYearWeek.week, 10);
        return endYear > startYear || (endYear === startYear && endWeek >= startWeek);
    };


    const handleSaveSchedule = async () => {
        if (!idClass) {
            setError("Please select a class before saving the schedule.");
            toast.error("Please select a class before saving the schedule.");
            return;
        }
        if (!isEndWeekGreaterThanStartWeek(startYearWeek, endYearWeek)) {
            toast.error("Tuần kết thúc nhỏ hơn tuần bắt đầu!!");
            return;
        }
        try {
            const startWeekNumber = parseInt(startYearWeek.week, 10);
            const endWeekNumber = parseInt(endYearWeek.week, 10);

            for (let currentWeek = startWeekNumber; currentWeek <= endWeekNumber; currentWeek++) {
                let timetableId = data?.find((schedule) => schedule.week === `${currentWeek}`)?._id || null;
                // console.log(timetableId)
                const scheduleData = {
                    yearNumber: startYearWeek.year,
                    weekNumber: currentWeek,
                    days: daysOfWeek
                        .map((day) => {
                            const newSlots = timeSlots
                                .filter((slot) => schedule[idClass]?.[day]?.[slot.slot])
                                .map((slot) => {
                                    const slotData = schedule[idClass]?.[day]?.[slot.slot];
                                    return {
                                        slotNumber: parseInt(slot.slot.replace("Tiết ", "")),
                                        subjectId: slotData?.subjectId || null,
                                        classId: idClass,
                                        attendanceStatus: {
                                            createdAt: new Date().toISOString(),
                                            status: false,
                                        },
                                        absentStudentId: [],
                                    };
                                });

                            if (newSlots.length > 0) {
                                let updatedSlots = [];
                                const existingDay = data?.find(
                                    (daySchedule) => daySchedule.dayOfWeek === day
                                );

                                if (existingDay) {
                                    updatedSlots = existingDay.slots.filter(
                                        (existingSlot) =>
                                            !newSlots.some((newSlot) => newSlot.slotNumber === existingSlot.slotNumber)
                                    );
                                }

                                updatedSlots = [...updatedSlots, ...newSlots];

                                return { dayOfWeek: day, slots: updatedSlots };
                            }

                            return null;
                        })
                        .filter((day) => day !== null),
                };

                console.log(scheduleData)
                if (!scheduleData.days || scheduleData.days.length === 0) {
                    setError("Schedule is empty, please select at least one subject per time slot.");
                    toast.error("Schedule is empty, please select at least one subject per time slot.");
                    return;
                }

                if (timetableId) {
                    try {
                        await ScheduleService.updateScheduleByClassId(idClass, timetableId, scheduleData);
                        toast.success(`Updated schedule for week ${currentWeek}`);
                    } catch (updateError) {
                        toast.error(`Error updating schedule for week ${currentWeek}`);
                    }
                } else {
                    try {
                        const response = await ScheduleService.createScheduleByClassId(idClass, scheduleData);
                        if (response?.data?.newTimeTable) {
                            timetableId = response.data.newTimeTable._id;
                            setClassDetail((prev) => ({
                                ...prev,
                                timeTable: [...(prev?.timeTable || []), response.data.newTimeTable],
                            }));
                        }
                        toast.success(`Created schedule for week ${currentWeek}`);
                    } catch (createError) {
                        console.error(createError);
                        toast.error(`Error creating schedule for week ${currentWeek}`);
                        toast.error(`${createError.response?.data?.error || createError.message}`);
                    }
                }
            }

            setError("");
            toast.success("Schedule processed successfully for all weeks!");
        } catch (error) {
            console.error("Error saving/updating schedule:", error);
            setError("An error occurred while processing the schedule.");
            toast.error("An error occurred while processing the schedule.");
        }
    };

    const onBack = () => {
        window.history.back();
    }

    return (
        <div className="p-6 bg-gray-100 rounded-lg">
            <Breadcrumb
                title="Tạo lịch học theo tuần"
                buttonText="Lưu lịch"
                onButtonClick={handleSaveSchedule}
                onBack={onBack}
            />



            <div className="bg-white p-6 rounded-lg shadow-lg mt-16">
                <div className="flex">
                    <div className="mb-4 w-1/2 pr-2">
                        <label className="block text-lg font-semibold">Thời gian bắt đầu:</label>
                        <input
                            type="week"
                            className="border p-2 rounded w-full mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={startWeek || ""}
                            onChange={handleStartWeekChange}
                        />
                        {startYearWeek.year && startYearWeek.week && (
                            <p>Năm: {startYearWeek.year}, Tuần: {startYearWeek.week}</p>
                        )}
                    </div>
                    <div className="mb-4 w-1/2 pl-2">
                        <label className="block text-lg font-semibold">Thời gian kết thúc:</label>
                        <input
                            type="week"
                            className="border p-2 rounded w-full mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={endWeek || ""}
                            onChange={handleEndWeekChange}
                        />
                        {endYearWeek.year && endYearWeek.week && (
                            <p>Năm: {endYearWeek.year}, Tuần: {endYearWeek.week}</p>
                        )}
                    </div>

                </div>
                <div className="mb-4 flex items-center justify-center space-x-4">
                    <button
                        onClick={() => document.getElementById("fileInput").click()}
                        className="bg-green-500 text-white hover:bg-green-600 text-gray-700 font-semibold py-2 px-4 rounded flex items-center gap-2"
                    >
                        <FaFileExcel className="w-5 h-5" />
                        Nhập từ file Excel
                    </button>
                    <input
                        type="file"
                        id="fileInput"
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                        style={{ opacity: 0, position: "absolute", zIndex: -1 }}
                    />
                </div>
                <table className="table-auto w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-indigo-100">
                            <th className="border px-4 py-2 text-indigo-700">Tiết học</th>
                            {daysOfWeek.map((day, idx) => (
                                <th key={idx} className="border px-4 py-2 text-indigo-700" style={{ width: "15%" }}>{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {timeSlots.map((slot, slotIndex) => (
                            <tr key={slotIndex} className="hover:bg-indigo-50 transition duration-200">
                                <td className="border px-4 py-2">{slot.slot}</td>
                                {daysOfWeek.map((day, dayIndex) => {
                                    const currentDay = data?.find(d => d.dayOfWeek === day) || { slots: [] };
                                    const currentSchedule = currentDay.slots.find(
                                        s => s.slotNumber === slot.slot.replace('Tiết ', '')
                                    );
                                    return (
                                        <td key={dayIndex} className="border px-4 py-2">
                                            {currentSchedule ? (
                                                <div>
                                                    <select
                                                        name="currentScheduleSelect"
                                                        id="currentScheduleSelect"
                                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        value={
                                                            schedule[selectedClass]?.[day]?.[slot.slot]
                                                                ? JSON.stringify(schedule[selectedClass][day][slot.slot])
                                                                : currentSchedule?.subjectId
                                                                    ? JSON.stringify({
                                                                        subjectId: currentSchedule.subjectId._id,

                                                                    })
                                                                    : ""
                                                        }
                                                        onChange={(e) =>
                                                            handleSelectSlot(selectedClass, day, slot.slot, e.target.value)
                                                        }
                                                    >
                                                        {classDetail?.SubjectsId.map((subject, index) => (
                                                            <option
                                                                key={index}
                                                                value={JSON.stringify({
                                                                    subjectId: subject._id,

                                                                })}
                                                            >
                                                                {subject?.nameSubject}
                                                            </option>
                                                        ))}
                                                        {classDetail?.SubjectsChuyendeId.map((subject, index) => (
                                                            <option
                                                                key={index}
                                                                value={JSON.stringify({
                                                                    subjectId: subject._id,

                                                                })}
                                                            >
                                                                {subject?.nameSubject}
                                                            </option>
                                                        ))}
                                                        {classDetail?.SubjectsPhuId.map((subject, index) => (
                                                            <option
                                                                key={index}
                                                                value={JSON.stringify({
                                                                    subjectId: subject._id,

                                                                })}
                                                            >
                                                                {subject?.nameSubject}
                                                            </option>
                                                        ))}
                                                    </select>


                                                </div>
                                            ) : (
                                                <select
                                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    onChange={(e) =>
                                                        handleSelectSlot(selectedClass, day, slot.slot, e.target.value)
                                                    }
                                                    value={
                                                        schedule[selectedClass]?.[day]?.[slot.slot]
                                                            ? JSON.stringify(schedule[selectedClass]?.[day]?.[slot.slot])
                                                            : ""
                                                    }
                                                >
                                                    <option value="">Chọn môn</option>
                                                    {classDetail?.SubjectsId.map((subject, index) => (
                                                        <option
                                                            key={index}
                                                            value={JSON.stringify({ subjectId: subject._id, })}
                                                        >
                                                            {subject?.nameSubject}
                                                        </option>
                                                    ))}
                                                    {classDetail?.SubjectsChuyendeId.map((subject, index) => (
                                                        <option
                                                            key={index}
                                                            value={JSON.stringify({ subjectId: subject._id, })}
                                                        >
                                                            {subject?.nameSubject}
                                                        </option>
                                                    ))}
                                                    {classDetail?.SubjectsPhuId.map((subject, index) => (
                                                        <option
                                                            key={index}
                                                            value={JSON.stringify({ subjectId: subject._id, })}
                                                        >
                                                            {subject?.nameSubject}
                                                        </option>
                                                    ))}

                                                </select>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CreateCalender;


