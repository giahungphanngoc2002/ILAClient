import React, { useState, useEffect } from 'react';
import { GrNext, GrPrevious } from "react-icons/gr";
import { useNavigate, useParams } from 'react-router-dom';
import * as ScheduleService from "../../services/ScheduleService";
import { useSelector } from 'react-redux';
import moment from 'moment';

import InfoNoteBook from '../InfoNoteBook/InfoNoteBook';

const ManageNoteBook = ({ }) => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [scheduleData, setScheduleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { idClass } = useParams();
  const [modalData, setModalData] = useState({ show: false, idSchedule: null, idSlot: null }); // Modal state
  console.log(idClass)
  console.log(modalData)
  useEffect(() => {
    const fetchSchedule = async () => {
      setIsLoading(true);
      try {
        const data = await ScheduleService.getAllScheduleByClassId(idClass);
        console.log("API Data:", data); // Log dữ liệu trả về từ API
        setScheduleData(data || []);
        setIsError(false);
      } catch (error) {
        setIsError(true);
        console.error('Error fetching schedule data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (idClass) {
      fetchSchedule();
    }
  }, [idClass]);

  console.log(scheduleData)

  useEffect(() => {
    const today = new Date();
    if (selectedYear === today.getFullYear()) {
      const currentWeek = moment(today).isoWeek();
      setCurrentWeekOffset(currentWeek - moment(new Date(selectedYear, 0, 1)).isoWeek());
    } else {
      setCurrentWeekOffset(0);
    }
  }, [selectedYear]);

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

  const getWeekNumber = (date) => {
    return moment(date).isoWeek();
  };

  const getLastWeekNumberOfYear = (year) => {
    return moment(new Date(year, 11, 31)).isoWeeksInYear();
  };

  const getWeekDates = (weekOffset) => {
    const startOfWeek = moment().year(selectedYear).isoWeek(1).startOf('isoWeek').add(weekOffset, 'weeks');
    return Array.from({ length: 7 }, (_, i) => startOfWeek.clone().add(i, 'days').format('DD/MM/YYYY'));
  };

  const weekDates = getWeekDates(currentWeekOffset);
  const currentWeekNumber = getWeekNumber(moment(weekDates[0], 'DD/MM/YYYY'));


  const getScheduleForDay = (day, slotIndex) => {
    // Lọc dữ liệu dựa trên year, week và dayOfWeek
    const filteredScheduleData = scheduleData.filter(schedule => {
      return (
        schedule.year === String(selectedYear) &&
        schedule.week === String(currentWeekNumber) &&
        schedule.dayOfWeek === day
      );
    });

    // console.log("Filtered Schedule Data:", filteredScheduleData);

    // Lọc tiếp theo slotNumber
    const classData = filteredScheduleData.find(cls => cls.slots.slotNumber === slotIndex + 1);

    if (classData) {
      const slotData = classData.slots;
      const scheduleId = classData.scheduleId._id;
      const formattedDate = weekDates[days.indexOf(day)];
      const currentDateTime = new Date();
      const [startHour, startMinute] = slotTimes[slotIndex].start.split(':').map(Number);
      const slotDate = new Date(formattedDate.split('/').reverse().join('-'));
      slotDate.setHours(startHour, startMinute);

      const isCompleted = slotData.attendanceStatus?.status === true;

      // Xác định trạng thái của slot
      if (slotDate < currentDateTime && !isCompleted) {
        return { ...slotData, scheduleId, isMissed: true };
      }
      if (slotDate >= currentDateTime && !isCompleted) {
        return { ...slotData, scheduleId, isMissed: false };
      }

      return { ...slotData, scheduleId, isCompleted };
    }

    return null;
  };





  const handlePreviousWeek = () => {
    if (currentWeekOffset > 0) {
      setCurrentWeekOffset(currentWeekOffset - 1);
    }
  };

  const handleNextWeek = () => {
    const totalWeeksInYear = getLastWeekNumberOfYear(selectedYear);
    if (currentWeekOffset + 1 < totalWeeksInYear) {
      setCurrentWeekOffset(currentWeekOffset + 1);
    } else {
      console.log("Không thể tăng tuần, đây là tuần cuối cùng của năm");
    }
  };



  const goToInfoNoteBook = (idSchedule, idSlot) => {
    setModalData({ show: true, idSchedule, idSlot });
  };

  const closeModal = () => setModalData({ ...modalData, show: false });



  return (
    <div className="container mx-auto p-4">
      {isLoading && <div>Loading schedule...</div>}
      {isError && <div>Error loading schedule. Please try again later.</div>}

      {!isLoading && !isError && (
        <div>
          <div className="mb-4">
            <label htmlFor="yearFilter" className="mr-2">Chọn năm:</label>
            <select
              id="yearFilter"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="p-2 border border-gray-300 rounded-lg"
            >
              {Array.from({ length: new Date().getFullYear() - 2020 + 1 }, (_, i) => 2020 + i).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
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


                  return (
                    <div
                      key={i}
                      className={`py-3 border-b border-gray-300 ${classData ? (classData.isCompleted ? 'bg-green-100' : (classData.isMissed ? 'bg-red-100' : 'bg-yellow-100')) : 'bg-white'} rounded-lg shadow-sm my-1 h-16 flex items-center justify-center`}
                    >
                      {classData ? (
                        <button
                          onClick={() => {
                            if (classData?.scheduleId && classData?._id) {
                              goToInfoNoteBook(classData.scheduleId, classData._id);
                            } else {
                              console.error("Missing data:", { scheduleId: classData?.scheduleId, slotId: classData?._id });
                            }
                          }}

                        >
                          <div className="text-xs text-gray-700 w-full h-full flex flex-col items-center justify-center">
                            <div className="font-bold text-blue-800">{classData?.subjectDetails?.nameSubject}</div>
                            {/* <div>{classData.classDetails[0].nameClass}</div> */}
                            <div className={`text-${classData.isCompleted ? 'green' : (classData.isMissed ? 'red' : 'yellow')}-600`}>
                              {classData.isCompleted ? 'Hoàn thành' : (classData.isMissed ? 'Bỏ lỡ' : 'Sắp đến')}
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
        </div>
      )}
      <InfoNoteBook
        show={modalData.show}
        handleClose={closeModal}
        idSchedule={modalData.idSchedule}
        idSlot={modalData.idSlot}

      />
    </div>
  );
};

export default ManageNoteBook;