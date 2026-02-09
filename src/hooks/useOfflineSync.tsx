import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getPendingLocations, clearPendingLocations } from '@/lib/offlineLocationStore';
import { toast } from 'sonner';

/**
 * Syncs cached offline location data to the backend when connectivity is restored.
 */
export function useOfflineSync() {
  const syncPending = useCallback(async () => {
    const pending = await getPendingLocations();
    if (pending.length === 0) return;

    let synced = 0;
    for (const entry of pending) {
      const { error } = await supabase
        .from('devices')
        .update({ lat: entry.lat, lng: entry.lng, last_seen: entry.timestamp })
        .eq('id', entry.deviceId);
      if (!error) synced++;
    }

    if (synced > 0) {
      await clearPendingLocations();
      toast.success(`Synced ${synced} offline location update${synced > 1 ? 's' : ''}`);
    }
  }, []);

  useEffect(() => {
    // Sync on mount (app startup)
    syncPending();

    // Sync when coming back online
    const handleOnline = () => syncPending();
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [syncPending]);
}
