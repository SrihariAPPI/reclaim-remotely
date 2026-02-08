import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Shield, LogOut, Wifi, AlertTriangle, Smartphone, ChevronLeft, ChevronRight } from 'lucide-react';
import { Device } from '@/types/device';
import { DeviceCard } from './DeviceCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AddDeviceDialog } from './AddDeviceDialog';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface DeviceSidebarProps {
  devices: Device[];
  selectedDevice: Device | null;
  onSelectDevice: (device: Device) => void;
  onAddDevice: (device: any) => Promise<any>;
  loading?: boolean;
}

export function DeviceSidebar({
  devices,
  selectedDevice,
  onSelectDevice,
  onAddDevice,
  loading,
}: DeviceSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const { signOut } = useAuth();

  const filteredDevices = devices.filter((device) =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineCount = devices.filter((d) => d.status === 'online').length;
  const lostCount = devices.filter((d) => d.status === 'lost').length;
  const offlineCount = devices.filter((d) => d.status === 'offline').length;

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1, width: collapsed ? 64 : 320 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-full flex flex-col glass-card border-r border-border/30 relative overflow-hidden"
    >
      {/* Decorative mesh */}
      <div className="absolute inset-0 mesh-gradient pointer-events-none" />

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-4 -right-0 z-10 p-1 rounded-l-lg bg-card/80 border border-border/40 border-r-0 text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      <AnimatePresence mode="wait">
        {!collapsed ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full relative z-[1]"
          >
            {/* Header */}
            <div className="p-5 pb-4">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 animate-glow-pulse">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="font-bold text-base heading-display gradient-text-glow tracking-tight">FindMyDevice</h1>
                    <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">Secure Tracker</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={signOut} title="Sign Out" className="rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>

              <div className="relative glow-ring rounded-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search devices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-muted/30 border-border/30 rounded-xl h-10 text-sm placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            {/* Stats row */}
            <div className="px-5 pb-4 flex gap-2">
              <div className="stat-pill">
                <Wifi className="h-3 w-3 text-success" />
                <span className="text-success">{onlineCount}</span>
              </div>
              <div className="stat-pill">
                <Smartphone className="h-3 w-3 text-muted-foreground" />
                <span>{offlineCount}</span>
              </div>
              {lostCount > 0 && (
                <div className="stat-pill border-destructive/30 bg-destructive/10">
                  <AlertTriangle className="h-3 w-3 text-destructive" />
                  <span className="text-destructive">{lostCount}</span>
                </div>
              )}
              <div className="stat-pill ml-auto">
                <span className="text-muted-foreground">{devices.length} total</span>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-5 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

            {/* Device List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 mt-1">
              {loading ? (
                <div className="space-y-3 p-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 rounded-2xl bg-muted/30 animate-pulse" />
                  ))}
                </div>
              ) : filteredDevices.length > 0 ? (
                filteredDevices.map((device, i) => (
                  <motion.div
                    key={device.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <DeviceCard
                      device={device}
                      isSelected={selectedDevice?.id === device.id}
                      onClick={() => onSelectDevice(device)}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/30 flex items-center justify-center">
                    <Smartphone className="h-7 w-7 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">No devices found</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Add a device to get started</p>
                </motion.div>
              )}
            </div>

            {/* Add Device */}
            <div className="p-4 border-t border-border/30">
              <AddDeviceDialog onAdd={onAddDevice} />
            </div>
          </motion.div>
        ) : (
          /* Collapsed mini sidebar */
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center h-full py-4 gap-3 relative z-[1]"
          >
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div className="w-8 h-px bg-border/40 my-1" />
            <div className="flex-1 overflow-y-auto space-y-2 px-2">
              {devices.map((device) => (
                <button
                  key={device.id}
                  onClick={() => onSelectDevice(device)}
                  className={cn(
                    'p-2 rounded-xl transition-all',
                    selectedDevice?.id === device.id
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  )}
                  title={device.name}
                >
                  <div className="relative">
                    <Smartphone className="h-4 w-4" />
                    <span className={cn(
                      'absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full border border-background',
                      device.status === 'online' && 'bg-success',
                      device.status === 'offline' && 'bg-muted-foreground',
                      device.status === 'lost' && 'bg-destructive',
                    )} />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
