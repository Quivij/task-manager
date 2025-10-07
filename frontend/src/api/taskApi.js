import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// 🔹 Lấy danh sách task (có phân trang + filter)
export const getTasks = async (
  token,
  page = 1,
  limit = 5,
  startDate = "",
  endDate = "",
  dateField = "dueDate"
) => {
  const params = { page, limit, startDate, endDate, dateField };
  const res = await axios.get(`${API_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return res.data;
};

// 🔹 Tạo task
export const createTask = async (task, token) => {
  const res = await axios.post(`${API_URL}/tasks`, task, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 🔹 Cập nhật task
export const updateTask = async (id, task, token) => {
  const res = await axios.put(`${API_URL}/tasks/${id}`, task, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 🔹 Xóa task
export const deleteTask = async (id, token) => {
  const res = await axios.delete(`${API_URL}/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
