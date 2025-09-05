import { apiClient } from './apiClient';

class DatasetService {
  constructor() {
    this.baseEndpoint = '/datasets';
  }

  // Get all datasets for current user
  async getDatasets(params = {}) {
    return await apiClient.get(this.baseEndpoint, params);
  }

  // Get dataset by ID
  async getDataset(id) {
    return await apiClient.get(`${this.baseEndpoint}/${id}`);
  }

  // Create new dataset
  async createDataset(datasetData) {
    return await apiClient.post(this.baseEndpoint, datasetData);
  }

  // Update dataset
  async updateDataset(id, datasetData) {
    return await apiClient.put(`${this.baseEndpoint}/${id}`, datasetData);
  }

  // Delete dataset
  async deleteDataset(id) {
    return await apiClient.delete(`${this.baseEndpoint}/${id}`);
  }

  // Test dataset connection
  async testConnection(connectionData) {
    return await apiClient.post(`${this.baseEndpoint}/test-connection`, connectionData);
  }

  // Get dataset schema
  async getDatasetSchema(id) {
    return await apiClient.get(`${this.baseEndpoint}/${id}/schema`);
  }

  // Update dataset configuration
  async updateConfiguration(id, config) {
    return await apiClient.patch(`${this.baseEndpoint}/${id}/configuration`, config);
  }

  // Get dataset statistics
  async getDatasetStats(id) {
    return await apiClient.get(`${this.baseEndpoint}/${id}/statistics`);
  }
}

export const datasetService = new DatasetService();