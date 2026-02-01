import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

// Centralized Error Extraction
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 1. Check for Response
    if (error.response) {
      // 2. Fallback ONLY if missing
      if (!error.response.data) error.response.data = {};
      if (!error.response.data.message) {
        error.response.data.message = "Something went wrong. Please try again.";
      }
    } else {
      // 3. Handle Network/Unknown Errors (No Response)
      error.response = {
        data: {
          message: "Something went wrong. Please try again.",
        },
      };
    }
    return Promise.reject(error);
  }
);

export default api;
