import { motion } from 'framer-motion';
import { Crosshair } from 'lucide-react';

interface LocateMeButtonProps {
  userLocation: { lat: number; lng: number } | null | undefined;
  onLocate: () => void;
}

export function LocateMeButton({ userLocation, onLocate }: LocateMeButtonProps) {
  if (!userLocation) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onLocate}
      className="absolute top-16 right-3 z-[450] glass-card p-2.5 rounded-xl border border-border/30 hover:border-primary/30 transition-colors"
      title="Center on my location"
    >
      <Crosshair className="h-4 w-4 text-primary" />
    </motion.button>
  );
}
