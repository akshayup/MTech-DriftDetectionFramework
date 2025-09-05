import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Database, Activity, Zap, Search, Filter, ChevronLeft, ChevronRight, Loader2, RefreshCw, AlertTriangle, X, Trash2, Settings, Eye, Edit, Save, Calendar, Clock, User, FolderOpen, FileText, Server, CheckCircle, XCircle, Info } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { datasetsAPI } from '../api';

// Dataset Details Modal
// const DatasetDetailsModal = ({ dataset, isOpen, onClose, isDark }) => {
//   const [loading, setLoading] = useState(false);
//   const [fullDataset, setFullDataset] = useState(null);
//   const [error, setError] = useState(null);

//   // Fetch full dataset details when modal opens
//   useEffect(() => {

// const fetchDatasetDetails = async () => {
//   if (isOpen && dataset) {
//     console.log('DatasetDetailsModal - Initial dataset data:', dataset);
//     console.log('Dataset ID for API call:', dataset.id);
    
//     setLoading(true);
//     setError(null);
//     try {
//       // Try to fetch full details, fallback to provided dataset
//       try {
//         console.log('Attempting API call to get full dataset details...');
//         const details = await datasetsAPI.getDatasetById(dataset.id);
//         console.log('API response received:', details);
//         setFullDataset(details);
//       } catch (err) {
//         // If API call fails, use the dataset data we already have
//         console.warn('API call failed, using fallback data:', err.message);
//         console.log('Fallback dataset data:', dataset);
//         setFullDataset(dataset);
//       }
//     } catch (err) {
//       console.error('Error in fetchDatasetDetails:', err);
//       setError('Failed to load dataset details');
//       setFullDataset(dataset); // Fallback to basic data
//     } finally {
//       setLoading(false);
//     }
//   }
// };

//     fetchDatasetDetails();
//   }, [isOpen, dataset]);

//   if (!isOpen) return null;

//   const data = fullDataset || dataset;

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleString();
//     } catch {
//       return dateString;
//     }
//   };

//   const getStatusColor = (status) => {
//     return status === 'Active' 
//       ? 'text-green-600 dark:text-green-400' 
//       : 'text-red-600 dark:text-red-400';
//   };

//   const getStatusIcon = (status) => {
//     return status === 'Active' 
//       ? <CheckCircle className="h-4 w-4" />
//       : <XCircle className="h-4 w-4" />;
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
//         <div className="p-6">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center space-x-3">
//               <Database className={`h-8 w-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
//               <div>
//                 <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                   {data?.name || 'Dataset Details'}
//                 </h3>
//                 <div className="flex items-center space-x-2 mt-1">
//                   {getStatusIcon(data?.status)}
//                   <span className={`text-sm font-medium ${getStatusColor(data?.status)}`}>
//                     {data?.status || 'Unknown'}
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
//             >
//               <X className="h-6 w-6" />
//             </button>
//           </div>

//           {/* Loading State */}
//           {loading && (
//             <div className="flex justify-center items-center py-8">
//               <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//               <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading dataset details...</span>
//             </div>
//           )}

