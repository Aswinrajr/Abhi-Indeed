import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('admintoken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response.status === 401) {
      localStorage.removeItem('admintoken');
      localStorage.removeItem('admin');
      window.location.href = '/admin-login'; 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
