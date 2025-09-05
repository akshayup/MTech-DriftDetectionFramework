import { apiClient } from './apiClient';
import { jwtService } from './jwtService';

// Simple auth service for MSAL integration
class AuthService {
  constructor() {
    // Basic auth service - no JWT dependencies
  }

  // Exchange Microsoft token for JWT
  async authenticateWithMicrosoft(microsoftToken, userInfo) {
    try {
      const response = await apiClient.post(this.endpoints.login, {
        microsoftToken,
        userInfo: {
          email: userInfo.username,
          name: userInfo.name,
          displayName: userInfo.displayName,
          accountType: userInfo.accountType,
          tenantId: userInfo.tenantId
        }
      }, { includeAuth: false });

      // Store JWT tokens and user data
      if (response.token) {
        jwtService.setToken(response.token);
        jwtService.setRefreshToken(response.refreshToken);
        jwtService.setUser(response.user);
      }

      return response;
    } catch (error) {
      console.error('Microsoft authentication failed:', error);
      throw error;
    }
  }

  // Refresh JWT token
  async refreshToken() {
    try {
      const refreshToken = jwtService.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post(this.endpoints.refresh, {
        refreshToken
      }, { includeAuth: false });

      if (response.token) {
        jwtService.setToken(response.token);
        jwtService.setRefreshToken(response.refreshToken);
        jwtService.setUser(response.user);
      }

      return response;
    } catch (error) {
      console.error('Token refresh failed:', error);
      jwtService.clearAuth();
      throw error;
    }
  }

  // Logout and clear tokens
  async logout() {
    try {
      const token = jwtService.getToken();
      if (token) {
        await apiClient.post(this.endpoints.logout);
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local cleanup even if API call fails
    } finally {
      jwtService.clearAuth();
    }
  }

  // Get current user profile
  async getUserProfile() {
    try {
      const response = await apiClient.get(this.endpoints.profile);
      jwtService.setUser(response);
      return response;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw error;
    }
  }

  // Get user roles and permissions
  async getUserRoles() {
    try {
      return await apiClient.get(this.endpoints.roles);
    } catch (error) {
      console.error('Failed to get user roles:', error);
      throw error;
    }
  }

  // Get user information from MSAL account
  getUserFromAccount(account) {
    if (!account) return null;
    
    return {
      id: account.homeAccountId,
      email: account.username,
      name: account.name || account.username,
      displayName: account.name || account.username
    };
  }

  // Check if user has specific role (placeholder for future implementation)
  hasRole(user, role) {
    // TODO: Implement role checking when backend is ready
    return true;
  }

  // Check if user has specific permission (placeholder for future implementation)
  hasPermission(user, permission) {
    // TODO: Implement permission checking when backend is ready
    return true;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return jwtService.isValidToken();
  }

  // Get current user
  getCurrentUser() {
    return jwtService.getUser();
  }

  // Auto-refresh token if needed
  async ensureValidToken() {
    if (!jwtService.isValidToken()) {
      if (jwtService.getRefreshToken()) {
        try {
          await this.refreshToken();
          return true;
        } catch (error) {
          return false;
        }
      }
      return false;
    }
    
    // Refresh if token will expire soon
    if (jwtService.willExpireSoon()) {
      try {
        await this.refreshToken();
      } catch (error) {
        console.warn('Token refresh failed:', error);
      }
    }
    
    return true;
  }
}

export const authService = new AuthService();