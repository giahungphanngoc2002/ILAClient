import axios from "axios"

export const createScore = async(scoreData) => {
    const res = await axios.post('http://localhost:3001/api/score/createScore', scoreData);
    return res.data; 
}

export const getAllScoresBySubject = async(subjectId, classId, semester ,studentId) => {
    const res = await axios.get(`http://localhost:3001/api/score/scores/${subjectId}/${classId}/${semester}/${studentId}`);
    return res.data; 
}