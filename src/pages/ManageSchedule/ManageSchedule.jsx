import React, { useState } from "react";

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
    { slot: "Tiêt 2" },
    { slot: "Tiêt 3" },
    { slot: "Tiêt 4" },
    { slot: "Tiêt 5" },
    { slot: "Tiêt 6" },
    { slot: "Tiêt 7" },
    { slot: "Tiêt 8" },
    { slot: "Tiêt 9" },
    { slot: "Tiêt 10" },

];

const subjects = [
    { name: "Toán", teacher: "GV1" },
    { name: "Văn", teacher: "GV2" },
    { name: "Anh", teacher: "GV3" },
    { name: "Hoá", teacher: "GV4" },
    { name: "Sử", teacher: "GV5" }
];

const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

const ManageSchedule = () => {
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [schedule, setSchedule] = useState({});
    const [error, setError] = useState("");
    const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);

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
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">TimeTable Scheduler</h1>

            <div className="mb-4">
                <label className="font-bold">Select a grade:</label>
                <select
                    className="border p-2 rounded w-full mt-2"
                    onChange={(e) => {
                        setSelectedGrade(e.target.value);
                        setSelectedClass(null);
                    }}
                    value={selectedGrade || ""}
                >
                    <option value="">-- Select a grade --</option>
                    <option value={10}>Grade 10</option>
                    <option value={11}>Grade 11</option>
                    <option value={12}>Grade 12</option>
                </select>
            </div>

            {selectedGrade && (
                <div className="mb-4">
                    <label className="font-bold">Select a class:</label>
                    <select
                        className="border p-2 rounded w-full mt-2"
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
                <div className="border p-4 rounded-lg">
                    <h2 className="font-bold text-lg mb-2">
                        {gradesData[selectedGrade].find((cls) => cls.id === Number(selectedClass))?.name}
                    </h2>
                    <div className="mb-4">
                        <label className="font-bold">Select a day:</label>
                        <select
                            className="border p-2 rounded w-full mt-2"
                            value={selectedDay}
                            onChange={(e) => setSelectedDay(e.target.value)}
                        >
                            {daysOfWeek.map((day, idx) => (
                                <option key={idx} value={day}>
                                    {day}
                                </option>
                            ))}
                        </select>
                    </div>

                    {timeSlots.map((slot, slotIndex) => (
                        <div
                            key={slotIndex}
                            className={`mt-2 w-full border p-2 rounded flex items-center ${
                                schedule[selectedClass]?.[selectedDay]?.[slot.slot]
                                    ? "bg-blue-100"
                                    : "bg-gray-100"
                            }`}
                        >
                            <span className="mr-2">⏰</span>
                            <div className="flex-grow">
                                <p className="font-semibold">{slot.slot}</p>
                                <select
                                    className="mt-1 border p-2 rounded w-full"
                                    onChange={(e) =>
                                        handleSelectSlot(selectedClass, selectedDay, slot.slot, e.target.value)
                                    }
                                    value={schedule[selectedClass]?.[selectedDay]?.[slot.slot] || ""}
                                >
                                    <option value="">Select a subject</option>
                                    {subjects.map((subject, idx) => (
                                        <option key={idx} value={subject.name}>
                                            {subject.name} - {subject.teacher}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-sm">
                                    Selected Subject:{" "}
                                    {schedule[selectedClass]?.[selectedDay]?.[slot.slot] || "None"}{" "}
                                    {error && <span className="text-red-500">{error}</span>}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedClass && (
                <div className="mt-4">
                    <button className="bg-blue-500 text-white p-2 rounded shadow">
                        Save Schedule
                    </button>
                    {Object.keys(schedule).length > 0 && (
                        <p className="mt-2 text-green-500">Schedule saved successfully!</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageSchedule;
