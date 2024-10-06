import axios from "axios"

export const getAllSchedule = async() =>{
    const res =await axios.get (`http://localhost:3001/api/schedule/getAllSchedule`)
    return res.data
}