# Ghid rapid

Site-ul are acum doua moduri de stocare pentru panoul de proprietar:

- local: salveaza in `data/owner-state.json`
- Vercel: salveaza persistent in Vercel Blob, ca sa ramana datele dupa deploy

Credentialele de owner pot fi schimbate direct din site, din panoul de proprietar.

## 1. Rulare locala simpla

### Instalare

```bash
npm install
```

### Pornire

Varianta cea mai simpla:

```bash
start-server.bat
```

sau:

```bash
npm start
```

### Linkuri locale

- site public: `http://127.0.0.1:8787/`
- pagina owner: `http://127.0.0.1:8787/owner`

### Credentiale initiale locale

Prima initializare foloseste valorile din `.env` sau `.env.example`:

- `OWNER_USERNAME`
- `OWNER_PASSWORD`

Dupa ce intri in panoul de owner, poti schimba userul si parola direct din site. Acestea se vor salva in `data/owner-state.json`.

## 2. Deploy pe Vercel

Pentru persistenta reala pe Vercel ai nevoie de:

1. proiectul importat in Vercel
2. un Blob store privat atasat proiectului
3. variabila `OWNER_SESSION_SECRET`

### Pasii practici

#### Pasul 1

Urca proiectul in GitHub, apoi importa repository-ul in Vercel.

#### Pasul 2

In Vercel:

1. intra in proiect
2. mergi la `Storage`
3. alege `Create Database`
4. alege `Blob`
5. seteaza store-ul ca `Private`
6. ataseaza tokenul la `Production`, `Preview` si `Development`

Vercel va adauga automat `BLOB_READ_WRITE_TOKEN`.

#### Pasul 3

In `Project Settings -> Environment Variables`, adauga:

- `OWNER_SESSION_SECRET`
- `OWNER_USERNAME`
- `OWNER_PASSWORD`

Exemplu:

```text
OWNER_SESSION_SECRET=o-valoare-lunga-si-greu-de-ghicit-123456
OWNER_USERNAME=afroditi
OWNER_PASSWORD=schimba-ma-imediat
```

### Ce fac aceste variabile

- `OWNER_SESSION_SECRET` securizeaza login-ul
- `OWNER_USERNAME` si `OWNER_PASSWORD` sunt folosite la prima initializare a storage-ului

Important:

- dupa prima initializare, datele reale de login sunt salvate in Blob
- dupa aceea, le poti schimba direct din panoul de owner
- modificarile nu se pierd la redeploy

#### Pasul 4

Redeploy la proiect.

#### Pasul 5

Deschide:

- site public: `https://domeniul-tau.vercel.app/`
- pagina owner: `https://domeniul-tau.vercel.app/owner`

## 3. Cum schimbi userul si parola

1. intri in `/owner`
2. te loghezi
3. jos, in cardul `Credentiale owner`, completezi:
   - parola curenta
   - user nou
   - parola noua
   - confirmarea parolei
4. apesi `Salveaza noile date`

Datele noi se salveaza:

- local in fisier
- pe Vercel in Blob

## 4. Cum verifici daca merge

### Health check

```text
/api/health
```

Exemplu:

```text
http://127.0.0.1:8787/api/health
```

Ar trebui sa primesti:

```json
{"ok":true}
```

## 5. Daca ai deschis site-ul pe 5501

Linkul de forma:

```text
http://127.0.0.1:5501/index.html?owner=1
```

nu este suficient pentru owner login, pentru ca acolo ruleaza doar partea statica.

Pentru login corect foloseste:

```text
http://127.0.0.1:8787/owner
```

sau ruleaza:

```bash
npm run dev:vercel
```

## 6. Reset de acces daca ai uitat parola

Varianta practica pe Vercel:

1. schimba in Vercel valorile pentru:
   - `OWNER_USERNAME`
   - `OWNER_PASSWORD`
2. sterge blobul `owner/owner-state.json`
3. redeschide site-ul sau redeployeaza

La urmatoarea initializare, proiectul recreeaza state-ul din variabilele noi.

Comanda utila cu Vercel CLI:

```bash
vercel blob del owner/owner-state.json
```

## 7. Rezumat foarte scurt

- local rapid: `start-server.bat`
- owner local: `http://127.0.0.1:8787/owner`
- pe Vercel: creezi Blob privat + adaugi `OWNER_SESSION_SECRET`
- userul si parola se pot schimba direct din site
- datele raman persistente dupa deploy, daca Blob-ul este configurat
