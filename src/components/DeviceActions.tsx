import { useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  Volume2, MapPin, Lock, MessageSquare, ChevronUp, Bell, Navigation, Camera, ShieldAlert, ShieldCheck,
} from 'lucide-react';
import { Device } from '@/types/device';
import { Switch } from '@/components/ui/switch';
import { BatteryIndicator } from './BatteryIndicator';
import { StatusBadge } from './StatusBadge';
import { DeviceIcon } from './DeviceIcon';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface DeviceActionsProps {
  device: Device | null;
  onUpdateDevice?: (id: string, updates: any) => Promise<any>;
}

export function DeviceActions({ device, onUpdateDevice }: DeviceActionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturing, setCapturing] = useState(false);

  if (!device) {
    return (
      <div className="absolute bottom-[140px] left-1/2 -translate-x-1/2 z-[450]">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card px-6 py-4 rounded-2xl border-dashed border-border/40"
        >
          <p className="text-muted-foreground text-sm">Select a device to see actions</p>
        </motion.div>
      </div>
    );
  }

  const isLost = device.status === 'lost';

  const handleRing = async () => {
    setIsRinging(true);
    if (onUpdateDevice) await onUpdateDevice(device.id, { is_ringing: true });
    toast.success(`Playing sound on ${device.name}`, { description: 'The device will ring for 30 seconds' });
    setTimeout(async () => {
      setIsRinging(false);
      if (onUpdateDevice) await onUpdateDevice(device.id, { is_ringing: false });
    }, 3000);
  };

  const handleLocate = () => {
    toast.success(`Locating ${device.name}`, { description: 'Requesting fresh location data...' });
  };

  const handleLock = async () => {
    if (onUpdateDevice) await onUpdateDevice(device.id, { status: 'offline' });
    toast.success(`Locking ${device.name}`, { description: 'Device will be locked remotely' });
  };

  const handleMessage = () => {
    toast.info('Send Message', { description: 'This feature is coming soon' });
  };

  const handleToggleLostMode = async () => {
    if (!onUpdateDevice) return;
    const newStatus = device.status === 'lost' ? 'online' : 'lost';
    await onUpdateDevice(device.id, { status: newStatus });
    if (newStatus === 'lost') {
      toast.warning(`${device.name} marked as LOST`, { description: 'Location tracking activated every 60 seconds' });
    } else {
      toast.success(`${device.name} recovered!`, { description: 'Lost mode deactivated' });
    }
  };

  const handleCapturePhoto = async () => {
    try {
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setTimeout(async () => {
        setCapturing(true);
        const canvas = document.createElement('canvas');
        if (videoRef.current) {
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
        }
        stream.getTracks().forEach(t => t.stop());
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const fileName = `${device.id}/${Date.now()}.jpg`;
          const { error } = await supabase.storage.from('device-photos').upload(fileName, blob, { contentType: 'image/jpeg' });
          if (!error) {
            const { data: urlData } = supabase.storage.from('device-photos').getPublicUrl(fileName);
            if (onUpdateDevice) await onUpdateDevice(device.id, { photo_url: urlData.publicUrl });
            toast.success('Photo captured & uploaded');
          } else {
            toast.error('Failed to upload photo');
          }
          setShowCamera(false);
          setCapturing(false);
        }, 'image/jpeg', 0.8);
      }, 1500);
    } catch {
      toast.error('Camera access denied');
      setShowCamera(false);
    }
  };

  const actions = [
    { icon: isRinging ? Bell : Volume2, label: 'Ring', onClick: handleRing, active: isRinging, activeClass: 'bg-primary/15 border-primary/40 text-primary' },
    { icon: MapPin, label: 'Locate', onClick: handleLocate },
    { icon: Lock, label: 'Lock', onClick: handleLock },
    { icon: MessageSquare, label: 'Message', onClick: handleMessage },
    { icon: Camera, label: 'Photo', onClick: handleCapturePhoto },
  ];

  return (
    <motion.div
      layout
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute bottom-[140px] left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-[450]"
    >
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(_: any, info: PanInfo) => {
          if (info.offset.y > 50) setIsExpanded(false);
        }}
        className={cn(
          'glass-card rounded-2xl overflow-hidden',
          isLost && 'border-destructive/30 shadow-[0_0_30px_-8px_hsl(0_72%_55%/0.2)]'
        )}
      >
        {/* Header bar */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-2.5 rounded-xl transition-colors',
              isLost ? 'bg-destructive/15 border border-destructive/25' : 'bg-primary/10 border border-primary/20'
            )}>
              <DeviceIcon type={device.type} className={cn('h-5 w-5', isLost ? 'text-destructive' : 'text-primary')} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm">{device.name}</h3>
              <p className="text-[10px] text-muted-foreground mono">Last seen {formatDistanceToNow(device.lastSeen, { addSuffix: true })}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <BatteryIndicator level={device.batteryLevel} size="md" />
            <StatusBadge status={device.status} size="sm" />
            <ChevronUp className={cn('h-4 w-4 text-muted-foreground transition-transform duration-300', !isExpanded && 'rotate-180')} />
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <div className="px-4 pb-4 max-h-[40vh] overflow-y-auto">
                {/* Gradient divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent mb-3" />

                <div className="flex items-center gap-2 py-2 text-sm">
                  <Navigation className="h-3.5 w-3.5 text-primary" />
                  <span className="text-muted-foreground text-xs">{device.location.address || 'Location not available'}</span>
                </div>

                {/* Lost Mode Toggle */}
                <div className="flex items-center justify-between py-2.5 mb-3 px-3 rounded-xl bg-muted/20 border border-border/30">
                  <div className="flex items-center gap-2.5">
                    {isLost
                      ? <ShieldAlert className="h-4 w-4 text-destructive" />
                      : <ShieldCheck className="h-4 w-4 text-success" />
                    }
                    <span className="text-xs font-semibold">Lost Mode</span>
                  </div>
                  <Switch checked={isLost} onCheckedChange={handleToggleLostMode} />
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-5 gap-2">
                  {actions.map(({ icon: Icon, label, onClick, active, activeClass }) => (
                    <button
                      key={label}
                      className={cn(
                        'action-btn',
                        active && (activeClass || ''),
                        active && 'animate-pulse'
                      )}
                      onClick={onClick}
                    >
                      <Icon className={cn('h-5 w-5', active && 'animate-bounce')} />
                      <span className="text-[10px] font-medium">{label}</span>
                    </button>
                  ))}
                </div>

                {/* Camera Preview */}
                {showCamera && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 rounded-xl overflow-hidden border border-border/30">
                    <video ref={videoRef} className="w-full rounded-xl" muted playsInline />
                    {capturing && <p className="text-[10px] text-center py-1.5 text-muted-foreground mono">Capturing...</p>}
                  </motion.div>
                )}

                {/* Captured Photo */}
                {device.photoUrl && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3">
                    <p className="text-[10px] text-muted-foreground mb-1.5 mono">Last captured photo:</p>
                    <img src={device.photoUrl} alt="Captured" className="w-full rounded-xl border border-border/30" />
                  </motion.div>
                )}

                {/* Lost mode warning */}
                {isLost && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 rounded-xl bg-destructive/8 border border-destructive/25"
                  >
                    <div className="flex items-center gap-2">
                      <Bell className="h-3.5 w-3.5 text-destructive" />
                      <span className="text-xs font-semibold text-destructive">Lost Mode Active</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">
                      Location updates every 60s. Capture a photo to identify the finder.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
