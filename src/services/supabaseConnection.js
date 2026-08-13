import { supabase } from '@/lib/supabase'

export async function verifySupabaseConnection() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  const response = await fetch(`${url}/rest/v1/`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Supabase connection failed with status ${response.status}`)
  }

  // Ensure the client instance is usable after a successful network check.
  if (!supabase) {
    throw new Error('Supabase client is not initialized')
  }

  return { connected: true }
}
