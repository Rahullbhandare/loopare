import { supabase } from './supabaseClient.js'

// Postgres unique-violation error code — relies on the `email` column in the
// `waitlist` table having a UNIQUE constraint. Without one, duplicate emails will
// simply insert as separate rows instead of being caught here.
const UNIQUE_VIOLATION = '23505'

export async function submitToWaitlist(firstName, email, phone) {
  const { error } = await supabase
    .from('waitlist')
    .insert([{ first_name: firstName, email, phone: phone || null }])

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      throw new Error("You're already on the waitlist — we'll be in touch soon!")
    }
    throw new Error('Something went wrong. Please try again.')
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
