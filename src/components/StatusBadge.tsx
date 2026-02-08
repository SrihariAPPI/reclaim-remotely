import { Device } from '@/types/device';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: Device['status'];
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const dotSize = size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2';

  return (
    <div className={cn(
      'flex items-center gap-1.5 px-2 py-0.5 rounded-full',
      status === 'online' && 'bg-success/10',
      status === 'offline' && 'bg-muted/50',
      status === 'lost' && 'bg-destructive/10',
    )}>
      <span className="relative flex">
        <span
          className={cn(
            'rounded-full',
            dotSize,
            status === 'online' && 'bg-success',
            status === 'offline' && 'bg-muted-foreground/60',
            status === 'lost' && 'bg-destructive'
          )}
        />
        {(status === 'online' || status === 'lost') && (
          <span
            className={cn(
              'absolute inset-0 rounded-full animate-ping opacity-50',
              status === 'online' && 'bg-success',
              status === 'lost' && 'bg-destructive'
            )}
          />
        )}
      </span>
      <span
        className={cn(
          'font-semibold capitalize',
          size === 'sm' ? 'text-[10px]' : 'text-xs',
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