//           {/* Error State */}
//           {error && (
//             <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-200">
//               <div className="flex items-start">
//                 <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
//                 <div>
//                   <p className="font-medium">Error Loading Details</p>
//                   <p className="mt-1 text-sm">{error}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Content */}
//           {data && !loading && (
//             <div className="space-y-6">
//               {/* Basic Information */}
//               <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
//                 <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                   Basic Information
//                 </h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
//                       Dataset Name
//                     </label>
//                     <p className={`mt-1 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                       {data.name || 'N/A'}
//                     </p>
//                   </div>
//                   <div>
//                     <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
//                       Dataset ID
//                     </label>
//                     <p className={`mt-1 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                       {data.id || 'N/A'}
//                     </p>
//                   </div>
//                   <div className="md:col-span-2">
//                     <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
//                       Description
//                     </label>
//                     <p className={`mt-1 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                       {data.description || 'No description available'}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Storage Configuration */}
//               <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
//                 <h4 className={`text-lg font-semibold mb-4 flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                   <Server className="h-5 w-5 mr-2" />
//                   Storage Configuration
//                 </h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
//                       Storage Type
//                     </label>
//                     <p className={`mt-1 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                       {data.storageType || 'N/A'}
//                     </p>
//                   </div>
//                   <div>
//                     <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
//                       File Type
//                     </label>
//                     <p className={`mt-1 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                       {data.fileType?.toUpperCase() || 'N/A'}
//                     </p>
//                   </div>
//                   <div className="md:col-span-2">
//                     <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
//                       <FolderOpen className="h-4 w-4 inline mr-1" />
//                       Folder Path
//                     </label>
//                     <p className={`mt-1 text-sm ${isDark ? 'text-white' : 'text-gray-900'} font-mono bg-gray-100 dark:bg-gray-600 p-2 rounded`}>
//                       {data.filePath || 'N/A'}
//                       {console.log('File path: 188', data)}
//                     </p>
//                   </div>
//                   {data.delimiter && (
//                     <div>
//                       <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
//                         Delimiter
//                       </label>
//                       <p className={`mt-1 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                         {data.delimiter === ',' ? 'Comma (,)' :
//                          data.delimiter === ';' ? 'Semicolon (;)' :
//                          data.delimiter === '\t' ? 'Tab (\\t)' :
//                          data.delimiter === '|' ? 'Pipe (|)' :
//                          data.delimiter}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Monitoring Configuration */}
//               <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
//                 <h4 className={`text-lg font-semibold mb-4 flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                   <Activity className="h-5 w-5 mr-2" />
//                   Monitoring Configuration
//                 </h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
//                       <Clock className="h-4 w-4 inline mr-1" />
//                       Check Interval
//                     </label>
//                     <p className={`mt-1 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                       {data.checkIntervalMinutes 
//                         ? `Every ${data.checkIntervalMinutes} minutes` 
//                         : 'N/A'}
//                     </p>
//                   </div>
//                   <div>
//                     <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
//                       <User className="h-4 w-4 inline mr-1" />
//                       Owning Team
//                     </label>
//                     <p className={`mt-1 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                       {data.owningTeam || 'N/A'}
//                     </p>
//                   </div>
//                   <div>
//                     <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
//                       Schema Learning
//                     </label>
//                     <div className="flex items-center mt-1">
//                       {data.enableSchemaLearning ? (
//                         <>
//                           <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
//                           <span className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>Enabled</span>
//                         </>
//                       ) : (
//                         <>
//                           <XCircle className="h-4 w-4 text-red-500 mr-1" />
//                           <span className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>Disabled</span>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
//                       Data Quality Checks
//                     </label>
//                     <div className="flex items-center mt-1">
//                       {data.enableDataQualityChecks ? (
//                         <>
//                           <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
//                           <span className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>Enabled</span>
//                         </>
//                       ) : (
//                         <>
//                           <XCircle className="h-4 w-4 text-red-500 mr-1" />
//                           <span className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>Disabled</span>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Timestamps */}
//               <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
//                 <h4 className={`text-lg font-semibold mb-4 flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                   <Calendar className="h-5 w-5 mr-2" />
//                   Timeline
//                 </h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
//                       Created Date
//                     </label>
//                     <p className={`mt-1 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                       {formatDate(data.createdAt || data.createdDate)}
//                     </p>
//                   </div>
//                   <div>
//                     <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
//                       Last Updated
//                     </label>
//                     <p className={`mt-1 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                       {formatDate(data.modifiedAt || data.lastUpdated || data.updatedDate)}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Schema Information (if available) */}
//               {(data.expectedSchema || data.schema) && (
//                 <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
//                   <h4 className={`text-lg font-semibold mb-4 flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                     <FileText className="h-5 w-5 mr-2" />
//                     Schema Information
//                   </h4>
//                   <div className="space-y-2">
//                     {(data.expectedSchema || data.schema || []).map((column, index) => (
//                       <div key={index} className={`flex items-center justify-between p-2 ${isDark ? 'bg-gray-600' : 'bg-white'} rounded`}>
//                         <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                           {column.name || column}
//                         </span>
//                         <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
//                           {column.type || 'string'}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Additional Information (if available) */}
//               {(data.containerName || data.azureConfig) && (
//                 <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
//                   <h4 className={`text-lg font-semibold mb-4 flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                     <Info className="h-5 w-5 mr-2" />
//                     Additional Configuration
//                   </h4>
//                   <div className="space-y-3">
//                     {data.containerName && data.containerName !== ' ' && (
//                       <div>
//                         <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
//                           Container Configuration
//                         </label>
//                         <pre className={`mt-1 text-xs ${isDark ? 'text-white' : 'text-gray-900'} bg-gray-100 dark:bg-gray-600 p-2 rounded overflow-x-auto`}>
//                           {data.containerName}
//                         </pre>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Footer */}
//           <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
//             <button
//               onClick={onClose}
//               className={`px-6 py-2 rounded-lg border transition-colors ${
//                 isDark
//                   ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
//                   : 'border-gray-300 text-gray-700 hover:bg-gray-100'
//               }`}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// Replace the DatasetDetailsModal component (starting from line 7) with this complete, fixed version:

