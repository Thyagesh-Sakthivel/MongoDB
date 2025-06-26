
import React, { useState } from 'react';
import { Bus, MapPin, Clock, Settings } from 'lucide-react';
import Navbar from '../components/Navbar';
import BusList from '../components/BusList';
import BusTracker from '../components/BusTracker';
import AdminPanel from '../components/AdminPanel';

interface Bus {
  id: string;
  busNumber: string;
  route: string;
  stops: string[];
  schedule: string[];
  currentLocation: string;
  nextStop: string;
  eta: string;
  capacity: number;
  occupancy: number;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

  const handleTrackBus = (bus: Bus) => {
    setSelectedBus(bus);
    setActiveTab('tracker');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <BusList onTrackBus={handleTrackBus} />;
      case 'tracker':
        return <BusTracker selectedBus={selectedBus} />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <BusList onTrackBus={handleTrackBus} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Hero Section */}
      {activeTab === 'dashboard' && (
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-4">
              <Bus size={64} className="animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Smart Bus Tracker</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Track buses in real-time, plan your journey, and never miss your ride again
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                <MapPin size={20} />
                <span>Real-time Tracking</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                <Clock size={20} />
                <span>Live Schedules</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;
