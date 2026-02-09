import { useState, useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Plus } from 'lucide-react';
import { AddDeviceDialog } from './AddDeviceDialog';

interface FloatingAddButtonProps {
  onAdd: (device: any) => Promise<any>;
}

export function FloatingAddButton({ onAdd }: FloatingAddButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const handleDragStart = () => setIsDragging(true);

  const handleDragEnd = (_: any, info: PanInfo) => {
    setPosition((prev) => ({
      x: prev.x + info.offset.x,
      y: prev.y + info.offset.y,
    }));
    // Delay resetting so the click handler can check
    setTimeout(() => setIsDragging(false), 100);
  };

  const handleTap = () => {
    if (!isDragging) setDialogOpen(true);
  };

  return (
    <>
      {/* Drag boundary — full viewport */}
      <div ref={constraintsRef} className="fixed inset-0 z-[520] pointer-events-none">
        <motion.button
          className="absolute bottom-36 right-4 pointer-events-auto h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center active:scale-95 transition-transform"
          style={{ x: position.x, y: position.y }}
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onTap={handleTap}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="h-6 w-6" />
        </motion.button>
      </div>

      {/* Reuse AddDeviceDialog in controlled mode */}
      <AddDeviceDialog onAdd={onAdd} open={dialogOpen} onOpenChange={setDialogOpen} hideTrigger />
    </>
  );
}
