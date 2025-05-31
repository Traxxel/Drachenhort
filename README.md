# 🐉 Drachenhort Kartensammlung

Eine moderne Web-Anwendung zur Anzeige und Durchsuche der Spielkarten aus dem Brettspiel "Drachenhort".

## 🎯 Funktionen

- **🔍 Kartensuche**: Schnelle Suche nach Kartennamen
- **🏷️ Filterung**: Filterung nach Kartentypen (Raumkarten, Leichenkarten, Gruftkarten, etc.)
- **📱 Responsive Design**: Optimierte Darstellung auf allen Geräten
- **💫 Moderne Benutzeroberfläche**: Klare und übersichtliche Darstellung der Karten

## 🛠️ Technologien

- **Next.js**: React Framework für serverseitiges Rendering
- **TypeScript**: Typsichere Entwicklung
- **Tailwind CSS**: Modernes, utility-first CSS Framework
- **React Hooks**: Für State Management und Seiteneffekte

## 🚀 Lokale Entwicklung

1. Repository klonen:

```bash
git clone https://github.com/Traxxel/Drachenhort.git
cd Drachenhort
```

2. Abhängigkeiten installieren:

```bash
npm install
```

3. Entwicklungsserver starten:

```bash
npm run dev
```

4. Browser öffnen und zur Adresse [http://localhost:3000](http://localhost:3000) navigieren

## 📦 Projektstruktur

```
Drachenhort/
├── app/                    # Next.js App-Verzeichnis
│   ├── components/        # React-Komponenten
│   ├── page.tsx          # Hauptseite
│   └── layout.tsx        # Layout-Komponente
├── public/               # Statische Dateien
│   └── allCards.json    # Kartendaten
└── package.json         # Projekt-Konfiguration
```

## 🎮 Spielkarten

Die App zeigt folgende Kartentypen an:

- Raumkarten
- Leichenkarten
- Gruftkarten
- Türkarten
- Fallenkarten
- Suchkarten

Jede Karte enthält:

- Name
- Beschreibung
- Kartentyp

## 🤝 Beitragen

Verbesserungsvorschläge und Pull Requests sind willkommen!

## 📄 Lizenz

Dieses Projekt ist für private, nicht-kommerzielle Nutzung bestimmt. Alle Rechte am Spiel "Drachenhort" liegen bei den ursprünglichen Rechteinhabern.
