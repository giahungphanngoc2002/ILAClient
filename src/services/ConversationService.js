import axios from "axios";

const API_URL = "http://localhost:3001/api/conversation"; // Đường dẫn API của conversation

const axiosJWT = axios.create();

export const createConversation = async (data, access_token) => {
  const res = await axiosJWT.post(`${API_URL}/createConversation`, data, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const updateConversation = async (id, data, access_token) => {
  const res = await axiosJWT.put(`${API_URL}/updateConversation/${id}`, data, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const getDetailConversation = async (id, access_token) => {
  const res = await axiosJWT.get(`${API_URL}/detailsConversation/${id}`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const deleteConversation = async (id, access_token) => {
  const res = await axiosJWT.delete(`${API_URL}/deleteConversation/${id}`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const getAllConversations = async (access_token) => {
  const res = await axiosJWT.get(`${API_URL}/getAllConversations`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};
export const getAllConversationsForTeacher = async (id) => {
  const res = await axios.get(`${API_URL}/getAllConversationsForTeacher/${id}`);
  return res.data;
};