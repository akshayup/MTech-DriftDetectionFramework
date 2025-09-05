import { graphConfig } from '../config/authConfig';

class GraphService {
  constructor() {
    this.photoCache = new Map();
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  }

  // Get user profile photo
  async getUserPhoto(accessToken, userId = 'me') {
    try {
      // Check cache first
      const cacheKey = `photo_${userId}`;
      const cachedPhoto = this.photoCache.get(cacheKey);
      
      if (cachedPhoto && (Date.now() - cachedPhoto.timestamp) < this.cacheExpiry) {
        return cachedPhoto.data;
      }

      // Check if photo exists first
      const photoMetadataResponse = await fetch(
        userId === 'me' ? graphConfig.graphProfilePhotoMetadata : 
        `https://graph.microsoft.com/v1.0/users/${userId}/photo`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          }
        }
      );

      if (!photoMetadataResponse.ok) {
        if (photoMetadataResponse.status === 404) {
          // No photo available
          return null;
        }
        throw new Error(`Failed to fetch photo metadata: ${photoMetadataResponse.status}`);
      }

      // Fetch the actual photo
      const photoResponse = await fetch(
        userId === 'me' ? graphConfig.graphProfilePhotoEndpoint : 
        `https://graph.microsoft.com/v1.0/users/${userId}/photo/$value`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          }
        }
      );

      if (!photoResponse.ok) {
        throw new Error(`Failed to fetch photo: ${photoResponse.status}`);
      }

      // Convert to blob and create object URL
      const photoBlob = await photoResponse.blob();
      const photoUrl = URL.createObjectURL(photoBlob);

      // Cache the photo URL
      this.photoCache.set(cacheKey, {
        data: photoUrl,
        timestamp: Date.now()
      });

      return photoUrl;
    } catch (error) {
      console.error('Error fetching user photo:', error);
      return null;
    }
  }

  // Get user profile information
  async getUserProfile(accessToken) {
    try {
      const response = await fetch(graphConfig.graphMeEndpoint, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  // Clear photo cache (useful for logout)
  clearPhotoCache() {
    // Revoke all object URLs to prevent memory leaks
    this.photoCache.forEach(cached => {
      if (cached.data && cached.data.startsWith('blob:')) {
        URL.revokeObjectURL(cached.data);
      }
    });
    this.photoCache.clear();
  }

  // Clean expired cache entries
  cleanExpiredCache() {
    const now = Date.now();
    for (const [key, cached] of this.photoCache.entries()) {
      if ((now - cached.timestamp) >= this.cacheExpiry) {
        if (cached.data && cached.data.startsWith('blob:')) {
          URL.revokeObjectURL(cached.data);
        }
        this.photoCache.delete(key);
      }
    }
  }
}

export const graphService = new GraphService();