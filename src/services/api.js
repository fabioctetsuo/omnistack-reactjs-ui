import axios from 'axios';

const api = axios.create({
  baseURL: 'http://omnistack-back-api.herokuapp.com',
});

export default api;
