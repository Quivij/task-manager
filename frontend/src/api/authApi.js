import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const login = async (username, password) => {
  const res = await axios.post(`${API_URL}/auth/login`, { username, password });
  return res.data;
};

export const register = async (username, password) => {
  const res = await axios.post(`${API_URL}/auth/register`, {
    username,
    password,
  });
  return res.data;
};
