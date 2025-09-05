// API Configuration
export const apiConfig = {
  // Base URL for your backend API
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  
  // Timeout settings
  timeout: 10000, // 10 seconds
  
  // API Endpoints
  endpoints: {
    datasets: '/datasets',
    reports: '/reports',
    users: '/users'
  }
};

export default apiConfig;