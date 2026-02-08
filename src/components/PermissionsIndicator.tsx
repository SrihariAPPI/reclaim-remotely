import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Camera, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type PermState = 'granted' | 'denied' | 'prompt' | 'unsupported';

interface PermissionsIndicatorProps {
  location: PermState;
  camera: PermState;
  ready: boolean;
}

function PermIcon({ state }: { state: PermState }) {
  if (state === 'granted') return <CheckCircle2 className="h-3 w-3 text-success" />;
  if (state === 'denied') return <XCircle className="h-3 w-3 text-destructive" />;
  return <Loader2 className="h-3 w-3 text-muted-foreground animate-spin" />;
}

function permLabel(state: PermState) {
  if (state === 'granted') return 'On';
  if (state === 'denied') return 'Off';
  if (state === 'unsupported') return 'N/A';
  return '...';
}

export function PermissionsIndicator({ location, camera, ready }: PermissionsIndicatorProps) {
  const allGranted = location === 'granted' && camera === 'granted';
  const anyDenied = location === 'denied' || camera === 'denied';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={cn(
        'glass-card px-3 py-2 rounded-xl flex items-center gap-3',
        anyDenied && 'border-warning/30',
      )}
    >
      <div className="flex items-center gap-1.5">
        <MapPin className={cn('h-3 w-3', location === 'granted' ? 'text-success' : location === 'denied' ? 'text-destructive' : 'text-muted-foreground')} />
        <span className={cn('text-[10px] mono font-medium', location === 'granted' ? 'text-success' : location === 'denied' ? 'text-destructive' : 'text-muted-foreground')}>
          {permLabel(location)}
        </span>
      </div>
      <div className="w-px h-3 bg-border/40" />
      <div className="flex items-center gap-1.5">
        <Camera className={cn('h-3 w-3', camera === 'granted' ? 'text-success' : camera === 'denied' ? 'text-destructive' : 'text-muted-foreground')} />
        <span className={cn('text-[10px] mono font-medium', camera === 'granted' ? 'text-success' : camera === 'denied' ? 'text-destructive' : 'text-muted-foreground')}>
          {permLabel(camera)}
        </span>
      </div>
    </motion.div>
  );
}
