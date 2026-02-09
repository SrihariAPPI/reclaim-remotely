import { useEffect, useRef } from 'react';
import { Device } from '@/types/device';
import { savePendingLocation } from '@/lib/offlineLocationStore';

/**
 * Periodically updates location for devices in lost mode (every 60s).
 * When offline, caches location data to IndexedDB for later sync.
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
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const timestamp = new Date().toISOString();

          for (const device of lostDevices) {
            if (navigator.onLine) {
              await updateDevice(device.id, { lat, lng, last_seen: timestamp });
            } else {
              // Cache offline for later sync
              await savePendingLocation({ deviceId: device.id, lat, lng, timestamp });
            }
          }
        },
        undefined,
        { enableHighAccuracy: true, timeout: 10000 }
      );
    };

    trackLocation();
    intervalRef.current = setInterval(trackLocation, 60000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [devices, updateDevice]);
}
