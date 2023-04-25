import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://tzaxbyqjfbmhmvqathwh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6YXhieXFqZmJtaG12cWF0aHdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MjM5Mjg2OSwiZXhwIjoxOTk3OTY4ODY5fQ.Cdq3po5BzDfZsf_zAsHj_Hrp3gRxRsqVFmYIlgYoOJA'
);
