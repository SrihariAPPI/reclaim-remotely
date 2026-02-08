import { useState } from 'react';
import { motion } from 'framer-motion';
import { Device } from '@/types/device';
import { DeviceSidebar } from '@/components/DeviceSidebar';
import { DeviceMap } from '@/components/DeviceMap';
import { DeviceActions } from '@/components/DeviceActions';
import { useDevices } from '@/hooks/useDevices';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useLostModeTracking } from '@/hooks/useLostModeTracking';
import { usePermissions } from '@/hooks/usePermissions';

export function Dashboard() {
  const permissions = usePermissions(); // triggers native permission dialogs on mobile
  const { devices, loading, addDevice, updateDevice, deleteDevice } = useDevices();
  const { location: userLocation } = useUserLocation();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  // Periodic location tracking for lost devices
  useLostModeTracking(devices, updateDevice);

  // Auto-select first lost device or first device
  const effectiveSelected = selectedDevice && devices.find(d => d.id === selectedDevice.id)
    ? devices.find(d => d.id === selectedDevice.id)!
    : devices.find(d => d.status === 'lost') || devices[0] || null;

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <DeviceSidebar
        devices={devices}
        selectedDevice={effectiveSelected}
        onSelectDevice={setSelectedDevice}
        onAddDevice={addDevice}
        loading={loading}
      />

      <main className="flex-1 relative">
        <DeviceMap
          devices={devices}
          selectedDevice={effectiveSelected}
          onSelectDevice={setSelectedDevice}
          userLocation={userLocation}
        />

        <DeviceActions
          device={effectiveSelected}
          onUpdateDevice={updateDevice}
        />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 glass-card px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-muted-foreground">
            {loading ? 'Loading...' : `${devices.length} Device${devices.length !== 1 ? 's' : ''}`}
          </span>
        </motion.div>
      </main>
    </div>
  );
}

export default Dashboard;
