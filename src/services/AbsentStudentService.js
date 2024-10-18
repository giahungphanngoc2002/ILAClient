import axios from "axios"


export const createAbsentStudent = async ({ classId, scheduleId, slotId, studentIds }) => {
    return axios.post(`http://localhost:3001/api/absent/${classId}/${scheduleId}/${slotId}/createAbsent`, {
      studentIds,
    });
  };

  export const updateAbsentStudent = async (absentId, studentId) => {
    const res = await axios.patch(`http://localhost:3001/api/absent/absent/${absentId}/${studentId}`);
    return res.data;
};

export const getAbsentId = async (classId, scheduleId, slotId) => {
  try {
    const res = await axios.get(`http://localhost:3001/api/absent/absent/${classId}/${scheduleId}/${slotId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching absent ID:", error);
    throw error; // Để hàm xử lý lỗi nếu cần
  }
};




