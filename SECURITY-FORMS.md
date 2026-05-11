# Securitate formulare publice

## Flux activ

Formularul public de cazare trimite datele exclusiv catre `/api/booking-request`.
Frontend-ul nu mai incarca `@supabase/supabase-js`, nu mai contine cheia anon Supabase si nu mai invoca direct Supabase Edge Functions.

Endpoint-ul server-side:

- valideaza payload-ul si limitele de lungime;
- verifica honeypot-ul `website`;
- verifica timpul minim pana la submit;
- blocheaza user-agent-uri lipsa sau evident automate;
- blocheaza domenii de email temporar configurabile prin `BLOCKED_EMAIL_DOMAINS`;
- aplica rate limit pe IP si email hash folosind `public.security_events`;
- verifica Cloudflare Turnstile server-side daca `TURNSTILE_SECRET_KEY` este configurat;
- scrie in `public.booking_requests` cu `status = 'pending'`;
- logheaza evenimente in `public.security_events` fara IP/email/telefon in clar.

## Variabile obligatorii in productie

```env
SUPABASE_URL=https://PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
WHATSAPP_NUMBER=40742721408
SECURITY_EVENT_HASH_SECRET=...
```

`SUPABASE_SERVICE_ROLE_KEY` trebuie setata doar server-side, in Vercel/Supabase Secrets. Nu se pune in HTML, JS public sau fisiere comise.

## CAPTCHA optional, recomandat

```env
TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...
BOOKING_CAPTCHA_MODE=always
```

Daca secretul Turnstile exista, modul implicit al codului este `always`. Pentru risc redus se poate folosi `adaptive`, dar pentru formular spam-at ramane recomandat `always`.

## Configurare Supabase

Ruleaza migrarea `supabase/migrations/20260511_public_form_security.sql`.
Aceasta:

- creeaza `public.security_events`;
- adauga campuri de moderare si hash-uri pe `public.booking_requests`;
- activeaza RLS pentru tabelele din schema `public`;
- elimina policies pe `booking_requests` si `security_events`;
- revoca accesul `anon` si `authenticated`;
- acorda acces doar pentru `service_role`.

## TODO operational

- Roteste orice cheie Supabase care a fost publicata accidental in client.
- Configureaza Turnstile in Cloudflare si seteaza `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY`.
- Activeaza WAF/rate limiting in Cloudflare pentru `/api/booking-request` si vechea functie Supabase.
- Deploy-uieste Edge Function `create-whatsapp-booking` actualizata, care nu mai scrie rezervari si logheaza incercarile vechi drept `direct_insert_attempt`.
- Verifica in Supabase Dashboard ca nu exista policies de tip `anon insert` sau `with check (true)` pe tabele publice.
