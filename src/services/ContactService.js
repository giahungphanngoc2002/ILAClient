import axios from "axios";



const CONTACT_API_URL =
  process.env.NODE_ENV === "production"
    ? "https://ila-server-2-3bw0.onrender.com/api/contact"
    : "http://localhost:3001/api/contact";

// Tạo thông tin liên hệ
export const createContact = async (data) => {
  const res = await axios.post(`${CONTACT_API_URL}/createContact`, data);
  return res.data;
};
