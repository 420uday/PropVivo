import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://localhost:7266/api',
});

// Function to set the auth token for all subsequent requests
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export default apiClient;