// Dataset Details Modal
const DatasetDetailsModal = ({ dataset, isOpen, onClose, isDark }) => {
  const [loading, setLoading] = useState(false);
  const [fullDataset, setFullDataset] = useState(null);
  const [error, setError] = useState(null);

  // Fetch full dataset details when modal opens
  useEffect(() => {
    if (!isOpen || !dataset) return;

    const fetchDatasetDetails = async () => {
      if (!dataset.id) {
        console.log('No dataset ID, using provided data');
        setFullDataset(dataset);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching details for dataset ID:', dataset.id);
        const response = await datasetsAPI.getDatasetById(dataset.id);
        console.log('Dataset details response:', response);
        setFullDataset(response);
      } catch (err) {
        console.error('Error fetching dataset details:', err);
        
        // Check if it's a network/API error
        if (err.message.includes('fetch') || err.message.includes('404')) {
          // If API call fails, use the dataset data we already have
          console.warn('API call failed, using fallback data:', err.message);
          console.log('Fallback dataset data:', dataset);
          setFullDataset(dataset);
        } else {
          setError('Failed to load dataset details');
          setFullDataset(dataset); // Fallback to basic data
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDatasetDetails();
  }, [isOpen, dataset]);

  if (!isOpen) return null;

  const data = fullDataset || dataset;

  // Helper function to safely parse schema data
  const parseSchemaData = (schemaData) => {
    if (!schemaData) return [];
    
    // If it's already an array, return it
    if (Array.isArray(schemaData)) {
      return schemaData;
    }
    
    // If it's a string, try to parse it as JSON
    if (typeof schemaData === 'string') {
      try {
        const parsed = JSON.parse(schemaData);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.log('Failed to parse schema as JSON:', e);
      }
    }
    
    // Return empty array as fallback
    return [];
  };

  // Parse schema data safely
  const schemaData = parseSchemaData(data.expectedSchema || data.schema);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    return status === 'Active' 
      ? 'text-green-600 dark:text-green-400' 
      : 'text-red-600 dark:text-red-400';
  };

  const getStatusIcon = (status) => {
    return status === 'Active' 
      ? <CheckCircle className="h-4 w-4" />
      : <XCircle className="h-4 w-4" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Database className={`h-8 w-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <div>
                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {data?.name || 'Dataset Details'}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusIcon(data.isActive==true?"Active":"Inactive")}
                  <span className={`text-sm font-medium ${getStatusColor(data.isActive==true?"Active":"Inactive")}`}>
                    {data.isActive==true?"Active":"Inactive" || 'Unknown'}
                    {console.log('Dataset status:483', data.isActive==true?"Active":"Inactive")}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading dataset details...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-200">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Error Loading Details</p>
                  <p className="mt-1 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          {data && !loading && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
                <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Dataset Name
                    </label>
                    <p className={`mt-1 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {data.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Dataset ID
                    </label>
                    <p className={`mt-1 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {data.id || 'N/A'}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Description
                    </label>
                    <p className={`mt-1 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {data.description || 'No description available'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Storage Configuration */}
              <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
                <h4 className={`text-lg font-semibold mb-4 flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <Server className="h-5 w-5 mr-2" />
                  Storage Configuration
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Storage Type
                    </label>
                    <p className={`mt-1 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {data.storageType || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      File Type
                    </label>
                    <p className={`mt-1 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {data.fileType?.toUpperCase() || 'N/A'}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <FolderOpen className="h-4 w-4 inline mr-1" />
                      Folder Path
                    </label>
                    <p className={`mt-1 text-sm ${isDark ? 'text-white' : 'text-gray-900'} font-mono bg-gray-100 dark:bg-gray-600 p-2 rounded`}>
                      {data.folderPath || data.filePath || 'N/A'}
                    </p>
                  </div>
                  {data.delimiter && (
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Delimiter
                      </label>
                      <p className={`mt-1 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {data.delimiter === ',' ? 'Comma (,)' :
                         data.delimiter === ';' ? 'Semicolon (;)' :
                         data.delimiter === '\t' ? 'Tab (\\t)' :
                         data.delimiter === '|' ? 'Pipe (|)' :
                         data.delimiter}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Monitoring Configuration */}
              <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
                <h4 className={`text-lg font-semibold mb-4 flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <Activity className="h-5 w-5 mr-2" />
                  Monitoring Configuration
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <Clock className="h-4 w-4 inline mr-1" />
                      Check Interval
                    </label>
                    <p className={`mt-1 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {data.checkIntervalMinutes 
                        ? `Every ${data.checkIntervalMinutes} minutes` 
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <User className="h-4 w-4 inline mr-1" />
                      Owning Team
                    </label>
                    <p className={`mt-1 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {data.owningTeam || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Schema Learning
                    </label>
                    <div className="flex items-center mt-1">
                      {data.enableSchemaLearning ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          <span className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>Enabled</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-500 mr-1" />
                          <span className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>Disabled</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Data Quality Checks
                    </label>
                    <div className="flex items-center mt-1">
                      {data.enableDataQualityChecks ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          <span className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>Enabled</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-500 mr-1" />
                          <span className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>Disabled</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
                <h4 className={`text-lg font-semibold mb-4 flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <Calendar className="h-5 w-5 mr-2" />
                  Timeline
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Created Date
                    </label>
                    <p className={`mt-1 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {formatDate(data.createdAt || data.createdDate)}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Last Updated
                    </label>
                    <p className={`mt-1 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {formatDate(data.modifiedAt || data.lastUpdated || data.updatedDate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Schema Information (FIXED) */}
              {schemaData.length > 0 && (
                <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
                  <h4 className={`text-lg font-semibold mb-4 flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <FileText className="h-5 w-5 mr-2" />
                    Schema Information
                  </h4>
                  <div className="space-y-2">
                    {schemaData.map((column, index) => (
                      <div key={index} className={`flex items-center justify-between p-2 ${isDark ? 'bg-gray-600' : 'bg-white'} rounded`}>
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {column.name || column}
                        </span>
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {column.type || 'string'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Configuration */}
              {(data.containerName || data.azureConfig) && (
                <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
                  <h4 className={`text-lg font-semibold mb-4 flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <Info className="h-5 w-5 mr-2" />
                    Additional Configuration
                  </h4>
                  <div className="space-y-3">
                    {data.containerName && data.containerName !== ' ' && (
                      <div>
                        <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          Container Configuration
                        </label>
                        <pre className={`mt-1 text-xs ${isDark ? 'text-white' : 'text-gray-900'} bg-gray-100 dark:bg-gray-600 p-2 rounded overflow-x-auto`}>
                          {data.containerName}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-lg border transition-colors ${
                isDark
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



// Edit Dataset Modal
const EditDatasetModal = ({ dataset, isOpen, onClose, onSave, isDark }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    storageType: 'local',
    folderPath: '',
    fileType: 'csv',
    delimiter: ',',
    checkIntervalMinutes: 60,
    owningTeam: 'DataEngineering',
    enableSchemaLearning: true,
    enableDataQualityChecks: false,
    status: 'Active',
    // Azure specific fields
    containerName: '',
    // Schema fields
    manualSchema: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize form data when dataset changes
  // useEffect(() => {
  //   if (dataset) {
  //     // Helper function to parse JSON fields for edit modal
  //     const parseDatasetForEdit = (datasetData) => {
  //       if (!datasetData) return datasetData;
        
  //       const parsed = { ...datasetData };
        
  //       // If description is a JSON string, parse it and extract the actual description
  //       if (parsed.description && typeof parsed.description === 'string') {
  //         try {
  //           const jsonData = JSON.parse(parsed.description);
            
  //           // If it's an object with properties, extract what we need
  //           if (typeof jsonData === 'object' && jsonData !== null) {
  //             // Extract description from JSON
  //             if (jsonData.description) {
  //               parsed.description = jsonData.description;
  //             }
              
  //             // Extract other fields that might be in the JSON
  //             if (jsonData.enableDataQualityChecks !== undefined) {
  //               parsed.enableDataQualityChecks = jsonData.enableDataQualityChecks;
  //             }
              
  //             // Keep other fields as they are, don't overwrite with JSON data
  //             // unless they're missing
  //           }
  //         } catch (e) {
  //           // If parsing fails, keep the description as is
  //           console.log('Description is not valid JSON, keeping as string:', parsed.description);
  //         }
  //       }
        
  //       console.log('Parsed dataset for edit:', parsed);
  //       return parsed;
  //     };

  //     const parsedDataset = parseDatasetForEdit(dataset);
      
  //     // Check if manual schema exists to determine auto-learn state
  //     const hasManualSchema = parsedDataset.expectedSchema && 
  //                            Array.isArray(parsedDataset.expectedSchema) && 
  //                            parsedDataset.expectedSchema.length > 0;
      
  //     setFormData({
  //       name: parsedDataset.name || '',
  //       description: parsedDataset.description || '',
  //       storageType: parsedDataset.storageType || 'local',
  //       folderPath: parsedDataset.folderPath || '',
  //       fileType: parsedDataset.fileType || 'csv',
  //       delimiter: parsedDataset.delimiter || ',',
  //       checkIntervalMinutes: parsedDataset.checkIntervalMinutes || 60,
  //       owningTeam: parsedDataset.owningTeam || 'DataEngineering',
  //       enableSchemaLearning: hasManualSchema ? false : (parsedDataset.enableSchemaLearning !== undefined ? parsedDataset.enableSchemaLearning : true),
  //       enableDataQualityChecks: parsedDataset.enableDataQualityChecks !== undefined ? parsedDataset.enableDataQualityChecks : false,
  //       status: parsedDataset.status || 'Active',
  //       // Azure specific
  //       containerName: parsedDataset.containerName || '',
  //       // Schema
  //       manualSchema: parsedDataset.expectedSchema || []
  //     });
  //     setError(null);
  //   }
  // }, [dataset]);

// Replace the useEffect in EditDatasetModal (around line 740-800) with this fixed version:

useEffect(() => {
    if (dataset) {
      // Helper function to parse JSON fields for edit modal
      const parseDatasetForEdit = (datasetData) => {
        if (!datasetData) return datasetData;
        
        const parsed = { ...datasetData };
        
        // If description is a JSON string, parse it and extract the actual description
        if (parsed.description && typeof parsed.description === 'string') {
          try {
            const jsonData = JSON.parse(parsed.description);
            
            // If it's an object with properties, extract what we need
            if (typeof jsonData === 'object' && jsonData !== null) {
              // Extract description from JSON
              if (jsonData.description) {
                parsed.description = jsonData.description;
              }
              
              // Extract other fields that might be in the JSON
              if (jsonData.enableDataQualityChecks !== undefined) {
                parsed.enableDataQualityChecks = jsonData.enableDataQualityChecks;
              }
              
              // Keep other fields as they are, don't overwrite with JSON data
              // unless they're missing
            }
          } catch (e) {
            // If parsing fails, keep the description as is
            console.log('Description is not valid JSON, keeping as string:', parsed.description);
          }
        }
        
        console.log('Parsed dataset for edit:', parsed);
        return parsed;
      };

      const parsedDataset = parseDatasetForEdit(dataset);
      
      // Safely parse manual schema - ensure it's always an array
      let manualSchemaArray = [];
      if (parsedDataset.expectedSchema) {
        if (Array.isArray(parsedDataset.expectedSchema)) {
          manualSchemaArray = parsedDataset.expectedSchema;
        } else if (typeof parsedDataset.expectedSchema === 'string') {
          try {
            const parsedSchema = JSON.parse(parsedDataset.expectedSchema);
            if (Array.isArray(parsedSchema)) {
              manualSchemaArray = parsedSchema;
            }
          } catch (e) {
            console.log('Failed to parse expectedSchema as JSON:', e);
            manualSchemaArray = [];
          }
        }
      }
      
      // Also check manualSchema field if it exists
      if (parsedDataset.manualSchema && !manualSchemaArray.length) {
        if (Array.isArray(parsedDataset.manualSchema)) {
          manualSchemaArray = parsedDataset.manualSchema;
        } else if (typeof parsedDataset.manualSchema === 'string') {
          try {
            const parsedSchema = JSON.parse(parsedDataset.manualSchema);
            if (Array.isArray(parsedSchema)) {
              manualSchemaArray = parsedSchema;
            }
          } catch (e) {
            console.log('Failed to parse manualSchema as JSON:', e);
            manualSchemaArray = [];
          }
        }
      }
      
      // Check if manual schema exists to determine auto-learn state
      const hasManualSchema = manualSchemaArray.length > 0;
      
      setFormData({
        name: parsedDataset.name || '',
        description: parsedDataset.description || '',
        storageType: parsedDataset.storageType || 'local',
        folderPath: parsedDataset.folderPath || '',
        fileType: parsedDataset.fileType || 'csv',
        delimiter: parsedDataset.delimiter || ',',
        checkIntervalMinutes: parsedDataset.checkIntervalMinutes || 60,
        owningTeam: parsedDataset.owningTeam || 'DataEngineering',
        enableSchemaLearning: hasManualSchema ? false : (parsedDataset.enableSchemaLearning !== undefined ? parsedDataset.enableSchemaLearning : true),
        enableDataQualityChecks: parsedDataset.enableDataQualityChecks !== undefined ? parsedDataset.enableDataQualityChecks : false,
        status: parsedDataset.status || 'Active',
        // Azure specific
        containerName: parsedDataset.containerName || '',
        // Schema - always ensure it's an array
        manualSchema: manualSchemaArray
      });
      setError(null);
    }
  }, [dataset]);

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // When storage type changes, reset Azure-specific fields
      if (field === 'storageType') {
        if (value === 'local') {
          newData.containerName = '';
        }
      }
      
      return newData;
    });
  };

  // const handleSave = async () => {
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     // Basic validation
  //     if (!formData.name.trim()) {
  //       setError('Dataset name is required');
  //       return;
  //     }
  //     if (!formData.description.trim()) {
  //       setError('Description is required');
  //       return;
  //     }
  //     if (!formData.folderPath.trim()) {
  //       setError('Folder path is required');
  //       return;
  //     }
      
  //     // Azure-specific validation
  //     if (formData.storageType === 'azure' && !formData.containerName.trim()) {
  //       setError('Container name is required for Azure storage');
  //       return;
  //     }

  //     // Prepare data for API
  //     const updateData = {
  //       name: formData.name,
  //       description: formData.description,
  //       storageType: formData.storageType,
  //       folderPath: formData.folderPath,
  //       fileType: formData.fileType,
  //       delimiter: formData.delimiter,
  //       checkIntervalMinutes: formData.checkIntervalMinutes,
  //       owningTeam: formData.owningTeam,
  //       enableSchemaLearning: formData.enableSchemaLearning,
  //       enableDataQualityChecks: formData.enableDataQualityChecks,
  //       status: formData.status,
  //       // Always include these fields even if empty
  //       containerName: formData.storageType === 'azure' ? formData.containerName : '',
  //       manualSchema: formData.manualSchema || []
  //     };

  //     await onSave(dataset.id, updateData);
  //     onClose();
  //   } catch (err) {
  //     console.error('Error updating dataset:', err);
  //     setError('Failed to update dataset. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  // Replace the handleSave function in EditDatasetModal (around line 925-970) with this fixed version:

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      // Basic validation
      if (!formData.name.trim()) {
        setError('Dataset name is required');
        return;
      }
      if (!formData.description.trim()) {
        setError('Description is required');
        return;
      }
      if (!formData.folderPath.trim()) {
        setError('Folder path is required');
        return;
      }
      
      // Azure-specific validation
      if (formData.storageType === 'azure' && !formData.containerName.trim()) {
        setError('Container name is required for Azure storage');
        return;
      }

      // Prepare data for API - convert manualSchema array to JSON string
      const updateData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        storageType: formData.storageType,
        folderPath: formData.folderPath.trim(),
        fileType: formData.fileType,
        delimiter: formData.delimiter,
        checkIntervalMinutes: formData.checkIntervalMinutes,
        owningTeam: formData.owningTeam,
        enableSchemaLearning: formData.enableSchemaLearning,
        enableDataQualityChecks: formData.enableDataQualityChecks,
        status: formData.status,
        // Always include these fields - convert manualSchema to string
        containerName: formData.storageType === 'azure' ? formData.containerName.trim() : '',
        manualSchema: Array.isArray(formData.manualSchema) && formData.manualSchema.length > 0 
          ? JSON.stringify(formData.manualSchema) 
          : ''
      };

      console.log('Sending update data:', updateData);
      await onSave(dataset.id, updateData);
      onClose();
    } catch (err) {
      console.error('Error updating dataset:', err);
      setError(err.message || 'Failed to update dataset. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Edit Dataset
            </h3>
            <button
              onClick={onClose}
              className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-200">
              <div className="flex items-start">
                <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">Error</p>
                  <p className="mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Dataset Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Dataset Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                  }`}
                placeholder="Enter dataset name"
              />
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                  }`}
                placeholder="Describe your dataset"
              />
            </div>

            {/* Storage Type and File Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <option value="azure">Azure Blob Storage</option>
                </select>
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
                  <option value="csv">CSV</option>
                  <option value="txt">TXT</option>
                </select>
              </div>
            </div>

            {/* Folder Path */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {formData.storageType === 'azure' ? 'Container Path *' : 'Folder Path *'}
              </label>
              <input
                type="text"
                value={formData.folderPath}
                onChange={(e) => handleInputChange('folderPath', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                  }`}
                placeholder={formData.storageType === 'azure' 
                  ? "e.g., data/datasets/customer-data" 
                  : "e.g., C:\\Data\\Datasets\\CustomerData"}
              />
            </div>

            {/* Azure-specific fields */}
            {formData.storageType === 'azure' && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Container Name *
                </label>
                <input
                  type="text"
                  value={formData.containerName}
                  onChange={(e) => handleInputChange('containerName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  placeholder="e.g., datasets-container"
                />
              </div>
            )}

            {/* Check Interval and Owning Team */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Check Interval (minutes)
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
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Owning Team
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
              </div>
            </div>

            {/* CSV specific options */}
            {formData.fileType === 'csv' && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  CSV Delimiter
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
                  <option value="\t">Tab</option>
                  <option value="|">Pipe (|)</option>
                </select>
              </div>
            )}


            {/* Schema Information */}
            {formData.manualSchema && Array.isArray(formData.manualSchema) && formData.manualSchema.length > 0 && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Current Schema ({formData.manualSchema.length} columns)
                </label>
                <div className={`max-h-32 overflow-y-auto border rounded-lg p-3 ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
                  <div className="space-y-1">
                    {formData.manualSchema.map((column, index) => (
                      <div key={index} className={`text-sm flex justify-between ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span className="font-medium">{column.name || column}</span>
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {column.type || 'string'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableSchemaLearning"
                  checked={formData.enableSchemaLearning}
                  onChange={(e) => handleInputChange('enableSchemaLearning', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableSchemaLearning" className={`ml-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Auto-learn schema from first file
                  {formData.manualSchema && Array.isArray(formData.manualSchema) && formData.manualSchema.length > 0 && (
                    <span className={`ml-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      (Manual schema already exists)
                    </span>
                  )}
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
                  Enable data quality checks
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="datasetStatus"
                  checked={formData.status === 'Active'}
                  onChange={(e) => handleInputChange('status', e.target.checked ? 'Active' : 'Inactive')}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="datasetStatus" className={`ml-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Dataset Active
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              disabled={loading}
              className={`px-4 py-2 rounded-lg border transition-colors ${isDark
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50'
                }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
// Delete Confirmation Modal
const DeleteConfirmationModal = ({ dataset, isOpen, onClose, onConfirm, isDark, deleteError, deleteLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-md w-full p-6`}>
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Delete Dataset
          </h3>
        </div>

        <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Are you sure you want to delete "<strong>{dataset?.name}</strong>"? This action cannot be undone.
        </p>

        {/* Delete Error Display */}
        {deleteError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-200">
            <div className="flex items-start">
              <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium">Delete Failed</p>
                <p className="mt-1">{deleteError}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-3 justify-end">
          <button
            onClick={onClose}
            disabled={deleteLoading}
            className={`px-4 py-2 rounded-lg border transition-colors ${isDark
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50'
              : 'border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50'
              }`}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(dataset.id)}
            disabled={deleteLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {deleteLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{deleteLoading ? 'Deleting...' : 'Delete Dataset'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Configured Datasets Page
export const ConfiguredDatasetsPage = ({ onCreateNew }) => {
  const { isDark } = useTheme();
  const [deleteError, setDeleteError] = useState(null);

  // State management
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiConnected, setApiConnected] = useState(true); // Track API connection status

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    dataset: null
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Edit modal state
  const [editModal, setEditModal] = useState({
    isOpen: false,
    dataset: null
  });

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dataTypeFilter, setDataTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('lastUpdated');
  const [sortOrder, setSortOrder] = useState('desc');
  // Details modal state
  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    dataset: null
  });
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Statistics state
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    monitoringTypes: 0
  });

  // Fetch datasets from API
  const fetchDatasets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        dataType: dataTypeFilter !== 'all' ? dataTypeFilter : undefined,
        sortBy,
        sortOrder
      };

      const response = await datasetsAPI.getDatasets(params);

      // API call successful
      setApiConnected(true);
      setDatasets(response.datasets || response.data || []);
      setTotalItems(response.pagination?.total || response.total || 0);
      setTotalPages(response.pagination?.totalPages || Math.ceil((response.total || 0) / itemsPerPage));

      // Update statistics
      if (response.stats) {
        setStats(response.stats);
      } else {
        // Calculate stats from datasets if not provided by API
        const total = response.datasets?.length || 0;
        const active = response.datasets?.filter(d => d.status === 'Active').length || 0;
        const dataTypes = new Set(response.datasets?.map(d => d.dataType)).size || 0;

        setStats({
          total,
          active,
          inactive: total - active,
          monitoringTypes: dataTypes
        });
      }

    } catch (err) {
      // API call failed - show error state instead of fallback data
      setApiConnected(false);
      setError(err.message || 'Failed to connect to the API server');
      console.error('Error fetching datasets:', err);

      // Clear data instead of showing mock data
      setDatasets([]);
      setStats({
        total: 0,
        active: 0,
        inactive: 0,
        monitoringTypes: 0
      });
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, statusFilter, dataTypeFilter, sortBy, sortOrder]);

  // Effect to fetch data when dependencies change
  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);

  // Reset to first page when search/filter changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, statusFilter, dataTypeFilter]);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter changes
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleDataTypeFilter = (dataType) => {
    setDataTypeFilter(dataType);
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  // Refresh data
  const handleRefresh = () => {
    fetchDatasets();
  };

  // Dismiss error
  const handleDismissError = () => {
    setError(null);
  };

  // Delete functionality
  const handleDeleteClick = (dataset) => {
    setDeleteModal({
      isOpen: true,
      dataset: dataset
    });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      dataset: null
    });
  };

  const handleDeleteConfirm = async (datasetId) => {
    setDeleteLoading(true);
    try {
      await datasetsAPI.deleteDataset(datasetId);

      // Close modal
      setDeleteModal({
        isOpen: false,
        dataset: null
      });

      // Refresh the datasets list
      await fetchDatasets();

      // Show success message (you can add a toast notification here)
      console.log('Dataset deleted successfully');

    } catch (err) {
      console.error('Error deleting dataset:', err);

      // Set a specific delete error instead of the general error
      // Don't use setError() as it shows the "Unable to Load Datasets" message
      alert(`Failed to delete dataset: ${err.message || 'Unknown error occurred'}`);

      // Alternatively, you could add a specific deleteError state
      // setDeleteError('Failed to delete dataset. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Edit functionality
  const handleEditClick = async (dataset) => {
    try {
      // Optionally fetch the full dataset details
      // const fullDataset = await datasetsAPI.getDatasetById(dataset.id);
      setEditModal({
        isOpen: true,
        dataset: dataset // or fullDataset if you fetch it
      });
    } catch (err) { 
      console.error('Error loading dataset for edit:', err);
      setError('Failed to load dataset details for editing.');
    }
  };

  const handleEditCancel = () => {
    setEditModal({
      isOpen: false,
      dataset: null
    });
  };

  const handleEditSave = async (datasetId, formData) => {
    try {
      await datasetsAPI.updateDataset(datasetId, formData);

      // Close modal
      setEditModal({
        isOpen: false,
        dataset: null
      });

      // Refresh the datasets list
      await fetchDatasets();

      console.log('Dataset updated successfully');
    } catch (err) {
      console.error('Error updating dataset:', err);
      throw err; // Re-throw to let the modal handle the error
    }
  };

    // Details functionality
const handleDetailsClick = (dataset) => {
  console.log('Opening details for dataset:', dataset);
  console.log('Dataset properties:', Object.keys(dataset));
  console.log('Description value:', dataset.description);
  console.log('Full dataset object:', JSON.stringify(dataset, null, 2));
  
  setDetailsModal({
    isOpen: true,
    dataset: dataset
  });
};

  const handleDetailsClose = () => {
    setDetailsModal({
      isOpen: false,
      dataset: null
    });
  };
  // Get filtered data for display (in case of client-side filtering)
  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = searchTerm === '' ||
      dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset.dataType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || dataset.status === statusFilter;
    const matchesDataType = dataTypeFilter === 'all' || dataset.dataType === dataTypeFilter;

    return matchesSearch && matchesStatus && matchesDataType;
  });

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Configured Datasets
            </h2>
            <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Manage your datasets and configure drift monitoring settings
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${isDark
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50'
                }`}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={onCreateNew}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create Dataset</span>
            </button>
          </div>
        </div>

        {/* Enhanced Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900 dark:border-red-700 dark:text-red-200 relative">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">Unable to Load Datasets</p>
                <p className="mt-1 text-sm">
                  Sorry, we couldn't load your datasets at the moment. Please try again later or contact support if the problem continues.
                </p>
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

        {/* API Connection Status */}
        {!apiConnected && !loading && (
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span className="font-medium">API Server Disconnected</span>
            </div>
            <p className="mt-1 text-sm">Unable to connect to the backend API. Please check your server status.</p>
          </div>
        )}

        {/* Search and Filters - Only show if API is connected */}
        {apiConnected && (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-8`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Search Datasets
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search by name or type..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                    }`}
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Data Type Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Data Type
                </label>
                <select
                  value={dataTypeFilter}
                  onChange={(e) => handleDataTypeFilter(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                    }`}
                >
                  <option value="all">All Types</option>
                  <option value="csv">CSV</option>
                  <option value="txt">TXT</option>
                  <option value="json">JSON</option>
                  <option value="xml">XML</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Sort By
                </label>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                    }`}
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="lastUpdated-desc">Last Updated (Newest)</option>
                  <option value="lastUpdated-asc">Last Updated (Oldest)</option>
                  <option value="status-asc">Status (A-Z)</option>
                  <option value="status-desc">Status (Z-A)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards - Show zeros when API is disconnected */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 ${!apiConnected ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Total Datasets
                </p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {loading ? '--' : stats.total}
                </p>
              </div>
              <Database className={`h-8 w-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 ${!apiConnected ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Active Datasets
                </p>
                <p className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  {loading ? '--' : stats.active}
                </p>
              </div>
              <Activity className={`h-8 w-8 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 ${!apiConnected ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Inactive Datasets
                </p>
                <p className={`text-2xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                  {loading ? '--' : stats.inactive}
                </p>
              </div>
              <Database className={`h-8 w-8 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 ${!apiConnected ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Monitoring Types
                </p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {loading ? '--' : stats.monitoringTypes}
                </p>
              </div>
              <Zap className={`h-8 w-8 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading datasets...</span>
          </div>
        )}

        {/* Main Content Area */}
        {!loading && (
          <>
            {/* API Disconnected - Empty State */}
            {!apiConnected ? (
              <div className="text-center py-16">
                <AlertTriangle className={`h-16 w-16 mx-auto ${isDark ? 'text-red-400' : 'text-red-500'} mb-4`} />
                <h3 className={`text-xl font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  Unable to Load Datasets
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6 max-w-md mx-auto`}>
                  The application cannot connect to the backend API server. Please ensure your C# API is running and try refreshing the page.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mx-auto disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Retry Connection</span>
                  </button>
                  <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Or <button onClick={onCreateNew} className="text-blue-600 hover:text-blue-700 underline">create your first dataset</button> once the API is available
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Datasets Grid - Only show when API is connected */}
                {filteredDatasets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {filteredDatasets.map((dataset) => (
                      <div
                        key={dataset.id}
                        className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <Database className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                            <div>
                              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {dataset.name}
                              </h3>
                              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {dataset.dataType}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${dataset.status === 'Active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}
                          >
                            {dataset.status}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Last Updated:</span>
                            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{dataset.lastUpdated}</span>
                          </div>
                          {dataset.owningTeam && (
                            <div className="flex justify-between text-sm">
                              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Team:</span>
                              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{dataset.owningTeam}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditClick(dataset)}
                            className="flex-1 flex items-center justify-center space-x-1 text-sm px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                            <Edit className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDetailsClick(dataset)}
                            className={`flex-1 flex items-center justify-center space-x-1 text-sm px-3 py-2 rounded border transition-colors ${isDark
                              ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                              }`}>
                            <Eye className="h-3 w-3" />
                            <span>Details</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(dataset)}
                            className="flex items-center justify-center px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-800 transition-colors"
                            title="Delete Dataset"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* No datasets found */
                  <div className="text-center py-12">
                    <Database className={`h-16 w-16 mx-auto ${isDark ? 'text-gray-600' : 'text-gray-400'} mb-4`} />
                    <h3 className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-900'} mb-2`}>
                      {searchTerm || statusFilter !== 'all' || dataTypeFilter !== 'all'
                        ? 'No datasets match your filters'
                        : 'No datasets configured'}
                    </h3>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                      {searchTerm || statusFilter !== 'all' || dataTypeFilter !== 'all'
                        ? 'Try adjusting your search or filters to find datasets'
                        : 'Get started by creating your first dataset for schema drift monitoring'}
                    </p>
                    <button
                      onClick={onCreateNew}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create First Dataset</span>
                    </button>
                  </div>
                )}

                {/* Pagination - Only show when we have data and multiple pages */}
                {filteredDatasets.length > 0 && totalPages > 1 && (
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      {/* Items per page */}
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Show
                        </span>
                        <select
                          value={itemsPerPage}
                          onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                          className={`px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDark
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                            }`}
                        >
                          <option value={6}>6</option>
                          <option value={9}>9</option>
                          <option value={12}>12</option>
                          <option value={24}>24</option>
                        </select>
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          per page
                        </span>
                      </div>

                      {/* Page info */}
                      <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
                      </div>

                      {/* Pagination controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`flex items-center space-x-1 px-3 py-2 rounded border transition-colors ${currentPage === 1
                            ? isDark
                              ? 'border-gray-700 text-gray-500 cursor-not-allowed'
                              : 'border-gray-200 text-gray-400 cursor-not-allowed'
                            : isDark
                              ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span>Previous</span>
                        </button>

                        {/* Page numbers */}
                        <div className="flex space-x-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNumber;
                            if (totalPages <= 5) {
                              pageNumber = i + 1;
                            } else if (currentPage <= 3) {
                              pageNumber = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNumber = totalPages - 4 + i;
                            } else {
                              pageNumber = currentPage - 2 + i;
                            }

                            return (
                              <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={`px-3 py-2 rounded transition-colors ${currentPage === pageNumber
                                  ? 'bg-blue-600 text-white'
                                  : isDark
                                    ? 'text-gray-300 hover:bg-gray-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                  }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`flex items-center space-x-1 px-3 py-2 rounded border transition-colors ${currentPage === totalPages
                            ? isDark
                              ? 'border-gray-700 text-gray-500 cursor-not-allowed'
                              : 'border-gray-200 text-gray-400 cursor-not-allowed'
                            : isDark
                              ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                          <span>Next</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Edit Dataset Modal */}
        <EditDatasetModal
          dataset={editModal.dataset}
          isOpen={editModal.isOpen}
          onClose={handleEditCancel}
          onSave={handleEditSave}
          isDark={isDark}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          dataset={deleteModal.dataset}
          isOpen={deleteModal.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          isDark={isDark}
          deleteError={deleteError}
          deleteLoading={deleteLoading}
        />

        {/* Dataset Details Modal */}
        <DatasetDetailsModal
          dataset={detailsModal.dataset}
          isOpen={detailsModal.isOpen}
          onClose={handleDetailsClose}
          isDark={isDark}
        />
      </div>
    </div>
  );
};