
export interface Bus {
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

export const busData: Bus[] = [
  {
    id: '1',
    busNumber: '101',
    route: 'Downtown Express',
    stops: [
      'Central Station',
      'City Hall',
      'Main Street',
      'Park Avenue',
      'Shopping Center',
      'University Campus',
      'Hospital', 
      'Airport Terminal'
    ],
    schedule: [
      '06:00',
      '06:15',
      '06:30',
      '06:45',
      '07:00',
      '07:15',
      '07:30',
      '07:45'
    ],
    currentLocation: 'City Hall',
    nextStop: 'Main Street',
    eta: '5 mins',
    capacity: 50,
    occupancy: 32
  },
  {
    id: '2',
    busNumber: '102',
    route: 'Northside Loop',
    stops: [
      'North Terminal',
      'Residential District',
      'School Zone',
      'Community Center',
      'Sports Complex',
      'Library',
      'North Terminal'
    ],
    schedule: [
      '06:30',
      '06:45',
      '07:00',
      '07:15',
      '07:30',
      '07:45',
      '08:00'
    ],
    currentLocation: 'School Zone',
    nextStop: 'Community Center',
    eta: '3 mins',
    capacity: 45,
    occupancy: 28
  },
  {
    id: '3',
    busNumber: '103',
    route: 'Southside Express',
    stops: [
      'South Station',
      'Business District',
      'Tech Park',
      'Retail Plaza',
      'Convention Center',
      'Marina',
      'Beach Resort'
    ],
    schedule: [
      '07:00',
      '07:15',
      '07:30',
      '07:45',
      '08:00',
      '08:15',
      '08:30'
    ],
    currentLocation: 'Tech Park',
    nextStop: 'Retail Plaza',
    eta: '7 mins',
    capacity: 55,
    occupancy: 41
  },
  {
    id: '4',
    busNumber: '104',
    route: 'East-West Connector',
    stops: [
      'West Terminal',
      'Suburban Mall',
      'Industrial Area',
      'Central Hub',
      'Business Center',
      'East Terminal'
    ],
    schedule: [
      '05:45',
      '06:05',
      '06:25',
      '06:45',
      '07:05',
      '07:25'
    ],
    currentLocation: 'Central Hub',
    nextStop: 'Business Center',
    eta: '4 mins',
    capacity: 60,
    occupancy: 48
  },
  {
    id: '5',
    busNumber: '105',
    route: 'Metro Circle',
    stops: [
      'Metro Center',
      'Arts District',
      'Financial Quarter',
      'Old Town',
      'Riverside',
      'Metro Center'
    ],
    schedule: [
      '06:00',
      '06:20',
      '06:40',
      '07:00',
      '07:20',
      '07:40'
    ],
    currentLocation: 'Arts District',
    nextStop: 'Financial Quarter',
    eta: '6 mins',
    capacity: 40,
    occupancy: 22
  },
  {
    id: '6',
    busNumber: '106',
    route: 'Airport Shuttle',
    stops: [
      'Airport Terminal 1',
      'Airport Terminal 2',
      'Hotel District',
      'Conference Center',
      'Downtown',
      'Airport Terminal 1'
    ],
    schedule: [
      '05:30',
      '05:45',
      '06:00',
      '06:15',
      '06:30',
      '06:45'
    ],
    currentLocation: 'Hotel District',
    nextStop: 'Conference Center',
    eta: '8 mins',
    capacity: 35,
    occupancy: 19
  }
];
