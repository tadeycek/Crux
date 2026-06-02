import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

// Single shared admin client for the whole backend.
// Passes ws explicitly — required on Node.js < 22 by @supabase/realtime-js.
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    realtime: { transport: ws as any },
    auth: { persistSession: false },
  },
)
