# Ghid SEO si Google Search Console

## Ce a fost optimizat in cod

- Domeniul canonic este `https://www.afroditistudiosgrigoriu.com/`.
- Varianta fara `www` redirectioneaza permanent catre `www`.
- URL-urile publice cu `.html` redirectioneaza permanent catre URL-uri curate, fara extensie.
- `sitemap.xml` include toate paginile importante, data actualizarii si imagini reprezentative.
- `robots.txt` permite indexarea site-ului public si blocheaza zonele tehnice: owner, api, data.
- Paginile publice au canonical, robots index/follow, Open Graph, Twitter card si schema JSON-LD pentru breadcrumbs.

### Actualizare 2026-06-16

- Pagina principala are o sectiune `Intrebari frecvente` vizibila plus schema `FAQPage` (poate aparea ca rezultat extins in Google).
- Schema `LodgingBusiness` include acum coordonate `geo`, limbile disponibile si moneda (EUR).
- Paginile `studio-double` si `studio-deluxe` au schema `Apartment` cu capacitatea de cazare.
- Pagina principala face acum legaturi interne catre paginile de cazare, aproape de plaja si studiouri (din sectiunea `Cautari utile`).
- Dupa acest update, reintra in Search Console si apasa din nou `Request indexing` pe pagina principala, ca Google sa preia noua schema si sectiunea FAQ.

## Cautari pe care merita sa le tintesti

- cazare Paralia Katerinis
- cazare Paralia Katerinis Grecia
- cazare aproape de plaja Paralia Katerinis
- camere Paralia Katerinis
- studio Paralia Katerinis
- studio double Paralia Katerinis
- studio deluxe Paralia Katerinis
- cazare Riviera Olimpului
- cazare Grecia aproape de plaja

Nu repeta artificial aceste expresii. Foloseste-le natural in titluri, paragrafe, descrieri de imagini, postari social media si descrieri pe Google Business Profile.

## Tutorial Google Search Console

1. Intra pe `https://search.google.com/search-console`.
2. Alege `Add property`.
3. Selecteaza `Domain`, nu doar `URL prefix`, si introdu `afroditistudiosgrigoriu.com`.
4. Google iti va da un TXT record pentru DNS.
5. Intra in Cloudflare, la domeniul tau, apoi mergi la `DNS > Records`.
6. Adauga un record nou:
   - Type: `TXT`
   - Name: `@`
   - Content: valoarea TXT data de Google
   - TTL: Auto
7. Revino in Search Console si apasa `Verify`. Daca nu merge imediat, asteapta 10-30 minute si incearca din nou.
8. Dupa verificare, intra in `Sitemaps`.
9. La `Add a new sitemap`, trimite:
   - `https://www.afroditistudiosgrigoriu.com/sitemap.xml`
10. Asteapta statusul `Success`.
11. Mergi la `URL inspection`.
12. Verifica aceste URL-uri:
   - `https://www.afroditistudiosgrigoriu.com/`
   - `https://www.afroditistudiosgrigoriu.com/cazare-paralia-katerinis`
   - `https://www.afroditistudiosgrigoriu.com/studio-paralia-katerinis`
   - `https://www.afroditistudiosgrigoriu.com/camere-paralia-katerinis`
   - `https://www.afroditistudiosgrigoriu.com/cazare-aproape-de-plaja-paralia-katerinis`
   - `https://www.afroditistudiosgrigoriu.com/locatie`
   - `https://www.afroditistudiosgrigoriu.com/contact`
13. Pentru fiecare URL important, apasa `Request indexing`.
14. In `Pages`, urmareste erorile de indexare. Cele mai importante de verificat:
   - `Blocked by robots.txt`
   - `Duplicate without user-selected canonical`
   - `Crawled - currently not indexed`
   - `Discovered - currently not indexed`
15. In `Performance > Search results`, urmareste dupa 2-4 saptamani:
   - Queries: ce cautari aduc impresii
   - Pages: ce pagini apar in cautari
   - CTR: daca oamenii vad site-ul dar nu apasa
   - Average position: pozitia medie pe termen lung

## Ce sa faci pentru popularitate fara reclame

- Creeaza sau completeaza Google Business Profile cu acelasi nume, telefon, site si poze reale.
- Cere recenzii reale de la clienti dupa sejur.
- Pune linkul site-ului in Instagram, TikTok, Booking si orice profil public relevant.
- Posteaza periodic continut real: piscina, camere, distanta fata de plaja, Paralia Katerinis, oferte lunare.
- Cere partenerilor sau cunoscutilor care au site-uri relevante sa includa un link natural catre site.
- Nu cumpara linkuri si nu folosi texte spam. Google poate reduce vizibilitatea pentru astfel de practici.

## Important

Indexarea si pozitiile in Google nu sunt instant. Dupa modificari, rezultatele pot aparea in cateva zile, dar uneori dureaza cateva saptamani. Scopul este sa eliminam blocajele tehnice si sa crestem treptat increderea Google in site.
