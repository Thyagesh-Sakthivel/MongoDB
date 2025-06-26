import React, { useState } from 'react';
import { Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { API_URL } from '../config';

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

interface BusCardProps {
  bus: Bus;
  onTrackLive?: (bus: Bus) => void;
}

const BusCard = ({ bus, onTrackLive }: BusCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const occupancyPercentage = (bus.occupancy / bus.capacity) * 100;

  const getOccupancyColor = () => {
    if (occupancyPercentage < 50) return 'text-green-600 bg-green-100';
    if (occupancyPercentage < 80) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const handleTrackLive = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch(`${API_URL}/track/${bus.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ busId: bus.id })
      });

      if (!response.ok) {
        throw new Error('Failed to track the bus.');
      }

      const data = await response.json();
      setSuccess('Tracking started successfully.');

      console.log('Tracking data:', data);

      if (onTrackLive) {
        onTrackLive(bus);
      }

    } catch (err) {
      setError('Error tracking the bus.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">Bus {bus.busNumber}</h3>
            <p className="text-gray-600">{bus.route}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getOccupancyColor()}`}>
            {occupancyPercentage.toFixed(0)}% Full
          </div>
        </div>

        {/* Current Status */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin size={16} className="text-blue-600" />
            <span className="text-sm">Currently at: <strong>{bus.currentLocation}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <ArrowRight size={16} className="text-green-600" />
            <span className="text-sm">Next: <strong>{bus.nextStop}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Clock size={16} className="text-orange-600" />
            <span className="text-sm">ETA: <strong>{bus.eta}</strong></span>
          </div>
        </div>

        {/* Occupancy Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Occupancy</span>
            <span>{bus.occupancy}/{bus.capacity}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                occupancyPercentage < 50 ? 'bg-green-500' :
                occupancyPercentage < 80 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${occupancyPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
          >
            {showDetails ? 'Hide' : 'View'} Schedule
          </button>
          <button
            onClick={handleTrackLive}
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
            disabled={loading}
          >
            {loading ? 'Tracking...' : 'Track Live'}
          </button>
        </div>

        {/* Expandable Schedule Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
            <h4 className="font-semibold text-gray-800 mb-2">Route Stops & Schedule</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {bus.stops.map((stop, index) => (
                <div key={index} className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded text-sm">
                  <span className="text-gray-700">{stop}</span>
                  <span className="text-gray-500 font-mono">{bus.schedule[index]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success & Error Messages */}
        {success && <p className="text-green-600 text-sm mt-3">{success}</p>}
        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
      </div>
    </div>
  );
};

export default BusCard;
