import { Smartphone, Laptop, Tablet, Watch } from 'lucide-react';
import { Device } from '@/types/device';

interface DeviceIconProps {
  type: Device['type'];
  className?: string;
}

export function DeviceIcon({ type, className = '' }: DeviceIconProps) {
  const iconProps = { className: `${className}` };

  switch (type) {
    case 'phone':
      return <Smartphone {...iconProps} />;
    case 'laptop':
      return <Laptop {...iconProps} />;
    case 'tablet':
      return <Tablet {...iconProps} />;
    case 'watch':
      return <Watch {...iconProps} />;
    default:
      return <Smartphone {...iconProps} />;
  }
}