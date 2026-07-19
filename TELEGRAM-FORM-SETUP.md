# Secure Telegram contact-form setup

The bot token and chat ID must never be added to `script.js`, `supabase-config.js`, HTML, or any other public website file. The browser now calls the `contact-telegram` Supabase Edge Function, and that server-side function reads the credentials from Supabase secrets.

## 1. Add the three production secrets

Open the Edge Function Secrets page for the website's Supabase project:

`https://supabase.com/dashboard/project/hfgtwwdfpwrrzyqlxwaa/functions/secrets`

Add these keys:

| Key | Value |
| --- | --- |
| `TELEGRAM_BOT_TOKEN` | The complete token received from BotFather |
| `TELEGRAM_CHAT_ID` | The destination user, group, or channel chat ID |
| `SITE_ORIGINS` | Comma-separated website origins, for example `https://example.com,https://www.example.com` |

Do not include a path or trailing slash in `SITE_ORIGINS`. Local development on `http://127.0.0.1:5500` and `http://localhost:5500` is already allowed by the function.

## 2. Deploy the function

Sign the Supabase CLI into the account that owns project `hfgtwwdfpwrrzyqlxwaa`, then run from the repository root:

```powershell
supabase login
supabase link --project-ref hfgtwwdfpwrrzyqlxwaa
supabase functions deploy contact-telegram --project-ref hfgtwwdfpwrrzyqlxwaa --no-verify-jwt --use-api
```

The function intentionally uses `verify_jwt = false` because ordinary website visitors are not logged in. It performs its own checks: allowed origin, matching public Supabase key, strict field validation, honeypot filtering, payload limits, and a best-effort per-IP rate limit.

## 3. Test

Open `pages/contact.html` through Live Server, submit a real test message, and confirm it arrives in the configured Telegram chat. A success notification is now shown only after Telegram confirms delivery.

If it fails, open Supabase Dashboard > Edge Functions > `contact-telegram` > Logs. The bot must already be a member of the target group/channel and must have permission to post there.

## Optional stronger spam protection

The included controls stop basic spam but a public form can still be automated. Before high-traffic production use, add Cloudflare Turnstile to the form and verify its token inside this Edge Function.

