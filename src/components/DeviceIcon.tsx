import { Device } from '@/types/device';

interface DeviceIconProps {
  type: Device['type'];
  className?: string;
}

export function DeviceIcon({ type, className = '' }: DeviceIconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {type === 'phone' && <PhoneSVG />}
      {type === 'laptop' && <LaptopSVG />}
      {type === 'tablet' && <TabletSVG />}
      {type === 'watch' && <WatchSVG />}
      {!['phone', 'laptop', 'tablet', 'watch'].includes(type) && <PhoneSVG />}
    </svg>
  );
}

/** Minimal phone — rounded rect body + signal arc */
function PhoneSVG() {
  return (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <line x1="10" y1="18" x2="14" y2="18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      {/* Signal arcs */}
      <path d="M15.5 6.5a3 3 0 0 1 0 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4" />
      <path d="M17 5a5.5 5.5 0 0 1 0 7" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.25" />
    </>
  );
}

/** Minimal laptop — screen + base with radar dot */
function LaptopSVG() {
  return (
    <>
      <rect x="4" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="M2 18h20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {/* Radar dot on screen */}
      <circle cx="12" cy="10" r="1.5" fill="currentColor" opacity="0.7" />
      <circle cx="12" cy="10" r="3.5" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.25" />
    </>
  );
}

/** Minimal tablet — larger rounded rect + crosshair center */
function TabletSVG() {
  return (
    <>
      <rect x="5" y="2" width="14" height="20" rx="2.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
      {/* Crosshair center */}
      <circle cx="12" cy="12" r="1.2" fill="currentColor" opacity="0.6" />
      <line x1="12" y1="8.5" x2="12" y2="10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
      <line x1="12" y1="14" x2="12" y2="15.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
      <line x1="8.5" y1="12" x2="10" y2="12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
      <line x1="14" y1="12" x2="15.5" y2="12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
    </>
  );
}

/** Minimal watch — rounded square body + band hints + pulse dot */
function WatchSVG() {
  return (
    <>
      {/* Band hints */}
      <path d="M9 2v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
      <path d="M15 2v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
      <path d="M9 19v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
      <path d="M15 19v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
      {/* Watch face */}
      <rect x="6" y="5" width="12" height="14" rx="3.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
      {/* Pulse dot */}
      <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity="0.7" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.3" />
    </>
  );
}
