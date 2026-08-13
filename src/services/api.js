import { supabase } from '@/lib/supabase'

export { supabase }

export function handleSupabaseError(error) {
  throw error
}
