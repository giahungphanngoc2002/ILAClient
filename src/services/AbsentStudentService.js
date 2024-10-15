import axios from "axios"


export const createAbsentStudent = async ({ classId, scheduleId, slotId, studentIds }) => {
    return axios.post(`http://localhost:3001/api/absent/${classId}/${scheduleId}/${slotId}/createAbsent`, {
      studentIds,
    });
  };