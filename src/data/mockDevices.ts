import { Device } from '@/types/device';

export const mockDevices: Device[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    type: 'phone',
    status: 'online',
    batteryLevel: 78,
    lastSeen: new Date(),
    location: {
      lat: 40.7128,
      lng: -74.006,
      address: 'Manhattan, New York, NY',
    },
  },
  {
    id: '2',
    name: 'MacBook Pro 16"',
    type: 'laptop',
    status: 'online',
    batteryLevel: 92,
    lastSeen: new Date(Date.now() - 1000 * 60 * 5),
    location: {
      lat: 40.7589,
      lng: -73.9851,
      address: 'Times Square, New York, NY',
    },
  },
  {
    id: '3',
    name: 'iPad Air',
    type: 'tablet',
    status: 'offline',
    batteryLevel: 34,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2),
    location: {
      lat: 40.6892,
      lng: -74.0445,
      address: 'Statue of Liberty, NY',
    },
  },
  {
    id: '4',
    name: 'Apple Watch Ultra',
    type: 'watch',
    status: 'lost',
    batteryLevel: 12,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 24),
    location: {
      lat: 40.7484,
      lng: -73.9857,
      address: 'Empire State Building, NY',
    },
  },
];