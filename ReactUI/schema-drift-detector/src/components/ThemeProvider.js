import React, { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';

// Theme Provider Component with Session Storage
export const ThemeProvider = ({ children }) => {
  // Initialize state from session storage or default to system preference
  const [isDark, setIsDark] = useState(() => {
    try {
      // First, check if user has a saved preference in session storage
      const savedTheme = sessionStorage.getItem('drift-monitor-theme');
      if (savedTheme !== null) {
        return JSON.parse(savedTheme);
      }
      
      // If no saved preference, check system preference
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      
      // Default to light theme
      return false;
    } catch (error) {
      console.warn('Error reading theme from session storage:', error);
      return false;
    }
  });
  
  // Save theme preference to session storage whenever it changes
  useEffect(() => {
    try {
      sessionStorage.setItem('drift-monitor-theme', JSON.stringify(isDark));
    } catch (error) {
      console.warn('Error saving theme to session storage:', error);
    }
  }, [isDark]);
  
  // Listen for system theme changes (optional enhancement)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleSystemThemeChange = (e) => {
        // Only update if user hasn't manually set a preference
        const savedTheme = sessionStorage.getItem('drift-monitor-theme');
        if (savedTheme === null) {
          setIsDark(e.matches);
        }
      };
      
      // Add listener for system theme changes
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      
      // Cleanup listener on unmount
      return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      };
    }
  }, []);
  
  const toggleTheme = () => {
    setIsDark(prevTheme => !prevTheme);
  };
  
  // Clear theme preference (useful for logout or reset)
  const clearThemePreference = () => {
    try {
      sessionStorage.removeItem('drift-monitor-theme');
      // Reset to system preference or default
      if (typeof window !== 'undefined' && window.matchMedia) {
        setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
      } else {
        setIsDark(false);
      }
    } catch (error) {
      console.warn('Error clearing theme preference:', error);
    }
  };
  
  return (
    <ThemeContext.Provider value={{ 
      isDark, 
      toggleTheme, 
      clearThemePreference 
    }}>
      <div className={isDark ? 'dark' : ''}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
