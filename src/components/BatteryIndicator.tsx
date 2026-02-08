import { Battery, BatteryLow, BatteryMedium, BatteryFull, BatteryWarning, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BatteryIndicatorProps {
  level: number;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function BatteryIndicator({ level, showLabel = true, size = 'sm' }: BatteryIndicatorProps) {
  const getBatteryIcon = () => {
    if (level <= 10) return BatteryWarning;
    if (level <= 30) return BatteryLow;
    if (level <= 60) return BatteryMedium;
    return BatteryFull;
  };

  const getColor = () => {
    if (level <= 10) return 'text-destructive';
    if (level <= 30) return 'text-warning';
    return 'text-success';
  };

  const Icon = getBatteryIcon();
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';

  return (
    <div className={cn('flex items-center gap-1', getColor())}>
      <Icon className={iconSize} />
      {showLabel && (
        <span className={cn('mono font-medium', size === 'sm' ? 'text-[10px]' : 'text-xs')}>
          {level}%
        </span>
      )}
    </div>
  );
}
