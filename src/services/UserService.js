import axios from "axios";

const API_URL = "http://localhost:3001/api/user";

export const axiosJWT = axios.create();

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

export const updateUser = async (id, data, access_token) => {
  const res = await axios.put(`${API_URL}/updateUser/${id}`, data, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
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
  const res = await axios.post(`${API_URL}/activation`, {
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

export const getAllUser = async() =>{
  const res =await axios.get (`http://localhost:3001/api/user/getAllUser`)
  return res.data
}

export const getAllTopUser = async() =>{
  const res =await axios.get (`http://localhost:3001/api/user/top`)
  return res.data
}