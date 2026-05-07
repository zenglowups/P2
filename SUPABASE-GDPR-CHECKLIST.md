# Supabase GDPR Checklist

Acest proiect foloseste Supabase doar pentru a salva cererile de cazare si pentru a construi linkul de WhatsApp in siguranta prin Edge Function.

Ce este deja facut in cod:
- formularul cere acord explicit pentru prelucrarea datelor;
- politica de confidentialitate poate fi deschisa din site;
- Edge Function-ul salveaza dovada acordului;
- tabela `booking_requests` este pregatita pentru retentie maxima de 90 zile;
- migrarea blocheaza accesul public direct la cereri prin RLS.

## 1. Alege o regiune UE daca poti

Daca proiectul Supabase nu este inca folosit in productie, prefera o regiune din UE pentru stocarea cererilor de cazare.

## 2. Ruleaza migrarea SQL

In Supabase Dashboard:
1. Deschide `SQL Editor`.
2. Ruleaza continutul din [supabase/migrations/20260507_gdpr_booking_requests.sql](./supabase/migrations/20260507_gdpr_booking_requests.sql).

Ce face migrarea:
- creeaza sau actualizeaza tabela `public.booking_requests`;
- adauga campuri pentru dovada consimtamantului;
- activeaza `Row Level Security`;
- elimina politici vechi de acces pentru aceasta tabela;
- blocheaza `anon` si `authenticated` sa citeasca sau sa scrie direct in tabela;
- lasa doar `service_role` pentru operatiuni administrative;
- creeaza functia privata `private.delete_expired_booking_requests()`.

## 3. Verifica Edge Function secrets

In Supabase Dashboard:
1. Mergi la `Edge Functions`.
2. Deschide `Secrets`.
3. Verifica sau adauga:

```text
WHATSAPP_NUMBER=407xxxxxxxx
```

Nu pune niciodata `service_role` in frontend. Edge Functions au deja acces la:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## 4. Deploy pentru Edge Function

Deployeaza functia:

```text
create-whatsapp-booking
```

Functia verifica acum:
- datele obligatorii;
- acordul de prelucrare;
- versiunea politicii;
- data acceptului.

## 5. Pune stergerea automata a cererilor vechi

In Supabase Dashboard poti folosi `Cron` sau SQL Editor.
Daca nu este activ, enable pentru `pg_cron` se face din Dashboard in zona de extensii/integrari.

SQL recomandat:

```sql
select cron.schedule(
  'booking-requests-cleanup-daily',
  '15 3 * * *',
  $$select private.delete_expired_booking_requests();$$
);
```

Asta sterge zilnic cererile care au depasit termenul de retentie.

## 6. Ce trebuie sa verifici dupa rulare

In `Table Editor`, pentru `booking_requests`, verifica:
- `RLS` este `Enabled`;
- exista coloanele `consent_accepted`, `consent_accepted_at`, `consent_policy_version`, `delete_after`;
- un vizitator anonim nu are acces direct la date prin tabela publica;
- cererile noi apar numai dupa submit prin Edge Function.

## 7. Testul minim inainte de publicare

1. Intra pe site intr-un browser curat.
2. Verifica bannerul de cookies.
3. Deschide politica de confidentialitate.
4. Completeaza formularul.
5. Bifeaza acordul.
6. Trimite cererea.
7. Verifica in Supabase ca exista un rand nou cu:
   - `guest_name`
   - `guest_phone`
   - `check_in`
   - `check_out`
   - `consent_accepted = true`
   - `consent_policy_version`
   - `delete_after`

## 8. Ce mai ramane in afara codului

Acestea nu se rezolva doar din sursa:
- pune in politica de confidentialitate emailul sau telefonul prin care utilizatorul poate cere stergerea datelor;
- verifica documentele contractuale/DPA din Vercel si Supabase;
- nu pastra cererile mai mult decat ai anuntat in politica;
- exporta sau sterge manual cererile vechi daca ai deja date istorice.

## 9. Cum arata fluxul corect

```text
Browser -> Edge Function -> booking_requests
```

Nu:

```text
Browser -> insert direct in booking_requests
```

Frontendul trebuie sa invoce functia, nu sa scrie direct in tabela cu cheia publica.
