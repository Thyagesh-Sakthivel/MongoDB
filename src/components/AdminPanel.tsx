import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Settings, Plus, Bus, Save, LogOut } from 'lucide-react';
import AdminLogin from './AdminLogin';

const API_URL = 'http://localhost:5000/api';

interface BusType {
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

const AdminPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [buses, setBuses] = useState<BusType[]>([]);
  const [selectedBus, setSelectedBus] = useState<BusType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRoute, setNewRoute] = useState({
    busNumber: '',
    route: '',
    stops: [''],
    schedule: [''],
    currentLocation: '',
    nextStop: '',
    eta: '',
    capacity: 50,
    occupancy: 0
  });

  // Fetch all buses
  const fetchBuses = async () => {
    try {
      const response = await axios.get(`${API_URL}/buses`);
      setBuses(response.data);
      setSelectedBus(response.data[0]);
    } catch (error) {
      console.error('Error fetching buses:', error);
    }
  };

  // Initial fetch after login
  useEffect(() => {
    if (isLoggedIn) {
      fetchBuses();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsEditing(false);
    setShowAddForm(false);
  };

  // Add new route to backend
  const handleSaveNewRoute = async () => {
  try {
    const response = await axios.post(`${API_URL}/buses`, newRoute);
    setBuses([...buses, response.data]);
    alert('New route added!');
    setShowAddForm(false);
    setNewRoute({
      busNumber: '',
      route: '',
      stops: [''],
      schedule: [''],
      currentLocation: '',
      nextStop: '',
      eta: '',
      capacity: 50,
      occupancy: 0
    });
  } catch (error) {
    console.error('Error adding route:', error);
  }
};

  // Save edited bus to backend
  const handleSaveChanges = async () => {
    try {
      if (selectedBus) {
        await axios.put(`${API_URL}/buses/${selectedBus.id}`, selectedBus);
        alert('Changes saved!');
        setIsEditing(false);
        fetchBuses(); // refresh data
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleStopChange = (index: number, value: string) => {
    setNewRoute(prev => ({
      ...prev,
      stops: prev.stops.map((stop, i) => (i === index ? value : stop))
    }));
  };

  const handleScheduleChange = (index: number, value: string) => {
    setNewRoute(prev => ({
      ...prev,
      schedule: prev.schedule.map((time, i) => (i === index ? value : time))
    }));
  };

  const handleAddStop = () => {
    setNewRoute(prev => ({
      ...prev,
      stops: [...prev.stops, ''],
      schedule: [...prev.schedule, '']
    }));
  };

  const handleRemoveStop = (index: number) => {
    setNewRoute(prev => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index),
      schedule: prev.schedule.filter((_, i) => i !== index)
    }));
  };

  const updateSelectedBus = <K extends keyof BusType>(field: K, value: BusType[K]) => {
  if (selectedBus) {
    setSelectedBus({
      ...selectedBus,
      [field]: value,
    });
  }
};


  if (!isLoggedIn) {
    return <AdminLogin onLogin={setIsLoggedIn} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Settings className="text-purple-600" />
            Admin Panel
          </h2>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Plus size={18} />
            Add New Route
          </button>

          <select
            value={selectedBus?.id || ''}
            onChange={(e) =>
              setSelectedBus(buses.find(bus => bus.id === e.target.value) || null)
            }
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            {buses.map(bus => (
              <option key={bus.id} value={bus.id}>
                Bus {bus.busNumber} - {bus.route}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Route'}
          </button>
        </div>
      </div>

      {/* Add New Route Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Plus className="text-green-600" />
            Add New Bus Route
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bus Number</label>
              <input
                type="text"
                value={newRoute.busNumber}
                onChange={(e) => setNewRoute(prev => ({ ...prev, busNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Route Name</label>
              <input
                type="text"
                value={newRoute.route}
                onChange={(e) => setNewRoute(prev => ({ ...prev, route: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
              <input
                type="number"
                value={newRoute.capacity}
                onChange={(e) => setNewRoute(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Occupancy</label>
              <input
                type="number"
                value={newRoute.occupancy}
                onChange={(e) => setNewRoute(prev => ({ ...prev, occupancy: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-800">Stops & Schedule</h4>
              <button
                onClick={handleAddStop}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Add Stop
              </button>
            </div>

            <div className="space-y-3">
              {newRoute.stops.map((stop, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={stop}
                      onChange={(e) => handleStopChange(index, e.target.value)}
                      placeholder="Stop name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="time"
                      value={newRoute.schedule[index]}
                      onChange={(e) => handleScheduleChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  {newRoute.stops.length > 1 && (
                    <button
                      onClick={() => handleRemoveStop(index)}
                      className="text-red-600 hover:text-red-800 px-2 py-1"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSaveNewRoute}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
          >
            <Save size={18} />
            Save New Route
          </button>
        </div>
      )}

      {/* Edit Existing Route */}
      {isEditing && selectedBus && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Bus className="text-blue-600" />
            Edit Bus {selectedBus.busNumber} - {selectedBus.route}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Current Status</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
                  <input
                    type="text"
                    value={selectedBus.currentLocation}
                    onChange={(e) => updateSelectedBus('currentLocation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Stop</label>
                  <input
                    type="text"
                    value={selectedBus.nextStop}
                    onChange={(e) => updateSelectedBus('nextStop', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ETA</label>
                  <input
                    type="text"
                    value={selectedBus.eta}
                    onChange={(e) => updateSelectedBus('eta', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Occupancy</label>
                  <input
                    type="number"
                    value={selectedBus.occupancy}
                    onChange={(e) => updateSelectedBus('occupancy', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSaveChanges}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
            >
              <Save size={18} />
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
