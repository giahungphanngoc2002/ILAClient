import axios from "axios";


export const createExamSchedule = async (data) => {
    const res = await axios.post(`http://localhost:3001/api/exam/createExamSchedule`, data)
    return res.data
}

export const getAllExamSchedules = async () => {
    const res = await axios.get(`http://localhost:3001/api/exam/getAllExamSchedule`)
    return res.data
}