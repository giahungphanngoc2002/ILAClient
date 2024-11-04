import React, { useState } from "react";

const ExamScheduler = () => {
    const [exams, setExams] = useState([]);
    const [newExam, setNewExam] = useState({
        grade: "10",
        subject: "",
        date: "",
        timeStart: "",
        timeEnd: "",
        totalStudents: 200,
        maxPerRoom: 20,
    });

    // Handle adding a new exam with room distribution
    const addExam = () => {
        const { subject, date, timeStart, timeEnd, totalStudents, maxPerRoom } = newExam;
        if (!subject || !date || !timeStart || !timeEnd || !totalStudents || !maxPerRoom) {
            alert("Please fill in all fields.");
            return;
        }

        // Calculate number of rooms needed and distribute students
        const numRooms = Math.ceil(totalStudents / maxPerRoom);
        const rooms = Array.from({ length: numRooms }, (_, index) => ({
            roomNumber: `Room ${index + 1}`,
            students: Math.min(maxPerRoom, totalStudents - index * maxPerRoom),
        }));

        // Add the exam with room distribution
        setExams([...exams, { ...newExam, rooms }]);
        setNewExam({
            grade: "10", subject: "", date: "", timeStart: "", timeEnd: "", totalStudents: 0, maxPerRoom: 0,
        });
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewExam({ ...newExam, [name]: value });
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Exam Scheduler</h2>

            {/* New Exam Form */}
            <div className="space-y-4">
                <div>
                    <label className="block font-medium">Select Grade</label>
                    <select
                        name="grade"
                        value={newExam.grade}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded"
                    >
                        <option value="10">Grade 10</option>
                        <option value="11">Grade 11</option>
                        <option value="12">Grade 12</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium">Subject</label>
                    <input
                        type="text"
                        name="subject"
                        value={newExam.subject}
                        onChange={handleInputChange}
                        placeholder="Enter subject"
                        className="w-full border border-gray-300 p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={newExam.date}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">Time Start</label>
                    <input
                        type="time"
                        name="timeStart"
                        value={newExam.timeStart}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">Time End</label>
                    <input
                        type="time"
                        name="timeEnd"
                        value={newExam.timeEnd}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">Total Students</label>
                    <input
                        type="number"
                        name="totalStudents"
                        value={newExam.totalStudents}
                        onChange={handleInputChange}
                        placeholder="Enter total number of students"
                        className="w-full border border-gray-300 p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">Max Students per Room</label>
                    <input
                        type="number"
                        name="maxPerRoom"
                        value={newExam.maxPerRoom}
                        onChange={handleInputChange}
                        placeholder="Enter max students per room"
                        className="w-full border border-gray-300 p-2 rounded"
                    />
                </div>

                <button
                    onClick={addExam}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Add Exam
                </button>
            </div>

            {/* Exam List */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Exam Schedule</h3>
                {exams.length === 0 ? (
                    <p className="text-gray-500">No exams scheduled yet.</p>
                ) : (
                    <div className="space-y-4">
                        {exams.map((exam, index) => (
                            <div key={index} className="p-4 border border-gray-300 rounded-md">
                                <p className="text-gray-700">
                                    <span className="font-semibold">Grade:</span> {exam.grade}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Subject:</span> {exam.subject}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Date:</span> {exam.date}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Time Start:</span> {exam.timeStart}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Time End:</span> {exam.timeEnd}
                                </p>
                                
                                <div className="mt-4">
                                    <h4 className="font-semibold">Room Assignments:</h4>
                                    {exam.rooms.map((room, roomIndex) => (
                                        <p key={roomIndex} className="text-gray-700">
                                            {room.roomNumber}: {room.students} students
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamScheduler;
