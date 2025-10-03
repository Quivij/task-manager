import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getTasks = async (token) => {
  const res = await axios.get(`${API_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createTask = async (task, token) => {
  const res = await axios.post(`${API_URL}/tasks`, task, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
