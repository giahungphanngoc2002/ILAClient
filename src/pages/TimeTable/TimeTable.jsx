import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // Assuming you're using redux for state management
import * as ClassService from "../../services/ClassService";
import { GrPrevious, GrNext } from 'react-icons/gr';

export default function TimeTable() {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [userClass, setUserClass] = useState(null);
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const user = useSelector((state) => state.user);

    const slotTimes = [
        { start: '07:00', end: '08:00' },
        { start: '08:00', end: '09:00' },
        { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
        { start: '11:00', end: '12:00' },
        { start: '13:00', end: '14:00' },
        { start: '14:00', end: '15:00' },
        { start: '15:00', end: '16:00' },
        { start: '16:00', end: '17:00' },
        { start: '17:00', end: '18:00' }
    ];

    const daysOfWeek = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'];

    const getWeekDates = (date) => {
        const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay() + 1));
        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const nextDay = new Date(startOfWeek);
            nextDay.setDate(startOfWeek.getDate() + i);
            weekDates.push(nextDay);
        }
        return weekDates;
    };

    const currentWeekDates = getWeekDates(new Date(currentWeek));

    useEffect(() => {
        const fetchSchedule = async () => {
            setIsLoading(true);
            try {
                const data = await ClassService.getAllClass();
                const userClass = data.data.find(cls =>
                    cls.studentID.some(student => student._id === user.id)
                );
                if (userClass) {
                    setUserClass(userClass);
                } else {
                    console.error('User class not found');
                }
                setIsError(false);
            } catch (error) {
                setIsError(true);
                console.error('Error fetching schedule data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSchedule();
    }, [user.id, currentWeek, selectedYear]);

    const handlePreviousWeek = () => {
        const newDate = new Date(currentWeek);
        newDate.setDate(currentWeek.getDate() - 7);
        setCurrentWeek(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(currentWeek);
        newDate.setDate(currentWeek.getDate() + 7);
        setCurrentWeek(newDate);
    };

    const handleYearChange = (event) => {
        setSelectedYear(Number(event.target.value));
    };

    const getScheduleForDay = (day, slotIndex) => {
        if (!userClass || !userClass.schedule) return null;

        const daySchedule = userClass.schedule.find(sch =>
            new Date(sch.dayOfWeek).getDate() === day.getDate() &&
            new Date(sch.dayOfWeek).getFullYear() === selectedYear
        );

        if (daySchedule) {
            return daySchedule.slots.find(slot => slot.slotNumber === slotIndex + 1);
        }
        return null;
    };

    console.log(userClass)

    return (
        <div className="container mx-auto p-4">
            {isLoading && <div>Loading schedule...</div>}
            {isError && <div>Error loading schedule. Please try again later.</div>}

            <div className="mb-4">
                <label htmlFor="year-select" className="mr-2 font-semibold">Filter by Year:</label>
                <select
                    id="year-select"
                    value={selectedYear}
                    onChange={handleYearChange}
                    className="p-2 border border-gray-300 rounded-lg shadow-lg focus:ring-2 focus:ring-blue-400"
                >
                    {[2022, 2023, 2024, 2025].map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            {!isLoading && !isError && (
                <div className="grid grid-cols-8 gap-2 bg-gray-100 shadow-lg p-4 rounded-lg overflow-hidden">
                    <div className="col-span-1">
                        <div className="flex justify-between mb-4">
                            <button onClick={handlePreviousWeek} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 hover:shadow-md transition">
                                <GrPrevious />
                            </button>
                            <button onClick={handleNextWeek} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 hover:shadow-md transition">
                                <GrNext />
                            </button>
                        </div>
                        {slotTimes.map((slot, i) => (
                            <div key={i} className="py-3 border-b border-gray-300 text-center font-bold bg-blue-50 rounded-lg shadow-sm text-sm my-1 h-16 flex items-center justify-center">
                                <div>
                                    <div>Slot {i + 1}</div>
                                    <div className="text-xs text-gray-500">{slot.start} - {slot.end}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {currentWeekDates.map((day, index) => (
                        <div key={index} className="col-span-1">
                            <div className="font-bold text-center text-white bg-blue-500 p-2 rounded-lg mb-2 shadow-sm text-xs">
                                {daysOfWeek[index]} <br />
                                <span className="text-xs">{day.toLocaleDateString()}</span>
                            </div>
                            {slotTimes.map((slot, i) => {
                                const classData = getScheduleForDay(day, i);
                                return (
                                    <div
                                        key={i}
                                        className={`py-3 border-b border-gray-300 ${classData ?
                                            (classData.isCompleted ? 'bg-green-100 hover:bg-green-200' : 'bg-yellow-100 hover:bg-yellow-200') : 'bg-white hover:bg-gray-200'} rounded-lg shadow-sm my-1 h-16 flex items-center justify-center transition-all duration-300`}
                                    >
                                        {classData ? (
                                            <button
                                                onClick={() => console.log('Navigate to class', classData.classId._id)}
                                                className="w-full h-full text-center"
                                            >
                                                <div className="text-xs text-gray-700 w-full h-full flex flex-col items-center justify-center">
                                                    <div className="font-bold text-blue-800">{classData.subjectId.nameSubject}</div>
                                                    <div>{classData.teacherId.name}</div>
                                                    <div className={`text-${classData.isCompleted ? 'green' : 'yellow'}-600`}>
                                                        {classData.isCompleted ? 'Hoàn thành' : 'Sắp đến'}
                                                    </div>
                                                </div>
                                            </button>
                                        ) : (
                                            <div className="text-center text-gray-400">Trống</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
