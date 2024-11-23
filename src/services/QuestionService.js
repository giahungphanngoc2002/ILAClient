import axios from "axios";



const QUESTION_API_URL =
    process.env.NODE_ENV === "production"
        ? "https://ila-server-2-3bw0.onrender.com/api/question"
        : "http://localhost:3001/api/question";

// Tạo câu hỏi
export const createQuestion = async (parsedAnswer) => {
    const res = await axios.post(`${QUESTION_API_URL}/createQuestion`, parsedAnswer);
    return res.data; // Trả về `res.data` để lấy dữ liệu phản hồi từ server
};

// Nếu bạn cần dùng hàm getAllQuestion, bạn có thể sửa lại như sau:

// Lấy tất cả câu hỏi
// export const getAllQuestion = async () => {
//   const res = await axios.get(`${QUESTION_API_URL}/getAllQuestion`);
//   return res.data;
// };
