import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  Shield,
  MapPin,
  Bell,
  Phone,
  Users,
  Camera,
  Map,
  AlertTriangle,
  Calendar,
  Star,
  Navigation,
  Wifi,
  MessageSquare,
  Activity,
  TrendingUp,
  BarChart3,
  Zap,
  Eye,
  Globe,
  Clock
} from 'lucide-react';

// Back Button Component
const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="group flex items-center bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 hover:text-slate-800 transition-all duration-300 mb-6 px-3 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
  >
    <div className="p-1 bg-white/70 rounded-md mr-2 group-hover:bg-white transition-all duration-300">
      <ArrowLeft className="w-4 h-4" />
    </div>
    <span className="font-medium text-sm">Back to Dashboard</span>
  </button>
);

// Toggle Switch Component
const ModeToggle = ({ isVillagerMode, onToggle }) => (
  <div className="bg-gradient-to-r from-white via-slate-50 to-white rounded-xl shadow-lg p-6 border border-slate-200">
    <div className="flex items-center justify-center">
      <div className="flex items-center space-x-6">
        <div className={`flex items-center transition-all duration-500 transform ${
          isVillagerMode ? 'scale-105 text-emerald-600' : 'scale-95 text-slate-400'
        }`}>
          <div className={`p-2 rounded-lg mr-3 transition-all duration-300 ${
            isVillagerMode 
              ? 'bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-md' 
              : 'bg-slate-100'
          }`}>
            <span className="text-2xl">👨‍🌾</span>
          </div>
          <div>
            <span className="font-semibold">Villager Mode</span>
            <div className={`mt-1 px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-300 ${
              isVillagerMode 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              🤖 Classification AI
            </div>
          </div>
        </div>
        
        <button
          onClick={onToggle}
          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:scale-105 ${
            isVillagerMode 
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
              : 'bg-gradient-to-r from-purple-500 to-purple-600'
          }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-500 ${
              isVillagerMode ? 'translate-x-1' : 'translate-x-9'
            }`}
          />
        </button>
        
        <div className={`flex items-center transition-all duration-500 transform ${
          !isVillagerMode ? 'scale-105 text-purple-600' : 'scale-95 text-slate-400'
        }`}>
          <div className={`p-2 rounded-lg mr-3 transition-all duration-300 ${
            !isVillagerMode 
              ? 'bg-gradient-to-br from-purple-100 to-purple-200 shadow-md' 
              : 'bg-slate-100'
          }`}>
            <span className="text-2xl">🧳</span>
          </div>
          <div>
            <span className="font-semibold">Tourist Mode</span>
            <div className={`mt-1 px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-300 ${
              !isVillagerMode 
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md' 
                : 'bg-purple-100 text-purple-700'
            }`}>
              📊 Regression AI
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, color, isActive }) => (
  <div className={`group p-4 rounded-lg border-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
    isActive 
      ? `border-${color}-300 bg-gradient-to-br from-${color}-50 to-white shadow-md` 
      : 'border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-slate-300 shadow-sm'
  }`}>
    <div className="flex items-start">
      <div className={`p-2 rounded-lg mr-3 transition-all duration-300 group-hover:scale-105 shadow-sm ${
        isActive 
          ? `bg-gradient-to-br from-${color}-400 to-${color}-600` 
          : 'bg-gradient-to-br from-slate-400 to-slate-600'
      }`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1">
        <h4 className={`font-semibold text-sm mb-1 transition-colors duration-300 ${
          isActive ? `text-${color}-800` : 'text-slate-800 group-hover:text-slate-900'
        }`}>
          {title}
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
        <div className={`mt-2 w-full h-0.5 rounded-full transition-all duration-500 ${
          isActive 
            ? `bg-gradient-to-r from-${color}-400 to-${color}-600` 
            : 'bg-slate-200 group-hover:bg-gradient-to-r group-hover:from-slate-300 group-hover:to-slate-400'
        }`} />
      </div>
    </div>
  </div>
);

// AI Model Info Card
const AIModelCard = ({ title, description, accuracy, features, color, isActive }) => (
  <div className={`bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-lg p-6 border-l-4 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
    isActive ? `border-${color}-500` : 'border-slate-300'
  }`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-md transition-all duration-300 ${
        isActive 
          ? `bg-gradient-to-r from-${color}-500 to-${color}-600 text-white` 
          : 'bg-gradient-to-r from-slate-400 to-slate-500 text-white'
      }`}>
        <div className="flex items-center">
          <div className={`w-1.5 h-1.5 rounded-full mr-2 animate-pulse ${
            isActive ? 'bg-white' : 'bg-slate-200'
          }`}></div>
          {accuracy}% Accuracy
        </div>
      </div>
    </div>
    <p className="text-slate-600 mb-4 leading-relaxed">{description}</p>
    <div className="space-y-2">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center text-xs bg-white/70 p-2 rounded-lg border border-slate-200">
          <div className={`p-1 rounded-full mr-2 ${
            isActive ? `bg-${color}-100` : 'bg-slate-100'
          }`}>
            <CheckCircle className={`w-3 h-3 ${
              isActive ? `text-${color}-600` : 'text-slate-500'
            }`} />
          </div>
          <span className="text-slate-700 font-medium">{feature}</span>
        </div>
      ))}
    </div>
  </div>
);

// Stats Card Component
const StatsCard = ({ icon: Icon, value, label, change, color = "emerald" }) => (
  <div className={`bg-gradient-to-br from-white to-slate-50 rounded-lg shadow-md p-4 border-l-4 border-${color}-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xl font-bold text-slate-800 mb-1">{value}</p>
        <p className="text-slate-600 text-xs font-medium">{label}</p>
        {change && (
          <div className={`flex items-center mt-1 px-2 py-0.5 bg-${color}-100 rounded-full w-fit`}>
            <TrendingUp className={`w-2 h-2 text-${color}-600 mr-1`} />
            <p className={`text-${color}-700 text-xs font-bold`}>{change}</p>
          </div>
        )}
      </div>
      <div className={`p-2 bg-gradient-to-br from-${color}-400 to-${color}-600 rounded-lg shadow-md`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
  </div>
);

// Quick Action Button
const QuickActionButton = ({ icon: Icon, label, onClick, color = "emerald" }) => (
  <button
    onClick={onClick}
    className={`group flex items-center justify-center p-3 bg-gradient-to-br from-${color}-50 to-white hover:from-${color}-100 hover:to-${color}-50 border-2 border-${color}-200 hover:border-${color}-300 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 hover:scale-102`}
  >
    <div className={`p-1.5 bg-gradient-to-br from-${color}-400 to-${color}-600 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105 mr-2`}>
      <Icon className="w-4 h-4 text-white" />
    </div>
    <span className={`font-semibold text-sm text-${color}-800 group-hover:text-${color}-900 transition-colors duration-300`}>{label}</span>
  </button>
);

// Villager Mode Component
const VillagerMode = () => {
  const villagerFeatures = [
    { icon: Shield, title: "Crop Protection Alerts", description: "Real-time notifications when animals approach your fields", color: "emerald" },
    { icon: Bell, title: "SMS in Local Language", description: "Alerts in Hindi, Tamil, Telugu, and other regional languages", color: "blue" },
    { icon: Phone, title: "Emergency Contacts", description: "Direct line to forest officials and veterinary services", color: "red" },
    { icon: Users, title: "Community Network", description: "Connect with other farmers for coordinated protection", color: "purple" },
    { icon: MapPin, title: "Field Monitoring", description: "Track animal movements near your agricultural land", color: "orange" },
    { icon: Calendar, title: "Seasonal Patterns", description: "Historical data on crop raiding patterns by season", color: "teal" }
  ];

  return (
    <div className="space-y-6">
      {/* AI Model Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <AIModelCard
          title="Classification AI Model"
          description="Advanced machine learning model trained to classify different wildlife species and predict their behavior patterns around agricultural areas."
          accuracy="94.7"
          features={[
            "Species identification with 94.7% accuracy",
            "Behavior pattern recognition",
            "Crop damage risk assessment",
            "Real-time threat classification"
          ]}
          color="emerald"
          isActive={true}
        />
        
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 border border-emerald-200">
          <h3 className="text-lg font-bold text-emerald-800 mb-3">Current Status</h3>
          <div className="space-y-3">
            <StatsCard icon={Shield} value="127" label="Crops Protected Today" change="↑ 23%" />
            <StatsCard icon={AlertTriangle} value="3" label="Active Alerts" />
            <StatsCard icon={Users} value="847" label="Farmers Connected" change="↑ 12%" />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {villagerFeatures.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            color={feature.color}
            isActive={true}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-white to-emerald-50 rounded-xl shadow-lg p-5 border border-emerald-100">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-md mr-3">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Quick Actions</h3>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionButton icon={Bell} label="Set Alert Zone" />
          <QuickActionButton icon={Phone} label="Call Forest Officer" color="red" />
          <QuickActionButton icon={MessageSquare} label="Report Sighting" color="blue" />
          <QuickActionButton icon={Map} label="View Risk Map" color="purple" />
        </div>
      </div>
    </div>
  );
};

// Tourist Mode Component
const TouristMode = () => {
  const touristFeatures = [
    { icon: Map, title: "Safe Trail Suggestions", description: "AI-powered route recommendations based on current wildlife activity", color: "blue" },
    { icon: Camera, title: "Wildlife Photography Guide", description: "Best spots and times for wildlife photography with safety tips", color: "purple" },
    { icon: Navigation, title: "GPS Navigation", description: "Turn-by-turn directions to forest checkpoints and facilities", color: "emerald" },
    { icon: Star, title: "Wildlife Sighting Predictions", description: "Probability-based predictions for animal encounters", color: "orange" },
    { icon: Globe, title: "Eco-Tourism Packages", description: "Curated nature experiences and guided tour bookings", color: "teal" },
    { icon: Wifi, title: "Offline Maps", description: "Downloadable maps for areas with poor connectivity", color: "indigo" },
    { icon: Activity, title: "Fitness Tracking", description: "Monitor your hiking distance, calories, and trail difficulty", color: "pink" },
    { icon: Clock, title: "Best Time Recommendations", description: "Optimal timing for wildlife viewing based on historical data", color: "cyan" }
  ];

  return (
    <div className="space-y-6">
      {/* AI Model Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <AIModelCard
          title="Regression AI Model"
          description="Sophisticated regression model that predicts wildlife sighting probabilities and optimal viewing conditions for tourists and nature enthusiasts."
          accuracy="91.3"
          features={[
            "Wildlife sighting probability prediction",
            "Optimal timing recommendations",
            "Weather impact analysis",
            "Crowd density forecasting"
          ]}
          color="blue"
          isActive={true}
        />
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
          <h3 className="text-lg font-bold text-blue-800 mb-3">Today's Predictions</h3>
          <div className="space-y-3">
            <StatsCard icon={Eye} value="78%" label="Elephant Sighting Chance" color="blue" />
            <StatsCard icon={Camera} value="23" label="Photo Opportunities" color="blue" />
            <StatsCard icon={Users} value="156" label="Active Tourists" color="blue" />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {touristFeatures.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            color={feature.color}
            isActive={true}
          />
        ))}
      </div>

      {/* Tourist-Specific Features */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Wildlife Sighting Predictions */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-8 border border-blue-100">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg mr-4">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Today's Sighting Predictions</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full mr-4 shadow-lg"></div>
                <div>
                  <span className="font-bold text-emerald-800">Elephants</span>
                  <p className="text-xs text-emerald-600">Peak time: 6-8 AM</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-emerald-600">78%</span>
                <p className="text-xs text-emerald-500">High Chance</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mr-4 shadow-lg"></div>
                <div>
                  <span className="font-bold text-orange-800">Tigers</span>
                  <p className="text-xs text-orange-600">Peak time: 5-7 PM</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-orange-600">34%</span>
                <p className="text-xs text-orange-500">Moderate</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mr-4 shadow-lg"></div>
                <div>
                  <span className="font-bold text-blue-800">Bears</span>
                  <p className="text-xs text-blue-600">Peak time: 7-9 AM</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-blue-600">52%</span>
                <p className="text-xs text-blue-500">Moderate</p>
              </div>
            </div>
          </div>
        </div>
        {/* Recommended Trails */}
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg p-5 border border-purple-100">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md mr-3">
              <Navigation className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Recommended Trails</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-white rounded-lg hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-emerald-800">Riverside Trail</h4>
                <span className="px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs rounded-full font-semibold shadow-md">Safe</span>
              </div>
              <p className="text-slate-600 mb-1 text-sm">🚶‍♂️ 3.2 km • ⏱️ 1.5 hours • 🦌 High wildlife activity</p>
              <div className="flex items-center text-xs text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md w-fit">
                <Star className="w-2 h-2 mr-1" />
                <span>Perfect for beginners</span>
              </div>
            </div>
            <div className="p-3 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-white rounded-lg hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-blue-800">Canopy Walk</h4>
                <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full font-semibold shadow-md">Moderate</span>
              </div>
              <p className="text-slate-600 mb-1 text-sm">🚶‍♂️ 5.7 km • ⏱️ 2.5 hours • 📸 Best for photography</p>
              <div className="flex items-center text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-md w-fit">
                <Camera className="w-2 h-2 mr-1" />
                <span>Great photo spots</span>
              </div>
            </div>
            <div className="p-3 border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-white rounded-lg hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-orange-800">Summit Path</h4>
                <span className="px-2 py-0.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs rounded-full font-semibold shadow-md">Challenging</span>
              </div>
              <p className="text-slate-600 mb-1 text-sm">🚶‍♂️ 8.4 km • ⏱️ 4 hours • 🏔️ Panoramic views</p>
              <div className="flex items-center text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded-md w-fit">
                <Globe className="w-2 h-2 mr-1" />
                <span>Spectacular views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions for Tourists */}
      <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg p-5 border border-purple-100">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md mr-3">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Tourist Services</h3>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionButton icon={Map} label="Download Maps" color="blue" />
          <QuickActionButton icon={Camera} label="Photo Guide" color="purple" />
          <QuickActionButton icon={Phone} label="Emergency Help" color="red" />
          <QuickActionButton icon={Calendar} label="Book Tour" color="emerald" />
        </div>
      </div>
    </div>
  );
};

// Main Component
const UserModePage = ({ setCurrentRoute }) => {
  const [isVillagerMode, setIsVillagerMode] = useState(true); // Default to Villager Mode

  return (
    <div className="space-y-6">
      <BackButton onClick={() => setCurrentRoute('/')} />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-xl p-6 text-center shadow-md border border-indigo-100">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-3">
            User Mode Selection
          </h1>
          <p className="text-slate-600 leading-relaxed">
            Choose your profile for AI-powered wildlife conflict prevention and conservation
          </p>
          <div className="flex items-center justify-center space-x-3 mt-3">
            <div className="flex items-center bg-emerald-100 px-2 py-1 rounded-full">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-emerald-700 text-xs font-medium">AI System Online</span>
            </div>
            <div className="flex items-center bg-blue-100 px-2 py-1 rounded-full">
              <span className="text-blue-700 text-xs font-medium">🤖 Powered by Advanced ML</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Toggle */}
      <ModeToggle 
        isVillagerMode={isVillagerMode} 
        onToggle={() => setIsVillagerMode(!isVillagerMode)} 
      />

      {/* Mode-Specific Content */}
      {isVillagerMode ? <VillagerMode /> : <TouristMode />}
    </div>
  );
};

export default UserModePage;