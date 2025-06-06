import axios from 'axios';

var host = import.meta.env.VITE_API_HOST; // Default to localhost:7185 if API_HOST is not set
console.log("API_HOST:", import.meta.env);
var url = `http://${host}/api`;

const apiClient = axios.create({
  baseURL: url,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ILS_AUTH_TOKEN');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {

    }
    return Promise.reject(error);
  }
);

export default apiClient;