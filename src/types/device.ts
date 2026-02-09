export interface Device {
  id: string;
  name: string;
  type: 'phone' | 'tablet' | 'laptop' | 'watch';
  status: 'online' | 'offline' | 'lost';
  batteryLevel: number;
  lastSeen: Date;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  isRinging?: boolean;
  photoUrl?: string;
  lostMessage?: string;
  isWiped?: boolean;
}

export interface DeviceAction {
  type: 'ring' | 'locate' | 'lock' | 'message' | 'wipe';
  deviceId: string;
  payload?: Record<string, unknown>;
}