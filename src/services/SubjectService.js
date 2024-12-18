import axios from "axios";



const SUBJECT_API_URL =
  process.env.NODE_ENV === "production"
    ? "https://ila-server-2-3bw0.onrender.com/api/subject"
    : "http://localhost:3001/api/subject";

// Tạo câu hỏi
export const createQuestion = async (classId, subjectId, questionData) => {
  const res = await axios.post(
    `${SUBJECT_API_URL}/classes/${classId}/subjects/${subjectId}/questions`,
    questionData
  );
  return res.data;
};

// Lấy tất cả câu hỏi cho một classId và subjectId cụ thể
export const getQuestions = async (classId, subjectId) => {
  const res = await axios.get(
    `${SUBJECT_API_URL}/classes/${classId}/subjects/${subjectId}/questions`
  );
  return res.data;
};

// Cập nhật câu hỏi theo questionId
export const updateQuestionById = async (classId, subjectId, questionId, questionData) => {
  const res = await axios.put(
    `${SUBJECT_API_URL}/classes/${classId}/subjects/${subjectId}/questions/${questionId}`,
    questionData
  );
  return res.data;
};

// Xóa câu hỏi theo questionId
export const deleteQuestionById = async (classId, subjectId, questionId) => {
  const res = await axios.delete(
    `${SUBJECT_API_URL}/classes/${classId}/subjects/${subjectId}/questions/${questionId}`
  );
  return res.data;
};

// Lấy chi tiết môn học
export const getDetailSubject = async (subjectId) => {
  const response = await axios.get(`${SUBJECT_API_URL}/detailSubject/${subjectId}`);
  return response.data;
};

// Lấy tất cả môn học
export const getAllSubjects = async () => {
  const res = await axios.get(`${SUBJECT_API_URL}/getAllSubjects`);
  return res.data;
};



export const getAllSemesterByYear = async (year) => {
  const res = await axios.get(`${SUBJECT_API_URL}/allSemester/${year}`);
  return res.data;
};

export const updateSemester = async (id, updateData) => {
  
    const res = await axios.put(`${SUBJECT_API_URL}/updateSemester/${id}`, updateData);
    return res.data; // Trả về dữ liệu phản hồi từ API
  
};


export const getAllSubjectbyBlock = async (block) => {
  const res = await axios.get(`${SUBJECT_API_URL}/getAllSubjects/${block}`);
  return res.data;
};

export const createEvaluate = async (classId, subjectId, evaluateData) => {
  const res = await axios.post(`${SUBJECT_API_URL}/createEvaluate/${classId}/${subjectId}`, evaluateData);
  return res.data;
};

export const updateEvaluate = async (classId, subjectId, evaluateId, semester, evaluateData) => {
  const res = await axios.put(
    `${SUBJECT_API_URL}/updateEvaluate/${classId}/${subjectId}/${evaluateId}/${semester}`, 
    evaluateData
  );
  return res.data;
};

export const getAllEvaluateSemester = async (classId, subjectId, semester) => {
  const res = await axios.get(
    `${SUBJECT_API_URL}/getAllEvaluateSemester/${classId}/${subjectId}/${semester}`
  );
  return res.data;
};
