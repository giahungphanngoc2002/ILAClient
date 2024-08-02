import axios from "axios";

export const addQuestionByTestId = async (testId, questionData, timeTest) => {
  const res = await axios.post(
    `http://localhost:3001/api/test/test/${testId}/questions`,
    {
      newQuestions: questionData,
      timeTest: timeTest,
    }
  );
  return res.data;
};

export const getDetailTest = async (id) => {
  const res = await axios.get(
    `http://localhost:3001/api/test/detailsTest/${id}`
  );
  return res.data;
};

export const updateQuestionById = async (
  testId,
  questionId,
  updatedQuestion
) => {
  const res = await axios.put(
    `http://localhost:3001/api/test/test/${testId}/questions/${questionId}`,
    updatedQuestion
  );
  return res.data;
};

export const deleteQuestionById = async (testId, questionId) => {
  const res = await axios.delete(
    `http://localhost:3001/api/test/test/${testId}/questions/${questionId}`
  );
  return res.data;
};

export const addHistoryTest = async (testId, historyTestData) => {
  const res = await axios.post(
    `http://localhost:3001/api/test/test/${testId}/historyTest`,
    historyTestData
  );
  return res.data;
};

export const deleteTestByID = async (id) => {
  const res = await axios.delete(
    `http://localhost:3001/api/test/deleteTest/${id}`
  );
  return res.data;
};
