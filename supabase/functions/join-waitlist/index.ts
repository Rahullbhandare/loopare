// Supabase Edge Function: join-waitlist
//
// This is the ONLY path allowed to write to public.waitlist — the anon role's
// direct INSERT grant on that table has been revoked (see the migration this
// commit ships alongside). Anything that reaches this table now had to pass
// through here first: Zod validation, a Postgres-backed rate limit, and only
// then a write using the service_role key, which never leaves this server-side
// runtime.
//
// Like send-welcome-email, this always responds HTTP 200 with a `{ok, ...}`
// body (never a non-2xx status) — supabase-js's functions.invoke() has more
// friction extracting a response body off a non-2xx result than off a 200, and
// the frontend already expects to branch on `data.ok`/`data.code`, not on
// HTTP status.

import { createClient } from 'npm:@supabase/supabase-js@2'
import { z } from 'npm:zod@3'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}

// Mirrors the client-side rules in src/WaitlistModal.jsx — legitimate users see
// no behavior change — but this copy is the one that's actually enforced.
// Trim/normalize happens here too, since nothing upstream of this can be
// trusted to have done it.
const WaitlistSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, 'Please enter your name.')
    .max(100, 'Name is too long.')
    // Letters (incl. accented/non-Latin via \p{L}), marks, spaces, and the
    // handful of punctuation marks real names actually use. Blocks HTML/script
    // metacharacters (<, >, &, etc.) outright rather than escaping them here —
    // escaping still happens at render time (email-template.ts) as a second
    // layer, but there's no reason a name needs those characters at all.
    .regex(/^[\p{L}\p{M}\s'.-]+$/u, 'Name contains invalid characters.'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, 'Email is too long.')
    .email('Please enter a valid email address.'),
  phone: z
    .union([
      z.literal(''),
      z.null(),
      z.undefined(),
      z
        .string()
        .trim()
        .regex(/^[0-9()+\-\s]{7,20}$/, 'Please enter a valid phone number.'),
    ])
    .optional(),
})

function clientIp(req: Request): string {
  // Vercel/Supabase's edge both set x-forwarded-for; take the first (original
  // client) hop. Falls back to a constant bucket if it's ever missing (local
  // testing) rather than throwing — better to rate-limit "unknown" as one
  // shared bucket than to fail the whole request over a missing header.
  const fwd = req.headers.get('x-forwarded-for')
  return fwd ? fwd.split(',')[0].trim() : 'unknown'
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS })
  }
  if (req.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed', code: 'method_not_allowed' }, 200)
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return json({ ok: false, error: 'Invalid request.', code: 'bad_request' })
  }

  const parsed = WaitlistSchema.safeParse(raw)
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message || 'Please check your details and try again.'
    return json({ ok: false, error: firstIssue, code: 'validation_error' })
  }
  const { first_name, email, phone } = parsed.data

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('join-waitlist: SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY not available')
    return json({ ok: false, error: 'Something went wrong. Please try again.', code: 'server_error' })
  }
  const supabase = createClient(supabaseUrl, serviceRoleKey)

  const ip = clientIp(req)
  const { data: allowed, error: rateLimitError } = await supabase.rpc('check_waitlist_rate_limit', {
    p_ip: ip,
    p_max_requests: 5,
    p_window_minutes: 15,
  })
  if (rateLimitError) {
    console.error('join-waitlist: rate limit check failed', rateLimitError)
    // Fail open on our own infra error, not closed — a broken rate-limit check
    // shouldn't be able to take down real signups.
  } else if (allowed === false) {
    return json(
      { ok: false, error: 'Too many attempts — please try again in a little while.', code: 'rate_limited' },
    )
  }

  const { error: insertError } = await supabase
    .from('waitlist')
    .insert([{ first_name, email, phone: phone || null }])

  if (insertError) {
    if (insertError.code === '23505') {
      return json({
        ok: false,
        error: "You're already on the waitlist — we'll be in touch soon!",
        code: 'duplicate',
      })
    }
    console.error('join-waitlist: insert failed', insertError)
    return json({ ok: false, error: 'Something went wrong. Please try again.', code: 'server_error' })
  }

  return json({ ok: true, first_name, email })
})
