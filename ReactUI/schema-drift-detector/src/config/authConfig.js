import { LogLevel } from "@azure/msal-browser";

// MSAL configuration for multitenant application
export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID || "72d9208a-dfeb-4900-a06a-ebc0ca84f445",
    // Using "common" authority for multitenant app that supports both organizational and personal accounts
    authority: process.env.REACT_APP_AZURE_AUTHORITY || "https://login.microsoftonline.com/consumers",
    redirectUri: process.env.REACT_APP_REDIRECT_URI || "http://localhost:3000",
    postLogoutRedirectUri: process.env.REACT_APP_POST_LOGOUT_REDIRECT_URI || "http://localhost:3000",
    // Additional settings for multitenant apps
    navigateToLoginRequestUrl: false, // Set to true if you want to return to the original page after login
    clientCapabilities: ["CP1"] // This allows for claims challenges
  },
  cache: {
    cacheLocation: "sessionStorage", // Use sessionStorage for better security
    storeAuthStateInCookie: false, // Set to true only if you need IE11 support
    secureCookies: true // Enable secure cookies in production
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(`[MSAL Error]: ${message}`);
            return;
          case LogLevel.Info:
            console.info(`[MSAL Info]: ${message}`);
            return;
          case LogLevel.Verbose:
            console.debug(`[MSAL Verbose]: ${message}`);
            return;
          case LogLevel.Warning:
            console.warn(`[MSAL Warning]: ${message}`);
            return;
          default:
            return;
        }
      },
      logLevel: process.env.NODE_ENV === 'development' ? LogLevel.Verbose : LogLevel.Warning,
      piiLoggingEnabled: false
    },
    windowHashTimeout: 60000, // Timeout for popup/redirect operations
    iframeHashTimeout: 6000,
    loadFrameTimeout: 0,
    asyncPopups: false // Set to true for better popup handling
  }
};

// Login request configuration with photo permissions
export const loginRequest = {
  scopes: ["User.Read", "User.ReadBasic.All", "openid", "profile", "email"], // Basic scopes for user info
  extraScopesToConsent: ["User.ReadBasic.All"], // Additional scopes to consent to
  prompt: "select_account" // Forces account selection - good for multitenant apps
};

// Silent token request for API calls
export const tokenRequest = {
  scopes: ["User.Read"],
  forceRefresh: false
};

// Microsoft Graph API configuration
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphUsersEndpoint: "https://graph.microsoft.com/v1.0/users",
  graphProfilePhotoEndpoint: "https://graph.microsoft.com/v1.0/me/photo/$value",
  graphProfilePhotoMetadata: "https://graph.microsoft.com/v1.0/me/photo"
};

// Protected resource scopes for your API
export const protectedResources = {
  api: {
    endpoint: process.env.REACT_APP_API_BASE_URL || "https://localhost:7122",
    scopes: {
      read: [`api://${process.env.REACT_APP_AZURE_CLIENT_ID}/access_as_user`],
      write: [`api://${process.env.REACT_APP_AZURE_CLIENT_ID}/access_as_user`]
    }
  }
};

// Account types that this app supports
export const supportedAccountTypes = {
  organizationalAccounts: true,
  personalMicrosoftAccounts: true,
  azureADMultipleOrgs: true
};

// Error handling configuration
export const msalErrorTypes = {
  INTERACTION_REQUIRED: "interaction_required",
  CONSENT_REQUIRED: "consent_required",
  LOGIN_REQUIRED: "login_required"
};

// Utility function to determine account type
export const getAccountType = (account) => {
  if (!account) return 'Unknown';
  
  // Personal accounts typically have @outlook.com, @hotmail.com, @live.com domains
  // or tenantId of "9188040d-6c67-4c5b-b112-36a304b66dad" (MSA tenant)
  if (account.tenantId === "9188040d-6c67-4c5b-b112-36a304b66dad" || 
      account.username?.includes('@outlook.com') ||
      account.username?.includes('@hotmail.com') ||
      account.username?.includes('@live.com')) {
    return 'Personal';
  }
  
  return 'Work';
};

// Utility function to check if user has required permissions
export const hasRequiredPermissions = (account, requiredRoles = []) => {
  if (!account || !requiredRoles.length) return true;
  
  const userRoles = account.idTokenClaims?.roles || [];
  return requiredRoles.some(role => userRoles.includes(role));
};