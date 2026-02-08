import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
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
  const isLost = device.status === 'lost';

  return (
    <motion.button
      onClick={onClick}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      className={cn(
        'w-full p-3.5 rounded-2xl text-left transition-all duration-300 relative overflow-hidden group',
        'glass-card-hover',
        isSelected && 'ring-1 ring-primary/50 bg-primary/5 border-primary/30',
        isLost && !isSelected && 'border-destructive/30'
      )}
    >
      {/* Subtle glow layer for selected state */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-primary/4 pointer-events-none" />
      )}
      {isLost && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-destructive/10 blur-2xl pointer-events-none" />
      )}

      <div className="relative flex items-start gap-3">
        <div
          className={cn(
            'p-2.5 rounded-xl transition-colors duration-200',
            isSelected
              ? 'bg-primary/15 shadow-[0_0_12px_-2px_hsl(174_72%_50%/0.3)]'
              : isLost
              ? 'bg-destructive/10'
              : 'bg-muted/50'
          )}
        >
          <DeviceIcon
            type={device.type}
            className={cn(
              'h-5 w-5 transition-colors',
              isSelected ? 'text-primary' : isLost ? 'text-destructive' : 'text-muted-foreground group-hover:text-foreground'
            )}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className={cn(
              'font-semibold text-sm truncate',
              isSelected && 'text-primary'
            )}>{device.name}</h3>
            <StatusBadge status={device.status} size="sm" />
          </div>

          <div className="flex items-center gap-1 mt-1.5 text-muted-foreground">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="text-[11px] truncate">
              {device.location.address || 'Location unknown'}
            </span>
          </div>

          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border/30">
            <BatteryIndicator level={device.batteryLevel} />
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="text-[10px] mono">
                {formatDistanceToNow(device.lastSeen, { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
