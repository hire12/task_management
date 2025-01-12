import axios from "axios";

export interface IUser {
  id: string;
  username: string;
  email: string;
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  status: "To Do" | "In Progress" | "Done";
}


const API = axios.create({
  baseURL: "http://localhost:3000", // Replace with your backend URL
});


// Set Authorization header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const registerUser = (data: { username: string; email: string; password: string }) =>
  API.post("/auth/register", data);

export const loginUser = (data: { email: string; password: string }) =>
  API.post("/auth/login", data);

export const logoutUser = () => API.post("/auth/logout");

// Task APIs
export const getTasks = () => API.get("/api/tasks");
export const createTask = (data: Partial<ITask>) => API.post("/api/tasks", data);
export const updateTask = (id: string, data: Partial<ITask>) => API.put(`/api/tasks/${id}`, data);
// export const updateTask = (id: string, data: Partial<ITask>) => API.put(`/api/tasks/${id}`, data);
export const deleteTask = (id: string) => API.delete(`/api/tasks/${id}`);
export const getTaskById = (id: string) => API.get(`/api/tasks/${id}`);
export const updateTaskStatus = (id: string) => API.get(`/api/tasks/${id}`);
