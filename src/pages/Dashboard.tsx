import { useState } from 'react';
import { motion } from 'framer-motion';
import { Device } from '@/types/device';
import { mockDevices } from '@/data/mockDevices';
import { DeviceSidebar } from '@/components/DeviceSidebar';
import { DeviceMap } from '@/components/DeviceMap';
import { DeviceActions } from '@/components/DeviceActions';

export function Dashboard() {
  const [devices] = useState<Device[]>(mockDevices);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(
    mockDevices.find((d) => d.status === 'lost') || mockDevices[0]
  );

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Sidebar */}
      <DeviceSidebar
        devices={devices}
        selectedDevice={selectedDevice}
        onSelectDevice={setSelectedDevice}
      />

      {/* Map Area */}
      <main className="flex-1 relative">
        <DeviceMap
          devices={devices}
          selectedDevice={selectedDevice}
          onSelectDevice={setSelectedDevice}
        />

        {/* Device Actions Panel */}
        <DeviceActions device={selectedDevice} />

        {/* Top-right status */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 glass-card px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-muted-foreground">Tracking Active</span>
        </motion.div>
      </main>
    </div>
  );
}

export default Dashboard;