import axios from "axios";

const url = "https://interview.switcheo.com";

const axiosInstance = axios.create({
  baseURL: `${url}`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
