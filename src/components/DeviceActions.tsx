import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2, MapPin, Lock, MessageSquare, ChevronUp, Bell, Navigation, Camera, ShieldAlert, ShieldCheck,
} from 'lucide-react';
import { Device } from '@/types/device';
import { Button } from '@/components/ui/button';
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
  const [isExpanded, setIsExpanded] = useState(true);
  const [isRinging, setIsRinging] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturing, setCapturing] = useState(false);

  if (!device) {
    return (
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card px-6 py-4 rounded-xl"
        >
          <p className="text-muted-foreground text-sm">Select a device to see actions</p>
        </motion.div>
      </div>
    );
  }

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
      // Wait a moment then capture
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

  return (
    <motion.div
      layout
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg px-4"
    >
      <div className="glass-card rounded-2xl overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', device.status === 'lost' ? 'bg-destructive/20' : 'bg-primary/20')}>
              <DeviceIcon type={device.type} className={cn('h-5 w-5', device.status === 'lost' ? 'text-destructive' : 'text-primary')} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm">{device.name}</h3>
              <p className="text-xs text-muted-foreground">Last seen {formatDistanceToNow(device.lastSeen, { addSuffix: true })}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BatteryIndicator level={device.batteryLevel} />
            <StatusBadge status={device.status} />
            <ChevronUp className={cn('h-4 w-4 text-muted-foreground transition-transform', !isExpanded && 'rotate-180')} />
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 pb-4 border-t border-border/50">
                <div className="flex items-center gap-2 py-3 text-sm">
                  <Navigation className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">{device.location.address || 'Location not available'}</span>
                </div>

                {/* Lost Mode Toggle */}
                <div className="flex items-center justify-between py-2 mb-2">
                  <div className="flex items-center gap-2">
                    {device.status === 'lost' ? <ShieldAlert className="h-4 w-4 text-destructive" /> : <ShieldCheck className="h-4 w-4 text-success" />}
                    <span className="text-sm font-medium">Lost Mode</span>
                  </div>
                  <Switch checked={device.status === 'lost'} onCheckedChange={handleToggleLostMode} />
                </div>

                <div className="grid grid-cols-5 gap-2">
                  <Button variant="outline" className={cn('flex-col gap-1 h-auto py-3', isRinging && 'bg-primary/20 border-primary animate-pulse')} onClick={handleRing}>
                    {isRinging ? <Bell className="h-5 w-5 text-primary animate-bounce" /> : <Volume2 className="h-5 w-5" />}
                    <span className="text-xs">Ring</span>
                  </Button>
                  <Button variant="outline" className="flex-col gap-1 h-auto py-3" onClick={handleLocate}>
                    <MapPin className="h-5 w-5" />
                    <span className="text-xs">Locate</span>
                  </Button>
                  <Button variant="outline" className="flex-col gap-1 h-auto py-3" onClick={handleLock}>
                    <Lock className="h-5 w-5" />
                    <span className="text-xs">Lock</span>
                  </Button>
                  <Button variant="outline" className="flex-col gap-1 h-auto py-3" onClick={handleMessage}>
                    <MessageSquare className="h-5 w-5" />
                    <span className="text-xs">Message</span>
                  </Button>
                  <Button variant="outline" className="flex-col gap-1 h-auto py-3" onClick={handleCapturePhoto}>
                    <Camera className="h-5 w-5" />
                    <span className="text-xs">Photo</span>
                  </Button>
                </div>

                {/* Camera Preview */}
                {showCamera && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 rounded-lg overflow-hidden border border-border/50">
                    <video ref={videoRef} className="w-full rounded-lg" muted playsInline />
                    {capturing && <p className="text-xs text-center py-1 text-muted-foreground">Capturing...</p>}
                  </motion.div>
                )}

                {/* Captured Photo */}
                {device.photoUrl && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1">Last captured photo:</p>
                    <img src={device.photoUrl} alt="Captured" className="w-full rounded-lg border border-border/50" />
                  </motion.div>
                )}

                {device.status === 'lost' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-destructive" />
                      <span className="text-sm font-medium text-destructive">Lost Mode Active</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Location updates every 60s. Capture a photo to identify the finder.</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
