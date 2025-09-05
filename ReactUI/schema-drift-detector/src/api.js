// API configuration and endpoints
const API_BASE_URL = /*process.env.REACT_APP_API_BASE_URL ||*/ 'https://localhost:7131';

// Helper function to build query parameters
const buildQueryParams = (params) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  
  return queryParams.toString();
};

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Making API request to:', url);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        // Add any authentication headers if needed
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    throw error;
  }
};



// ============================================================================
// ESSENTIAL DATASETS API (Used by ConfiguredDatasetsPage & AddNewDatasetPage)
// ============================================================================
export const datasetsAPI = {
  // Get all datasets with filters and pagination
  getDatasets: async (params = {}) => {
    const queryString = buildQueryParams({
      page: params.page || 1,
      limit: params.limit || 9,
      search: params.search,
      status: params.status,
      dataType: params.dataType,
      sortBy: params.sortBy || 'lastUpdated',
      sortOrder: params.sortOrder || 'desc',
      monitoringFrequency: params.monitoringFrequency,
      thresholdLevel: params.thresholdLevel,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo
    });
    
    // REMOVED FALLBACK DATA - Let the error bubble up to ConfiguredDatasetsPage
    const response = await apiRequest(`/api/datasets${queryString ? `?${queryString}` : ''}`);
    console.log('API Response:', response);
    return response;
  },

  // Create new dataset
  createDataset: async (datasetData) => {
    return await apiRequest('/api/createdatasets', {
      method: 'POST',
      body: JSON.stringify(datasetData)
    });
  },

  // Delete dataset (soft delete)
  deleteDataset: async (datasetId) => {
    console.log('Making API call to delete dataset:', datasetId);
    return await apiRequest(`/api/deletedataset/${datasetId}`, {
      method: 'DELETE'
    });
  },

  updateDataset: async (datasetId, datasetData) => {
  console.log('Making API call to update dataset:', datasetId);
  console.log('With data:', datasetData);
  return await apiRequest(`/api/datasets/${datasetId}`, {
    method: 'PUT',
    body: JSON.stringify(datasetData)
  });
},

// Get single dataset by ID
getDatasetById: async (datasetId) => {
  console.log('Making API call to get dataset:', datasetId);
  return await apiRequest(`/api/datasets/${datasetId}`);
},
};

// Replace the existing driftReportsAPI section with this updated version:

// ============================================================================
// ESSENTIAL DRIFT REPORTS API (Used by RecentDriftReportsPage)
// ============================================================================
export const driftReportsAPI = {
  // Get all drift reports with filters and pagination
  getDriftReports: async (params = {}) => {
    const queryString = buildQueryParams({
      page: params.page || 1,
      limit: params.limit || 20,
      datasetId: params.datasetId,
      severity: params.severity,
      driftType: params.driftType,
      fromDate: params.fromDate,
      toDate: params.toDate
    });
    
    return await apiRequest(`/api/driftreports${queryString ? `?${queryString}` : ''}`);
  },
  
  // Keep the existing functions for future use
  getReportStats: async (dateRange = '30d') => {
    return await apiRequest(`/api/drift-reports/stats?dateRange=${dateRange}`);
  },

  exportReports: async (format = 'csv', filters = {}) => {
    const queryString = buildQueryParams({ format, ...filters });
    return await apiRequest(`/api/drift-reports/export${queryString ? `?${queryString}` : ''}`);
  },

  getAvailableDatasets: async () => {
    return await apiRequest('/api/drift-reports/available-datasets');
  }
};

// ============================================================================
// DATASET CONFIGURATION FUNCTIONS (Used by AddNewDatasetPage)
// ============================================================================

