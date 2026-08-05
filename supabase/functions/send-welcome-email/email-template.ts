// Kept separate from index.ts so the HTML (which is long and email-client-fussy —
// table-based layout, inlined styles, no external stylesheet) doesn't crowd out the
// actual function logic.

// Hosted in Supabase Storage (public bucket "public assests") rather than
// loopare.com/assets/... — the site isn't deployed there yet, so that URL 404s and
// email clients just show a broken-image icon. Once loopare.com is live, this can
// switch back to `${SITE_URL}/assets/logo-full.png` if preferred.
const LOGO_URL =
  'https://rqmlzpednflxkykcugnk.supabase.co/storage/v1/object/public/public%20assests/logo-full.png'
const MASCOT_URL =
  'https://rqmlzpednflxkykcugnk.supabase.co/storage/v1/object/public/public%20assests/mascot-wave.png'
const SITE_URL = 'https://loopare.com'
const ACCENT = '#1D4ED8'

// firstName reaches here from a user-submitted form field. By the time it gets
// here it's already passed join-waitlist's Zod validation (letters/marks/
// spaces/apostrophe/hyphen/period only), which alone rules out HTML/script
// metacharacters — this escape is a second, independent layer so this
// function is safe even if called with unvalidated input from somewhere else
// in the future.
function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))
}

export function buildWelcomeEmailHtml(firstName?: string) {
  const greeting = firstName ? `Hi ${escapeHtml(firstName)},` : 'Hi there,'

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Welcome to Loopare</title>
  </head>
  <body style="margin:0; padding:0; background-color:#F4F5F9; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
      You're officially on the Loopare waitlist — welcome to Loopare World.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4F5F9; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background-color:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 8px 32px rgba(29,78,216,0.08);">
            <!-- Header -->
            <tr>
              <td align="center" style="padding:40px 32px 24px;">
                <img src="${LOGO_URL}" alt="Loopare" width="150" style="display:block; height:auto; max-width:150px;" />
              </td>
            </tr>

            <!-- Headline -->
            <tr>
              <td align="center" style="padding:0 32px;">
                <h1 style="margin:0; font-size:26px; line-height:1.25; font-weight:800; color:#0B1220;">
                  Welcome to Loopare
                </h1>
              </td>
            </tr>

            <!-- Mascot -->
            <tr>
              <td align="center" style="padding:24px 32px 4px;">
                <img src="${MASCOT_URL}" alt="Loopare mascot waving hello" width="220"
                  style="display:block; width:100%; height:auto; max-width:220px; border-radius:16px;" />
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:20px 40px 8px; font-size:15px; line-height:1.65; color:#4B5568;">
                <p style="margin:0 0 16px;">${greeting}</p>
                <p style="margin:0 0 16px;">
                  Thank you for joining the Loopare waitlist. You're officially part of
                  <strong style="color:#0B1220;">Loopare World</strong>, India's All in One marketplace for
                  buy/sell, rent, exchange, and service barter.
                </p>
                <p style="margin:0 0 16px;">
                  You'll be among the first to receive early updates, launch announcements, and
                  exclusive access before everyone else.
                </p>
                <p style="margin:0;">— Team Loopare</p>
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td align="center" style="padding:28px 32px 36px;">
                <a href="${SITE_URL}"
                  style="display:inline-block; background-color:${ACCENT}; color:#ffffff; text-decoration:none;
                  font-size:16px; font-weight:700; padding:16px 40px; border-radius:999px;
                  box-shadow:0 10px 24px rgba(29,78,216,0.35);">
                  Visit Loopare
                </a>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding:0 32px;">
                <div style="border-top:1px solid #EDEFF5;"></div>
              </td>
            </tr>

            <!-- Tagline / footer -->
            <tr>
              <td align="center" style="padding:24px 32px 36px;">
                <p style="margin:0; font-size:12px; font-weight:700; letter-spacing:0.22em; text-transform:uppercase; color:${ACCENT};">
                  Keep It Moving.
                </p>
              </td>
            </tr>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
            <tr>
              <td align="center" style="padding:20px 12px; font-size:12px; line-height:1.6; color:#9AA3B8;">
                &copy; ${new Date().getFullYear()} Loopare. You're receiving this because you joined the
                Loopare waitlist at loopare.com.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}
