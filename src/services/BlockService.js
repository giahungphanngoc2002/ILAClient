import axios from 'axios';



const BLOCK_API_URL =
    process.env.NODE_ENV === "production"
        ? "https://ila-server-2-3bw0.onrender.com/api/block"
        : "http://localhost:3001/api/block";

// Lấy tất cả các khối
export const getAllBlocks = async () => {
    const res = await axios.get(`${BLOCK_API_URL}/getAllBlocks`);
    return res.data;
};
