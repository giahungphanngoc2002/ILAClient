import axios from "axios"

export const getAllSchedule = async() =>{
    const res =await axios.get (`http://localhost:3001/api/schedule/getAllSchedule`)
    return res.data
}

export const getAllScheduleByTeacherId = async (teacherId) => {
    const res = await axios.get(`http://localhost:3001/api/schedule/teacher/${teacherId}/schedules`);
    return res.data;
};

export const getAllAbsentStudentId = async (classId, scheduleId, slotId) => {
      const res = await axios.get(`http://localhost:3001/api/schedule/${classId}/${scheduleId}/${slotId}`);
      return res.data;  
  };
