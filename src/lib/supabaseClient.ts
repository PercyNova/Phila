import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

console.log('Supabase URL:', SUPABASE_URL)
console.log('Supabase Key:', SUPABASE_ANON_KEY ? '✅ Loaded' : '❌ Missing')

export const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)
