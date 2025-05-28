import axios from 'axios';

var test_url = 'https://localhost:7185/api'

const apiClient = axios.create({
  baseURL: test_url,
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