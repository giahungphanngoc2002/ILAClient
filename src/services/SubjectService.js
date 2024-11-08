import axios from "axios";

// Tạo câu hỏi
export const createQuestion = async (classId, subjectId, questionData) => {
    const res = await axios.post(
      `http://localhost:3001/api/subject/classes/${classId}/subjects/${subjectId}/questions`,
      questionData
    );
    return res.data;
  };
  
  // Lấy tất cả câu hỏi cho một classId và subjectId cụ thể
  export const getQuestions = async (classId, subjectId) => {
    const res = await axios.get(
      `http://localhost:3001/api/subject/classes/${classId}/subjects/${subjectId}/questions`
    );
    return res.data;
  };
  
  // Cập nhật câu hỏi theo questionId
  export const updateQuestionById = async (classId, subjectId, questionId, questionData) => {
    const res = await axios.put(
      `http://localhost:3001/api/subject/classes/${classId}/subjects/${subjectId}/questions/${questionId}`,
      questionData
    );
    return res.data;
  };
  
  // Xóa câu hỏi theo questionId
  export const deleteQuestionById = async (classId, subjectId, questionId) => {
    const res = await axios.delete(
      `http://localhost:3001/api/subject/classes/${classId}/subjects/${subjectId}/questions/${questionId}`
    );
    return res.data;
  };