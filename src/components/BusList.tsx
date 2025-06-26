import React, { useEffect, useState } from 'react';
import { Search, Bus } from 'lucide-react';
import BusCard from './BusCard';
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

interface BusListProps {
  onTrackBus?: (bus: Bus) => void;
}

const BusList = ({ onTrackBus }: BusListProps) => {
  const [busData, setBusData] = useState<Bus[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await fetch(`${API_URL}/buses`);
        if (!response.ok) throw new Error('Failed to fetch bus data.');

        const data = await response.json();
        setBusData(data);
      } catch (err) {
        setError('Could not load buses. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  const filteredBuses = busData.filter(bus => {
    const matchesSearch =
      bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.stops.some(stop => stop.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRoute = selectedRoute === 'all' || bus.route === selectedRoute;
    return matchesSearch && matchesRoute;
  });

  const routes = [...new Set(busData.map(bus => bus.route))];

  const handleTrackLive = (bus: Bus) => {
    if (onTrackBus) {
      onTrackBus(bus);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-lg font-medium">Loading buses...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600 text-lg">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Bus className="text-blue-600" />
          Bus Routes & Schedules
        </h2>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by bus number, route, or stop..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Routes</option>
            {routes.map(route => (
              <option key={route} value={route}>{route}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{busData.length}</div>
          <div className="text-gray-600">Total Buses</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{routes.length}</div>
          <div className="text-gray-600">Active Routes</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{filteredBuses.length}</div>
          <div className="text-gray-600">Buses Found</div>
        </div>
      </div>

      {/* Bus Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBuses.map((bus) => (
          <BusCard key={bus.id} bus={bus} onTrackLive={handleTrackLive} />
        ))}
      </div>

      {filteredBuses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <Bus className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No buses found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default BusList;
