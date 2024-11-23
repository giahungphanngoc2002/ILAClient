import axios from "axios";



const TEST_API_URL =
  process.env.NODE_ENV === "production"
    ? "https://ila-server-2-3bw0.onrender.com/api/test"
    : "http://localhost:3001/api/test";

// Lấy chi tiết lịch sử bài kiểm tra theo ID
export const getDetailHistoryTest = async (id) => {
  const res = await axios.get(`${TEST_API_URL}/detailsHistoryTest/${id}`);
  return res.data;
};
