import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, divIcon } from 'leaflet';
import { Device } from '@/types/device';
import { DeviceIcon } from './DeviceIcon';
import { StatusBadge } from './StatusBadge';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface DeviceMapProps {
  devices: Device[];
  selectedDevice: Device | null;
  onSelectDevice: (device: Device) => void;
}

function MapController({ selectedDevice }: { selectedDevice: Device | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedDevice) {
      map.flyTo([selectedDevice.location.lat, selectedDevice.location.lng], 14, {
        duration: 1,
      });
    }
  }, [selectedDevice, map]);

  return null;
}

function createCustomMarker(device: Device, isSelected: boolean) {
  const statusColor =
    device.status === 'online'
      ? '#22c55e'
      : device.status === 'lost'
      ? '#ef4444'
      : '#6b7280';

  const bgColor = isSelected ? '#14b8a6' : '#1e293b';
  const ringColor = isSelected ? '#14b8a680' : 'transparent';

  return divIcon({
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

export function DeviceMap({
  devices,
  selectedDevice,
  onSelectDevice,
}: DeviceMapProps) {
  const center = selectedDevice
    ? [selectedDevice.location.lat, selectedDevice.location.lng]
    : [40.7128, -74.006];

  return (
    <div className="w-full h-full rounded-xl overflow-hidden">
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .leaflet-container {
          background: hsl(222, 30%, 8%);
        }
        .leaflet-popup-content-wrapper {
          background: hsl(222, 28%, 12%);
          border: 1px solid hsl(222, 25%, 20%);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        }
        .leaflet-popup-tip {
          background: hsl(222, 28%, 12%);
          border-color: hsl(222, 25%, 20%);
        }
        .leaflet-popup-content {
          margin: 12px;
          color: hsl(210, 40%, 96%);
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
        }
        .leaflet-control-zoom a {
          background: hsl(222, 28%, 12%) !important;
          color: hsl(210, 40%, 96%) !important;
          border-color: hsl(222, 25%, 20%) !important;
        }
        .leaflet-control-zoom a:hover {
          background: hsl(222, 25%, 18%) !important;
        }
      `}</style>
      <MapContainer
        center={center as [number, number]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapController selectedDevice={selectedDevice} />
        {devices.map((device) => (
          <Marker
            key={device.id}
            position={[device.location.lat, device.location.lng]}
            icon={createCustomMarker(device, selectedDevice?.id === device.id)}
            eventHandlers={{
              click: () => onSelectDevice(device),
            }}
          >
            <Popup>
              <div className="min-w-[180px]">
                <h3 className="font-semibold mb-1">{device.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {device.location.address}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      device.status === 'online'
                        ? 'bg-green-500'
                        : device.status === 'lost'
                        ? 'bg-red-500'
                        : 'bg-gray-500'
                    }`}
                  />
                  <span className="text-xs capitalize">{device.status}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}