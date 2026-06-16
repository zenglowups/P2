begin;

-- Rezervarile nu mai genereaza un link WhatsApp: confirmarea se trimite automat prin email.
-- Coloana ramane pentru compatibilitate cu inregistrarile vechi, dar devine optionala.
alter table public.booking_requests
  alter column whatsapp_url drop not null;

commit;
