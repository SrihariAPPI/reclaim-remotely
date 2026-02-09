import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SendMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceName: string;
  deviceId: string;
  onSend: (id: string, updates: any) => Promise<any>;
}

export function SendMessageDialog({ open, onOpenChange, deviceName, deviceId, onSend }: SendMessageDialogProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    const error = await onSend(deviceId, { lost_message: message.trim() });
    setSending(false);
    if (!error) {
      toast.success(`Message sent to ${deviceName}`, { description: 'It will display on the lock screen' });
      setMessage('');
      onOpenChange(false);
    } else {
      toast.error('Failed to send message');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-border/50 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm">Send Message to {deviceName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSend} className="space-y-3">
          <Textarea
            placeholder="e.g. This phone belongs to... Please call +1 555-0123"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-muted/30 border-border/30 min-h-[100px] text-sm"
            maxLength={500}
          />
          <p className="text-[10px] text-muted-foreground">{message.length}/500 characters</p>
          <Button type="submit" className="w-full" disabled={sending || !message.trim()}>
            {sending ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
