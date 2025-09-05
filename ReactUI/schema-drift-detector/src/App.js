import React, { useState } from 'react';
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./config/authConfig";
import { ThemeProvider } from './components/ThemeProvider';
import { AuthenticatedApp } from './components/AuthenticatedApp';
import './App.css';

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Main App Component
function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <ThemeProvider>
        <AuthenticatedApp />
      </ThemeProvider>
    </MsalProvider>
  );
}

export default App;
