import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://ila-server-2-3bw0.onrender.com/api/user"
    : "http://localhost:3001/api/user";

export const axiosJWT = axios.create();

// API liên quan đến tài khoản và người dùng
export const loginUser = async (data) => {
  const res = await axios.post(`${API_URL}/signin`, data);
  return res.data;
};

export const signupUser = async (data) => {
  const res = await axios.post(`${API_URL}/signup`, data);
  return res.data;
};

export const logoutUser = async (data) => {
  const res = await axios.get(`${API_URL}/logout`, data);
  return res.data;
};

export const getDetailUser = async (id, access_token) => {
  const res = await axios.get(`${API_URL}/getdetails/${id}`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const refreshToken = async () => {
  const res = await axios.post(`${API_URL}/refresh-token`, {
    withCredentials: true,
  });
  return res.data;
};

export const updateUser = async (id, formData, access_token) => {
  try {
    const res = await axios.put(`${API_URL}/updateUser/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        token: `Bearer ${access_token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error in updateUser:", error.response || error.message);
    throw error;
  }
};

export const updatePassword = async (id, data, access_token) => {
  const res = await axios.put(`${API_URL}/updatePassword/${id}`, data, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const activateUser = async (activation_token) => {
  const res = await axios.post(`${API_URL}/activate-email/${activation_token}`, {
    activation_token,
  });
  return res.data;
};

export const requestPasswordReset = async (email) => {
  const res = await axios.post(`${API_URL}/requestPasswordReset`, {
    email,
    redirectUrl: window.location.origin,
  });
  return res.data;
};

export const resetPassword = async (resetToken, newPassword) => {
  const res = await axios.post(`${API_URL}/resetPassword`, {
    resetToken,
    newPassword,
  });
  return res.data;
};

// API liên quan đến danh sách tài khoản
export const getAllAccount = async () => {
  const res = await axios.get(`${API_URL}/getAllAccount`);
  return res.data;
};

export const getAllUser = async () => {
  const res = await axios.get(`${API_URL}/getAllUser`);
  return res.data;
};

export const getAllTopUser = async () => {
  const res = await axios.get(`${API_URL}/top`);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await axios.delete(`${API_URL}/deleteUser/${id}`);
  return res.data;
};

// API liên quan đến thông tin liên lạc
export const createContact = async (userId, contactData) => {
  const res = await axios.post(`${API_URL}/createContact/${userId}`, contactData);
  return res.data;
};

export const updateContact = async (contactId, updatedData) => {
  const res = await axios.put(`${API_URL}/updateContact/${contactId}`, updatedData);
  return res.data;
};

export const getInfoContactByUserId = async (userId) => {
  const res = await axios.get(`${API_URL}/getdetailsInfocontact/${userId}`);
  return res.data;
};

export const createUserbyRole = async (data) => {
  const res = await axios.post(`${API_URL}/signupAccount`, data);
  return res.data;
};