import { createClient } from "@supabase/supabase-js";
export const database = createClient(
    'https://cyuocaqlrxzezycbtvgq.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5dW9jYXFscnh6ZXp5Y2J0dmdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAyNzQ4NzUsImV4cCI6MjA0NTg1MDg3NX0.PSjUm-rCInZf-nBW5HvNL6xITvqNOosdgPujo8PV3bY')  