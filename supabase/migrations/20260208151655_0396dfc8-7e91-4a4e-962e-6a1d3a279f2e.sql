
-- Add photo_url column to devices for captured photos
ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS photo_url text;

-- Create storage bucket for device photos
INSERT INTO storage.buckets (id, name, public) VALUES ('device-photos', 'device-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to device-photos bucket
CREATE POLICY "Users can upload device photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'device-photos' AND auth.uid() IS NOT NULL);

-- Allow public read of device photos
CREATE POLICY "Device photos are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'device-photos');

-- Allow users to delete their own device photos
CREATE POLICY "Users can delete own device photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'device-photos' AND auth.uid() IS NOT NULL);
