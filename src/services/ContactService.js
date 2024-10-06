import axios from "axios";

const API_URL = "http://localhost:3001/api/contact"; 


export const createContact = async (data) => {
  const res = await axios.post(`${API_URL}/createContact`, data);
  return res.data;
};
