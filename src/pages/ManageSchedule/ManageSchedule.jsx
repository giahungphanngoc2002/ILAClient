import React, { useEffect, useState } from "react";
import * as BlockService from "../../services/BlockService";
import * as ClassService from "../../services/ClassService";

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


const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

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
            if (!selectedClass) {
                return;  // Không gọi API nếu selectedClass là null
            }
            try {
                const classData = await ClassService.getDetailClass(selectedClass);
                setClassDetail(classData?.data);
            } catch (error) {
                console.error("Error fetching class details:", error);
            }
        };

        fetchClassDetail();
    }, [selectedClass]);

    // Hàm tách year và week từ giá trị week
    const getYearAndWeekFromValue = (weekValue) => {
        const [year, week] = weekValue.split('-W');
        return { year, week };
    };

    const handleStartWeekChange = (e) => {
        const startWeekValue = e.target.value;
        setStartWeek(startWeekValue);
        const yearWeek = getYearAndWeekFromValue(startWeekValue);
        setStartYearWeek(yearWeek);
    };

    const handleEndWeekChange = (e) => {
        const endWeekValue = e.target.value;
        setEndWeek(endWeekValue);
        const yearWeek = getYearAndWeekFromValue(endWeekValue);
        setEndYearWeek(yearWeek);
    };

    console.log("Start Week:", startYearWeek.week);
    console.log("End Week:", endYearWeek.week);

    console.log(classDetail?.subjects)



    const handleSelectSlot = (classId, day, slot, subject) => {
        if (!subject) {
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
                    [slot]: subject,
                },
            },
        }));
    };

    return (
        <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
            {/* Chọn khối */}
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
                    <h2 className="font-bold text-2xl mb-4 text-indigo-700">
                        {blocks
                            .find((block) => block._id === selectedBlock)
                            ?.classIds.find((cls) => cls._id === selectedClass)?.nameClass}
                    </h2>

                    {/* Thời gian bắt đầu và kết thúc */}
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

                    {/* Hiển thị lịch */}
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
                                    {daysOfWeek.map((day, dayIndex) => (
                                        <td key={dayIndex} className="border px-4 py-2">
                                            <select
                                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                onChange={(e) =>
                                                    handleSelectSlot(selectedClass, day, slot.slot, e.target.value)
                                                }
                                                value={schedule[selectedClass]?.[day]?.[slot.slot] || ""}
                                            >
                                                <option value=""></option>
                                                {classDetail?.subjects.map((subject, index) => (
                                                    <option key={index} value={subject._id}>
                                                        {subject.nameSubject} - {subject.teacherId.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedClass && (
                <div className="mt-6 text-center">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded shadow-lg transition duration-200">
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
