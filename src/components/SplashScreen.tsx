import { motion } from 'framer-motion';
import { Shield, MapPin, Camera, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SplashScreenProps {
  permissions: {
    location: 'granted' | 'denied' | 'prompt' | 'unsupported';
    camera: 'granted' | 'denied' | 'prompt' | 'unsupported';
    ready: boolean;
  };
}

export function SplashScreen({ permissions }: SplashScreenProps) {
  const { location, camera, ready } = permissions;

  const getIcon = (status: string) => {
    if (status === 'granted') return <CheckCircle2 className="h-4 w-4 text-success" />;
    if (status === 'denied') return <XCircle className="h-4 w-4 text-destructive" />;
    return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
  };

  const getLabel = (status: string) => {
    if (status === 'granted') return 'Granted';
    if (status === 'denied') return 'Denied';
    return 'Requesting...';
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center px-6">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="p-5 rounded-3xl bg-primary/10 border border-primary/20 animate-glow-pulse">
            <Shield className="h-12 w-12 text-primary" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold heading-display gradient-text-glow tracking-tight mb-1"
        >
          FindMyDevice
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-muted-foreground tracking-widest uppercase mb-10"
        >
          Secure Device Tracker
        </motion.p>

        {/* Permission status cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-xs space-y-3"
        >
          <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Location Access</p>
              <p className="text-[10px] text-muted-foreground">Required to track devices</p>
            </div>
            {getIcon(location)}
          </div>

          <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <Camera className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Camera Access</p>
              <p className="text-[10px] text-muted-foreground">Used to capture device photos</p>
            </div>
            {getIcon(camera)}
          </div>
        </motion.div>

        {/* Loading indicator */}
        {!ready && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex items-center gap-2"
          >
            <Loader2 className="h-4 w-4 text-primary animate-spin" />
            <span className="text-xs text-muted-foreground mono">Setting up permissions...</span>
          </motion.div>
        )}

        {ready && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 flex items-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span className="text-xs text-muted-foreground mono">Ready</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
