import React, { useState, useEffect } from 'react';
import { 
  Database, 
  AlertTriangle, 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3, 
  Users, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Eye,
  Plus,
  Activity,
  FileText,
  Gauge
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { driftReportsAPI } from '../api';

export const HomePage = ({ setCurrentPage }) => {
  const { isDark } = useTheme();
  const [stats, setStats] = useState({
    totalDatasets: 0,
    totalReports: 0,
    highSeverityReports: 0,
    recentActivity: 0
  });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch recent reports for stats
        const reportsResponse = await driftReportsAPI.getDriftReports({ limit: 10 });
        const reports = reportsResponse.data || [];
        
        setRecentReports(reports.slice(0, 5)); // Show only 5 most recent
        
        // Calculate stats
        const highSeverity = reports.filter(r => r.severity === 'High').length;
        const uniqueDatasets = new Set(reports.map(r => r.datasetId)).size;
        
        setStats({
          totalDatasets: uniqueDatasets || 3, // Fallback for demo
          totalReports: reports.length || 8,
          highSeverityReports: highSeverity,
          recentActivity: reports.filter(r => {
            const reportDate = new Date(r.detectedAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return reportDate > weekAgo;
          }).length
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback stats for demo
        setStats({
          totalDatasets: 3,
          totalReports: 8,
          highSeverityReports: 2,
          recentActivity: 5
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Real-time Monitoring",
      description: "Continuously monitor your data pipelines for schema and distribution changes",
      color: "blue"
    },
    {
      icon: Zap,
      title: "Instant Alerts",
      description: "Get notified immediately when critical drift is detected in your datasets",
      color: "yellow"
    },
    {
      icon: BarChart3,
      title: "Detailed Analytics",
      description: "Comprehensive reports with severity scoring and impact analysis",
      color: "green"
    },
    {
      icon: Database,
      title: "Multi-Source Support",
      description: "Monitor datasets from various sources and formats seamlessly",
      color: "purple"
    }
  ];

  const quickActions = [
    {
      icon: Plus,
      title: "Add New Dataset",
      description: "Configure monitoring for a new data source",
      action: () => setCurrentPage('create-dataset'),
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      icon: BarChart3,
      title: "View Reports",
      description: "Browse all drift detection reports",
      action: () => setCurrentPage('reports'),
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      icon: Database,
      title: "Manage Datasets",
      description: "Configure existing dataset monitoring",
      action: () => setCurrentPage('datasets'),
      color: "bg-purple-600 hover:bg-purple-700"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: isDark ? 'text-blue-400 bg-blue-900' : 'text-blue-600 bg-blue-100',
      yellow: isDark ? 'text-yellow-400 bg-yellow-900' : 'text-yellow-600 bg-yellow-100',
      green: isDark ? 'text-green-400 bg-green-900' : 'text-green-600 bg-green-100',
      purple: isDark ? 'text-purple-400 bg-purple-900' : 'text-purple-600 bg-purple-100'
    };
    return colors[color] || colors.blue;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High':
        return isDark ? 'text-red-400 bg-red-900' : 'text-red-800 bg-red-100';
      case 'Medium':
        return isDark ? 'text-yellow-400 bg-yellow-900' : 'text-yellow-800 bg-yellow-100';
      case 'Low':
        return isDark ? 'text-green-400 bg-green-900' : 'text-green-800 bg-green-100';
      default:
        return isDark ? 'text-gray-400 bg-gray-900' : 'text-gray-800 bg-gray-100';
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          {/* Logo with pulse and bounce animation */}
          <div className={`flex justify-center mb-6 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
          }`}>
            <div className={`p-4 rounded-full ${isDark ? 'bg-blue-900' : 'bg-blue-100'} 
              animate-pulse hover:animate-bounce transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl`}>
              <TrendingUp className={`h-16 w-16 ${isDark ? 'text-blue-400' : 'text-blue-600'} 
                animate-pulse`} />
            </div>
          </div>
          
          {/* Title with typewriter effect */}
          <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 
            transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          } hover:scale-105 transition-transform`}>
            Schema Drift Detector
          </h1>
          
          {/* Subtitle with slide-in animation */}
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto mb-8 
            transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            Monitor your data with confidence. Detect schema changes, distribution shifts
            {/* ,and data quality */}
             issues before they impact your business operations.
          </p>
          
          {/* Buttons with staggered animation */}
          <div className={`flex justify-center space-x-4 transform transition-all duration-1000 delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <button
              onClick={() => setCurrentPage('create-dataset')}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg 
                hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg 
                transform hover:-translate-y-1"
            >
              <Plus className="h-5 w-5 animate-pulse" />
              <span>Get Started</span>
            </button>
            <button
              onClick={() => setCurrentPage('reports')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg border transition-all duration-300 
                hover:scale-105 hover:shadow-lg transform hover:-translate-y-1 ${
                isDark
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Eye className="h-5 w-5" />
              <span>View Reports</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards with staggered entrance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[{
            label: "Monitored Datasets",
            value: stats.totalDatasets,
            icon: Database,
            color: "blue",
            delay: "delay-100"
          },
          {
            label: "Total Reports",
            value: stats.totalReports,
            icon: FileText,
            color: "green",
            delay: "delay-200"
          },
          {
            label: "Critical Issues",
            value: stats.highSeverityReports,
            icon: AlertTriangle,
            color: "red",
            delay: "delay-300"
          },
          {
            label: "Recent Activity",
            value: stats.recentActivity,
            icon: Activity,
            color: "purple",
            delay: "delay-400"
          }
        ].map((stat, index) => (
            
              <div key={index} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 
                transform transition-all duration-1000 ${stat.delay} hover:scale-105 hover:shadow-xl 
                hover:-translate-y-2 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="flex items-center justify-between">
                  <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {stat.label}
                  </p>
                  <p className={`text-3xl font-bold ${
                    stat.color === 'red' 
                      ? isDark ? 'text-red-400' : 'text-red-600'
                      : stat.color === 'green'
                      ? isDark ? 'text-green-400' : 'text-green-600'
                      : stat.color === 'purple'
                      ? isDark ? 'text-purple-400' : 'text-purple-600'
                      : isDark ? 'text-blue-400' : 'text-blue-600'
                  } animate-pulse`}>
                    {loading ? '...' : stat.value}
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${
                  stat.color === 'red' 
                    ? isDark ? 'text-red-400' : 'text-red-600'
                    : stat.color === 'green'
                    ? isDark ? 'text-green-400' : 'text-green-600'
                    : stat.color === 'purple'
                    ? isDark ? 'text-purple-400' : 'text-purple-600'
                    : isDark ? 'text-blue-400' : 'text-blue-600'
                } hover:animate-bounce`} />
              </div>
            </div>
          ))}
        </div>

        {/* Features Section with wave animation */}
        <div className={`mb-12 transform transition-all duration-1000 delay-600 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-8 text-center 
            hover:scale-105 transition-transform duration-300`}>
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 
                transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-2
                animate-fade-in-up`} 
                style={{ animationDelay: `${800 + index * 100}ms` }}>
                <div className={`p-3 rounded-lg ${getColorClasses(feature.color)} w-fit mb-4 
                  hover:animate-spin transition-all duration-300`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions and Recent Reports with slide animations */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 transform transition-all duration-1000 delay-1000 ${
          isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
        }`}>
          {/* Quick Actions */}
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 
            hover:shadow-xl transition-all duration-300`}>
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
              Quick Actions
            </h3>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`w-full flex items-center justify-between p-4 rounded-lg ${action.color} 
                    text-white transition-all duration-300 hover:scale-105 hover:shadow-lg 
                    transform hover:-translate-y-1 group`}
                >
                  <div className="flex items-center space-x-3">
                    <action.icon className="h-5 w-5 group-hover:animate-bounce" />
                    <div className="text-left">
                      <p className="font-medium">{action.title}</p>
                      <p className="text-sm opacity-90">{action.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              ))}
            </div>
          </div>

          {/* Recent Reports */}
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 
            hover:shadow-xl transition-all duration-300 transform transition-all duration-1000 delay-1200 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Recent Reports
              </h3>
              <button
                onClick={() => setCurrentPage('reports')}
                className={`text-sm px-3 py-1 rounded border transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                View All
              </button>
            </div>
            
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`animate-pulse p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className={`h-4 rounded mb-2 ${isDark ? 'bg-gray-600' : 'bg-gray-200'} animate-pulse`}></div>
                    <div className={`h-3 rounded w-3/4 ${isDark ? 'bg-gray-600' : 'bg-gray-200'} animate-pulse`}></div>
                  </div>
                ))}
              </div>
            ) : recentReports.length > 0 ? (
              <div className="space-y-3">
                {recentReports.map((report, index) => (
                  <div key={report.id} 
                    className={`p-3 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'} 
                    hover:scale-102 hover:shadow-md transition-all duration-300 transform 
                    animate-fade-in-up`}
                    style={{ animationDelay: `${1400 + index * 100}ms` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {report.datasetName}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(report.severity)} 
                        animate-pulse`}>
                        {report.severity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {report.driftType} • Score: {report.score}
                      </span>
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>
                        {new Date(report.detectedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Gauge className={`h-12 w-12 mx-auto ${isDark ? 'text-gray-600' : 'text-gray-400'} mb-3 
                  hover:animate-spin`} />
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  No reports yet. Start monitoring your datasets!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Application Benefits with entrance animation */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 
          transform transition-all duration-1000 delay-1400 hover:shadow-xl ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 text-center 
            hover:scale-105 transition-transform duration-300`}>
            Why Choose Schema Drift Detector?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
              icon: CheckCircle,
              title: "Proactive Monitoring",
              description: "Catch data issues before they impact your business operations and decision-making processes.",
              color: "blue"
            },
            {
              icon: Users,
              title: "Team Collaboration", 
              description: "Share insights and reports with your team to maintain data quality across all departments.",
              color: "green"
            },
            {
              icon: Clock,
              title: "Save Time",
              description: "Automated monitoring reduces manual data validation efforts and speeds up issue resolution.",
              color: "purple"
            }
        ].map((benefit, index) => (
              <div key={index} className={`text-center transform transition-all duration-500 hover:scale-105 
                animate-fade-in-up`} 
                style={{ animationDelay: `${1600 + index * 200}ms` }}>
                <div className={`p-4 rounded-full ${
                  benefit.color === 'green' 
                    ? isDark ? 'bg-green-900' : 'bg-green-100'
                    : benefit.color === 'purple'
                    ? isDark ? 'bg-purple-900' : 'bg-purple-100'
                    : isDark ? 'bg-blue-900' : 'bg-blue-100'
                } w-fit mx-auto mb-4 hover:animate-bounce`}>
                  <benefit.icon className={`h-8 w-8 ${
                    benefit.color === 'green' 
                      ? isDark ? 'text-green-400' : 'text-green-600'
                      : benefit.color === 'purple'
                      ? isDark ? 'text-purple-400' : 'text-purple-600'
                      : isDark ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                </div>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {benefit.title}
                </h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS for additional animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};