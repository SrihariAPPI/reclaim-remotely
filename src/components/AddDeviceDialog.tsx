import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface AddDeviceDialogProps {
  onAdd: (device: { name: string; type: 'phone' | 'tablet' | 'laptop' | 'watch'; status: 'online'; batteryLevel: number; location: { lat: number; lng: number; address?: string } }) => Promise<any>;
}

export function AddDeviceDialog({ onAdd }: AddDeviceDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'phone' | 'tablet' | 'laptop' | 'watch'>('phone');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);

    // Use browser geolocation if available
    let lat = 40.7128, lng = -74.006, address = 'New York, NY';
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
      );
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
      address = undefined as any;
    } catch {
      // fallback to default
    }

    const error = await onAdd({ name: name.trim(), type, status: 'online', batteryLevel: 100, location: { lat, lng, address } });
    setSubmitting(false);
    if (error) {
      toast.error('Failed to add device');
    } else {
      toast.success(`${name} added successfully`);
      setName('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2" variant="outline">
          <Plus className="h-4 w-4" />
          Add Device
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-border/50">
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Device name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Select value={type} onValueChange={(v) => setType(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="tablet">Tablet</SelectItem>
              <SelectItem value="laptop">Laptop</SelectItem>
              <SelectItem value="watch">Watch</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Device'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
