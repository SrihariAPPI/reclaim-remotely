import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Shield } from 'lucide-react';
import { Device } from '@/types/device';
import { DeviceCard } from './DeviceCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DeviceSidebarProps {
  devices: Device[];
  selectedDevice: Device | null;
  onSelectDevice: (device: Device) => void;
}

export function DeviceSidebar({
  devices,
  selectedDevice,
  onSelectDevice,
}: DeviceSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDevices = devices.filter((device) =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineCount = devices.filter((d) => d.status === 'online').length;
  const lostCount = devices.filter((d) => d.status === 'lost').length;

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-80 h-full flex flex-col glass-card border-r border-border/50"
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-lg gradient-text">FindMyDevice</h1>
            <p className="text-xs text-muted-foreground">Secure Device Locator</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search devices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/50 border-border/50"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 border-b border-border/50 flex gap-4">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-success" />
          <span className="text-xs text-muted-foreground">
            {onlineCount} Online
          </span>
        </div>
        {lostCount > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-xs text-destructive">
              {lostCount} Lost
            </span>
          </div>
        )}
      </div>

      {/* Device List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredDevices.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            isSelected={selectedDevice?.id === device.id}
            onClick={() => onSelectDevice(device)}
          />
        ))}

        {filteredDevices.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No devices found</p>
          </div>
        )}
      </div>

      {/* Add Device Button */}
      <div className="p-4 border-t border-border/50">
        <Button className="w-full gap-2" variant="outline">
          <Plus className="h-4 w-4" />
          Add Device
        </Button>
      </div>
    </motion.aside>
  );
}