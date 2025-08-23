import React from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';

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

// Alert Card Component
const AlertCard = ({ animal, location, severity, time }) => {
  const severityConfig = {
    high: { color: 'red', bg: 'bg-red-50 border-red-500' },
    medium: { color: 'yellow', bg: 'bg-yellow-50 border-yellow-500' },
    low: { color: 'green', bg: 'bg-green-50 border-green-500' },
  };

  return (
    <div className={`p-4 rounded-lg border-l-4 ${severityConfig[severity].bg}`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-lg text-slate-800">{animal} Movement</h4>
          <p className="text-slate-600 flex items-center mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            {location}
          </p>
          <div className="mt-2 space-x-2">
            <button className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-colors">
              Send SMS Alert
            </button>
            <button className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full hover:bg-slate-200 transition-colors">
              View on Map
            </button>
          </div>
        </div>
        <div className="text-right">
          <span
            className={`px-2 py-1 text-xs font-bold rounded-full bg-${severityConfig[severity].color}-200 text-${severityConfig[severity].color}-800`}
          >
            {severity.toUpperCase()}
          </span>
          <p className="text-xs text-slate-500 mt-1">{time}</p>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// Main Alert Component
// =========================================================================

const AlertComponent = ({ setCurrentRoute }) => (
  <div className="space-y-6">
    <BackButton onClick={() => setCurrentRoute('/')} />
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Live Alerts</h1>
      <p className="text-slate-600">Real-time wildlife movement detection</p>
    </div>

    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
            <span className="font-medium">Live Monitoring Active</span>
          </div>
          <span className="text-sm text-slate-600">12 active alerts</span>
        </div>
      </div>

      <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
        <AlertCard animal="Elephant" location="Village Kumara" severity="high" time="5 min ago" />
        <AlertCard animal="Tiger" location="Forest Junction" severity="medium" time="25 min ago" />
        <AlertCard animal="Wild Boar" location="Crop Field A-12" severity="high" time="45 min ago" />
        <AlertCard animal="Bear" location="Riverside Trail" severity="low" time="1 hour ago" />
        <AlertCard animal="Leopard" location="Tourist Trail B" severity="medium" time="2 hours ago" />
      </div>
    </div>
  </div>
);

export default AlertComponent;