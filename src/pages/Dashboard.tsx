import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crosshair, Wifi } from 'lucide-react';
import { Device } from '@/types/device';
import { DeviceSidebar } from '@/components/DeviceSidebar';
import { DeviceMap } from '@/components/DeviceMap';
import { DeviceActions } from '@/components/DeviceActions';
import { useDevices } from '@/hooks/useDevices';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useLostModeTracking } from '@/hooks/useLostModeTracking';
import { usePermissions } from '@/hooks/usePermissions';

export function Dashboard() {
  const permissions = usePermissions();
  const { devices, loading, addDevice, updateDevice, deleteDevice } = useDevices();
  const { location: userLocation } = useUserLocation();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  useLostModeTracking(devices, updateDevice);

  const effectiveSelected = selectedDevice && devices.find(d => d.id === selectedDevice.id)
    ? devices.find(d => d.id === selectedDevice.id)!
    : devices.find(d => d.status === 'lost') || devices[0] || null;

  const lostCount = devices.filter(d => d.status === 'lost').length;

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background">
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

        {/* Top-right HUD */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-[400]">
          {lostCount > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card px-3.5 py-2 rounded-xl flex items-center gap-2 border-destructive/30"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-destructive animate-ping opacity-50" />
                <span className="rounded-full h-2 w-2 bg-destructive" />
              </span>
              <span className="text-[10px] font-semibold text-destructive mono">{lostCount} LOST</span>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card px-3.5 py-2 rounded-xl flex items-center gap-2"
          >
            <Wifi className="h-3 w-3 text-success" />
            <span className="text-[10px] text-muted-foreground mono">
              {loading ? 'Syncing...' : `${devices.length} Device${devices.length !== 1 ? 's' : ''}`}
            </span>
          </motion.div>
          {userLocation && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card px-3.5 py-2 rounded-xl flex items-center gap-2"
            >
              <Crosshair className="h-3 w-3 text-primary" />
              <span className="text-[10px] text-muted-foreground mono">GPS Active</span>
            </motion.div>
          )}
        </div>

        <DeviceActions
          device={effectiveSelected}
          onUpdateDevice={updateDevice}
        />
      </main>
    </div>
  );
}

export default Dashboard;
