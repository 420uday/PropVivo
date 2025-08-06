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

// Axios-based methods
apiClient.fetchGet = async (url) => {
  const response = await fetch(`${apiClient.defaults.baseURL}${url}`, {
    headers: {
      ...apiClient.defaults.headers.common
    }
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

apiClient.fetchPost = async (url, data) => {
  const response = await fetch(`${apiClient.defaults.baseURL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...apiClient.defaults.headers.common
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response;
};

export default apiClient;