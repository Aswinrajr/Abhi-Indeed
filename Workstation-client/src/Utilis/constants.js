import Axios from 'axios';

const axiosInstance = Axios.create({
  baseURL: 'https://api.workstation.today',
  withCredentials: true,
});

export default axiosInstance;