# Verleiherdatenbank (Frontend)

Eine Datenbank für Kinos: Wer verleiht einen Film, wen fragt man an, und welche Erfahrungen haben andere Kinos damit gemacht? Das Projekt entsteht im Bundesverband kommunale Filmarbeit (BkF) als Vorhaben der AG Unikino.

Dieses Repository enthält das **Frontend**. Das Backend wird getrennt entwickelt.

## Stand

Das Frontend ist ein Prototyp:

- Alle Daten sind **Fake-Daten** (Beispiel-Verleiher, Beispiel-Kinos, `example.org`-Adressen). Sie liegen in `src/api/` und leben nur im Arbeitsspeicher. Nach einem Neuladen sind Änderungen weg.
- Die **Anmeldung ist ein Platzhalter** (`src/stores/auth.ts`). Der Button "Anmelden" schaltet ein Fake-Konto ein, es gibt kein Passwort und keinen Server.
- **Impressum und Datenschutzerklärung** sind nur Gliederungen mit Platzhaltern und keine gültigen Rechtstexte.
- Das Backend ist noch nicht angebunden.

## Was die App kann

- Filme suchen und die Filmseite ansehen: Titel, Links zu Recherche-Datenbanken und die Anfragen-Historie als Tabelle.
- Bei jedem Film steht ein Kasten "Wo anfragen?" mit dem letzten erfolgreichen Verleiher, einem Hinweis zum Verleiher und dem Alter der Information.
- Verleiher durchsuchen, mit Hinweisen, Kontakten und den Filmen, die sie verleihen.
- Anfragen anlegen und bearbeiten (nur angemeldet und nur für Anfragen der eigenen Kinos).
- Kontaktdaten und Kinonamen sind ohne Anmeldung ausgeblendet.
- Deutsch und Englisch, umschaltbar in der Kopfzeile.
- Hell- und Dunkelmodus nach Systemeinstellung.
- Tabellen werden auf Handys im Hochformat zu Karten.

## Technik

