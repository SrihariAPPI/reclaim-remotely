import { useEffect, useRef } from 'react';
import { Device } from '@/types/device';

/**
 * Periodically updates location for devices in lost mode (every 60s).
 */
export function useLostModeTracking(
  devices: Device[],
  updateDevice: (id: string, updates: any) => Promise<any>
) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const lostDevices = devices.filter((d) => d.status === 'lost');
    if (lostDevices.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const trackLocation = () => {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          for (const device of lostDevices) {
            await updateDevice(device.id, {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              last_seen: new Date().toISOString(),
            });
          }
        },
        undefined,
        { enableHighAccuracy: true, timeout: 10000 }
      );
    };

    // Run immediately then every 60s
    trackLocation();
    intervalRef.current = setInterval(trackLocation, 60000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [devices, updateDevice]);
}
