import React, { useState, useEffect } from 'react';
import {
  Upload, ArrowLeft, Save, FileText, Database, Settings,
  AlertTriangle, CheckCircle, Loader2, Plus, X, Info, Folder
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { createDataset, validateDatasetConfiguration, getDatasetTemplates } from '../api';

// Add New Dataset Page
export const AddNewDatasetPage = ({ onBack, onAddDataset }) => {
  const { isDark } = useTheme();

  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [apiConnected, setApiConnected] = useState(true); // Track API connection status

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    storageType: 'local',
    folderPath: '',
    fileType: 'csv',
    delimiter: ',',
    checkIntervalMinutes: 60,
    owningTeam: 'DataEngineering',
    expectedSchema: [],
    manualSchema: '',
    enableSchemaLearning: true,
    enableDataQualityChecks: false,
    status: 'Active',
    storageConfig: {
      localPath: '',
      azureService: 'blob',
      connectionString: '',
      containerName: '',
      blobPath: ''
    }
  });

  // Load templates on mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const templateData = await getDatasetTemplates();
      setTemplates(templateData);
      setApiConnected(true);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setApiConnected(false);
      // Set fallback templates
      setTemplates([
        {
          id: 'sales-data',
          name: 'Sales Data Monitoring',
          description: 'Monitor daily sales CSV files for schema changes',
          config: {
            storageType: 'local',
            fileType: 'csv',
            delimiter: ',',
            checkIntervalMinutes: 60,
            owningTeam: 'SalesTeam',
            enableSchemaLearning: true,
            enableDataQualityChecks: true,
            status: 'Active'
          }
        },
        {
          id: 'customer-data',
          name: 'Customer Data Monitoring',
          description: 'Monitor customer data files with moderate validation',
          config: {
            storageType: 'local',
            fileType: 'csv',
            delimiter: ',',
            checkIntervalMinutes: 240,
            owningTeam: 'SalesTeam',
            enableSchemaLearning: true,
            enableDataQualityChecks: false,
            status: 'Active'
          }
        },
        {
          id: 'financial-data',
          name: 'Financial Data Monitoring',
          description: 'High-frequency monitoring for financial datasets',
          config: {
            storageType: 'local',
            fileType: 'csv',
            delimiter: ',',
            checkIntervalMinutes: 10,
            owningTeam: 'SalesTeam',
            enableSchemaLearning: false,
            enableDataQualityChecks: true,
            status: 'Active'
          }
        },
        {
          id: 'txt-reports',
          name: 'Text Report Files',
          description: 'Monitor structured text report files',
          config: {
            storageType: 'local',
            fileType: 'txt',
            delimiter: '|',
            checkIntervalMinutes: 60,
            owningTeam: 'SalesTeam',
            enableSchemaLearning: true,
            enableDataQualityChecks: true,
            status: 'Active'
          }
        },
        {
          id: 'azure-analytics',
          name: 'Azure Analytics Data',
          description: 'Monitor analytics data from Azure storage',
          config: {
            storageType: 'azure',
            fileType: 'csv',
            delimiter: ',',
            checkIntervalMinutes: 120,
            owningTeam: 'SalesTeam',
            enableSchemaLearning: true,
            enableDataQualityChecks: true,
            status: 'Active'
          }
        }
      ]);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setFormData(prev => ({
      ...prev,
      ...template.config,
      name: '',
      description: template.description
    }));
  };

  const validateForm = async () => {
    try {
      const validation = await validateDatasetConfiguration(formData);
      setValidationErrors(validation.errors || {});
      return validation.isValid;
    } catch (err) {
      console.error('Validation error:', err);
      return false;
    }
  };

  // Utility function to parse manual schema input
  const parseManualSchema = (schemaText) => {
    if (!schemaText.trim()) return [];

    let columns;
    if (schemaText.includes('\n')) {
      columns = schemaText.split('\n');
    } else if (schemaText.includes(';')) {
      columns = schemaText.split(';');
    } else {
      columns = schemaText.split(',');
    }

    return columns
      .map(col => col.trim())
      .filter(col => col.length > 0)
      .map(col => ({
        name: col,
        type: 'string',
        required: true
      }));
  };

  // Dismiss error
  const handleDismissError = () => {
    setError(null);
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  setSuccess(false);

  // Basic client-side validation
  const errors = {};
  if (!formData.name.trim()) errors.name = 'Dataset name is required';
  if (!formData.description.trim()) errors.description = 'Description is required';
  if (!formData.folderPath.trim()) errors.folderPath = 'Folder path is required';
  if (!formData.fileType) errors.fileType = 'File type is required';
  if (!formData.storageType) errors.storageType = 'Storage type is required';
  if (!formData.owningTeam) errors.owningTeam = 'Owning team is required';

  if (!formData.enableSchemaLearning && !formData.manualSchema.trim()) {
    errors.manualSchema = 'Please provide expected column names when auto-learning is disabled';
  }

  if (formData.storageType === 'azure') {
    if (!formData.storageConfig.connectionString.trim()) {
      errors.connectionString = 'Connection string is required for Azure storage';
    }
    if (!formData.storageConfig.containerName.trim()) {
      errors.containerName = 'Container name is required';
    }
  }

  if (!['csv', 'txt'].includes(formData.fileType)) {
    errors.fileType = 'Only CSV and TXT files are currently supported';
  }

  if (Object.keys(errors).length > 0) {
    setValidationErrors(errors);
    return;
  }

  try {
    setLoading(true);

    let containerName = '';
    if (formData.storageType === 'azure') {
      const azureConfig = {
        containerName: formData.storageConfig.containerName || '',
        azureService: formData.storageConfig.azureService || 'blob',
        connectionString: formData.storageConfig.connectionString || '',
        blobPath: formData.storageConfig.blobPath || ''
      };
      containerName = JSON.stringify(azureConfig);
    } else {
      containerName = ' ';
    }

    const datasetData = {
      name: formData.name,
      description: formData.description,
      folderPath: formData.folderPath,
      fileType: formData.fileType,
      delimiter: formData.delimiter,
      storageType: formData.storageType,
      containerName: containerName,
      checkIntervalMinutes: formData.checkIntervalMinutes,
      owningTeam: formData.owningTeam,
      enableSchemaLearning: formData.enableSchemaLearning,
      manualSchema: formData.manualSchema,
      status: formData.status === 'Active',
      enableDataQualityChecks: formData.enableDataQualityChecks
    };

    if (!formData.enableSchemaLearning && formData.manualSchema.trim()) {
      datasetData.expectedSchema = parseManualSchema(formData.manualSchema);
    }

    // Call the API - this will throw an error if it fails
    const newDataset = await createDataset(datasetData);

    // Only reach here if API call was successful
    setApiConnected(true);
    setSuccess(true);

    if (onAddDataset) {
      onAddDataset(newDataset);
    }

    setTimeout(() => {
      onBack();
    }, 2000);

  } catch (err) {
    // This block runs if the API call fails
    console.error('Error creating dataset:', err);
    
    // Check if it's a connection error
    if (err.message.includes('fetch') || err.message.includes('network') || err.message.includes('connection')) {
      setApiConnected(false);
      setError('Unable to save dataset. Please check your connection and try again later.');
    } else {
      setApiConnected(false);
      setError('Sorry, we couldn\'t create your dataset. Please try again or contact support if the problem continues.');
    }
    
    // Make sure success is false when there's an error
    setSuccess(false);
  } finally {
    setLoading(false);
  }
};
  const handleInputChange = (field, value, section = null) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    if (field === 'fileType') {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className={`flex items-center space-x-2 mb-4 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Datasets</span>
          </button>
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Create New Dataset
          </h2>
          <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Configure a new dataset for drift monitoring and analysis
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg dark:bg-green-900 dark:border-green-700 dark:text-green-200">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Dataset created successfully!</span>
            </div>
            <p className="mt-1">Redirecting to datasets list...</p>
          </div>
        )}

        {/* User-Friendly Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900 dark:border-red-700 dark:text-red-200 relative">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">Unable to Create Dataset</p>
                <p className="mt-1 text-sm">{error}</p>
                {!apiConnected && (
                  <div className="mt-3">
                    <button
                      onClick={() => window.location.reload()}
                      className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
                    >
                      Refresh Page
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={handleDismissError}
                className="ml-4 text-red-500 hover:text-red-700 dark:text-red-300 dark:hover:text-red-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* API Connection Warning */}
        {!apiConnected && !error && (
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span className="font-medium">Limited Functionality</span>
            </div>
            <p className="mt-1 text-sm">Some features may not work properly. You can still fill out the form, but saving may not be available.</p>
          </div>
        )}

        {/* Templates Section */}
        {!selectedTemplate && (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-8`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Choose a Template (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${isDark
                    ? 'border-gray-600 hover:border-blue-500 bg-gray-700'
                    : 'border-gray-300 hover:border-blue-500 bg-gray-50'
                    }`}
                >
                  <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {template.name}
                  </h4>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {template.description}
                  </p>
                </div>
              ))}
              <div
                className={`p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDark
                  ? 'border-gray-600 hover:border-blue-500'
                  : 'border-gray-300 hover:border-blue-500'
                  }`}
              >
                <div className="text-center">
                  <Plus className={`h-8 w-8 mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-2`} />
                  <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Start from Scratch
                  </h4>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Create a custom configuration
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8`}>
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Dataset Configuration
            </h3>

            {selectedTemplate && (
              <div className={`p-4 rounded-lg ${isDark ? 'bg-blue-900' : 'bg-blue-50'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                      Using Template: {selectedTemplate.name}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                      {selectedTemplate.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedTemplate(null)}
                    className={`p-1 rounded ${isDark ? 'hover:bg-blue-800' : 'hover:bg-blue-100'}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Dataset Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.name
                    ? 'border-red-500'
                    : isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  placeholder="Enter dataset name"
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.name}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Storage Type *
                </label>
                <select
                  value={formData.storageType}
                  onChange={(e) => handleInputChange('storageType', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                    }`}
                >
                  <option value="local">Local File System</option>
                  <option value="azure">Azure</option>
                </select>
                <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Where your data files are stored
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  File Type *
                </label>
                <select
                  value={formData.fileType}
                  onChange={(e) => handleInputChange('fileType', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                    }`}
                >
                  <option value="csv">CSV (Comma Separated) ✅</option>
                  <option value="txt">TXT (Plain Text) ✅</option>
                  <option value="tsv" disabled>TSV (Tab Separated) - Coming Soon</option>
                  <option value="json" disabled>JSON Lines - Coming Soon</option>
                  <option value="parquet" disabled>Parquet - Coming Soon</option>
                  <option value="excel" disabled>Excel (XLSX) - Coming Soon</option>
                </select>
                <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Currently supporting CSV and TXT files
                </p>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.description
                  ? 'border-red-500'
                  : isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                  }`}
                placeholder="Describe your dataset and its purpose"
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.description}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <div className="flex items-center space-x-2">
                  <Folder className="h-4 w-4" />
                  <span>Folder Path *</span>
                </div>
              </label>
              <input
                type="text"
                value={formData.folderPath}
                onChange={(e) => handleInputChange('folderPath', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.folderPath
                  ? 'border-red-500'
                  : isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                  }`}
                placeholder="e.g., C:\Data\Datasets\CustomerData or /data/datasets/customer-data"
              />
              {validationErrors.folderPath && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.folderPath}</p>
              )}
              <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Specify the folder path where your dataset files are located for monitoring
              </p>
            </div>

            {/* File Format Configuration */}
            {(formData.fileType === 'csv' || formData.fileType === 'txt') && (
              <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <h4 className={`text-md font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  File Format Configuration
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Delimiter
                    </label>
                    <select
                      value={formData.delimiter}
                      onChange={(e) => handleInputChange('delimiter', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    >
                      <option value=",">Comma (,)</option>
                      <option value=";">Semicolon (;)</option>
                      <option value="\t">Tab (\t)</option>
                      <option value="|">Pipe (|)</option>
                      <option value=" ">Space</option>
                    </select>
                    <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      How fields are separated in your files
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Storage-Specific Configuration */}
            {formData.storageType === 'azure' && (
              <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <h4 className={`text-md font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Azure Storage Configuration
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Azure Service *
                    </label>
                    <select
                      value={formData.storageConfig.azureService}
                      onChange={(e) => handleInputChange('azureService', e.target.value, 'storageConfig')}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    >
                      <option value="blob">Blob Storage</option>
                      <option value="cosmos">Cosmos DB</option>
                      <option value="adls1">ADLS Gen 1</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Container Name *
                    </label>
                    <input
                      type="text"
                      value={formData.storageConfig.containerName}
                      onChange={(e) => handleInputChange('containerName', e.target.value, 'storageConfig')}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      placeholder="my-data-container"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Connection String *
                  </label>
                  <textarea
                    value={formData.storageConfig.connectionString}
                    onChange={(e) => handleInputChange('connectionString', e.target.value, 'storageConfig')}
                    rows={2}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    placeholder="DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;EndpointSuffix=..."
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Check Interval (minutes) *
                </label>
                <select
                  value={formData.checkIntervalMinutes}
                  onChange={(e) => handleInputChange('checkIntervalMinutes', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                    }`}
                >
                  <option value={5}>Every 5 minutes</option>
                  <option value={10}>Every 10 minutes</option>
                  <option value={30}>Every 30 minutes</option>
                  <option value={60}>Every hour</option>
                  <option value={240}>Every 4 hours</option>
                  <option value={1440}>Once daily</option>
                </select>
                <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  How often to check for new files and schema changes
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Owning Team *
                </label>
                <select
                  value={formData.owningTeam}
                  onChange={(e) => handleInputChange('owningTeam', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                    }`}
                >
                  <option value="DataEngineering">Data Engineering Team</option>
                  <option value="Analytics">Analytics Team</option>
                  <option value="BusinessIntelligence">Business Intelligence Team</option>
                  <option value="DataScience">Data Science Team</option>
                  <option value="SalesTeam">Sales Team</option>
                  <option value="MarketingTeam">Marketing Team</option>
                  <option value="FinanceTeam">Finance Team</option>
                  <option value="OperationsTeam">Operations Team</option>
                  <option value="ITTeam">IT Team</option>
                  <option value="QualityAssurance">Quality Assurance Team</option>
                </select>
                <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Select the team responsible for this dataset
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableSchemaLearning"
                  checked={formData.enableSchemaLearning}
                  onChange={(e) => handleInputChange('enableSchemaLearning', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableSchemaLearning" className={`ml-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className="font-medium">Auto-learn schema from first file</span>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    If disabled, system will validate against expected file structure only
                  </p>
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableDataQualityChecks"
                  checked={formData.enableDataQualityChecks}
                  onChange={(e) => handleInputChange('enableDataQualityChecks', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableDataQualityChecks" className={`ml-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className="font-medium">Enable data quality checks</span>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Monitor null rates, data types, and value ranges
                  </p>
                </label>
              </div>
            </div>

            {/* Dataset Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="datasetStatus"
                  checked={formData.status === 'Active'}
                  onChange={(e) => handleInputChange('status', e.target.checked ? 'Active' : 'Inactive')}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="datasetStatus" className={`ml-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className="font-medium">Dataset Active</span>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Enable monitoring for this dataset immediately
                  </p>
                </label>
              </div>

              <div className="flex items-center justify-end">
                <span className={`text-sm ${formData.status === 'Active'
                  ? 'text-green-600 font-medium'
                  : isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                  Status: {formData.status}
                </span>
              </div>
            </div>

            {/* Schema Learning Warning */}
            {!formData.enableSchemaLearning && (
              <div className="mt-4 space-y-4">
                <div className={`p-4 rounded-lg border-l-4 ${isDark ? 'bg-yellow-900 border-yellow-500' : 'bg-yellow-50 border-yellow-400'}`}>
                  <div className="flex items-center">
                    <Info className={`h-5 w-5 ${isDark ? 'text-yellow-400' : 'text-yellow-600'} mr-2`} />
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-yellow-200' : 'text-yellow-800'}`}>
                        Schema Learning Disabled
                      </p>
                      <p className={`text-xs ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
                        Please provide the expected column names below for validation.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Manual Schema Input */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Expected Column Names *
                  </label>
                  <textarea
                    value={formData.manualSchema}
                    onChange={(e) => handleInputChange('manualSchema', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.manualSchema
                      ? 'border-red-500'
                      : isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    placeholder="Example: customer_id, name, email, age, city&#10;Or: customer_id; name; email; age; city&#10;Or: customer_id,name,email,age,city"
                  />
                  {validationErrors.manualSchema && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.manualSchema}</p>
                  )}
                  <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Enter column names separated by commas (,) semicolons (;) or line breaks. Example: name, email, age
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end pt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Create Dataset</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};