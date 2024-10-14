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
    { slot: "07:00 - 08:00" },
    { slot: "08:00 - 09:00" },
    { slot: "09:00 - 10:00" },
    { slot: "10:00 - 11:00" },
    { slot: "11:00 - 12:00"},
    { slot: "12:00 - 13:00"},
    { slot: "14:00 - 15:00"},
    { slot: "15:00 - 16:00"},
    { slot: "16:00 - 17:00"},
    { slot: "17:00 - 18:00"}
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
            <h1 className="text-2xl font-bold mb-4">TimeTable Scheduler</h1>

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
                    <h2 className="font-bold text-lg">
                        {gradesData[selectedGrade].find((cls) => cls.id === Number(selectedClass))?.name}
                    </h2>
                    <p>
                        Students:{" "}
                        {gradesData[selectedGrade].find((cls) => cls.id === Number(selectedClass))?.students}
                    </p>

                    {daysOfWeek.map((day, dayIndex) => (
                        <div key={dayIndex} className="mt-4">
                            <h3 className="font-semibold">{day}</h3>
                            <div className="flex flex-wrap">
                                {timeSlots.map((slot, slotIndex) => (
                                    <div
                                        key={slotIndex}
                                        className={`mt-2 w-full md:w-1/2 px-2 border p-2 rounded`}
                                    >
                                        <label className="block flex items-center">
                                            <span className="mr-2">⏰</span>
                                            {slot.slot}
                                        </label>
                                        <select
                                            className="mt-1 border p-2 rounded w-full"
                                            onChange={(e) =>
                                                handleSelectSlot(selectedClass, day, slot.slot, e.target.value)
                                            }
                                            value={schedule[selectedClass]?.[day]?.[slot.slot] || ""}
                                        >
                                            <option value="">Select a subject</option>
                                            {subjects.map((subject, idx) => (
                                                <option key={idx} value={subject.name}>
                                                    {subject.name} - {subject.teacher}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="mt-1">
                                            Selected Subject:{" "}
                                            {schedule[selectedClass]?.[day]?.[slot.slot] || "None"} {error && <span className="text-red-500">{error}</span>}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageSchedule;
