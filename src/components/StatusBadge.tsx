import { Device } from '@/types/device';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: Device['status'];
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5';
  
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          'rounded-full',
          sizeClasses,
          status === 'online' && 'bg-success animate-pulse-glow',
          status === 'offline' && 'bg-muted-foreground',
          status === 'lost' && 'bg-destructive animate-pulse'
        )}
      />
      <span
        className={cn(
          'text-xs font-medium capitalize',
          status === 'online' && 'text-success',
          status === 'offline' && 'text-muted-foreground',
          status === 'lost' && 'text-destructive'
        )}
      >
        {status}
      </span>
    </div>
  );
}