// Dataset Templates API
export const getDatasetTemplates = async () => {
  try {
    return await apiRequest('/api/datasets/templates');
  } catch (error) {
    console.warn('Failed to fetch dataset templates, using fallback data');
    // Fallback templates for development
    return [
      {
        id: 'customer-analytics',
        name: 'Customer Analytics',
        description: 'Template for customer behavior and demographic analysis',
        category: 'Analytics',
        fields: [
          { name: 'customer_id', type: 'string', required: true },
          { name: 'age', type: 'number', required: false },
          { name: 'gender', type: 'string', required: false },
          { name: 'income', type: 'number', required: false },
          { name: 'location', type: 'string', required: false }
        ],
        icon: '👥'
      },
      {
        id: 'financial-data',
        name: 'Financial Data',
        description: 'Template for financial transactions and market data',
        category: 'Finance',
        fields: [
          { name: 'transaction_id', type: 'string', required: true },
          { name: 'amount', type: 'number', required: true },
          { name: 'currency', type: 'string', required: true },
          { name: 'timestamp', type: 'datetime', required: true },
          { name: 'account_id', type: 'string', required: true }
        ],
        icon: '💰'
      },
      {
        id: 'sales-performance',
        name: 'Sales Performance',
        description: 'Template for sales metrics and performance tracking',
        category: 'Sales',
        fields: [
          { name: 'sale_id', type: 'string', required: true },
          { name: 'product_id', type: 'string', required: true },
          { name: 'quantity', type: 'number', required: true },
          { name: 'price', type: 'number', required: true },
          { name: 'salesperson', type: 'string', required: false }
        ],
        icon: '📊'
      },
      {
        id: 'iot-sensors',
        name: 'IoT Sensors',
        description: 'Template for IoT device sensor data monitoring',
        category: 'IoT',
        fields: [
          { name: 'device_id', type: 'string', required: true },
          { name: 'temperature', type: 'number', required: false },
          { name: 'humidity', type: 'number', required: false },
          { name: 'pressure', type: 'number', required: false },
          { name: 'timestamp', type: 'datetime', required: true }
        ],
        icon: '🌡️'
      },
      {
        id: 'web-analytics',
        name: 'Web Analytics',
        description: 'Template for website traffic and user behavior',
        category: 'Web',
        fields: [
          { name: 'session_id', type: 'string', required: true },
          { name: 'user_id', type: 'string', required: false },
          { name: 'page_views', type: 'number', required: true },
          { name: 'duration', type: 'number', required: true },
          { name: 'bounce_rate', type: 'number', required: false }
        ],
        icon: '🌐'
      },
      {
        id: 'custom',
        name: 'Custom Dataset',
        description: 'Create your own custom dataset structure',
        category: 'Custom',
        fields: [],
        icon: '⚙️'
      }
    ];
  }
};

// Dataset Configuration Validation API
export const validateDatasetConfiguration = async (config) => {
  try {
    return await apiRequest('/api/datasets/validate', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  } catch (error) {
    console.warn('Failed to validate dataset configuration, using client-side validation');
    // Fallback client-side validation
    const errors = [];
    
    if (!config.name || config.name.trim().length === 0) {
      errors.push('Dataset name is required');
    }
    
    if (!config.template) {
      errors.push('Template selection is required');
    }
    
    if (!config.fields || config.fields.length === 0) {
      errors.push('At least one field is required');
    }
    
    if (config.fields) {
      config.fields.forEach((field, index) => {
        if (!field.name || field.name.trim().length === 0) {
          errors.push(`Field ${index + 1}: Name is required`);
        }
        if (!field.type) {
          errors.push(`Field ${index + 1}: Type is required`);
        }
      });
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings: errors.length === 0 ? [] : ['Using client-side validation only']
    };
  }
};

// Create dataset function
export const createDataset = async (datasetData) => {
    console.log('Making API call to:', `${API_BASE_URL}/api/createdatasets`);
    console.log('With data:', datasetData);
    
    return await apiRequest('/api/createdatasets', {
      method: 'POST',
      body: JSON.stringify(datasetData)
    });
};