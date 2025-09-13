import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Smartphone, Map, Satellite, Users, Bell, TrendingUp, CheckCircle, Menu, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import sightings from '../Dataset/wildlife_sightings.json'
import SimpleMapComponent from '../components/SimpleMapComponent'
// Navbar Component
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuClick = (href) => {
    setIsMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-emerald-600" />
            <span className="text-2xl font-bold text-amber-300">MAITRI</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => handleMenuClick('#features')} className="text-gray-700 hover:text-emerald-600 transition-colors">Features</button>
            <button onClick={() => handleMenuClick('#how-it-works')} className="text-gray-700 hover:text-emerald-600 transition-colors">How It Works</button>
            <button onClick={() => handleMenuClick('#impact')} className="text-gray-700 hover:text-emerald-600 transition-colors">Impact</button>
            <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors" onClick={() => navigate("/dashboard")} >
              Get Started
            </button>
          </div>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button onClick={() => handleMenuClick('#features')} className="block w-full text-left px-3 py-2 text-gray-700">Features</button>
              <button onClick={() => handleMenuClick('#how-it-works')} className="block w-full text-left px-3 py-2 text-gray-700">How It Works</button>
              <button onClick={() => handleMenuClick('#impact')} className="block w-full text-left px-3 py-2 text-gray-700">Impact</button>
              <button className="w-full text-left bg-emerald-600 text-white px-3 py-2 rounded-lg" onClick={() => navigate("/dashboard")}>
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Alert Card Component
const AlertCard = ({ type, location, time, severity }) => {
  const severityColors = {
    high: 'border-red-500 bg-red-50',
    medium: 'border-yellow-500 bg-yellow-50',
    low: 'border-green-500 bg-green-50'
  };

  const severityTextColors = {
    high: 'text-red-600',
    medium: 'text-yellow-600',
    low: 'text-green-600'
  };

  return (
    <div className={`p-4 rounded-lg border-l-4 ${severityColors[severity]} animate-pulse`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className={`h-5 w-5 ${severityTextColors[severity]}`} />
          <span className="font-semibold">{type} Spotted</span>
          </div>
        <span className="text-sm text-gray-500">{time}</span>
      </div>
      <p className="text-sm text-gray-700 mt-1">{location}</p>
    </div>
  );
};

// Stats Counter Component
const StatCounter = ({ end, label, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-white mb-2">{count.toLocaleString()}+</div>
      <div className="text-emerald-100">{label}</div>
    </div>
  );
};

// Function to process sightings data and create alerts
const processWildlifeSightings = (sightings) => {
  // Get the most recent 10 sightings and sort by date (descending)
  const recentSightings = sightings
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  return recentSightings.map((sighting, index) => {
    // Determine severity based on species and group size
    let severity = 'low';
    if (sighting.common_name === 'Asian Elephant' && sighting.group_size > 5) {
      severity = 'high';
    } else if (sighting.common_name === 'Tiger' || (sighting.common_name === 'Asian Elephant' && sighting.group_size >= 3)) {
      severity = 'medium';
    } else if (sighting.group_size > 6) {
      severity = 'medium';
    }

    // Calculate time ago (mock recent times for demo)
    const timesAgo = ['2 min ago', '8 min ago', '15 min ago', '23 min ago', '35 min ago', '45 min ago', '1 hr ago', '2 hr ago', '3 hr ago', '4 hr ago'];
    
    // Format location to be more readable
    let formattedLocation = sighting.location;
    if (sighting.group_size > 1) {
      formattedLocation += ` (Group of ${sighting.group_size})`;
    }

    return {
      type: sighting.common_name,
      location: formattedLocation,
      time: timesAgo[index] || `${index + 1} hr ago`,
      severity: severity
    };
  });
};

// Main Landing Page Component
const MaitriLanding = () => {
  const [currentAlert, setCurrentAlert] = useState(0);
  const navigate = useNavigate();

  // Process the real wildlife data
  const realAlerts = processWildlifeSightings(sightings);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAlert((prev) => (prev + 1) % realAlerts.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [realAlerts.length]);

  // Add custom CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(5deg); }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-50px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
      
      .animate-fade-in-up {
        animation: fadeInUp 0.8s ease-out forwards;
      }
      
      .animate-slide-in-left {
        animation: slideInLeft 0.8s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const features = [
    {
      icon: <Satellite className="h-8 w-8" />,
      title: "Satellite Intelligence",
      description: "Advanced satellite imagery analysis combined with weather data and historical wildlife movement patterns"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Reporting",
      description: "Crowdsourced alerts from villagers via mobile app and SMS for real-time wildlife spotting"
    },
    {
      icon: <Bell className="h-8 w-8" />,
      title: "Instant Alerts",
      description: "Real-time notifications sent via SMS, WhatsApp, and mobile app to communities and forest rangers"
    },
    {
      icon: <Map className="h-8 w-8" />,
      title: "Smart Resource Mapping",
      description: "Interactive maps showing safe grazing areas, high-risk zones, and recommended safe passages"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-green-700 flex items-center overflow-hidden">
        {/* Primary overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10"></div>
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Ccircle cx='8' cy='8' r='3'/%3E%3Ccircle cx='72' cy='8' r='3'/%3E%3Ccircle cx='8' cy='72' r='3'/%3E%3Ccircle cx='72' cy='72' r='3'/%3E%3Cpath d='M40 8 L40 72 M8 40 L72 40' stroke='%23ffffff' stroke-opacity='0.03' stroke-width='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-emerald-300/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-cyan-300/20 rounded-full" style={{animation: 'float 4s ease-in-out infinite'}}></div>
        <div className="absolute bottom-32 left-32 w-1 h-1 bg-emerald-200/40 rounded-full animate-ping"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-white mb-8 leading-tight tracking-tight">
                <span className="drop-shadow-2xl">Protecting</span>
                <span className="block bg-gradient-to-r from-emerald-300 via-cyan-300 to-teal-200 bg-clip-text text-transparent drop-shadow-lg">
                  Communities
                </span>
                <span className="drop-shadow-2xl">& Wildlife</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-emerald-50 mb-10 leading-relaxed max-w-2xl font-medium drop-shadow-lg">
                AI-powered conflict prediction system that forecasts wildlife intrusions using satellite data, 
                community reports, and machine learning to <span className="text-cyan-200 font-semibold">save lives</span> and <span className="text-emerald-200 font-semibold">protect wildlife</span>.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 mb-16">
                <button onClick={() => navigate("/dashboard")} className="bg-gradient-to-r from-white to-emerald-50 text-emerald-800 px-10 py-5 rounded-xl font-bold hover:from-emerald-50 hover:to-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-xl border border-emerald-200/20">
                  <span className="flex items-center justify-center">
                    Get Started
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
                <button className="border-2 border-emerald-200/80 bg-emerald-900/20 backdrop-blur-sm text-white px-10 py-5 rounded-xl font-bold hover:bg-white hover:text-emerald-800 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg">
                  Learn More
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <StatCounter end={500} label="Communities Protected" />
                <StatCounter end={1200} label="Alerts Sent" />
                <StatCounter end={85} label="Conflicts Prevented" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Live Alerts
                </h3>
                <AlertCard {...realAlerts[currentAlert]} />
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Risk Level: Medium
                </h3>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full w-3/5 animate-pulse"></div>
                </div>
                <p className="text-emerald-100 text-sm mt-2">Based on recent elephant movement patterns</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-white via-emerald-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              How <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">MAITRI AI</span> Works
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our comprehensive system combines cutting-edge technology with community participation 
              to predict and prevent wildlife-human conflicts before they happen.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-white via-emerald-50/50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-emerald-100/60 hover:border-emerald-200 backdrop-blur-sm">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl">
                    <div className="text-white transform group-hover:rotate-6 transition-transform duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 text-sm">{feature.description}</p>
                  
                  {/* Decorative gradient line */}
                  <div className="w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 mt-4 transition-all duration-500 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-gray-50 via-white to-emerald-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Three-Step <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Protection Process</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-white via-blue-50/50 to-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-blue-100/60 group">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">Data Collection</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Satellite imagery, weather patterns, historical wildlife movement data, and real-time community reports
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="font-medium">Satellite monitoring 24/7</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="font-medium">Community SMS reports</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="font-medium">Weather data integration</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white via-purple-50/50 to-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-purple-100/60 group">
              <div className="bg-gradient-to-br from-purple-500 to-violet-600 w-16 h-16 rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-700 transition-colors duration-300">AI Prediction</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Advanced LSTM machine learning models analyze patterns to predict conflict hotspots and timing
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="font-medium">LSTM neural networks</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="font-medium">Pattern recognition</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="font-medium">Risk assessment</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white via-green-50/50 to-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-green-100/60 group">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-16 h-16 rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-700 transition-colors duration-300">Alert & Response</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Instant notifications to communities and rangers with actionable safety guidance and resource maps
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="font-medium">SMS & WhatsApp alerts</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="font-medium">Mobile app notifications</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="font-medium">Safe route guidance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Making a Real Impact
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Every alert sent, every conflict prevented, every life saved - our mission is to create 
                harmony between human communities and wildlife through technology.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">92%</div>
                  <div className="text-gray-600">Accuracy Rate</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">15min</div>
                  <div className="text-gray-600">Average Alert Time</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">500+</div>
                  <div className="text-gray-600">Villages Protected</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">Zero</div>
                  <div className="text-gray-600">Human Casualties</div>
                </div>
              </div>

              <button onClick={() => navigate("/dashboard")} className="bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                Join Our Mission
              </button>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-white via-emerald-50/30 to-white rounded-3xl p-10 shadow-2xl border border-emerald-100/60">
                <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Resource Safety Map</h3>
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl h-80 relative overflow-hidden shadow-inner">
                  {/* Map component container */}
                  <div className="absolute inset-0 z-10" > 
                    <SimpleMapComponent/>
                  </div>
                  
                  {/* Overlay content */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-t from-emerald-900/20 via-transparent to-emerald-900/10">
                    <div className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-emerald-200/50">
                      <Map className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
                      <p className="text-gray-700 font-medium">Interactive map showing safe zones, high-risk areas, and recommended routes</p>
                    </div>
                  </div>
                  
                  {/* Animated status indicators */}
                  <div className="absolute top-6 left-6 z-30">
                    <div className="flex items-center space-x-2 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-white text-xs font-medium">Safe Zone</span>
                    </div>
                  </div>
                  
                  <div className="absolute top-6 right-6 z-30">
                    <div className="flex items-center space-x-2 bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-white text-xs font-medium">High Risk</span>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-6 left-6 z-30">
                    <div className="flex items-center space-x-2 bg-yellow-500/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-white text-xs font-medium">Moderate Risk</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>



          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='10' cy='10' r='4'/%3E%3Ccircle cx='90' cy='10' r='4'/%3E%3Ccircle cx='10' cy='90' r='4'/%3E%3Ccircle cx='90' cy='90' r='4'/%3E%3Cpath d='M50 10 L50 90 M10 50 L90 50' stroke='%23ffffff' stroke-opacity='0.05' stroke-width='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            Ready to <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">Protect</span> Your Community?
          </h2>
          <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of communities already using <span className="text-emerald-300 font-semibold">MAITRI AI</span> to prevent conflicts and save lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <button onClick={() => navigate("/dashboard")} className="group bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-12 py-6 rounded-2xl font-bold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-emerald-500/25 flex items-center justify-center">
              <Smartphone className="h-6 w-6 mr-3 group-hover:animate-bounce" />
              Get Started Now
              <svg className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button className="group border-2 border-emerald-400/80 bg-emerald-900/20 backdrop-blur-sm text-white px-12 py-6 rounded-2xl font-bold hover:bg-emerald-400 hover:text-gray-900 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-emerald-400/25">
              <span className="group-hover:animate-pulse">Request Demo</span>
            </button>
          </div>
          
          {/* Trust indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 opacity-80">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-300">500+</div>
              <div className="text-sm text-gray-400">Communities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-300">24/7</div>
              <div className="text-sm text-gray-400">Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-300">92%</div>
              <div className="text-sm text-gray-400">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-300">Zero</div>
              <div className="text-sm text-gray-400">Casualties</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-100 to-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <Shield className="h-10 w-10 text-emerald-600" />
                <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">MAITRI AI</span>
              </div>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed max-w-md">
                Protecting communities and wildlife through AI-powered conflict prediction and prevention.
              </p>
              <div className="text-sm text-gray-500 bg-emerald-50 px-4 py-2 rounded-lg inline-block">
                © 2025 MAITRI AI. All rights reserved.
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-6 text-lg">Product</h4>
              <div className="space-y-3 text-gray-600">
                <div className="hover:text-emerald-600 transition-colors cursor-pointer">Mobile App</div>
                <div className="hover:text-emerald-600 transition-colors cursor-pointer">Dashboard</div>
                <div className="hover:text-emerald-600 transition-colors cursor-pointer">API Access</div>
                <div className="hover:text-emerald-600 transition-colors cursor-pointer">Reports</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-6 text-lg">Support</h4>
              <div className="space-y-3 text-gray-600">
                <div className="hover:text-emerald-600 transition-colors cursor-pointer">Help Center</div>
                <div className="hover:text-emerald-600 transition-colors cursor-pointer">Community Forum</div>
                <div className="hover:text-emerald-600 transition-colors cursor-pointer">Contact Us</div>
                <div className="hover:text-emerald-600 transition-colors cursor-pointer">Emergency Line</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default MaitriLanding;
