import axios from "axios";


const ABSENT_API_URL =
  process.env.NODE_ENV === "production"
    ? "https://ila-server-2-3bw0.onrender.com/api/absent"
    : "http://localhost:3001/api/absent";

// Tạo danh sách sinh viên vắng mặt
export const createAbsentStudent = async ({ classId, scheduleId, slotId, studentIds }) => {
  return axios.post(`${ABSENT_API_URL}/${classId}/${scheduleId}/${slotId}/createAbsent`, {
    studentIds,
  });
};

// Cập nhật sinh viên vắng mặt
export const updateAbsentStudent = async (absentId, studentId) => {
  const res = await axios.patch(`${ABSENT_API_URL}/absent/${absentId}/${studentId}`);
  return res.data;
};

// Lấy ID vắng mặt
export const getAbsentId = async (classId, scheduleId, slotId) => {
  try {
    const res = await axios.get(`${ABSENT_API_URL}/absent/${classId}/${scheduleId}/${slotId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching absent ID:", error);
    throw error;
  }
};
