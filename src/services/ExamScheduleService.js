import axios from "axios";



const EXAM_API_URL =
    process.env.NODE_ENV === "production"
        ? "https://ila-server-2-3bw0.onrender.com/api/exam"
        : "http://localhost:3001/api/exam";

// Tạo lịch thi
export const createExamSchedule = async (data) => {
    const res = await axios.post(`${EXAM_API_URL}/createExamSchedule`, data);
    return res.data;
};

export const deleteExamSchedule = async (examScheduleId) => {
    const res = await axios.delete(`${EXAM_API_URL}/deleteExamSchedule/${examScheduleId}`);
    return res.data;
};

export const updateExamSchedule = async (examScheduleId) => {
    const res = await axios.put(`${EXAM_API_URL}/updateExamSchedule/${examScheduleId}`);
    return res.data;
};

// Lấy tất cả lịch thi
export const getAllExamSchedules = async () => {
    const res = await axios.get(`${EXAM_API_URL}/getAllExamSchedule`);
    return res.data;
};

// Lấy lịch thi theo khối
export const getAllExamScheduleByBlock = async (blockId) => {
    const res = await axios.get(`${EXAM_API_URL}/getAllExamScheduleByBlock`, {
        params: { blockId },
    });
    return res.data;
};
