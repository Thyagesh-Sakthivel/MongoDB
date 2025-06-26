import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Navigation, Clock, Bus, ArrowRight } from 'lucide-react';

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

interface BusTrackerProps {
  selectedBus?: Bus | null;
}

const BusTracker = ({ selectedBus }: BusTrackerProps) => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [currentBus, setCurrentBus] = useState<Bus | null>(null);
  const [simulatedLocation, setSimulatedLocation] = useState({ lat: 40.7128, lng: -74.0060 });
  const [isTracking, setIsTracking] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(1);

  // Fetch bus data from backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/buses')
      .then(response => {
        setBuses(response.data);
        if (response.data.length > 0 && !selectedBus) {
          setCurrentBus(response.data[0]);
        }
      })
      .catch(error => {
        console.error('Error fetching bus data:', error);
      });
  }, []);

  // Update current bus when selectedBus prop changes
  useEffect(() => {
    if (selectedBus) {
      setCurrentBus(selectedBus);
      setIsTracking(true);
    }
  }, [selectedBus]);

  // Simulate bus movement
  useEffect(() => {
    if (!isTracking || !currentBus) return;

    const interval = setInterval(() => {
      setSimulatedLocation(prev => {
        const targetLat = 40.7128 + (currentStopIndex * 0.0007);
        const targetLng = -74.0060 + (currentStopIndex * 0.0005);

        return {
          lat: prev.lat + (targetLat - prev.lat) * 0.1 + (Math.random() - 0.5) * 0.0001,
          lng: prev.lng + (targetLng - prev.lng) * 0.1 + (Math.random() - 0.5) * 0.0001
        };
      });

      if (Math.random() < 0.1 && currentBus.stops.length > 1) {
        setCurrentStopIndex(prev => (prev + 1) % currentBus.stops.length);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [isTracking, currentStopIndex, currentBus]);

  // Reset location when bus changes
  useEffect(() => {
    setSimulatedLocation({ lat: 40.7128, lng: -74.0060 });
    setCurrentStopIndex(1);
  }, [currentBus?.id]);

  if (!currentBus) return <div>Loading bus data...</div>;

  const routeCoordinates = currentBus.stops.map((stop, index) => ({
    name: stop,
    lat: 40.7128 + (index * 0.0007),
    lng: -74.0060 + (index * 0.0005),
  }));

  const currentStop = currentBus.stops[currentStopIndex];
  const nextStop = currentBus.stops[(currentStopIndex + 1) % currentBus.stops.length];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Navigation className="text-green-600" />
          Live Bus Tracking
        </h2>

        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={currentBus.id}
            onChange={(e) => setCurrentBus(buses.find(bus => bus.id === e.target.value) || buses[0])}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          >
            {buses.map(bus => (
              <option key={bus.id} value={bus.id}>
                Bus {bus.busNumber} - {bus.route}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsTracking(!isTracking)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${isTracking ? 'bg-red-600 text-white animate-pulse' : 'bg-green-600 text-white'}`}
          >
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </button>
        </div>
      </div>

      {/* Map Simulation & Bus Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Simulation */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <MapPin className="text-blue-600" />
              Route Map - Bus {currentBus.busNumber}
            </h3>
          </div>

          <div className="p-6">
            <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-lg p-8 min-h-96 relative">
              {isTracking && (
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                  🔴 LIVE
                </div>
              )}

              <div className="space-y-4">
                {routeCoordinates.map((stop, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded-full ${index === currentStopIndex && isTracking ? 'bg-red-500 animate-pulse shadow-lg' : index < currentStopIndex && isTracking ? 'bg-gray-400' : 'bg-blue-500'}`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className={`font-medium ${index === currentStopIndex && isTracking ? 'text-red-600' : 'text-gray-800'}`}>{stop.name}</span>
                        <span className="text-sm text-gray-500 font-mono">
                          {stop.lat.toFixed(4)}, {stop.lng.toFixed(4)}
                        </span>
                      </div>
                      {index === currentStopIndex && isTracking && (
                        <div className="text-sm text-red-600 font-medium animate-pulse">
                          🚍 Bus Current Location
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {isTracking && (
                <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md border-l-4 border-green-500">
                  <div className="text-sm font-medium text-gray-800 mb-1">Live Position</div>
                  <div className="text-xs text-gray-600 font-mono">
                    {simulatedLocation.lat.toFixed(6)}, {simulatedLocation.lng.toFixed(6)}
                  </div>
                  <div className="text-xs text-green-600 font-medium mt-1">
                    Updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bus Info Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Bus className="text-blue-600" />
              Bus Status
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-600">Bus Number</span><span className="font-medium">{currentBus.busNumber}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Route</span><span className="font-medium">{currentBus.route}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Current Stop</span><span className="font-medium text-green-600">{isTracking ? currentStop : currentBus.currentLocation}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Next Stop</span><span className="font-medium text-blue-600">{isTracking ? nextStop : currentBus.nextStop}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">ETA</span><span className="font-medium text-orange-600">{isTracking ? `${Math.floor(Math.random() * 8) + 2} mins` : currentBus.eta}</span></div>
            </div>

            {isTracking && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live tracking active</span>
                </div>
                <div className="text-xs text-green-600 mt-1">Last updated: {new Date().toLocaleTimeString()}</div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="text-orange-600" />
              Upcoming Stops
            </h3>

            <div className="space-y-3">
              {currentBus.stops.slice(currentStopIndex + 1, currentStopIndex + 5).map((stop, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <ArrowRight size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-700">{stop}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-mono">
                    {currentBus.schedule[(currentStopIndex + index + 1) % currentBus.schedule.length]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusTracker;
