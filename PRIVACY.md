# Privacy Policy — Business Days API

_Last updated: 2026-04-19_

## What we collect

The Business Days API is a stateless data service. We do **not** collect personal data from end users. When you call the API via RapidAPI we process:

- Request parameters (country code, date, year) — used only to answer the request
- Rate-limiting identifiers (RapidAPI user ID or, if absent, the proxying IP) — stored in Upstash Redis for short-lived rate-limit counters
- Standard server logs (timestamp, path, status code) — retained by our hosting provider (Vercel) for operational purposes

We do not store request payloads, response payloads, or user-identifying fields beyond what is required to enforce rate limits.

## What we cache

To keep responses fast and reduce load on the upstream Nager.Date service we cache:

- Public holiday lists per `(country, year)` — up to the end of that calendar year
- Per-date business-day verdicts — up to 24 hours

Cached data contains no personal information.

## Upstream data source

Public holiday data is retrieved from [Nager.Date](https://date.nager.at) (MIT licensed, publicly available). We are not the authoritative source for legal or official holiday lists.

## Sub-processors

- **Vercel** — hosting (region: Frankfurt, fra1)
- **Upstash** — Redis (caching + rate limiting)
- **RapidAPI** — API marketplace, billing, analytics
- **Nager.Date** — public holiday data source

## Your rights

Because we do not store personal data, there is typically nothing to access, export, or delete. If you believe we hold data about you, contact us via the RapidAPI listing.

## Contact

Questions: use the RapidAPI listing's support channel.
