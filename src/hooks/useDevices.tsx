import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Device } from '@/types/device';

type DeviceRow = {
  id: string;
  user_id: string;
  name: string;
  type: string;
  status: string;
  battery_level: number;
  last_seen: string;
  lat: number;
  lng: number;
  address: string | null;
  is_ringing: boolean;
  photo_url: string | null;
  lost_message: string | null;
  is_wiped: boolean;
};

function rowToDevice(row: DeviceRow): Device {
  return {
    id: row.id,
    name: row.name,
    type: row.type as Device['type'],
    status: row.status as Device['status'],
    batteryLevel: row.battery_level,
    lastSeen: new Date(row.last_seen),
    location: { lat: row.lat, lng: row.lng, address: row.address ?? undefined },
    isRinging: row.is_ringing,
    photoUrl: row.photo_url ?? undefined,
    lostMessage: row.lost_message ?? undefined,
    isWiped: row.is_wiped,
  };
}

export function useDevices() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDevices = useCallback(async () => {
    if (!user) { setDevices([]); setLoading(false); return; }
    const { data } = await supabase
      .from('devices')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setDevices(data.map((r: any) => rowToDevice(r as DeviceRow)));
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchDevices(); }, [fetchDevices]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('devices-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'devices' }, () => {
        fetchDevices();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, fetchDevices]);

  const addDevice = async (device: Omit<Device, 'id' | 'lastSeen' | 'isRinging'>) => {
    if (!user) return;
    const { error } = await supabase.from('devices').insert({
      user_id: user.id,
      name: device.name,
      type: device.type,
      status: device.status,
      battery_level: device.batteryLevel,
      lat: device.location.lat,
      lng: device.location.lng,
      address: device.location.address ?? null,
    });
    if (!error) fetchDevices();
    return error;
  };

  const updateDevice = async (id: string, updates: Partial<{ status: string; is_ringing: boolean; lat: number; lng: number; address: string; photo_url: string }>) => {
    const { error } = await supabase.from('devices').update(updates).eq('id', id);
    if (!error) fetchDevices();
    return error;
  };

  const deleteDevice = async (id: string) => {
    const { error } = await supabase.from('devices').delete().eq('id', id);
    if (!error) fetchDevices();
    return error;
  };

  return { devices, loading, addDevice, updateDevice, deleteDevice, refetch: fetchDevices };
}
