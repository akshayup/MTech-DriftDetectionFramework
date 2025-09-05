import { useCallback, useState, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest, tokenRequest, getAccountType, hasRequiredPermissions } from "../config/authConfig";
import { graphService } from "../services/graphService";

export const useAuth = () => {
  const { instance, accounts, inProgress } = useMsal();
  const [userPhoto, setUserPhoto] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);

  const login = useCallback(async (loginType = 'popup') => {
    try {
      if (loginType === 'popup') {
        await instance.loginPopup(loginRequest);
      } else {
        await instance.loginRedirect(loginRequest);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [instance]);

  const logout = useCallback(async (logoutType = 'popup') => {
    try {
      // Clear photo cache on logout
      graphService.clearPhotoCache();
      setUserPhoto(null);
      
      if (logoutType === 'popup') {
        await instance.logoutPopup();
      } else {
        await instance.logoutRedirect();
      }
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }, [instance]);

  const getAccessToken = useCallback(async (scopes = tokenRequest.scopes) => {
    if (!accounts[0]) {
      throw new Error('No account found');
    }

    try {
      const response = await instance.acquireTokenSilent({
        ...tokenRequest,
        scopes,
        account: accounts[0]
      });
      return response.accessToken;
    } catch (error) {
      if (error.name === 'InteractionRequiredAuthError') {
        // Try to get token with popup
        const response = await instance.acquireTokenPopup({
          ...tokenRequest,
          scopes,
          account: accounts[0]
        });
        return response.accessToken;
      }
      throw error;
    }
  }, [instance, accounts]);

  const getCurrentUser = useCallback(() => {
    if (!accounts[0]) return null;

    const account = accounts[0];
    return {
      ...account,
      accountType: getAccountType(account),
      displayName: account.name || account.username,
      email: account.username,
      hasRequiredPermissions: (roles) => hasRequiredPermissions(account, roles),
      photoUrl: userPhoto
    };
  }, [accounts, userPhoto]);

  // Fetch user photo when authenticated
  const fetchUserPhoto = useCallback(async () => {
    if (!accounts[0] || photoLoading) return;

    try {
      setPhotoLoading(true);
      const accessToken = await getAccessToken(['User.Read']);
      const photoUrl = await graphService.getUserPhoto(accessToken);
      setUserPhoto(photoUrl);
    } catch (error) {
      console.error('Failed to fetch user photo:', error);
      setUserPhoto(null);
    } finally {
      setPhotoLoading(false);
    }
  }, [accounts, getAccessToken, photoLoading]);

  // Load user photo when user logs in
  useEffect(() => {
    if (accounts[0] && !userPhoto && !photoLoading) {
      fetchUserPhoto();
    }
  }, [accounts, userPhoto, photoLoading, fetchUserPhoto]);

  // Clean up photo cache periodically
  useEffect(() => {
    const interval = setInterval(() => {
      graphService.cleanExpiredCache();
    }, 60 * 60 * 1000); // Clean every hour

    return () => clearInterval(interval);
  }, []);

  const isAuthenticated = accounts.length > 0;
  const isLoading = inProgress !== 'none';

  return {
    login,
    logout,
    getAccessToken,
    getCurrentUser,
    fetchUserPhoto,
    isAuthenticated,
    isLoading,
    photoLoading,
    account: accounts[0] || null,
    instance
  };
};