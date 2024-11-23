import axios from "axios";



const SCORE_API_URL =
    process.env.NODE_ENV === "production"
        ? "https://ila-server-2-3bw0.onrender.com/api/score"
        : "http://localhost:3001/api/score";

// Tạo điểm
export const createScore = async (scoreData) => {
    const res = await axios.post(`${SCORE_API_URL}/createScore`, scoreData);
    return res.data;
};

// Lấy tất cả điểm theo môn học, lớp, học kỳ, và ID sinh viên
export const getAllScoresBySubject = async (subjectId, classId, semester, studentId) => {
    const res = await axios.get(
        `${SCORE_API_URL}/scores/${subjectId}/${classId}/${semester}/${studentId}`
    );
    return res.data;
};

// Lấy tất cả điểm theo môn học, lớp và học kỳ
export const getAllScoresBySubjectSemester = async (subjectId, classId, semester) => {
    const res = await axios.get(`${SCORE_API_URL}/scores/${subjectId}/${classId}/${semester}`);
    return res.data;
};

// Cập nhật điểm theo ID
export const updateScore = async (scoreId, updatedData) => {
    const res = await axios.put(`${SCORE_API_URL}/updateScore/${scoreId}`, updatedData);
    return res.data;
};

// Lấy tất cả điểm theo ID sinh viên và học kỳ
export const getAllScoreByStudentIdAndSemester = async (studentId, semester) => {
    const res = await axios.get(`${SCORE_API_URL}/scores/${studentId}/${semester}`);
    return res.data;
};
