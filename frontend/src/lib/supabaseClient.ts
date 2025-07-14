import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ezetxacdchfymubmdbnw.supabase.co'  // remplace par ton URL Supabase
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6ZXR4YWNkY2hmeW11Ym1kYm53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0ODY5MzcsImV4cCI6MjA2ODA2MjkzN30.W0BooeBP0kjyU7_Qg9MBZJx23osvtudo20b8xNkI48U'  // remplace par ta clé publique (anon key)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
