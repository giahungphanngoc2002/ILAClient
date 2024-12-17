import axios from "axios";



const SCHEDULE_API_URL =
    process.env.NODE_ENV === "production"
        ? "https://ila-server-2-3bw0.onrender.com/api/schedule"
        : "http://localhost:3001/api/schedule";

// Lấy tất cả lịch học
export const getAllSchedule = async () => {
    const res = await axios.get(`${SCHEDULE_API_URL}/getAllSchedule`);
    return res.data;
};

// Lấy tất cả lịch học theo ID giáo viên
export const getAllScheduleByTeacherId = async (teacherId) => {
    const res = await axios.get(`${SCHEDULE_API_URL}/teacher/${teacherId}/schedules`);
    return res.data;
};

// Lấy tất cả lịch học theo ID sinh viên
export const getAllScheduleByStudentId = async (studentId) => {
    const res = await axios.get(`${SCHEDULE_API_URL}/student/${studentId}/schedules`);
    return res.data;
};

// Lấy danh sách sinh viên vắng mặt theo lớp, lịch học, và slot
export const getAllAbsentStudentId = async (classId, scheduleId, slotId) => {
    const res = await axios.get(`${SCHEDULE_API_URL}/${classId}/${scheduleId}/${slotId}`);
    return res.data;
};

// Lấy chi tiết lịch học theo ID lịch học
export const getDetailScheduleById = async (scheduleId) => {
    const res = await axios.get(`${SCHEDULE_API_URL}/detailSchedule/${scheduleId}`);
    return res.data;
};

// Lấy chi tiết slot theo ID lịch học và ID slot
export const getDetailSlotById = async (scheduleId, slotId) => {
    const res = await axios.get(`${SCHEDULE_API_URL}/schedule/${scheduleId}/slot/${slotId}`);
    return res.data;
};

// Tạo danh sách sinh viên vắng mặt
export const createAbsentstudentId = async (scheduleId, classId, slotId) => {
    const res = await axios.post(`${SCHEDULE_API_URL}/createAbsent/${scheduleId}/${classId}/${slotId}`);
    return res.data;
};

export const createNoteBookByClassAndScheduleId = async (classId, scheduleId, slotId, content, scoreClass) => {
    
      const res = await axios.post(
        `${SCHEDULE_API_URL}/createNoteBook/${classId}/${scheduleId}/${slotId}`,
        {
          content,
          scoreClass,
        }
      );
      return res.data; // Trả về kết quả từ server
     
  };

  export const getAllScheduleByClassId = async (classId) => {
    const res = await axios.get(`${SCHEDULE_API_URL}/getAllSchedule/${classId}`);
    return res.data;
};

// Cập nhật danh sách sinh viên vắng mặt
export const updateAbsentstudentId = async (scheduleId, classId, slotId, newAbsentStudents) => {
    const res = await axios.put(
        `${SCHEDULE_API_URL}/updateAbsent/${scheduleId}/${classId}/${slotId}`,
        { newAbsentStudents }
    );
    return res.data;
};

// Tạo lịch học theo ID lớp học
export const createScheduleByClassId = async (classId, scheduleData) => {
    const res = await axios.post(`${SCHEDULE_API_URL}/${classId}/schedules`, scheduleData);
    return res.data;
};

export const updateScheduleByClassId = async (classId, timeTableId, scheduleData) => {
    
        const res = await axios.put(
            `${SCHEDULE_API_URL}/${classId}/timetable/${timeTableId}`,
            scheduleData
        );
        return res.data;
    
};

export const getClassAndTimeTableByStudentId = async (studentId) => {
    const res = await axios.get(`${SCHEDULE_API_URL}/getAllTimeTable/${studentId}`);
    return res.data;
};
