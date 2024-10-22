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

  export const getDetailScheduleById = async (scheduleId) => {
    const res = await axios.get(`http://localhost:3001/api/schedule/detailSchedule/${scheduleId}`);
    return res.data;
};

export const createAbsentstudentId = async (scheduleId,classId,slotId) => {
    const res = await axios.post(`http://localhost:3001/api/schedule/createAbsent/${scheduleId}/${classId}/${slotId}`);
    return res.data;
};

export const updateAbsentstudentId = async (scheduleId, classId, slotId, newAbsentStudentIds) => {
    // Chú ý: Đảm bảo rằng `newAbsentStudentIds` là một mảng
    const res = await axios.put(`http://localhost:3001/api/schedule/updateAbsent/${scheduleId}/${classId}/${slotId}`, {
        newAbsentStudentIds  // Đây phải là một mảng
    });
    return res.data;
};
