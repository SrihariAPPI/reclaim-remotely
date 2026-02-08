import { Map, Satellite } from 'lucide-react';
import { motion } from 'framer-motion';

interface MapLayerToggleProps {
  layer: 'satellite' | 'street';
  onToggle: (layer: 'satellite' | 'street') => void;
}

export function MapLayerToggle({ layer, onToggle }: MapLayerToggleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-6 left-4 z-[400] glass-card rounded-xl p-1 flex gap-1"
    >
      <button
        onClick={() => onToggle('satellite')}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-all ${
          layer === 'satellite'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Satellite className="h-3.5 w-3.5" />
        Satellite
      </button>
      <button
        onClick={() => onToggle('street')}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-all ${
          layer === 'street'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Map className="h-3.5 w-3.5" />
        Street
      </button>
    </motion.div>
  );
}
