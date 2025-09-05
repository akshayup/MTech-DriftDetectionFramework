import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Database, BarChart3, TrendingUp, Home, User, LogOut, Building, Mail, ChevronDown, Settings, Shield } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useAuth } from '../hooks/useAuth';

// Sidebar Navigation Component
export const Sidebar = ({ currentPage, setCurrentPage, isExpanded, setIsExpanded }) => {
  const { isDark, toggleTheme } = useTheme();
  const { getCurrentUser, logout, isAuthenticated, photoLoading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);
  const dropdownRef = useRef(null);
  
  const currentUser = getCurrentUser();
  
  useEffect(() => {
    // Trigger entrance animation after a short delay
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);
  
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, color: 'blue' },
    { id: 'datasets', label: 'Configured Datasets', icon: Database, color: 'purple' },
    { id: 'reports', label: 'Recent Drift Reports', icon: BarChart3, color: 'green' }
  ];

  // Function to get user initials
  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Function to get user's organization
  const getUserOrganization = (user) => {
    const domain = user?.username?.split('@')[1];
    
    if (user?.accountType === 'Work' && domain) {
      const orgName = domain.split('.')[0];
      return orgName.charAt(0).toUpperCase() + orgName.slice(1);
    }
    return 'Personal';
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const userMenuItems = [
    { label: 'Profile Settings', icon: Settings, action: () => console.log('Profile Settings') },
    { label: 'Security', icon: Shield, action: () => console.log('Security Settings') },
    { label: 'Sign Out', icon: LogOut, action: handleLogout, danger: true }
  ];

  // Enhanced Profile Photo Component with animations
  const ProfilePhoto = ({ size = 'w-10 h-10', showLoader = false }) => {
    if (photoLoading && showLoader) {
      return (
        <div className={`${size} rounded-full bg-gray-300 animate-pulse flex items-center justify-center border-2 border-blue-500 relative overflow-hidden`}>
          <User className="h-4 w-4 text-gray-500 animate-bounce" />
          {/* Loading shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
        </div>
      );
    }

    if (currentUser?.photoUrl) {
      return (
        <div className={`${size} rounded-full relative overflow-hidden border-2 border-blue-500 group hover:border-blue-400 transition-all duration-300 hover:scale-110 hover:shadow-lg`}>
          <img
            src={currentUser.photoUrl}
            alt="Profile"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </div>
      );
    }

    return (
      <div className={`${size} rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-sm border-2 border-blue-500 hover:border-blue-400 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:from-blue-500 hover:to-blue-600 cursor-pointer group`}>
        <span className="transition-transform duration-300 group-hover:scale-110">
          {getUserInitials(currentUser?.displayName)}
        </span>
      </div>
    );
  };

  return (
    <div className={`${isExpanded ? 'w-64' : 'w-16'} h-screen ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out shadow-lg`}>
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20px 20px, ${isDark ? '#3b82f6' : '#1e40af'} 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          animation: 'patternMove 20s linear infinite'
        }}></div>
      </div>

      {/* Header with Enhanced Animations */}
      <div className={`p-4 border-b ${isDark ? 'border-gray-700 bg-gradient-to-r from-gray-800 to-gray-850' : 'border-gray-200 bg-gradient-to-r from-gray-50 to-white'} relative overflow-hidden group`}>
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        
        <div className={`flex items-center justify-between transform transition-all duration-500 ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-80'
        }`}>
          {isExpanded && (
            <div className="flex items-center space-x-3 group">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-600' : 'bg-blue-600'} transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg relative overflow-hidden`}>
                <TrendingUp className="h-5 w-5 text-white relative z-10 transition-transform duration-500 group-hover:scale-110" />
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 transition-all duration-1000 group-hover:translate-x-full"></div>
              </div>
              <div className="transform transition-all duration-500 group-hover:translate-x-1">
                <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} transition-colors duration-300 group-hover:text-blue-500`}>
                  Drift Monitor
                </h1>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} transition-all duration-300 group-hover:text-blue-400`}>
                  Enterprise Analytics
                </p>
              </div>
            </div>
          )}
          {!isExpanded && (
            <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-600' : 'bg-blue-600'} mx-auto hover:scale-110 hover:rotate-3 transition-all duration-500 hover:shadow-lg group relative overflow-hidden`}>
              <TrendingUp className="h-5 w-5 text-white transition-transform duration-500 group-hover:scale-110" />
              {/* Pulse effect for collapsed state */}
              <div className="absolute inset-0 rounded-lg bg-blue-400 opacity-0 group-hover:opacity-30 animate-ping"></div>
            </div>
          )}
        </div>
      </div>
      
      {/* Enhanced Toggle Button with Animation */}
      <div className="p-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full flex items-center ${isExpanded ? 'justify-end' : 'justify-center'} p-2 rounded-lg transition-all duration-300 group relative overflow-hidden ${
            isDark
              ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
          } hover:shadow-lg hover:scale-105`}
        >
          <div className={`transform transition-all duration-300 group-hover:scale-125 ${isExpanded ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          {/* Ripple effect */}
          <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-20 rounded-lg transform scale-0 group-hover:scale-100 transition-all duration-300"></div>
        </button>
      </div>
      
      {/* Enhanced Navigation Items */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          const isHovered = hoveredItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`w-full flex items-center ${isExpanded ? 'space-x-3 px-3' : 'justify-center px-2'} py-3 rounded-lg transition-all duration-300 transform group relative overflow-hidden ${
                isActive
                  ? isDark
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 shadow-md'
                  : isDark
                    ? 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 hover:text-white hover:scale-105'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:text-gray-900 hover:scale-105'
              } hover:shadow-lg`}
              style={{ 
                animation: isActive ? 'activeGlow 2s ease-in-out infinite' : ''
              }}
            >
              {/* Background animation effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${
                item.color === 'blue' ? 'from-blue-500 to-blue-600' :
                item.color === 'purple' ? 'from-purple-500 to-purple-600' :
                'from-green-500 to-green-600'
              } opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-lg`}></div>
              
              {/* Icon with enhanced animations */}
              <div className="relative">
                <Icon className={`h-5 w-5 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 ${
                  isActive ? (isDark ? 'text-white' : 'text-blue-600') : ''
                } ${isHovered ? 'animate-pulse' : ''}`} />
                
                {/* Animated ring around active icon */}
                {isActive && (
                  <div className="absolute inset-0 rounded-full border-2 border-current opacity-50 animate-ping"></div>
                )}
              </div>
              
              {isExpanded && (
                <span className={`font-medium transition-all duration-300 group-hover:translate-x-1 group-hover:font-semibold ${
                  isActive ? 'font-semibold' : ''
                }`}>
                  {item.label}
                </span>
              )}
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-current rounded-l-full animate-pulse"></div>
              )}
              
              {/* Hover shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 transition-all duration-1000 group-hover:translate-x-full"></div>
            </button>
          );
        })}
      </nav>

      {/* Enhanced Bottom Section */}
      <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} relative`}>
        {/* Animated User Profile Section */}
        {isAuthenticated && currentUser && (
          <div className="relative">
            {isExpanded ? (
              <div 
                ref={dropdownRef}
                className={`m-3 mb-2 ${isDark ? 'bg-gradient-to-r from-gray-800 to-gray-750' : 'bg-gradient-to-r from-gray-50 to-white'} rounded-xl border ${isDark ? 'border-gray-600' : 'border-gray-200'} shadow-lg hover:shadow-xl transition-all duration-500 group overflow-visible relative`}
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                  className={`w-full p-3 flex items-center space-x-3 hover:${isDark ? 'bg-gray-700/50' : 'bg-gray-100/50'} transition-all duration-300 rounded-xl group-hover:scale-[1.02] relative z-10`}
                >
                  <div className="relative">
                    <ProfilePhoto showLoader={true} />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0 text-left">
                    <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'} transition-colors duration-300 group-hover:text-blue-500`}>
                      {currentUser.displayName || 'User'}
                    </p>
                    <p className={`text-xs truncate ${isDark ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300 group-hover:text-blue-400`}>
                      {getUserOrganization(currentUser)}
                    </p>
                  </div>
                  
                  <ChevronDown className={`h-4 w-4 transition-all duration-300 ${showUserMenu ? 'rotate-180 scale-110' : ''} ${isDark ? 'text-gray-400' : 'text-gray-500'} group-hover:text-blue-500`} />
                </button>

                {/* Enhanced Dropdown Menu - Fixed to expand upward */}
                {showUserMenu && (
                  <div className={`absolute bottom-full left-0 right-0 mb-2 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl border ${isDark ? 'border-gray-600' : 'border-gray-200'} shadow-2xl z-[60] overflow-hidden animate-slideUp`}>
                    <div className="p-2">
                      {userMenuItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            item.action();
                            setShowUserMenu(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-300 group relative overflow-hidden transform hover:scale-105 ${
                            item.danger
                              ? isDark
                                ? 'text-red-400 hover:bg-red-900/30 hover:shadow-lg'
                                : 'text-red-600 hover:bg-red-50 hover:shadow-lg'
                              : isDark
                                ? 'text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-lg'
                                : 'text-gray-700 hover:bg-gray-100 hover:shadow-lg'
                          }`}
                        >
                          <item.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                          <span className="text-sm font-medium transition-all duration-300 group-hover:translate-x-1">{item.label}</span>
                          
                          {/* Hover effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 transition-all duration-700 group-hover:translate-x-full"></div>
                        </button>
                      ))}
                    </div>
                    
                    {/* Enhanced Account Info */}
                    <div className={`px-3 py-3 border-t ${isDark ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'} rounded-b-xl`}>
                      <div className="flex items-center mb-2 group">
                        {currentUser.accountType === 'Work' ? (
                          <Building className={`h-3 w-3 mr-1 ${isDark ? 'text-blue-400' : 'text-blue-600'} transition-transform duration-300 group-hover:scale-125`} />
                        ) : (
                          <Mail className={`h-3 w-3 mr-1 ${isDark ? 'text-green-400' : 'text-green-600'} transition-transform duration-300 group-hover:scale-125`} />
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full transition-all duration-300 hover:scale-105 ${
                          currentUser.accountType === 'Work'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {currentUser.accountType} Account
                        </span>
                      </div>
                      <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300 hover:text-blue-400`}>
                        {currentUser.email}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Enhanced Collapsed Profile
              <div className="p-3 flex justify-center">
                <div className="relative group">
                  <div title={`${currentUser.displayName} - ${getUserOrganization(currentUser)}`}>
                    <ProfilePhoto size="w-8 h-8" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Theme Toggle */}
        <div className="p-4">
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center ${isExpanded ? 'space-x-3 px-3' : 'justify-center px-2'} py-3 rounded-lg transition-all duration-300 group relative overflow-hidden hover:scale-105 hover:shadow-lg ${
              isDark
                ? 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 hover:text-white'
                : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:text-gray-900'
            }`}
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
            
            <div className="relative transition-all duration-300 group-hover:scale-125 group-hover:rotate-12">
              {isDark ? (
                <Sun className="h-5 w-5 animate-spin" style={{ animationDuration: '8s' }} />
              ) : (
                <Moon className="h-5 w-5 animate-pulse" />
              )}
            </div>
            
            {isExpanded && (
              <span className="font-medium transition-all duration-300 group-hover:translate-x-1 group-hover:font-semibold relative">
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 transition-all duration-1000 group-hover:translate-x-full"></div>
          </button>
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes patternMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
        
        @keyframes activeGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
        }
        
        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};
