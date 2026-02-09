-- Add lost_message column for Send Message feature
ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS lost_message text DEFAULT NULL;

-- Add is_wiped column for Remote Wipe feature
ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS is_wiped boolean NOT NULL DEFAULT false;