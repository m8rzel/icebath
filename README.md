# Icebath Tracker

Eine moderne Next.js App zum Tracken von Eisbädern mit MongoDB-Persistenz, Gamification und umfangreichen Statistiken.

## Features

- ❄️ Eisbäder tracken (Datum, Temperatur, Dauer, Notizen)
- 📊 Interaktive Charts für Temperatur- und Dauer-Verlauf
- 🏆 134+ Achievements für langfristige Motivation
- 🎯 Wöchentliche und monatliche Challenges
- ⭐ XP/Level System
- 📈 Detaillierte Statistiken
- 💾 MongoDB-Persistenz
- 📤 Export-Funktionen (CSV, JSON)
- 🔗 Social Sharing

## Setup

### 1. Dependencies installieren

```bash
npm install
```

### 2. MongoDB einrichten

#### Option A: MongoDB Atlas (Cloud)

1. Erstelle einen kostenlosen Account auf [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Erstelle einen neuen Cluster
3. Erstelle einen Database User
4. Whiteliste deine IP-Adresse (oder `0.0.0.0/0` für alle IPs)
5. Kopiere den Connection String

#### Option B: Lokale MongoDB

Installiere MongoDB lokal und starte den Service.

### 3. Environment Variables

Erstelle eine `.env.local` Datei im Root-Verzeichnis:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/icebath?retryWrites=true&w=majority
```

Oder für lokale MongoDB:

```env
MONGODB_URI=mongodb://localhost:27017/icebath
```

### 4. Development Server starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: shadcn/ui, Tailwind CSS
- **Database**: MongoDB mit Mongoose
- **Charts**: Recharts
- **Icons**: Lucide React

## Projektstruktur

```
icebath/
├── app/
│   ├── api/icebaths/     # API Routes für CRUD-Operationen
│   ├── page.tsx          # Hauptseite
│   └── layout.tsx        # Root Layout
├── components/           # React Komponenten
│   ├── ui/              # shadcn/ui Komponenten
│   ├── achievements-panel.tsx
│   ├── challenges-panel.tsx
│   ├── temperature-chart.tsx
│   └── ...
├── hooks/               # Custom Hooks
├── lib/                 # Utilities
│   ├── mongodb.ts       # MongoDB Connection
│   ├── achievements.ts  # Achievement-Logik
│   └── stats.ts         # Statistik-Berechnungen
├── models/              # Mongoose Models
│   └── Icebath.ts
└── types/               # TypeScript Types
```

## API Endpoints

- `GET /api/icebaths` - Alle Eisbäder abrufen
- `POST /api/icebaths` - Neues Eisbad erstellen
- `DELETE /api/icebaths?id=<id>` - Eisbad löschen

## Deployment

### Vercel

1. Push dein Code zu GitHub
2. Importiere das Projekt in Vercel
3. Füge die `MONGODB_URI` Environment Variable hinzu
4. Deploy!

### Andere Plattformen

Stelle sicher, dass:
- Node.js 18+ installiert ist
- Die `MONGODB_URI` Environment Variable gesetzt ist
- MongoDB von deiner Deployment-Plattform erreichbar ist

## License

MIT
