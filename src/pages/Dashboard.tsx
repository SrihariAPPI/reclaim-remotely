import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Crosshair, Wifi } from 'lucide-react';
import { PermissionsIndicator } from '@/components/PermissionsIndicator';
import { Device } from '@/types/device';
import { MobileDeviceDrawer } from '@/components/MobileDeviceDrawer';
import { DeviceMap, DeviceMapHandle } from '@/components/DeviceMap';
import { DeviceActions } from '@/components/DeviceActions';
import { MapLayerToggle } from '@/components/MapLayerToggle';
import { LocateMeButton } from '@/components/LocateMeButton';
import { useDevices } from '@/hooks/useDevices';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useLostModeTracking } from '@/hooks/useLostModeTracking';

export function Dashboard() {
  const { devices, loading, addDevice, updateDevice, deleteDevice } = useDevices();
  const { location: userLocation } = useUserLocation();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [mapLayer, setMapLayer] = useState<'satellite' | 'street'>('satellite');
  const mapRef = useRef<DeviceMapHandle>(null);

  useLostModeTracking(devices, updateDevice);

  const effectiveSelected = selectedDevice && devices.find(d => d.id === selectedDevice.id)
    ? devices.find(d => d.id === selectedDevice.id)!
    : devices.find(d => d.status === 'lost') || devices[0] || null;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      <main className="flex-1 relative">
        <DeviceMap
          ref={mapRef}
          devices={devices}
          selectedDevice={effectiveSelected}
          onSelectDevice={setSelectedDevice}
          userLocation={userLocation}
          layer={mapLayer}
        />

        <MapLayerToggle layer={mapLayer} onToggle={setMapLayer} />

        <LocateMeButton
          userLocation={userLocation}
          onLocate={() => mapRef.current?.centerOnUser()}
        />

        <DeviceActions
          device={effectiveSelected}
          onUpdateDevice={updateDevice}
          onDeleteDevice={deleteDevice}
        />

        {/* Mobile drawer with header */}
        <MobileDeviceDrawer
          devices={devices}
          selectedDevice={effectiveSelected}
          onSelectDevice={setSelectedDevice}
          onAddDevice={addDevice}
          loading={loading}
        />
      </main>
    </div>
  );
}

export default Dashboard;
