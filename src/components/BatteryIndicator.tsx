import { Battery, BatteryLow, BatteryMedium, BatteryFull, BatteryWarning } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BatteryIndicatorProps {
  level: number;
  showLabel?: boolean;
}

export function BatteryIndicator({ level, showLabel = true }: BatteryIndicatorProps) {
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

  return (
    <div className={cn('flex items-center gap-1', getColor())}>
      <Icon className="h-4 w-4" />
      {showLabel && <span className="text-xs font-mono">{level}%</span>}
    </div>
  );
}