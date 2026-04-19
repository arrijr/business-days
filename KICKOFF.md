# Business Days API — Kickoff

**Status:** Planning
**Erstellt:** 2026-04-19
**Owner:** Arthur

---

## Phase 1: Markt-Validierung ✅

| Kriterium | Antwort | Status |
|---|---|---|
| Direkte Konkurrenten auf RapidAPI | 3–4 (Working Days API, Business Days Calculator, Calculate Working Days) — alle schwach, unvollständig | ✅ |
| Popularity Score Top-Konkurrenten | Keiner dominiert — "Working days" API hat Aktivität aber schlechte Doku | ✅ |
| Klare Differenzierung möglich? | Ja — 100+ Länder, is-business-day-Check, Datumsberechnung, regionale Feiertage | ✅ |
| Zahlungsbereitschaft bewiesen? | Ja — timeanddate.com nimmt $299 für ihre Calculator API | ✅ |
| Rechtliche Risiken? | Niedrig — Feiertagsdaten sind öffentlich, Nager.Date MIT-Lizenz | ✅ |

**Fazit:** Klares Go. Schwache, fragmentierte Konkurrenz auf RapidAPI. Nager.Date deckt 100+ Länder ab — weit mehr als jeder Konkurrent. Einfacher Build, breite Zielgruppe (Scheduling-Tools, HR-Software, E-Commerce-Lieferzeiten, Buchhaltungssoftware).

### Differenzierungsstrategie
1. **100+ Länder** — Kein Konkurrent kommt da ran. Globale Abdeckung ist das Hauptargument.
2. **is_business_day Check** — Einfacher Boolean für "Ist heute/dieses Datum ein Arbeitstag?". Meistgenutzter Use Case.
3. **Business Day Berechnung** — "Was ist der 5. Werktag nach dem 15. März?" — Kritisch für Zahlungsfristen, Lieferdaten.
4. **Regionale Feiertage** — Nager.Date unterstützt Bundesländer/Kantone (DE, AT, CH, US States etc.)
5. **Caching** — Feiertagsdaten ändern sich nicht unterjährig → aggressives Caching, schnelle Responses

---

## Phase 2: Technischer Ansatz

| Frage | Antwort |
|---|---|
| Was tut der Core-Endpoint? | Datum + Land → ist Arbeitstag?, Liste Feiertage, Werktag-Berechnung |
| Externe Datenquelle | Nager.Date REST API (MIT-Lizenz, kostenlos, 100+ Länder) |
| Self-hosted oder extern? | Extern — `https://date.nager.at/api/v3/` direkt aufrufen |
| Puppeteer nötig? | **Nein** |
| Datenbank nötig? | **Ja** — Upstash Redis für Caching + Rate Limiting |
| Async oder synchron? | Synchron |
| Geschätzte Response-Zeit | 50–200ms (extern), cached < 30ms |
| Größtes technisches Risiko | Nager.Date Downtime — Mitigation: 365-Tage-Cache für Feiertagslisten (ändern sich nicht rückwirkend) |

### Datenquelle: Nager.Date
- **Endpoint:** `https://date.nager.at/api/v3/publicholidays/{year}/{countryCode}`
- **Response:** Array mit `date`, `localName`, `name`, `countryCode`, `fixed`, `global`, `counties`, `types`
- **Länder:** 100+ inkl. Deutschland (mit Bundesländern), Österreich, Schweiz, USA (mit States), UK etc.
- **Lizenz:** MIT — kommerzielle Nutzung erlaubt
- **Rate Limits:** Keine offizielle Beschränkung, aber wir cachen aggressiv um Nager nicht zu belasten

### Cache-Strategie
- Feiertagslisten pro Jahr+Land: TTL 365 Tage (oder bis 31. Dez des Jahres)
- `is_business_day` Checks: TTL 24h
- Business-day Berechnungen: TTL 24h
- Key-Muster: `holidays:{year}:{countryCode}` / `bizday:{date}:{countryCode}`

---

## Phase 3: API-Design (Endpoints)

**4 Endpoints für v1:**

1. `GET /api/v1/holidays/{country}/{year}` — Alle Feiertage eines Landes für ein Jahr
2. `GET /api/v1/is-business-day` — Ist ein Datum ein Arbeitstag?
3. `GET /api/v1/business-days/calculate` — N Werktage vor/nach einem Datum berechnen
4. `GET /api/health` — Health Check

### Request / Response Schema

