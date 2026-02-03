import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Device } from '@/types/device';
import { DeviceIcon } from './DeviceIcon';
import { StatusBadge } from './StatusBadge';
import { BatteryIndicator } from './BatteryIndicator';
import { cn } from '@/lib/utils';

interface DeviceCardProps {
  device: Device;
  isSelected: boolean;
  onClick: () => void;
}

export function DeviceCard({ device, isSelected, onClick }: DeviceCardProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        'w-full p-4 rounded-xl text-left transition-all duration-200',
        'glass-card-hover',
        isSelected && 'ring-2 ring-primary bg-primary/5 border-primary/30'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'p-2.5 rounded-lg',
            isSelected ? 'bg-primary/20' : 'bg-muted'
          )}
        >
          <DeviceIcon
            type={device.type}
            className={cn(
              'h-5 w-5',
              isSelected ? 'text-primary' : 'text-muted-foreground'
            )}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-sm truncate">{device.name}</h3>
            <StatusBadge status={device.status} size="sm" />
          </div>

          <div className="flex items-center gap-1 mt-1 text-muted-foreground">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="text-xs truncate">
              {device.location.address || 'Location unknown'}
            </span>
          </div>

          <div className="flex items-center justify-between mt-2">
            <BatteryIndicator level={device.batteryLevel} />
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(device.lastSeen, { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}