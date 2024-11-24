import React, { useEffect, useState } from "react";
import * as BlockService from "../../services/BlockService";
import * as ClassService from "../../services/ClassService";
import * as ScheduleService from "../../services/ScheduleService";
import { toast } from "react-toastify";

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

const ManageSchedule = () => {
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [schedule, setSchedule] = useState({});
    const [error, setError] = useState("");
    const [blocks, setBlocks] = useState([]);
    const [classDetail, setClassDetail] = useState(null);
    const [startWeek, setStartWeek] = useState(null);
    const [endWeek, setEndWeek] = useState(null);
    const [startYearWeek, setStartYearWeek] = useState({ year: "", week: "" });
    const [endYearWeek, setEndYearWeek] = useState({ year: "", week: "" });

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
            if (!selectedClass) return;
            try {
                const classData = await ClassService.getDetailClass(selectedClass);
                setClassDetail(classData?.data);
            } catch (error) {
                console.error("Error fetching class details:", error);
            }
        };
        fetchClassDetail();
    }, [selectedClass]);

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

    const handleWeekChange = (direction) => {
        const currentWeek = getYearAndWeekFromValue(startWeek);
        const newWeekNumber = parseInt(currentWeek.week) + direction;
        if (newWeekNumber >= 1 && newWeekNumber <= 52) {
            const newWeekValue = `${currentWeek.year}-W${newWeekNumber}`;
            setStartWeek(newWeekValue);
            setStartYearWeek(getYearAndWeekFromValue(newWeekValue));
        }
    };

    const handleSelectSlot = (classId, day, slot, subjectData) => {
        const { subjectId, subjectChuyendeId } = JSON.parse(subjectData);
        if (!subjectId && !subjectChuyendeId) {
            setError("You need to select a subject for each time slot.");
            return;
        }
        setError("");
        setSchedule((prev) => ({
            ...prev,
            [classId]: {
                ...prev[classId],
                [day]: {
                    ...(prev[classId]?.[day] || {}),
                    [slot]: {
                        subjectId,
                        subjectChuyendeId,
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
        if (!selectedClass) {
            setError("Please select a class before saving the schedule.");
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
                const scheduleData = {
                    yearNumber: startYearWeek.year,
                    weekNumber: currentWeek,
                    days: daysOfWeek.map((day) => ({
                        dayOfWeek: day,
                        slots: timeSlots
                            .filter((slot) => schedule[selectedClass]?.[day]?.[slot.slot])
                            .map((slot) => {
                                const slotData = schedule[selectedClass]?.[day]?.[slot.slot];
                                return {
                                    slotNumber: parseInt(slot.slot.replace('Tiết ', '')),
                                    subjectId: slotData.subjectId,
                                    classId: selectedClass,
                                    attendanceStatus: {
                                        createdAt: new Date().toISOString(),
                                        status: false,
                                    },
                                    absentStudentId: [],
                                };
                            }),
                    })).filter((day) => day.slots.length > 0),
                };
                if (!scheduleData.days || scheduleData.days.length === 0) {
                    setError("Schedule is empty, please select at least one subject per time slot.");
                    return;
                }
                await ScheduleService.createScheduleByClassId(selectedClass, scheduleData);
            }
            setError("");
            toast.success("Schedule saved successfully for all weeks!");
        } catch (error) {
            console.error("Error saving schedule:", error);
            setError("An error occurred while saving the schedule.");
        }
    };

    console.log(classDetail?.timeTable)

    console.log(startYearWeek.week)

    const listTimetableByWeek = (listTimetable, week) => {
        return listTimetable.filter(schedule => schedule.week === week);
    };

    console.log(listTimetableByWeek(classDetail?.timeTable || [], startYearWeek.week));

    return (
        <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
            <div className="flex space-x-4 mb-6">
                <div className="w-1/2">
                    <label className="font-semibold text-lg">Chọn khối:</label>
                    <select
                        className="border p-2 rounded w-full mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={(e) => {
                            setSelectedBlock(e.target.value);
                            setSelectedClass(null);
                        }}
                        value={selectedBlock || ""}
                    >
                        <option value="">-- Chọn khối --</option>
                        {blocks.map((block) => (
                            <option key={block._id} value={block._id}>
                                {block.nameBlock}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-1/2">
                    <label className="font-semibold text-lg">Chọn lớp:</label>
                    <select
                        className="border p-2 rounded w-full mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={(e) => setSelectedClass(e.target.value)}
                        value={selectedClass || ""}
                    >
                        <option value="">-- Chọn lớp --</option>
                        {blocks
                            .find((block) => block._id === selectedBlock)
                            ?.classIds.map((classItem) => (
                                <option key={classItem._id} value={classItem._id}>
                                    {classItem.nameClass}
                                </option>
                            ))}
                    </select>
                </div>
            </div>
            {selectedClass && (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    {/* <h2 className="font-bold text-2xl mb-4 text-indigo-700">
                        {blocks.find((block) => block._id === selectedBlock)?.classIds.find((cls) => cls._id === selectedClass)?.nameClass}
                    </h2> */}
                    <div className="mb-4 flex items-center space-x-4">
                        <button
                            onClick={() => handleWeekChange(-1)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-1 px-2 rounded"
                        >
                            Tuần trước
                        </button>
                        <select
                            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={startWeek || ""}
                            onChange={handleStartWeekChange}
                        >
                            <option value="">-- Chọn tuần --</option>
                            {Array.from({ length: 52 }).map((_, idx) => {
                                const year = new Date().getFullYear();
                                const week = idx + 1;
                                return (
                                    <option key={week} value={`${year}-W${week}`}>
                                        Tuần {week} - Năm {year}
                                    </option>
                                );
                            })}
                        </select>
                        <button
                            onClick={() => handleWeekChange(1)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-1 px-2 rounded"
                        >
                            Tuần sau
                        </button>
                    </div>
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

                    <table className="table-auto w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-indigo-100">
                                <th className="border px-4 py-2 text-indigo-700">Tiết học</th>
                                {daysOfWeek.map((day, idx) => (
                                    <th key={idx} className="border px-4 py-2 text-indigo-700">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {timeSlots.map((slot, slotIndex) => (
                                <tr key={slotIndex} className="hover:bg-indigo-50 transition duration-200">
                                    <td className="border px-4 py-2">{slot.slot}</td>
                                    {daysOfWeek.map((day, dayIndex) => {
                                        // Lọc danh sách ngày trong tuần
                                        const timetableByWeek = listTimetableByWeek(classDetail?.timeTable || [], startYearWeek.week) || [];
                                        const allDays = timetableByWeek.flatMap(schedule => schedule.scheduleIds || []);
                                        // Tìm dữ liệu ngày
                                        const currentDay = allDays.find(d => d.dayOfWeek === day) || { slots: [] };
                                        // Tìm slot hiện tại
                                        const currentSchedule = currentDay.slots.find(
                                            s => s.slotNumber === parseInt(slot.slot.replace('Tiết ', ''))
                                        );

                                        // const cleanSchedule = currentSchedule.filter(item => item !== undefined);
                                        console.log(currentSchedule);
                                        return (
                                            <td key={dayIndex} className="border px-4 py-2">
                                                {currentSchedule ? (
                                                    // Nếu có dữ liệu, hiển thị thông tin
                                                    // <div className="text-green-600">
                                                    //     <p>{currentSchedule.subjectId?.nameSubject || "Không xác định"}</p>
                                                    //     <p>Giáo viên: {currentSchedule.teacherId || "N/A"}</p>
                                                    // </div>
                                                    <div>
                                                    <select
                                                        name="currentScheduleSelect"
                                                        id="currentScheduleSelect"
                                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        value={JSON.stringify({
                                                            subjectId: currentSchedule.subjectId._id,
                                                            subjectChuyendeId: currentSchedule.subjectId.subjectChuyendeId?._id,
                                                        })}
                                                        onChange={(e) => handleSelectSlot(selectedClass, day, slot.slot, e.target.value)}
                                                    >
                                                        {/* <option value="">Chọn môn</option> */}
                                                        {classDetail?.subjectGroup?.SubjectsId.map((subject, index) => (
                                                            <option
                                                                key={index}
                                                                value={JSON.stringify({
                                                                    subjectId: subject._id,
                                                                    subjectChuyendeId: subject?.subjectChuyendeId?._id,
                                                                })}
                                                            >
                                                                {subject?.nameSubject} - {subject?.teacherId?.name}
                                                            </option>
                                                        ))}
                                                        {classDetail?.subjectGroup?.SubjectsChuyendeId.map((subject, index) => (
                                                            <option
                                                                key={index}
                                                                value={JSON.stringify({
                                                                    subjectId: subject._id,
                                                                    subjectChuyendeId: subject?.subjectChuyendeId?._id,
                                                                })}
                                                            >
                                                                {subject?.nameSubject} - {subject?.teacherId?.name}
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
                                                        {/* {console.log(schedule[selectedClass]?.[day]?.[slot.slot]
                                                            ? JSON.stringify(schedule[selectedClass]?.[day]?.[slot.slot])
                                                            : "")}
                                                        {console.log("Dropdown value for slot:", slot.slot, "Day:", day, "Value:", schedule[selectedClass]?.[day]?.[slot.slot])} */}
                                                        <option value="">Chọn môn</option>
                                                        {classDetail?.subjectGroup?.SubjectsId.map((subject, index) => (
                                                            <option
                                                                key={index}
                                                                value={JSON.stringify({ subjectId: subject._id, subjectChuyendeId: subject?.subjectChuyendeId?._id })}
                                                            >
                                                                {subject?.nameSubject} - {subject?.teacherId?.name}
                                                            </option>
                                                        ))}
                                                        {classDetail?.subjectGroup?.SubjectsChuyendeId.map((subject, index) => (
                                                            <option
                                                                key={index}
                                                                value={JSON.stringify({ subjectId: subject._id, subjectChuyendeId: subject?.subjectChuyendeId?._id })}
                                                            >
                                                                {subject?.nameSubject} - {subject?.teacherId?.name}
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
            )}
            {selectedClass && (
                <div className="mt-6 text-center">
                    <button
                        onClick={handleSaveSchedule}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded shadow-lg transition duration-200"
                    >
                        Save Schedule
                    </button>
                    {Object.keys(schedule).length > 0 && (
                        <p className="mt-4 text-green-600">Schedule saved successfully!</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageSchedule;
