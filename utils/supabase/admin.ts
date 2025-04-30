import { createClient } from '@supabase/supabase-js'

const supabase  = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export const serverClient = supabase
// Access auth admin api
export const adminAuthClient = supabase.auth.admin




const supabaseServiceRole = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const serviceRoleClient = supabaseServiceRole