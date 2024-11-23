import axios from "axios";



const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://ila-server-2-3bw0.onrender.com/api/conversation"
    : "http://localhost:3001/api/conversation";

const axiosJWT = axios.create();

// Tạo cuộc trò chuyện mới
export const createConversation = async (data, access_token) => {
  const res = await axiosJWT.post(`${API_URL}/createConversation`, data, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

// Tìm kiếm người dùng
export const searchUser = async (search) => {
  const res = await axios.get(`${API_URL}/searchUser`, {
    params: { search },
  });
  return res.data;
};

// Cập nhật cuộc trò chuyện
export const updateConversation = async (id, data, access_token) => {
  const res = await axiosJWT.put(`${API_URL}/updateConversation/${id}`, data, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

// Lấy chi tiết cuộc trò chuyện
export const getDetailConversation = async (id, access_token) => {
  const res = await axiosJWT.get(`${API_URL}/detailsConversation/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

// Xóa cuộc trò chuyện
export const deleteConversation = async (id, access_token) => {
  const res = await axiosJWT.delete(`${API_URL}/deleteConversation/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

// Lấy tất cả các cuộc trò chuyện
export const getAllConversations = async (access_token) => {
  const res = await axiosJWT.get(`${API_URL}/getAllConversations`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

// Lấy tất cả cuộc trò chuyện của giáo viên
export const getAllConversationsForTeacher = async (id) => {
  const res = await axios.get(`${API_URL}/getAllConversationsForTeacher/${id}`);
  return res.data;
};
