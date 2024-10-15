import React, { useState, useEffect } from 'react';
import { GrNext, GrPrevious } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';
import * as ClassService from "../../services/ClassService";
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
const Calendar = ({ onClassClick }) => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [scheduleData, setScheduleData] = useState([]);
  const [scheduleData1, setScheduleData1] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const user = useSelector((state) => state.user);
  const [teacherId, setTeacherId] = useState(user?.id); 
  const navigate = useNavigate();
 
  
  useEffect(() => {
    setTeacherId(user?.id); // Update teacherId whenever user changes
}, [user]);

console.log("teacherID",teacherId)


useEffect(() => {
  const fetchSchedule = async () => {
    setIsLoading(true);
    try {
      const data = await ClassService.getAllScheduleForTeacherId(teacherId);
      setScheduleData(data); 
      setIsError(false);

     
      if (data && data.length > 0) {
        const scheduleIds = data.map(schedule => schedule._id); 
        console.log('Schedule IDs:', scheduleIds);
        setScheduleData1(scheduleIds) 
      }

    } catch (error) {
      setIsError(true);
      console.error('Error fetching schedule data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (teacherId) {
    fetchSchedule();
  }
}, [teacherId]);

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
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1 + (weekOffset * 7)));
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

    console.log('class',classData)
  
    if (classData) {
      const slotData = classData.slots.find(slot => slot.slotNumber === slotIndex + 1);
      
      // Extract the `scheduleId`
      const scheduleId = classData._id;  
      
      if (slotData) {
        const isCompleted = classData.status;
  
        if (slotDate < currentDateTime && !isCompleted) {
          return { ...slotData, scheduleId, isMissed: true };
        }
  
        if (slotDate >= currentDateTime && !isCompleted) {
          return { ...slotData, scheduleId, isMissed: false };
        }
  
        return { ...slotData, scheduleId, isCompleted };
      }
    }
  
    return null;
  };

  
 


  const goToClass = (idClass, idSchedule, idSlot,idSubject,semester) => {
    navigate(`/teacher/calender/${idClass}/${idSchedule}/${idSlot}/${idSubject}/${semester}`);
  };
  

  return (
    <div className="container mx-auto p-4">
      {isLoading && <div>Loading schedule...</div>}
      {isError && <div>Error loading schedule. Please try again later.</div>}

      {!isLoading && !isError && (
        <div className="grid grid-cols-8 gap-2 bg-gray-100 shadow-lg p-4 rounded-lg overflow-hidden">
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

          {days.map((day, index) => (
            <div key={index} className="col-span-1">
              <div className="font-bold text-center text-white bg-blue-500 p-2 rounded-lg mb-2 shadow-sm text-xs">
                {day} <br />
                <span className="text-xs">{weekDates[index]}</span>
              </div>
              {slotTimes.map((slot, i) => {
                const classData = getScheduleForDay(day, i);
                console.log('class',classData)
                return (
                  <div
                    key={i}
                    className={`py-3 border-b border-gray-300 ${classData ?
                      (classData.isCompleted ? 'bg-green-100' : (classData.isMissed ? 'bg-red-100' : 'bg-yellow-100'))
                      : 'bg-white'} rounded-lg shadow-sm my-1 h-16 flex items-center justify-center`}
                  >
                   <button onClick={() => goToClass(classData.classId._id, classData.scheduleId, classData._id,classData.subjectId._id,classData.subjectId.semester)}>

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
                    </button>
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
