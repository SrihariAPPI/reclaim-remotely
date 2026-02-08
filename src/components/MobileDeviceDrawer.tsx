import { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Search, Shield, ChevronUp, ChevronDown, Sun, Moon, Wifi, Smartphone, AlertTriangle, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Device } from '@/types/device';
import { DeviceCard } from './DeviceCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AddDeviceDialog } from './AddDeviceDialog';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface MobileDeviceDrawerProps {
  devices: Device[];
  selectedDevice: Device | null;
  onSelectDevice: (device: Device) => void;
  onAddDevice: (device: any) => Promise<any>;
  loading?: boolean;
}

export function MobileDeviceDrawer({
  devices,
  selectedDevice,
  onSelectDevice,
  onAddDevice,
  loading,
}: MobileDeviceDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const filteredDevices = devices.filter((device) =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineCount = devices.filter((d) => d.status === 'online').length;
  const lostCount = devices.filter((d) => d.status === 'lost').length;

  const handleSelectDevice = (device: Device) => {
    onSelectDevice(device);
    setExpanded(false);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.y < -threshold) {
      setExpanded(true);
    } else if (info.offset.y > threshold) {
      setExpanded(false);
    }
  };

  return (
    <>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-[500] safe-area-top">
        <div className="glass-card border-b border-border/30 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-sm heading-display gradient-text-glow tracking-tight">FindMyDevice</h1>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="stat-pill mr-1">
              <Wifi className="h-3 w-3 text-success" />
              <span className="text-[10px]">{onlineCount}</span>
            </div>
            {lostCount > 0 && (
              <div className="stat-pill border-destructive/30 bg-destructive/10 mr-1">
                <AlertTriangle className="h-3 w-3 text-destructive" />
                <span className="text-[10px] text-destructive">{lostCount}</span>
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-xl h-8 w-8">
              {theme === 'dark' ? <Sun className="h-3.5 w-3.5 text-warning" /> : <Moon className="h-3.5 w-3.5 text-primary" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate('/settings')} className="rounded-xl h-8 w-8">
              <Settings className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom drawer */}
      <div className="absolute bottom-0 left-0 right-0 z-[500]">
        {/* Backdrop */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[499]"
              onClick={() => setExpanded(false)}
            />
          )}
        </AnimatePresence>

        <motion.div
          className={cn(
            'relative z-[500] glass-card border-t border-border/30 rounded-t-2xl',
            expanded ? 'max-h-[75vh]' : 'max-h-[auto]'
          )}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          {/* Drag handle & toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex flex-col items-center pt-2 pb-3 px-4 touch-none"
          >
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mb-2" />
            <div className="w-full flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                {devices.length} Device{devices.length !== 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <span className="text-[10px]">{expanded ? 'Close' : 'View all'}</span>
                {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
              </div>
            </div>
          </button>

          {/* Selected device quick preview (when collapsed) */}
          {!expanded && selectedDevice && (
            <div className="px-4 pb-3">
              <DeviceCard
                device={selectedDevice}
                isSelected
                onClick={() => setExpanded(true)}
              />
            </div>
          )}

          {/* Expanded device list */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-2">
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search devices..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-muted/30 border-border/30 rounded-xl h-10 text-sm"
                    />
                  </div>
                </div>

                <div className="overflow-y-auto max-h-[50vh] px-4 pb-4 space-y-2">
                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 rounded-2xl bg-muted/30 animate-pulse" />
                      ))}
                    </div>
                  ) : filteredDevices.length > 0 ? (
                    filteredDevices.map((device) => (
                      <DeviceCard
                        key={device.id}
                        device={device}
                        isSelected={selectedDevice?.id === device.id}
                        onClick={() => handleSelectDevice(device)}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Smartphone className="h-6 w-6 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No devices found</p>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-border/30">
                  <AddDeviceDialog onAdd={onAddDevice} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
