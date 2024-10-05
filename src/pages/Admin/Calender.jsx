import React, { useState } from 'react';
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";

const Calendar = () => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // Track week offset

  const scheduleData = [
    { day: 'Thứ hai', date: '30/09/2024', slot: 1, subject: 'Toán', class: 'Lớp 10/1', status: true },
    { day: 'Thứ hai', date: '30/09/2024', slot: 3, subject: 'Văn', class: 'Lớp 11/2', status: true },
    { day: 'Thứ hai', date: '30/09/2024', slot: 4, subject: 'Anh', class: 'Lớp 10/3', status: false },
    { day: 'Thứ hai', date: '30/09/2024', slot: 5, subject: 'Hoá', class: 'Lớp 12/4', status: true },
    { day: 'Thứ ba', date: '01/10/2024', slot: 2, subject: 'Toán', class: 'Lớp 10/2', status: true },
    { day: 'Thứ ba', date: '01/10/2024', slot: 3, subject: 'Sinh', class: 'Lớp 11/4', status: false },
    { day: 'Thứ ba', date: '01/10/2024', slot: 6, subject: 'Sử', class: 'Lớp 12/5', status: true },
    { day: 'Thứ ba', date: '01/10/2024', slot: 8, subject: 'Địa', class: 'Lớp 11/1', status: true },
    { day: 'Thứ tư', date: '02/10/2024', slot: 1, subject: 'Lý', class: 'Lớp 12/3', status: false },
    { day: 'Thứ tư', date: '02/10/2024', slot: 4, subject: 'Sinh', class: 'Lớp 11/3', status: true },
    { day: 'Thứ tư', date: '02/10/2024', slot: 5, subject: 'Hoá', class: 'Lớp 12/2', status: false },
    { day: 'Thứ năm', date: '03/10/2024', slot: 1, subject: 'Anh', class: 'Lớp 10/2', status: true },
    { day: 'Thứ năm', date: '03/10/2024', slot: 2, subject: 'Văn', class: 'Lớp 12/1', status: true },
    { day: 'Thứ năm', date: '03/10/2024', slot: 4, subject: 'Toán', class: 'Lớp 11/4', status: false },
    { day: 'Thứ năm', date: '03/10/2024', slot: 6, subject: 'Sinh', class: 'Lớp 12/3', status: true },
    { day: 'Thứ năm', date: '03/10/2024', slot: 8, subject: 'Sử', class: 'Lớp 10/3', status: false },
    { day: 'Thứ sáu', date: '04/10/2024', slot: 1, subject: 'Toán', class: 'Lớp 11/1', status: false },
    { day: 'Thứ sáu', date: '04/10/2024', slot: 5, subject: 'Hoá', class: 'Lớp 12/6', status: false },
    { day: 'Thứ sáu', date: '04/10/2024', slot: 6, subject: 'Anh', class: 'Lớp 10/4', status: false },
    { day: 'Thứ sáu', date: '04/10/2024', slot: 9, subject: 'Lý', class: 'Lớp 11/2', status: false },
    { day: 'Thứ bảy', date: '05/10/2024', slot: 2, subject: 'Địa', class: 'Lớp 12/4', status: false },
    { day: 'Thứ bảy', date: '05/10/2024', slot: 3, subject: 'Sử', class: 'Lớp 10/1', status: false },
    { day: 'Thứ bảy', date: '05/10/2024', slot: 7, subject: 'Hoá', class: 'Lớp 11/4', status: false },
    { day: 'Thứ bảy', date: '05/10/2024', slot: 8, subject: 'Sinh', class: 'Lớp 12/3', status: false },
    { day: 'Chủ nhật', date: '06/10/2024', slot: 1, subject: 'Anh', class: 'Lớp 11/2', status: false },
    { day: 'Chủ nhật', date: '06/10/2024', slot: 4, subject: 'Toán', class: 'Lớp 10/3', status: false },
    { day: 'Chủ nhật', date: '06/10/2024', slot: 5, subject: 'Sinh', class: 'Lớp 12/1', status: false },
  ];

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
      (cls) => cls.date === formattedDate && cls.slot === slotIndex + 1
    );

    if (classData && slotDate < currentDateTime && !classData.status) {
      return { ...classData, isMissed: true }; 
    }

    if (classData && slotDate >= currentDateTime) {
      return { ...classData, isMissed: false };
    }

    return classData;
  };

  return (
    <div className="container mx-auto p-4">

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
                  className={`py-3 border-b border-gray-300 ${classData ? (classData.status ? 'bg-green-100' : (classData.isMissed ? 'bg-red-100' : 'bg-white')) : 'bg-white'
                    } rounded-lg shadow-sm my-1 h-16 flex items-center justify-center`}
                >
                  {classData ? (
                    <div className="text-xs text-gray-700 w-full h-full flex flex-col items-center justify-center">
                      <div className="font-bold text-blue-800">{classData.subject}</div>
                      <div>{classData.class}</div>
                      <div className={`text-${classData.status ? 'green' : (classData.isMissed ? 'red' : 'gray')}-600`}>
                        {classData.status ? 'Hoàn thành' : (classData.isMissed ? 'Bỏ lỡ' : 'Sắp đến')}
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
    </div>
  );
};

export default Calendar;
