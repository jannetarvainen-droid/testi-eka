# Työmaaseuranta (MVP)

Selainpohjainen MVP-sovellus sähköurakan projektipäällikölle. Sovellus tarjoaa yhden dashboard-näkymän työmaan perustietoihin, tehtäviin, hankintoihin, lisä- ja muutostöihin sekä riskeihin.

## Teknologiat

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Tallennus:** JSON-tiedosto (`server/data/store.json`)

## Projektirakenne

```
.
├── client/                 # React + Vite frontend
│   └── src/
│       ├── components/     # UI-komponentit
│       ├── services/       # API-kutsut
│       └── styles/         # Tyylit
├── server/                 # Express API
│   ├── data/store.json     # Pysyvä tiedostopohjainen data
│   ├── routes/             # API-reitit
│   └── utils/              # Tallennusapu
└── package.json            # Yhteiset skriptit
```

## Ominaisuudet

- Työmaan perustietojen ylläpito
- CRUD (lisää/muokkaa/poista) kaikille taulukoille
- Dashboardin yhteenvetokortit:
  - avoimet tehtävät
  - myöhässä olevat tehtävät
  - avoimet hankinnat
  - hyväksyntää odottavat lisätyöt
  - avoimet riskit
  - työmaan yleisstatus
- Liikennevalo-logiikka (vihreä/keltainen/punainen)
- Tehtävien haku ja yksinkertainen suodatus hakusanalla
- Esimerkkidata mukana valmiina

## Käynnistys (lokaali)

### 1) Asenna riippuvuudet

Projektin juuressa:

```bash
npm install
npm run install:all
```

### 2) Käynnistä frontend + backend kehitystilassa

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000/api

## Ensikertalaisen eteneminen (vaihe vaiheelta)

Jos käytät Codexia tai tätä projektia ensimmäistä kertaa, etene näin:

1. **Avaa terminaali projektikansioon**
   ```bash
   cd /workspace/testi-eka
   ```
2. **Tarkista, että Node.js on asennettu**
   ```bash
   node -v
   npm -v
   ```
3. **Asenna riippuvuudet**
   ```bash
   npm install
   npm run install:all
   ```
4. **Käynnistä sovellus kehitystilaan**
   ```bash
   npm run dev
   ```
5. **Avaa selain**
   - Frontend: `http://localhost:5173`
   - API: `http://localhost:4000/api`
6. **Tee nopea toimivuustesti**
   - aja toisessa terminaalissa:
     ```bash
     curl http://localhost:4000/api/data
     ```
   - lisää yksi tehtävä, muokkaa sitä ja poista se
   - päivitä sivu ja varmista, että data säilyy oikein
7. **Lopeta ajossa oleva kehityspalvelin**
   - paina terminaalissa `Ctrl + C`

Jos asennus epäonnistuu, tarkista ensin yritysverkon/proxyn npm-rajoitukset.

## Sovelluksen testaus (nopea check-list)

Kun `npm run dev` on käynnissä, testaa näin:

### 1) API toimii

Avaa toinen terminaali projektin juuressa ja aja:

```bash
curl http://localhost:4000/api/data
```

Jos saat JSON-vastauksen, backend toimii.

### 2) Frontend latautuu

Avaa selaimessa `http://localhost:5173`.

Tarkista, että näet:
- vasemman navigaation
- työmaan perustiedot
- yhteenvetokortit
- taulukot (tehtävät, hankinnat, lisä-/muutostyöt, riskit)

### 3) CRUD-toiminnot

Testaa jokaisessa taulukossa:
- Lisää uusi rivi
- Muokkaa riviä
- Poista rivi

Päivitä sivu selaimessa (refresh) ja varmista, että muutokset säilyivät.

### 4) Tehtävien haku

Kirjoita hakukenttään sana (esim. vastuuhenkilön nimi) ja varmista, että listaus suodattuu.

### 5) Liikennevalo-status

Muuta tehtäviä/hankintoja niin, että tila vaihtuu:
- **Punainen:** myöhässä oleva korkean prioriteetin tehtävä tai kriittinen hankinta puuttuu
- **Keltainen:** avoimia tai lähestyviä riskejä
- **Vihreä:** ei kriittisiä myöhästymisiä

## Automaattinen perussavutus

Voit ajaa nämä komennot nopeasti:

```bash
# 1) Varmista backend-tiedostojen syntaksi
node --check server/index.js
node --check server/routes/storeRoutes.js
node --check server/utils/store.js

# 2) Käynnistä dev-ympäristö
npm run dev

# 3) Testaa API
curl http://localhost:4000/api/data
```

### 3) Tuotantotyyppinen frontend-build

```bash
npm run build
```

### 4) Käynnistä pelkkä backend

```bash
npm run start
```

## API (tiivistetty)

- `GET /api/data` – hae koko tilanne
- `PUT /api/site-info` – päivitä työmaan perustiedot
- `POST /api/:collection` – lisää rivi (`tasks`, `procurements`, `changeWorks`, `risks`)
- `PUT /api/:collection/:id` – päivitä rivi
- `DELETE /api/:collection/:id` – poista rivi

## Huomioita

- Data tallennetaan tiedostoon `server/data/store.json`, joten muutokset säilyvät käynnistysten yli.
- Sovellus on rakennettu helposti laajennettavaksi: taulukoiden sarakkeet määritellään frontendissä keskitetysti, ja backendissä CRUD on geneerinen.