- [Vue 3](https://vuejs.org/) mit TypeScript und [Vite](https://vite.dev/)
- [Vue Router](https://router.vuejs.org/), [Pinia](https://pinia.vuejs.org/) und [vue-i18n](https://vue-i18n.intlify.dev/)
- [Vitest](https://vitest.dev/) und ESLint
- Keine UI-Bibliothek. Komponenten und Styles sind selbst geschrieben, das Aussehen steuern CSS-Variablen in `src/assets/global.css`.

## Vorabversion starten (gebauter Stand)

Voraussetzung: [Node.js](https://nodejs.org/) (aktuelle LTS-Version). Es ist kein `npm install` nötig.

Im entpackten Ordner, neben dem Ordner `dist`:

```sh
npx serve -s dist
```

Die App ist danach meist unter `http://localhost:3000` erreichbar. Mit `-l <port>` lässt sich ein anderer Port wählen.

Besonderheiten:

- **`index.html` nicht direkt öffnen.** Die App nutzt History-Routing (`/films/3`) und braucht einen Server, der unbekannte Pfade an `index.html` zurückgibt. Bei `serve` erledigt das `-s`. Ein einfacher Dateiserver ohne diese Regel (zum Beispiel `python -m http.server`) liefert beim Neuladen einer Unterseite einen 404.
- Alle Daten sind erfunden, der Login ist ein Platzhalter, und Änderungen sind nach einem Neuladen weg.

## Entwicklungsumgebung (Quellcode)

Voraussetzungen: [Node.js](https://nodejs.org/) (aktuelle LTS-Version) und Git. Empfohlen ist VS Code mit den Erweiterungen **Vue (Official)** und **ESLint**. Die alte Erweiterung "Vetur" sollte deaktiviert sein.

```sh
git clone https://github.com/ag-unikino/mldb-frontend.git
cd mldb-frontend
npm install
npm run dev
```

Der Entwicklungsserver läuft meist unter `http://localhost:5173` und lädt bei Änderungen neu. Meldet `npm run dev`, `vite` sei unbekannt, fehlt `npm install`.

| Befehl               | Wirkung                                  |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Entwicklungsserver                       |
| `npm run build`      | Typ-Check und Build in den Ordner `dist` |
| `npm run preview`    | den gebauten Stand lokal ansehen         |
| `npm run type-check` | nur der Typ-Check                        |
| `npm run lint`       | ESLint                                   |
| `npm run test:unit`  | Tests mit Vitest                         |

Die genauen Namen stehen in der `package.json`, `npm run` ohne Zusatz listet sie auf. Vor einem Commit sollten `npm run type-check` und `npm run lint` ohne Fehler durchlaufen.

## Testfälle in den Fake-Daten

Mit diesen Beispielen lassen sich die wichtigsten Zustände ansehen:

- **Film 3 (Tokyo monogatari)** hat drei Anfragen in verschiedenen Zuständen (laufend, zugesagt, abgelehnt mit Verweis), Links und Zusatzangaben.
- **Film 5 (Persona)** hat keine Anfragen und keine Zusatzangaben. Er zeigt die leeren Zustände.
- **Verleih A** hat einen befristeten Hinweis (bis Mitte 2027), **Verleih C** einen unbefristeten, **Verleih D** einen abgelaufenen (der nicht mehr angezeigt wird), **Verleih B** keinen.
- **Anmelden** schaltet ein Fake-Konto mit den Kinos "Beispiel-Kino X" und "Beispiel-Kino Y" ein. Anfragen von Kino Z lassen sich damit nicht bearbeiten, `/requests/3/edit` zeigt dann die entsprechende Meldung.
- Die gewählte **Sprache** merkt sich die App im lokalen Speicher des Browsers (Schlüssel `locale`).

## Projektstruktur

```
src/
  api/          Zugriff auf Daten. Aktuell Fake-Daten, später das Backend.
  assets/       Globale Styles und das TMDB-Logo
  components/   Wiederverwendbare Bausteine
  composables/  Wiederverwendbare Logik (Datumsformat, Media Queries)
  constants/    Auswahllisten wie Formate und Sprachvorschläge
  locales/      Texte in Deutsch (de.json) und Englisch (en.json)
  router/       Routen
  stores/       Globaler Zustand (Anmeldung)
  utils/        Kleine Hilfsfunktionen
  views/        Eine Datei pro Seite
```

## Konventionen

- **Daten nur über `src/api/`.** Komponenten rufen dort Funktionen auf und kennen die Datenquelle nicht.
- **Texte nur über vue-i18n.** Kein deutscher oder englischer Text direkt im Template, sondern ein Schlüssel in beiden Dateien unter `src/locales/`. Ausnahme: die Rechtstexte und der von TMDB vorgeschriebene Hinweis.
- **URL-Pfade sind englisch** (`/films/3`, `/distributors`), auch wenn die Oberfläche deutsch ist.
- **Datumswerte werden als ISO-Text gespeichert** (`2026-10-26`). Die Anzeige formatiert nach Sprache.
- **Farben, Abstände und Rundungen kommen aus CSS-Variablen** (`src/assets/global.css`), nicht aus festen Werten in Komponenten.
- **Zugänglichkeit:** Bedienbar mit der Tastatur, sichtbarer Fokus, sinnvolle Beschriftungen. Status werden nie nur durch Farbe gezeigt.

## Datenschutz und Sicherheit

- Das Ausblenden von Kontaktdaten und Kinonamen ohne Anmeldung ist nur eine Anzeigeregel. Die eigentliche Absicherung muss das **Backend** leisten, indem es diese Felder nicht an nicht angemeldete Anfragen ausliefert.
- Echte personenbezogene Daten gehören erst in das System, wenn Datenschutzerklärung und Zuständigkeiten geklärt sind.

## Datenquellen

Filmdaten sollen zum Teil von [TMDB](https://www.themoviedb.org) stammen. Die Namensnennung steht auf der Seite "Über / Credits" (`/about`). Poster werden über kurze Pfade (`posterPath`) direkt von TMDB geladen und nicht bei uns gespeichert.

## Offene Punkte

- Anbindung an das Backend und Festlegung der API
- Anmeldung (hatten wir schon mal besprochen, OAuth2?)
- Felder im Anfrage-Formular (Film, Verleiher, Kino, Sprache, Format): Auswahl oder Texteingabe
- Rechtstexte (Impressum, Datenschutz)
- Lizenz des Projekts

## Lizenz

Noch nicht festgelegt.
