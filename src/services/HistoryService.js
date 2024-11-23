import axios from "axios";



const TEST_API_URL =
  process.env.NODE_ENV === "production"
    ? "https://ila-server-2-3bw0.onrender.com/api/history"
    : "http://localhost:3001/api/history";

// Tạo lịch sử
export const createHistory = async (historyData) => {
  try {
    const res = await axios.post(`${HISTORY_API_URL}/createHistory`, historyData);
    return res.data;
  } catch (error) {
    console.error("Error creating history assignment:", error);
    throw error;
  }
};

// Lấy chi tiết lịch sử theo ID
export const getDetailHistory = async (id) => {
  const res = await axios.get(`${HISTORY_API_URL}/detailsHistory/${id}`);
  return res.data;
};

// Lấy tất cả lịch sử
export const getAllHistory = async () => {
  const res = await axios.get(`${HISTORY_API_URL}/getAllHistory`);
  return res.data;
};
