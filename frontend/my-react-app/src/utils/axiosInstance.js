import axios from "axios";

// Create an Axios instance with the base URL
const API = axios.create({
  baseURL: "http://localhost:3000", // Backend API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach token if logged in
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
