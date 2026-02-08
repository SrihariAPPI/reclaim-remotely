import { useEffect, useState } from 'react';

interface PermissionStatus {
  location: 'granted' | 'denied' | 'prompt' | 'unsupported';
  camera: 'granted' | 'denied' | 'prompt' | 'unsupported';
  ready: boolean;
}

/**
 * Requests location and camera permissions on mount.
 * Works on both web browsers and Capacitor mobile apps.
 * On mobile, this triggers the native OS permission dialogs.
 */
export function usePermissions() {
  const [status, setStatus] = useState<PermissionStatus>({
    location: 'prompt',
    camera: 'prompt',
    ready: false,
  });

  useEffect(() => {
    async function requestPermissions() {
      let locationStatus: PermissionStatus['location'] = 'unsupported';
      let cameraStatus: PermissionStatus['camera'] = 'unsupported';

      // Request location permission
      if (navigator.geolocation) {
        try {
          await new Promise<GeolocationPosition>((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
            })
          );
          locationStatus = 'granted';
        } catch (err: any) {
          locationStatus = err?.code === 1 ? 'denied' : 'prompt';
        }
      }

      // Request camera permission
      if (navigator.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
          });
          // Stop tracks immediately — we just needed the permission
          stream.getTracks().forEach((t) => t.stop());
          cameraStatus = 'granted';
        } catch (err: any) {
          cameraStatus = err?.name === 'NotAllowedError' ? 'denied' : 'prompt';
        }
      }

      setStatus({ location: locationStatus, camera: cameraStatus, ready: true });
    }

    requestPermissions();
  }, []);

  return status;
}
