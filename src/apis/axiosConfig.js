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

    } else if (error.response?.status === 403) {
      // Show an alert dialog for forbidden error
      if (typeof window !== "undefined") {
        const dialog = document.createElement("dialog");
        dialog.className = "modal";
        dialog.innerHTML = `
          <div class="modal-box">
            <h3 class="font-bold text-lg">Access Denied</h3>
            <p class="py-4">You do not have permission to perform this action.</p>
            <form method="dialog" class="modal-backdrop">
              <button class="btn btn-primary">Close</button>
            </form>
          </div>
        `;
        document.body.appendChild(dialog);
        dialog.showModal();
        dialog.addEventListener("close", () => {
          dialog.remove();
        });
      }
    } else if (error.response?.status === 404) {
      // Handle not found
      // console.error('Resource not found:', error.response.data);
    } else {
      // Handle other errors
      // console.error('API error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;