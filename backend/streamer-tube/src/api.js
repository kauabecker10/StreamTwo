import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Funciona tanto local quanto no Render depois
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;