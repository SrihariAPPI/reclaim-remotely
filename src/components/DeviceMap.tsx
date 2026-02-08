import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import L from 'leaflet';
import { Device } from '@/types/device';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type MapLayer = 'satellite' | 'street';

interface DeviceMapProps {
  devices: Device[];
  selectedDevice: Device | null;
  onSelectDevice: (device: Device) => void;
  userLocation?: { lat: number; lng: number } | null;
  layer?: MapLayer;
}

export interface DeviceMapHandle {
  centerOnUser: () => void;
}

function createCustomIcon(device: Device, isSelected: boolean): L.DivIcon {
  const statusColor =
    device.status === 'online'
      ? '#22c55e'
      : device.status === 'lost'
      ? '#ef4444'
      : '#6b7280';

  const bgColor = isSelected ? '#14b8a6' : '#1e293b';
  const ringColor = isSelected ? '#14b8a680' : 'transparent';

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        position: relative;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: ${ringColor};
          animation: ${isSelected ? 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' : 'none'};
        "></div>
        <div style="
          width: 36px;
          height: 36px;
          background: ${bgColor};
          border: 2px solid ${statusColor};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            ${
              device.type === 'phone'
                ? '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>'
                : device.type === 'laptop'
                ? '<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>'
                : device.type === 'tablet'
                ? '<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/>'
                : '<circle cx="12" cy="12" r="6"/><polyline points="12 10 12 12 13 13"/><path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05"/><path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.77-4.05"/>'
            }
          </svg>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });
}

export const DeviceMap = forwardRef<DeviceMapHandle, DeviceMapProps>(function DeviceMap({
  devices,
  selectedDevice,
  onSelectDevice,
  userLocation,
  layer = 'satellite',
}, ref) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const userMarkerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  useImperativeHandle(ref, () => ({
    centerOnUser: () => {
      const map = mapInstanceRef.current;
      if (map && userLocation) {
        map.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 1 });
      }
    },
  }), [userLocation]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const center: L.LatLngExpression = [40.7128, -74.006];
    
    mapInstanceRef.current = L.map(mapRef.current, {
      center,
      zoom: 12,
      zoomControl: true,
    });

    tileLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri',
    }).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Switch tile layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !tileLayerRef.current) return;

    tileLayerRef.current.remove();

    const url = layer === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    const attribution = layer === 'satellite' ? '&copy; Esri' : '&copy; CartoDB';

    tileLayerRef.current = L.tileLayer(url, { attribution }).addTo(map);
  }, [layer]);

  // Update markers when devices change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    // Add new markers
    devices.forEach((device) => {
      const isSelected = selectedDevice?.id === device.id;
      const icon = createCustomIcon(device, isSelected);

      const marker = L.marker([device.location.lat, device.location.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width: 180px; padding: 4px;">
            <h3 style="font-weight: 600; margin-bottom: 4px; color: #f8fafc;">${device.name}</h3>
            <p style="font-size: 12px; color: #94a3b8; margin-bottom: 8px;">
              ${device.location.address || 'Location unknown'}
            </p>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="
                height: 8px;
                width: 8px;
                border-radius: 50%;
                background: ${device.status === 'online' ? '#22c55e' : device.status === 'lost' ? '#ef4444' : '#6b7280'};
              "></span>
              <span style="font-size: 12px; text-transform: capitalize; color: #f8fafc;">${device.status}</span>
            </div>
          </div>
        `);

      marker.on('click', () => onSelectDevice(device));
      markersRef.current.set(device.id, marker);
    });
  }, [devices, selectedDevice, onSelectDevice]);

  // Fly to selected device
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedDevice) return;

    map.flyTo([selectedDevice.location.lat, selectedDevice.location.lng], 14, {
      duration: 1,
    });
  }, [selectedDevice]);

  // User location marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div style="position:relative;width:24px;height:24px;display:flex;align-items:center;justify-content:center;">
            <div style="position:absolute;inset:0;border-radius:50%;background:hsl(174,72%,50%);opacity:0.3;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="width:14px;height:14px;border-radius:50%;background:hsl(174,72%,50%);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('<div style="color:#f8fafc;font-size:12px;"><strong>Your Location</strong></div>');

      // If no selected device, center on user
      if (!selectedDevice) {
        map.flyTo([userLocation.lat, userLocation.lng], 14, { duration: 1 });
      }
    }
  }, [userLocation, selectedDevice]);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden device-map-container">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
});