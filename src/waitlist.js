import { supabase } from './supabaseClient.js'

// The anon role has no direct write access to public.waitlist (see the
// join-waitlist Edge Function + migration) — this is real server-side
// validation, rate limiting, and the actual insert, not just a client-side
// check that a raw API call could bypass. The client-side checks in
// WaitlistModal.jsx exist purely for instant UX feedback; this call is the
// one that's actually enforced.
export async function submitToWaitlist(firstName, email, phone) {
  const { data, error: invokeError } = await supabase.functions.invoke('join-waitlist', {
    body: { first_name: firstName, email, phone: phone || null },
  })

  if (invokeError) {
    throw new Error('Something went wrong. Please try again.')
  }
  if (!data?.ok) {
    throw new Error(data?.error || 'Something went wrong. Please try again.')
  }

  // Fire-and-forget: the waitlist signup itself is already committed at this point,
  // so a failure here (Resend down, function cold-start timeout, etc.) must never
  // turn into a failed signup for the visitor. The edge function itself also never
  // throws — this try/catch is a second layer in case the *invoke* call itself
  // rejects (e.g. a network error reaching Supabase).
  try {
    const { error: fnError } = await supabase.functions.invoke('send-welcome-email', {
      body: { first_name: firstName, email },
    })
    if (fnError) console.error('send-welcome-email invoke failed:', fnError)
  } catch (fnError) {
    console.error('send-welcome-email invoke failed:', fnError)
  }

  return { ok: true }
}