```json
// GET /api/v1/holidays/DE/2026
{
  "country": "DE",
  "country_name": "Germany",
  "year": 2026,
  "count": 9,
  "holidays": [
    {
      "date": "2026-01-01",
      "name": "New Year's Day",
      "local_name": "Neujahr",
      "type": "public",
      "global": true,
      "regions": null
    },
    {
      "date": "2026-04-03",
      "name": "Good Friday",
      "local_name": "Karfreitag",
      "type": "public",
      "global": true,
      "regions": null
    }
  ]
}

// GET /api/v1/is-business-day?date=2026-12-25&country=DE
{
  "date": "2026-12-25",
  "country": "DE",
  "is_business_day": false,
  "reason": "public_holiday",
  "holiday_name": "Christmas Day"
}

// GET /api/v1/is-business-day?date=2026-04-20&country=DE
{
  "date": "2026-04-20",
  "country": "DE",
  "is_business_day": true,
  "reason": null,
  "holiday_name": null
}

// GET /api/v1/business-days/calculate?start=2026-04-20&days=5&country=DE&direction=forward
{
  "start_date": "2026-04-20",
  "country": "DE",
  "days_requested": 5,
  "direction": "forward",
  "result_date": "2026-04-27",
  "skipped_dates": [
    { "date": "2026-04-25", "reason": "weekend" },
    { "date": "2026-04-26", "reason": "weekend" }
  ]
}

// Response 400
{ "error": "Invalid country code 'XX'", "code": "COUNTRY_NOT_SUPPORTED" }
```

### Core-Regeln
- Datum-Format: ISO 8601 (`YYYY-MM-DD`) — immer
- `country` Parameter: ISO 3166-1 alpha-2, uppercase
- `direction`: `forward` (default) oder `backward`
- Wochenende = Samstag + Sonntag (Standard, keine Konfiguration in v1)
- Alle Error-Responses: `{ error: string, code: string }`
- Header `X-RateLimit-Remaining` + `X-Cache: HIT|MISS` bei jedem Response
- Error-Codes: `COUNTRY_NOT_SUPPORTED`, `INVALID_DATE`, `INVALID_YEAR`, `SERVICE_UNAVAILABLE`

---

## Phase 4: Pricing-Tiers

| Tier | Preis/Monat | Requests/Monat | Zielgruppe |
|---|---|---|---|
| Free | $0 | 500 | Testing |
| Basic | $9 | 10.000 | Indie-Entwickler, kleine Apps |
| Pro | $29 | 100.000 | SaaS-Startups, Scheduling-Tools |
| Business | $99 | 1.000.000 | Enterprise, HR-Software, ERP |

**Rationale:** Ähnlich wie VAT Rates — externe Daten mit Caching, niedrige Serverkosten, großzügige Free-Tier. timeanddate.com nimmt $299 für vergleichbare Funktionalität → wir sind deutlich günstiger und auf RapidAPI.

---

## Phase 5: RapidAPI Listing Vorbereitung

| Feld | Inhalt |
|---|---|
| API Name | **Business Days API** |
| Kategorie (RapidAPI) | Data → Calendar / Productivity |
| Tagline (max 60 Zeichen) | "Check business days & holidays for 100+ countries" (50) |
| Zielgruppe | Entwickler von Scheduling-Tools, HR-Software, E-Commerce (Lieferdaten), Buchhaltungssoftware |
| Hauptuse-Case | Prüfen ob ein Datum ein Arbeitstag ist + N Werktage vor/nach einem Datum berechnen |
| 3 SEO-Keywords | `business days api`, `public holidays api`, `working days calculator` |
| Differenzierung | 100+ Länder, regionale Feiertage (Bundesländer, US States), einfacher is-business-day Check + Datum-Berechnung |

---

## Phase 6: Infrastruktur-Checkliste

- [ ] Neues GitHub-Repo `arrijr/business-days` anlegen
- [ ] Vercel-Projekt konnektieren (Region: `fra1`)
- [ ] Upstash Redis (Caching + Rate Limiting)
- [ ] Environment Variables:
  - [ ] `UPSTASH_REDIS_REST_URL`
  - [ ] `UPSTASH_REDIS_REST_TOKEN`
  - [ ] `RAPIDAPI_PROXY_SECRET`
  - [ ] `NAGER_DATE_ENDPOINT` (default: `https://date.nager.at/api/v3`)
- [ ] Lazy Redis-Initialisierung (wie alle anderen Projekte)
- [ ] RapidAPI Proxy Secret Guard
- [ ] Health Check mit Nager.Date-Erreichbarkeit
- [ ] Logo: `public/logo.svg` — Kürzel `BIZ`, gleiche Farben wie Portfolio

---

## Open Questions — alle beantwortet ✅

- [x] Regionale Feiertage in v1? → Ja, Nager.Date liefert `counties` Feld — durchreichen
- [x] Weekend-Definition konfigurierbar? → Nein in v1 (Sa+So = immer Wochenende). Für v2 optional.
- [x] Jahres-Range: Nager.Date unterstützt mehrere Jahre → wir erlauben aktuelles Jahr ± 5 Jahre
- [x] `backward` Direction beim calculate-Endpoint? → Ja — wichtig für "wann muss ich spätestens bestellen damit es in 3 Werktagen da ist"

---

## Nächste Schritte

1. Next.js Projekt scaffolden
2. Nager.Date Integration testen (Spike: 1h max — sollte trivial sein)
3. `/api-review` nach erstem funktionierenden Endpoint
4. `/rapidapi-listing` wenn MVP steht
5. `/api-launch` Checkliste vor Go-Live
