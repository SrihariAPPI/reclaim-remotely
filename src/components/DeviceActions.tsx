import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  MapPin,
  Lock,
  MessageSquare,
  ChevronUp,
  Bell,
  Navigation,
} from 'lucide-react';
import { Device } from '@/types/device';
import { Button } from '@/components/ui/button';
import { BatteryIndicator } from './BatteryIndicator';
import { StatusBadge } from './StatusBadge';
import { DeviceIcon } from './DeviceIcon';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DeviceActionsProps {
  device: Device | null;
}

export function DeviceActions({ device }: DeviceActionsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isRinging, setIsRinging] = useState(false);

  if (!device) {
    return (
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card px-6 py-4 rounded-xl"
        >
          <p className="text-muted-foreground text-sm">
            Select a device to see actions
          </p>
        </motion.div>
      </div>
    );
  }

  const handleRing = () => {
    setIsRinging(true);
    toast.success(`Playing sound on ${device.name}`, {
      description: 'The device will ring for 30 seconds',
    });
    setTimeout(() => setIsRinging(false), 3000);
  };

  const handleLocate = () => {
    toast.success(`Locating ${device.name}`, {
      description: 'Requesting fresh location data...',
    });
  };

  const handleLock = () => {
    toast.success(`Locking ${device.name}`, {
      description: 'Device will be locked remotely',
    });
  };

  const handleMessage = () => {
    toast.info('Send Message', {
      description: 'This feature is coming soon',
    });
  };

  return (
    <motion.div
      layout
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg px-4"
    >
      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Toggle Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'p-2 rounded-lg',
                device.status === 'lost' ? 'bg-destructive/20' : 'bg-primary/20'
              )}
            >
              <DeviceIcon
                type={device.type}
                className={cn(
                  'h-5 w-5',
                  device.status === 'lost' ? 'text-destructive' : 'text-primary'
                )}
              />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm">{device.name}</h3>
              <p className="text-xs text-muted-foreground">
                Last seen {formatDistanceToNow(device.lastSeen, { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BatteryIndicator level={device.batteryLevel} />
            <StatusBadge status={device.status} />
            <ChevronUp
              className={cn(
                'h-4 w-4 text-muted-foreground transition-transform',
                !isExpanded && 'rotate-180'
              )}
            />
          </div>
        </button>

        {/* Expanded Actions */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 pb-4 border-t border-border/50">
                {/* Location Info */}
                <div className="flex items-center gap-2 py-3 text-sm">
                  <Navigation className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">
                    {device.location.address || 'Location not available'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    className={cn(
                      'flex-col gap-1 h-auto py-3',
                      isRinging && 'bg-primary/20 border-primary animate-pulse'
                    )}
                    onClick={handleRing}
                  >
                    {isRinging ? (
                      <Bell className="h-5 w-5 text-primary animate-bounce" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                    <span className="text-xs">Ring</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-col gap-1 h-auto py-3"
                    onClick={handleLocate}
                  >
                    <MapPin className="h-5 w-5" />
                    <span className="text-xs">Locate</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-col gap-1 h-auto py-3"
                    onClick={handleLock}
                  >
                    <Lock className="h-5 w-5" />
                    <span className="text-xs">Lock</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-col gap-1 h-auto py-3"
                    onClick={handleMessage}
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span className="text-xs">Message</span>
                  </Button>
                </div>

                {/* Lost Mode Alert */}
                {device.status === 'lost' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30"
                  >
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-destructive" />
                      <span className="text-sm font-medium text-destructive">
                        Lost Mode Active
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      This device is marked as lost. Location updates are being sent
                      every 60 seconds.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}