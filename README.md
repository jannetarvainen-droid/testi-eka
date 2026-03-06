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
