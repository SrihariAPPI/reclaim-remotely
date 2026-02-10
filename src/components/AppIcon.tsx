import { motion } from 'framer-motion';

interface AppIconProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export function AppIcon({ size = 24, className = '', animate = true }: AppIconProps) {
  const svg = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer shield — slightly rounded */}
      <path
        d="M12 2L4 5.5V11C4 16.25 7.4 21.15 12 22.5C16.6 21.15 20 16.25 20 11V5.5L12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.35"
      />
      {/* Inner radar pulse rings */}
      <circle cx="12" cy="11" r="2" fill="currentColor" />
      <circle cx="12" cy="11" r="4.5" stroke="currentColor" strokeWidth="1.2" opacity="0.55" fill="none" />
      <circle cx="12" cy="11" r="7" stroke="currentColor" strokeWidth="0.8" opacity="0.25" fill="none" />
      {/* Crosshair ticks */}
      <line x1="12" y1="6" x2="12" y2="7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="12" y1="14.5" x2="12" y2="16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="7" y1="11" x2="8.5" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="15.5" y1="11" x2="17" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );

  if (!animate) return svg;

  return (
    <motion.div
      className="inline-flex"
      animate={{
        filter: [
          'drop-shadow(0 0 4px hsl(174 72% 50% / 0.2))',
          'drop-shadow(0 0 12px hsl(174 72% 50% / 0.5))',
          'drop-shadow(0 0 4px hsl(174 72% 50% / 0.2))',
        ],
      }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      {svg}
    </motion.div>
  );
}
