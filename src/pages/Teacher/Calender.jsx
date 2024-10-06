import React, { useState, useEffect } from 'react';
import { GrNext, GrPrevious } from "react-icons/gr";
import axios from 'axios';

const Calendar = () => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // Track week offset
  const [scheduleData, setScheduleData] = useState([]); // State to store fetched schedule data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isError, setIsError] = useState(false); // Error state

  // Fetch schedule data from the API
  const getAllSchedule = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/schedule/getAllSchedule');
      return res.data;
    } catch (error) {
      setIsError(true);
      console.error('Error fetching schedule data:', error);
    }
  };

  useEffect(() => {
    // Fetch schedule data on component mount
    const fetchSchedule = async () => {
      setIsLoading(true);
      const data = await getAllSchedule();
      if (data) {
        setScheduleData(data.data); // Assuming API returns data in `data.data`
        setIsError(false);
      }
      setIsLoading(false);
    };

    fetchSchedule();
  }, []);

  const days = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'];

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

  const getWeekDates = (weekOffset) => {
    const today = new Date();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1 + (weekOffset * 7))); // Get Monday

    const currentWeekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDayOfWeek);
      date.setDate(firstDayOfWeek.getDate() + i);
      const formattedDate = date.toLocaleDateString('en-GB');
      currentWeekDates.push(formattedDate);
    }
    return currentWeekDates;
  };

  const weekDates = getWeekDates(currentWeekOffset);

  const handlePreviousWeek = () => {
    setCurrentWeekOffset(currentWeekOffset - 1);
  };

  const handleNextWeek = () => {
    setCurrentWeekOffset(currentWeekOffset + 1);
  };

  const getScheduleForDay = (day, slotIndex) => {
    const formattedDate = weekDates[days.indexOf(day)];
    const currentDateTime = new Date();
    const [startHour, startMinute] = slotTimes[slotIndex].start.split(':').map(Number);
    const slotDate = new Date(formattedDate.split('/').reverse().join('-'));

    slotDate.setHours(startHour, startMinute);

    const classData = scheduleData.find(
      (cls) => new Date(cls.dayOfWeek).toLocaleDateString('en-GB') === formattedDate &&
               cls.slots.some(slot => slot.slotNumber === slotIndex + 1)
    );
    
    if (classData) {
      const slotData = classData.slots.find(slot => slot.slotNumber === slotIndex + 1);
    
      // Ensure that 'status' is treated as a boolean
      const isCompleted = Boolean(classData && classData.status);
    
      // If status is true (Hoàn thành)
      if (slotData && isCompleted) {
        return { ...slotData, isCompleted: true };
      }
    
      // If status is false and the time has passed, it's missed (Bỏ lỡ)
      if (slotData && slotDate < currentDateTime && !isCompleted) {
        return { ...slotData, isMissed: true };
      }
    
      // If status is false but the time hasn't passed yet, it's upcoming (Sắp đến)
      if (slotData && slotDate >= currentDateTime && !isCompleted) {
        return { ...slotData, isMissed: false };
      }
    
      return slotData;
    }
    
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Loading and Error States */}
      {isLoading && <div>Loading schedule...</div>}
      {isError && <div>Error loading schedule. Please try again later.</div>}

      {!isLoading && !isError && (
        <div className="grid grid-cols-8 gap-2 bg-gray-100 shadow-lg p-4 rounded-lg overflow-hidden">
          {/* Slot Column */}
          <div className="col-span-1">
            <div className="flex justify-between mb-4">
              <button onClick={handlePreviousWeek} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm">
                <GrPrevious />
              </button>
              <button onClick={handleNextWeek} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm">
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

          {/* Days Columns */}
          {days.map((day, index) => (
            <div key={index} className="col-span-1">
              <div className="font-bold text-center text-white bg-blue-500 p-2 rounded-lg mb-2 shadow-sm text-xs">
                {day} <br />
                <span className="text-xs">{weekDates[index]}</span> {/* Display corresponding date */}
              </div>
              {slotTimes.map((slot, i) => {
  const classData = getScheduleForDay(day, i);
  return (
    <div
      key={i}
      className={`py-3 border-b border-gray-300 ${classData ? 
        (classData.isCompleted ? 'bg-green-100' : (classData.isMissed ? 'bg-red-100' : 'bg-yellow-100')) 
        : 'bg-white'} 
        rounded-lg shadow-sm my-1 h-16 flex items-center justify-center`}
    >
      {classData ? (
        <div className="text-xs text-gray-700 w-full h-full flex flex-col items-center justify-center">
          <div className="font-bold text-blue-800">{classData.subjectId.nameSubject}</div>
          <div>{classData.classId.nameClass}</div>
          <div className={`text-${classData.isCompleted ? 'green' : (classData.isMissed ? 'red' : 'yellow')}-600`}>
  {classData.isCompleted ? 'Hoàn thành' : (classData.isMissed ? 'Bỏ lỡ' : 'Sắp đến')}
</div>
        </div>
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
};

export default Calendar;
