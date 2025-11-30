import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // to send cookies (JWT)
});

// Optional: interceptors for errors/logs
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error?.response || error.message);
    throw error;
  }
);

export default axiosClient;
