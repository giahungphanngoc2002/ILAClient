import React, { useEffect, useState } from "react";
import * as BlockService from "../../services/BlockService";
const gradesData = {
    10: [
        { id: 1, name: "Lớp 10A", students: 30 },
        { id: 2, name: "Lớp 10B", students: 25 },
    ],
    11: [
        { id: 3, name: "Lớp 11A", students: 28 },
        { id: 4, name: "Lớp 11B", students: 32 },
    ],
    12: [
        { id: 5, name: "Lớp 12A", students: 26 },
        { id: 6, name: "Lớp 12B", students: 24 },
    ],
};

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

const subjects = [
    { name: "Toán", teacher: "GV1" },
    { name: "Văn", teacher: "GV2" },
    { name: "Anh", teacher: "GV3" },
    { name: "Hoá", teacher: "GV4" },
    { name: "Sử", teacher: "GV5" },
];

const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

const ManageSchedule = () => {
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [schedule, setSchedule] = useState({});
    const [error, setError] = useState("");
    const [blocks, setBlocks] = useState([]);

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
    console.log("blocks",blocks)


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
            {/* <h1 className="text-4xl font-bold mb-6 text-center text-indigo-600">Xếp thời khoá biểu</h1> */}

            <div className="mb-6">
                <label className="font-semibold text-lg">Chọn khối:</label>
                <select
                    className="border p-3 rounded w-full mt-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) => {
                        setSelectedGrade(e.target.value);
                        setSelectedClass(null);
                    }}
                    value={selectedGrade || ""}
                >
                    <option value="">-- Chọn khối --</option>
                    <option value={10}>Khối 10</option>
                    <option value={11}>Khối 11</option>
                    <option value={12}>Khối 12</option>
                </select>
            </div>

            {selectedGrade && (
                <div className="mb-6">
                    <label className="font-semibold text-lg">Chọn lớp:</label>
                    <select
                        className="border p-3 rounded w-full mt-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={(e) => setSelectedClass(e.target.value)}
                        value={selectedClass || ""}
                    >
                        <option value="">-- Select a class --</option>
                        {gradesData[selectedGrade].map((classItem) => (
                            <option key={classItem.id} value={classItem.id}>
                                {classItem.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {selectedClass && (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="font-bold text-2xl mb-4 text-indigo-700">
                        {gradesData[selectedGrade].find((cls) => cls.id === Number(selectedClass))?.name}
                    </h2>

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
                                                {subjects.map((subject, subIndex) => (
                                                    <option key={subIndex} value={subject.name}>
                                                        {subject.name} - {subject.teacher}
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
