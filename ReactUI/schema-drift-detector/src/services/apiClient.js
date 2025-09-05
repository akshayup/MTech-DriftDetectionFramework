import { apiConfig } from '../config/apiConfig';

class ApiClient {
  constructor() {
    this.baseURL = apiConfig.baseURL;
    this.timeout = apiConfig.timeout;
  }

  // Create headers for API requests
  createHeaders() {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  // Generic HTTP request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.createHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // HTTP Methods
  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

export const apiClient = new ApiClient();