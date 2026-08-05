// Supabase Edge Function: send-welcome-email
//
// Sends the Loopare welcome email via Resend right after a waitlist signup.
// The Resend API key lives only here, as the RESEND_API_KEY secret (see README.md in
// this folder for how it's set) — it is never sent to, or readable from, the browser.
//
// By design this never fails the caller: whatever goes wrong (missing key, Resend
// down, malformed payload), it logs the real error via console.error (visible in
// `supabase functions logs send-welcome-email` / the Dashboard's Edge Function logs)
// and still responds 200 with `{ ok: false, ... }` — sending a welcome email is a
// nice-to-have, not a reason to make someone's waitlist signup look like it failed.

import { Resend } from 'npm:resend@4.0.1'
import { buildWelcomeEmailHtml } from './email-template.ts'

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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS })
  }

  if (req.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed' }, 405)
  }

  let body: { first_name?: string; email?: string }
  try {
    body = await req.json()
  } catch {
    return json({ ok: false, error: 'Invalid JSON body' }, 400)
  }

  const email = body.email?.trim()
  const firstName = body.first_name?.trim()

  if (!email) {
    // A missing email is a caller bug, not a transient failure — worth a real 400
    // so it's caught during development rather than silently swallowed.
    return json({ ok: false, error: 'email is required' }, 400)
  }

  const apiKey = Deno.env.get('RESEND_API_KEY')
  if (!apiKey) {
    console.error('send-welcome-email: RESEND_API_KEY secret is not set')
    return json({ ok: false, error: 'Email service not configured' })
  }

  try {
    const resend = new Resend(apiKey)
    const html = buildWelcomeEmailHtml(firstName)

    const { data, error } = await resend.emails.send({
      from: 'Loopare <hello@loopare.com>',
      reply_to: 'support@loopare.com',
      to: email,
      subject: 'Welcome to Loopare',
      html,
    })

    if (error) {
      console.error('send-welcome-email: Resend returned an error', error)
      return json({ ok: false, error: error.message })
    }

    return json({ ok: true, id: data?.id })
  } catch (err) {
    console.error('send-welcome-email: unexpected failure', err)
    return json({ ok: false, error: err instanceof Error ? err.message : String(err) })
  }
})
