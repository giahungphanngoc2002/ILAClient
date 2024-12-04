import React, { useEffect, useState } from "react";
import * as BlockService from "../../services/BlockService";
import * as ClassService from "../../services/ClassService";
import * as ScheduleService from "../../services/ScheduleService";
import { toast } from "react-toastify";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useNavigate } from "react-router-dom";

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
    const [startYearWeek, setStartYearWeek] = useState({ year: "", week: "" });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchBlocks = async () => {
            setIsLoading(true); // Bắt đầu loading
            try {
                const blocksData = await BlockService.getAllBlocks();
                setBlocks(blocksData);
            } catch (error) {
                console.error("Error fetching blocks:", error);
            } finally {
                setIsLoading(false); // Kết thúc loading
            }
        };
        fetchBlocks();
    }, []);

    useEffect(() => {
        const fetchClassDetail = async () => {
            if (!selectedClass) return;
            setIsLoading(true);
            try {
                const classData = await ClassService.getDetailClass(selectedClass);
                setClassDetail(classData?.data);
            } catch (error) {
                console.error("Error fetching class details:", error);
            } finally {
                setIsLoading(false); // Kết thúc loading
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
        const { subjectId, subjectChuyendeId ,subjectPhuId } = JSON.parse(subjectData);
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

    const handleSaveSchedule = async () => {
        setIsLoading(true);
        try {
            const startWeekNumber = parseInt(startYearWeek.week, 10);
            let timetableId = classDetail?.timeTable?.find((schedule) => schedule.week === `${startWeekNumber}`)?._id || null;
            const scheduleData = {
                yearNumber: startYearWeek.year,
                weekNumber: startWeekNumber,
                days: daysOfWeek
                    .map((day) => {
                        const newSlots = timeSlots
                            .filter((slot) => schedule[selectedClass]?.[day]?.[slot.slot])
                            .map((slot) => {
                                const slotData = schedule[selectedClass]?.[day]?.[slot.slot];
                                return {
                                    slotNumber: parseInt(slot.slot.replace("Tiết ", "")),
                                    subjectId: slotData?.subjectId || null,
                                    classId: selectedClass,
                                    attendanceStatus: {
                                        createdAt: new Date().toISOString(),
                                        status: false,
                                    },
                                    absentStudentId: [],
                                };
                            });

                        if (newSlots.length > 0) {
                            let updatedSlots = [];
                            const existingDay = classDetail?.timeTable?.find(
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
            if (!scheduleData.days || scheduleData.days.length === 0) {
                setError("Schedule is empty, please select at least one subject per time slot.");
                toast.error("Chưa có sự thay đổi!.");
                return;
            }

            if (timetableId) {
                try {
                    await ScheduleService.updateScheduleByClassId(selectedClass, timetableId, scheduleData);
                    // Cập nhật lại classDetail sau khi cập nhật thời khóa biểu
                    const updatedClassData = await ClassService.getDetailClass(selectedClass);
                    setClassDetail(updatedClassData?.data);
                    setSchedule("") // Clear schedule state if update is successful
                    toast.success(`Thay đổi thành công tuần ${startWeekNumber}`);
                } catch (updateError) {
                    toast.error(`Error updating schedule for week ${startWeekNumber}`);
                }
            } else {
                try {
                    const response = await ScheduleService.createScheduleByClassId(selectedClass, scheduleData);
                    if (response?.data?.newTimeTable) {
                        timetableId = response.data.newTimeTable._id;
                        setClassDetail((prev) => ({
                            ...prev,
                            timeTable: [...(prev?.timeTable || []), response.data.newTimeTable],
                        }));
                    }
                    toast.success(`Created schedule for week ${startWeekNumber}`);
                } catch (createError) {
                    toast.error(`Error creating schedule for week ${startWeekNumber}`);
                }
            }
            setError("");
        } catch (error) {
            console.error("Error saving/updating schedule:", error);
            setError("An error occurred while processing the schedule.");
            toast.error("An error occurred while processing the schedule.");
        } finally {
            setIsLoading(false); // Kết thúc loading
        }
    };

    const listTimetableByWeek = (listTimetable, week) => {
        return listTimetable.filter(schedule => schedule.week === week);
    };

    const onBack = () => {
        window.history.back();
    }

    const goToCreateSchedule = (idClass) => {
        navigate(`/manage/manageSchedule/createCalender/${idClass}`)
    }

    console.log(classDetail?.timeTable)


    return (
        <div className="h-screen p-6 bg-gray-100 rounded-lg">
            <Breadcrumb title="Quản lí thời khoá biểu" onBack={onBack} buttonText="Tạo mới" onButtonClick={() => goToCreateSchedule(classDetail?._id)} />
            <div className="pt-12"></div>
            {isLoading && <div className="absolute top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center z-10"><span className="text-white text-xl">Đang tải...</span></div>}
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
                    <div className="mb-4 flex items-center justify-center space-x-4">
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
                                        const timetableByWeek = listTimetableByWeek(classDetail?.timeTable || [], startYearWeek.week) || [];
                                        const allDays = timetableByWeek.flatMap(schedule => schedule.scheduleIds || []);
                                        const currentDay = allDays.find(d => d.dayOfWeek === day) || { slots: [] };
                                        const currentSchedule = currentDay.slots.find(
                                            s => s.slotNumber === parseInt(slot.slot.replace('Tiết ', ''))
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
                                                            {classDetail?.subjectGroup?.SubjectsId.map((subject, index) => (
                                                                <option
                                                                    key={index}
                                                                    value={JSON.stringify({
                                                                        subjectId: subject._id,
                                                                       
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
                                                                       
                                                                    })}
                                                                >
                                                                    {subject?.nameSubject} - {subject?.teacherId?.name}
                                                                </option>
                                                            ))}
                                                            {classDetail?.subjectGroup?.SubjectsPhuId.map((subject, index) => (
                                                                <option
                                                                    key={index}
                                                                    value={JSON.stringify({
                                                                        subjectId: subject._id,
                                                                       
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
                                                        {classDetail?.subjectGroup?.SubjectsPhuId.map((subject, index) => (
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
                <div className="mt-6 text-center bg-gray-100">
                    <button
                        onClick={handleSaveSchedule}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded shadow-lg transition duration-200"
                    >
                        Hoàn thành thay đổi
                    </button>
                </div>
            )}
        </div>
    );
};

export default ManageSchedule;
