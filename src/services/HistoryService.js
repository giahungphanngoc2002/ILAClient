import axios from "axios";

export const createHistory = async (historyData) => {
  try {
    const res = await axios.post(
      "http://localhost:3001/api/history/createHistory",
      historyData
    );
    return res.data;
  } catch (error) {
    console.error("Error creating history assignment:", error);
    throw error;
  }
};

export const getDetailHistory = async (id) => {
  const res = await axios.get(
    `http://localhost:3001/api/history/detailsHistory/${id}`
  );
  return res.data;
};

export const getAllHistory = async () => {
  const res = await axios.get(
    `http://localhost:3001/api/history/getAllHistory/`
  );
  return res.data;
};
