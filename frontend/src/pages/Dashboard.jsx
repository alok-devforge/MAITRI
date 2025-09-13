// This is a refactored version of the Maitri App, with all components
// organized within a single file for proper compilation. The components are
// declared before they are used to ensure proper functionality.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle,
  Bell,
  Shield,
  Users,
  MapPin,
  Map,
  MessageSquare,
  Home,
  Menu,
  X,
  BarChart3,
  Clock,
  ArrowLeft,
  LogOut,
} from 'lucide-react';
import MapComponent from '../components/MapComponent'
import AlertComponent from '../components/AlertComponent';
import ReportComponent from '../components/ReportComponent';
import UserModePage from '../components/UserMode';
import AnalyticsPage from '../components/AnalyticsPage';

// =========================================================================
// Component Declarations
// =========================================================================

// Back Button Component
const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center text-slate-600 hover:text-slate-800 transition-colors mb-6"
  >
    <ArrowLeft className="w-5 h-5 mr-2" />
    <span className="font-medium">Back to Dashboard</span>
  </button>
);

// System Status in Sidebar
const SystemStatus = () => (
  <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50 bg-gradient-to-t from-slate-900 to-transparent">
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-600/30">
      <h4 className="text-white font-semibold mb-2 text-xs">System Status</h4>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-slate-300 text-xs">ML Engine</span>
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse shadow-lg shadow-green-400/50"></div>
            <span className="text-green-300 text-xs font-medium">Active</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-300 text-xs">Satellites</span>
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1 animate-pulse shadow-lg shadow-blue-400/50"></div>
            <span className="text-blue-300 text-xs font-medium">3 Online</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-300 text-xs">Network</span>
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1 animate-pulse shadow-lg shadow-emerald-400/50"></div>
            <span className="text-emerald-300 text-xs font-medium">Strong</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Quick Navigation Card
const QuickNavCard = ({ title, description, icon: Icon, color, onClick, stats }) => {
  const colorConfig = {
    red: {
      gradient: 'from-red-500 to-pink-600',
      bg: 'from-red-50 via-white to-red-50/50',
      border: 'border-red-200',
      text: 'text-red-600',
      glow: 'hover:shadow-red-200/50'
    },
    emerald: {
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'from-emerald-50 via-white to-emerald-50/50',
      border: 'border-emerald-200',
      text: 'text-emerald-600',
      glow: 'hover:shadow-emerald-200/50'
    },
    blue: {
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'from-blue-50 via-white to-blue-50/50',
      border: 'border-blue-200',
      text: 'text-blue-600',
      glow: 'hover:shadow-blue-200/50'
    }
  };
  
  const config = colorConfig[color] || colorConfig.emerald;
  
  return (
    <div
      className={`bg-gradient-to-br ${config.bg} rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl ${config.glow} transition-all duration-500 border ${config.border} transform hover:-translate-y-2 group animate-fade-in-scale`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 bg-gradient-to-br ${config.gradient} rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-right">
          <div className={`w-2 h-2 bg-gradient-to-r ${config.gradient} rounded-full animate-pulse`}></div>
        </div>
      </div>
      <h3 className="font-bold text-slate-800 mb-2 text-lg group-hover:text-slate-900 transition-colors duration-300">{title}</h3>
      <p className="text-slate-600 mb-3 leading-relaxed text-sm">{description}</p>
      <div className="flex justify-between items-center">
        <p className={`${config.text} font-semibold text-sm`}>{stats}</p>
        <div className="flex items-center text-slate-400 group-hover:text-slate-600 transition-colors duration-300">
          <span className="text-xs mr-1">Open</span>
          <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      <div className={`w-0 group-hover:w-full h-0.5 bg-gradient-to-r ${config.gradient} mt-3 transition-all duration-500 rounded-full`}></div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ icon: Icon, value, label, color }) => {
  const colorConfig = {
    emerald: {
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'from-emerald-50 via-white to-emerald-50/50',
      border: 'border-emerald-200',
      text: 'text-emerald-600',
      glow: 'hover:shadow-emerald-200/50'
    },
    red: {
      gradient: 'from-red-500 to-pink-600',
      bg: 'from-red-50 via-white to-red-50/50',
      border: 'border-red-200',
      text: 'text-red-600',
      glow: 'hover:shadow-red-200/50'
    },
    blue: {
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'from-blue-50 via-white to-blue-50/50',
      border: 'border-blue-200',
      text: 'text-blue-600',
      glow: 'hover:shadow-blue-200/50'
    },
    purple: {
      gradient: 'from-purple-500 to-violet-600',
      bg: 'from-purple-50 via-white to-purple-50/50',
      border: 'border-purple-200',
      text: 'text-purple-600',
      glow: 'hover:shadow-purple-200/50'
    }
  };
  
  const config = colorConfig[color] || colorConfig.emerald;
  
  return (
    <div className={`bg-gradient-to-br ${config.bg} rounded-xl shadow-lg p-6 border ${config.border} hover:shadow-xl ${config.glow} transition-all duration-500 transform hover:-translate-y-1 group animate-fade-in-scale`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-slate-800 mb-1 group-hover:scale-105 transition-transform duration-300">{value}</p>
          <p className="text-slate-600 font-medium text-sm">{label}</p>
          <div className={`w-8 h-0.5 bg-gradient-to-r ${config.gradient} rounded-full mt-2 group-hover:w-12 transition-all duration-300`}></div>
        </div>
        <div className={`p-3 bg-gradient-to-br ${config.gradient} rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

// Activity Item Component
const ActivityItem = ({ type, animal, location, time }) => {
  const severityConfig = {
    high: {
      color: 'red',
      bg: 'from-red-50 to-red-100/50',
      border: 'border-red-200',
      icon: 'text-red-600',
      pulse: 'animate-pulse'
    },
    medium: {
      color: 'yellow',
      bg: 'from-yellow-50 to-yellow-100/50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      pulse: ''
    },
    low: {
      color: 'green',
      bg: 'from-green-50 to-green-100/50',
      border: 'border-green-200',
      icon: 'text-green-600',
      pulse: ''
    },
  };
  
  const config = severityConfig[type];
  
  return (
    <div className={`flex items-center justify-between p-4 bg-gradient-to-r ${config.bg} rounded-lg shadow-md border ${config.border} hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 group`}>
      <div className="flex items-center">
        <div className={`p-1.5 bg-white rounded-md shadow-md mr-3 group-hover:scale-110 transition-transform duration-300`}>
          <AlertTriangle className={`w-4 h-4 ${config.icon} ${config.pulse}`} />
        </div>
        <div>
          <p className="font-bold text-slate-800 group-hover:text-slate-900 transition-colors duration-300 text-sm">{animal} detected</p>
          <p className="text-slate-600 flex items-center mt-0.5 text-xs">
            <MapPin className="w-3 h-3 mr-1" />
            {location}
          </p>
        </div>
      </div>
      <div className="text-right">
        <span className={`px-2 py-0.5 text-xs font-bold rounded-full bg-${config.color}-200 text-${config.color}-800 mb-1 inline-block`}>
          {type.toUpperCase()}
        </span>
        <p className="text-slate-500 text-xs">{time}</p>
      </div>
    </div>
  );
};

// Alert Card Component
const AlertCard = ({ animal, location, severity, time }) => {
  const severityConfig = {
    high: { 
      color: 'red', 
      bg: 'from-red-50 via-white to-red-50/50',
      border: 'border-red-300',
      gradient: 'from-red-500 to-red-600'
    },
    medium: { 
      color: 'yellow', 
      bg: 'from-yellow-50 via-white to-yellow-50/50',
      border: 'border-yellow-300',
      gradient: 'from-yellow-500 to-orange-500'
    },
    low: { 
      color: 'green', 
      bg: 'from-green-50 via-white to-green-50/50',
      border: 'border-green-300',
      gradient: 'from-green-500 to-emerald-500'
    },
  };

  const config = severityConfig[severity];

  return (
    <div className={`p-6 rounded-2xl border-2 ${config.border} bg-gradient-to-br ${config.bg} shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <div className={`p-2 bg-gradient-to-r ${config.gradient} rounded-lg shadow-lg mr-3 group-hover:scale-110 transition-transform duration-300`}>
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-bold text-xl text-slate-800 group-hover:text-slate-900 transition-colors duration-300">{animal} Movement</h4>
          </div>
          <p className="text-slate-600 flex items-center mb-4">
            <MapPin className="w-4 h-4 mr-2 text-slate-500" />
            {location}
          </p>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Send SMS Alert
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-slate-500 to-slate-600 text-white text-sm rounded-lg hover:from-slate-600 hover:to-slate-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              View on Map
            </button>
          </div>
        </div>
        <div className="text-right ml-4">
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r ${config.gradient} text-white shadow-lg`}
          >
            {severity.toUpperCase()}
          </span>
          <p className="text-xs text-slate-500 mt-2">{time}</p>
        </div>
      </div>
    </div>
  );
};

// User Mode Card
const UserModeCard = ({ title, icon, description, features, active }) => (
  <div
    className={`bg-white rounded-xl shadow-lg p-6 border-2 ${
      active ? 'border-emerald-500' : 'border-slate-200'
    }`}
  >
    <div className="text-center mb-6">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      <p className="text-slate-600 mt-2">{description}</p>
    </div>

    <div className="space-y-2 mb-6">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center text-sm text-slate-600">
          <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
          {feature}
        </div>
      ))}
    </div>

    <button
      className={`w-full py-3 rounded-lg font-medium transition-all ${
        active
          ? 'bg-emerald-600 text-white'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
      }`}
    >
      {active ? 'Currently Active' : 'Switch Mode'}
    </button>
  </div>
);

// =========================================================================
// Page Components
// =========================================================================

// Dashboard Home Page
const DashboardHome = ({ setCurrentRoute }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Add modern CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
        50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.6); }
      }
      
      .animate-slide-in-up {
        animation: slideInUp 0.6s ease-out forwards;
      }
      
      .animate-fade-in-scale {
        animation: fadeInScale 0.5s ease-out forwards;
      }
      
      .animate-pulse-glow {
        animation: pulse-glow 2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-white via-emerald-50/30 to-white rounded-xl shadow-lg p-6 mb-6 border border-emerald-100/50 animate-slide-in-up">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-1">
              Control Center
            </h1>
            <p className="text-slate-600 font-medium">Real-time wildlife conflict monitoring system</p>
            <div className="flex items-center mt-2 space-x-3">
              <div className="flex items-center bg-green-100 px-2 py-1 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                <span className="text-green-700 text-xs font-medium">System Online</span>
              </div>
              <div className="flex items-center bg-blue-100 px-2 py-1 rounded-full">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1 animate-pulse"></div>
                <span className="text-blue-700 text-xs font-medium">AI Active</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-3 shadow-lg border border-slate-300/50">
              <div className="flex items-center text-slate-700 font-bold mb-1">
                <Clock className="w-4 h-4 mr-1 text-emerald-600" />
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-slate-600 text-sm font-medium">{currentTime.toLocaleDateString()}</div>
              <div className="text-xs text-slate-500 mt-1">Last updated: now</div>
            </div>
          </div>
        </div>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon={CheckCircle} value="94.7%" label="ML Accuracy" color="emerald" />
        <MetricCard icon={Bell} value="12" label="Active Alerts" color="red" />
        <MetricCard icon={Shield} value="127" label="Prevented" color="blue" />
        <MetricCard icon={Users} value="847" label="Villages" color="purple" />
      </div>
      {/* Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuickNavCard
          title="Live Alerts"
          description="View real-time wildlife movements"
          icon={Bell}
          color="red"
          onClick={() => setCurrentRoute('/alerts')}
          stats="12 active alerts"
        />
        <QuickNavCard
          title="Submit Report"
          description="Report wildlife sightings quickly"
          icon={MessageSquare}
          color="emerald"
          onClick={() => setCurrentRoute('/reports')}
          stats="Submit new sighting"
        />
        <QuickNavCard
          title="Risk Map"
          description="Interactive conflict zone map"
          icon={Map}
          color="blue"
          onClick={() => setCurrentRoute('/map')}
          stats="View safe routes"
        />
      </div>
      {/* Recent Activity Preview */}
      <div className="bg-gradient-to-br from-white via-slate-50/30 to-white rounded-xl shadow-lg p-6 border border-slate-200/50 animate-slide-in-up">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">Recent Activity</h3>
            <p className="text-slate-600 text-sm">Latest wildlife detections and system alerts</p>
          </div>
          <button
            onClick={() => setCurrentRoute('/alerts')}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center text-sm"
          >
            View All
            <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="space-y-3">
          <ActivityItem type="high" animal="Elephant" location="Village Kumara" time="5 min ago" />
          <ActivityItem type="medium" animal="Tiger" location="Forest Trail" time="25 min ago" />
          <ActivityItem type="low" animal="Bear" location="River Bank" time="1 hour ago" />
        </div>
      </div>
    </div>
  );
};
// Alerts Page
const AlertsPage = ({ setCurrentRoute }) => {
  return <AlertComponent setCurrentRoute={setCurrentRoute} />;
};

// Reports Page
const ReportsPage = ({ setCurrentRoute }) => {
  return <ReportComponent setCurrentRoute={setCurrentRoute} />;
};

// Map Page - Using the MapComponent directly since it's already a complete page
const MapPage = ({ setCurrentRoute }) => (
  <MapComponent setCurrentRoute={setCurrentRoute} />
);
// =========================================================================
// Main App Component & Router
// =========================================================================

// Mock Router Component
const Router = ({ currentRoute, setCurrentRoute }) => {
  // A simple switch statement to render the correct page component
  switch (currentRoute) {
    case '/alerts':
      return <AlertsPage setCurrentRoute={setCurrentRoute} />;
    case '/reports':
      return <ReportsPage setCurrentRoute={setCurrentRoute} />;
    case '/map':
      return <MapPage setCurrentRoute={setCurrentRoute} />;
    case '/user-mode':
      return <UserModePage setCurrentRoute={setCurrentRoute} />;
    case '/analytics':
      return <AnalyticsPage setCurrentRoute={setCurrentRoute} />;
    default:
      return <DashboardHome setCurrentRoute={setCurrentRoute} />;
  }
};

// Navigation Component
const Navigation = ({ currentRoute, setCurrentRoute, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navigate = useNavigate();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/alerts', icon: Bell, label: 'Live Alerts' },
    { path: '/reports', icon: MessageSquare, label: 'Quick Report' },
    { path: '/map', icon: Map, label: 'Risk Map' },
    { path: '/user-mode', icon: Users, label: 'User Mode' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  const handleBackToLanding = () => {
    navigate('/');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-lg border border-slate-200"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white w-64 transform transition-transform duration-300 z-40 shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-emerald-600/10 to-teal-600/10">
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">MAITRI</h2>
          </div>
          <p className="text-slate-300 text-xs font-medium">Wildlife Conflict Prevention</p>
          <div className="mt-2 flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300 text-xs font-medium">System Active</span>
          </div>
        </div>

        <nav className="mt-6 px-3 flex-1 flex flex-col">
          {navItems.map(({ path, icon: Icon, label }) => (
            <button
              key={path}
              onClick={() => {
                setCurrentRoute(path);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg mb-1 transition-all duration-300 group text-sm ${
                currentRoute === path 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/25 text-white' 
                  : 'hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 text-slate-300 hover:text-white'
              }`}
            >
              <div className={`p-1.5 rounded-md mr-3 transition-all duration-300 ${
                currentRoute === path 
                  ? 'bg-white/20 shadow-lg' 
                  : 'bg-slate-700/50 group-hover:bg-slate-600/50'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="font-medium">{label}</span>
              {currentRoute === path && (
                <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
          
          {/* Spacer to push back button to bottom */}
          <div className="flex-1"></div>
          
          {/* Separator */}
          <div className="my-4 border-t border-slate-700/50"></div>
          
          {/* Back to Landing Page Button */}
          <button
            onClick={() => {
              handleBackToLanding();
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center px-4 py-3 text-left rounded-lg mb-4 transition-all duration-300 group text-sm text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600"
          >
            <div className="p-1.5 rounded-md mr-3 transition-all duration-300 bg-slate-700/50 group-hover:bg-white/20">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-medium">Back to Landing</span>
            <div className="ml-auto">
              <LogOut className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </button>
        </nav>
        <SystemStatus />
      </div>
    </>
  );
};

// Main App Component
const Dashboard = () => {
  const [currentRoute, setCurrentRoute] = useState('/');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100 font-sans antialiased text-slate-900">
      <Navigation
        currentRoute={currentRoute}
        setCurrentRoute={setCurrentRoute}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="lg:ml-64 p-6 transition-all duration-300">
        <Router currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} />
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;