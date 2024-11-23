import axios from "axios";

const TEST_API_URL =
  process.env.NODE_ENV === "production"
    ? "https://ila-server-2-3bw0.onrender.com/api/test"
    : "http://localhost:3001/api/test";

// Thêm câu hỏi vào bài kiểm tra
export const addQuestionByTestId = async (testId, questionData, timeTest) => {
  const res = await axios.post(`${TEST_API_URL}/test/${testId}/questions`, {
    newQuestions: questionData,
    timeTest,
  });
  return res.data;
};

// Lấy chi tiết bài kiểm tra
export const getDetailTest = async (id) => {
  const res = await axios.get(`${TEST_API_URL}/detailsTest/${id}`);
  return res.data;
};

// Cập nhật câu hỏi theo ID
export const updateQuestionById = async (testId, questionId, updatedQuestion) => {
  const res = await axios.put(
    `${TEST_API_URL}/test/${testId}/questions/${questionId}`,
    updatedQuestion
  );
  return res.data;
};

// Xóa câu hỏi theo ID
export const deleteQuestionById = async (testId, questionId) => {
  const res = await axios.delete(`${TEST_API_URL}/test/${testId}/questions/${questionId}`);
  return res.data;
};

// Thêm lịch sử bài kiểm tra
export const addHistoryTest = async (testId, historyTestData) => {
  const res = await axios.post(
    `${TEST_API_URL}/test/${testId}/historyTest`,
    historyTestData
  );
  return res.data;
};

// Xóa bài kiểm tra theo ID
export const deleteTestByID = async (id) => {
  const res = await axios.delete(`${TEST_API_URL}/deleteTest/${id}`);
  return res.data;
};

// Cập nhật bài kiểm tra
export const updateTest = async (id, data) => {
  const res = await axios.put(`${TEST_API_URL}/updateTest/${id}`, data);
  return res.data;
};
