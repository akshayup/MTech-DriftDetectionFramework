import React, { useState } from 'react';
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "../config/authConfig";
import { Sidebar } from './Sidebar';
import { HomePage } from './HomePage';
import { ConfiguredDatasetsPage } from './ConfiguredDatasetsPage';
import { AddNewDatasetPage } from './AddNewDatasetPage';
import { RecentDriftReportsPage } from './RecentDriftReportsPage';
import { DriftReportDetailsPage } from './DriftReportDetailsPage';
import { LoginPage } from './auth/LoginPage';

export const AuthenticatedApp = () => {
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();
  
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedReport, setSelectedReport] = useState(null);
  const [datasets, setDatasets] = useState([]);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  
  const handleCreateDataset = () => {
    setCurrentPage('create-dataset');
  };
  
  const handleAddDataset = (newDataset) => {
    setDatasets([...datasets, newDataset]);
  };
  
  const handleViewReportDetails = (report) => {
    setSelectedReport(report);
    setCurrentPage('report-details');
  };
  
  const handleBackToDatasets = () => {
    setCurrentPage('datasets');
  };
  
  const handleBackToReports = () => {
    setCurrentPage('reports');
    setSelectedReport(null);
  };

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch(e => {
      console.error(e);
    });
  };
  
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'datasets':
        return <ConfiguredDatasetsPage onCreateNew={handleCreateDataset} />;
      case 'create-dataset':
        return <AddNewDatasetPage onBack={handleBackToDatasets} onAddDataset={handleAddDataset} />;
      case 'reports':
        return <RecentDriftReportsPage onViewDetails={handleViewReportDetails} />;
      case 'report-details':
        return selectedReport ? <DriftReportDetailsPage report={selectedReport} onBack={handleBackToReports} /> : <RecentDriftReportsPage onViewDetails={handleViewReportDetails} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }
  
  return (
    <div className="flex min-h-screen">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        isExpanded={sidebarExpanded}
        setIsExpanded={setSidebarExpanded}
      />
      <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarExpanded ? 'ml-64' : 'ml-16'}`}>
        {renderPage()}
      </div>
    </div>
  );
};