# RapidAPI Listing — Business Days API

Copy-paste into RapidAPI Studio. Generated 2026-04-19.

---

## Core fields

| Field | Value |
|---|---|
| **API Name** | `Business Days API` |
| **Category** | Data → Calendar / Productivity |
| **Base URL** | `https://business-days-kohl.vercel.app/api/v1` |
| **Proxy Secret** | `c7afb1b7-5d56-4117-9bbd-be8f9b2ab107` |
| **Health URL (monitoring)** | `https://business-days-kohl.vercel.app/api/health` |
| **Privacy URL** | `https://raw.githubusercontent.com/arrijr/business-days/main/PRIVACY.md` |
| **Terms URL** | `https://raw.githubusercontent.com/arrijr/business-days/main/TERMS.md` |
| **OpenAPI** | `https://raw.githubusercontent.com/arrijr/business-days/main/openapi.yaml` |
| **Logo** | `public/logo.svg` (120×120, dark navy + yellow calendar icon) |

---

## Studio → Security → Secret Headers & Parameters

Add **one row** — this is what injects the Proxy Secret on every gateway request so our middleware accepts the call:

| Name | Value | Type | Description |
|---|---|---|---|
| `X-RapidAPI-Proxy-Secret` | `c7afb1b7-5d56-4117-9bbd-be8f9b2ab107` | Header | Auth between RapidAPI gateway and our Vercel origin |

Without this row every request returns `403 FORBIDDEN` from our middleware.

> ⚠️ **Do not put this in Transformations.** The Transformations dialog has a `Key` field that expects dotted-path format (`request.header.data`) and will reject a plain header name with "Invalid format". Use the **Secret Headers & Parameters** table above.

## Studio → Security → Transformations

**None required.** Base URL already contains `/api/v1`, so user-facing paths like `/holidays/DE/2026` map 1:1 to origin `/api/v1/holidays/DE/2026`. Leave the Transformations table empty.

(If you ever drop `/api/v1` from the Base URL, add a Request transformation: Action `AddToPath`, Value `/api/v1`, Scope `All endpoints`.)

---

## Tagline (max 60 chars)

```
Check business days & holidays for 100+ countries
```
(50 chars — ✓)

---

## Short description (max 160 chars)

```
Public holidays API + working days calculator for 100+ countries. Check if a date is a business day, list holidays, calculate N working days.
```
(139 chars ✓ — keywords front-loaded: "Public holidays API", "working days calculator", "business day")

---

## Long description (Overview tab)

> Paste this whole Markdown block into Studio → Settings → Description. Keywords are woven in naturally (no separate Tags field exists on RapidAPI — search ranking comes from the description text).

```markdown
# Business Days API — Public Holidays & Working Days Calculator for 100+ Countries

The **Business Days API** is a fast, reliable REST API to check public holidays and calculate business days across **100+ countries**. Built for scheduling tools, HR software, e-commerce delivery estimation, payroll systems, and financial due-date calculations.

Whether you need to answer "is December 25 a working day in Germany?", list all bank holidays for Italy in 2026, or calculate the 5th business day after April 20 in the UK — this API does it in a single HTTP call.

## Why developers choose this API

- **100+ countries supported** — Germany, Austria, Switzerland, USA (with states), United Kingdom, France, Spain, Italy, Netherlands, Poland, Canada, Australia, Brazil, Japan, and many more. Full ISO 3166-1 alpha-2 coverage.
- **Regional holidays included** — German Bundesländer, US states, Swiss cantons, Spanish autonomous communities. Regional holiday codes returned where available.
- **Business day math in one call** — calculate N working days forward or backward from any start date, skipping weekends and public holidays automatically.
- **Blazing fast** — aggressive Redis caching, cached responses under 30 ms, served from Frankfurt (EU) with global edge reach.
- **Stable error codes** — machine-readable `code` field (`COUNTRY_NOT_SUPPORTED`, `INVALID_DATE`, etc.) for reliable client-side handling.
- **Generous free tier** — 500 requests / month on the free plan, no credit card required.

## Common use cases

- **Scheduling & HR software** — compute next working day, SLA deadlines, holiday-aware shift planning, PTO calculators.
- **E-commerce** — estimate delivery dates across multiple markets, exclude non-working days from carrier lead times.
- **Finance & accounting** — payment due dates, invoice aging, T+N settlement calculations, tax filing deadlines.
- **Payroll** — calculate paid-holiday offsets, pro-rate monthly salaries for new hires, validate leave requests.
- **Logistics & supply chain** — dispatch cut-off calculations, customs clearance estimates, cross-border lead times.
- **Legal & compliance tech** — contract deadline math, statute-of-limitations calculators, court filing windows.
- **Project management tools** — working-day Gantt charts, milestone scheduling, sprint burndown corrections.

## Endpoints

### `GET /holidays/{country}/{year}` — list all public holidays

Returns every public holiday for a country and year, including local names (e.g. "Neujahr" for New Year's Day in Germany), regional scope, and holiday type. Covers 2020–2030.

### `GET /is-business-day` — is this date a workday?

Given a date and country, returns `true`/`false` plus the reason (`weekend` or `public_holiday`) and the holiday name where applicable. Perfect for "show me the next deliverable date" workflows.

### `GET /business-days/calculate` — add/subtract N working days

Calculate the date exactly N business days forward (`direction=forward`) or backward (`direction=backward`) from a start date. Returns the result date plus the list of skipped dates with reasons — essential for transparent SLA calculators and audit trails.

## Response format

- **JSON** responses, UTF-8, `Content-Type: application/json`
- **Dates**: ISO 8601 `YYYY-MM-DD`
- **Country codes**: ISO 3166-1 alpha-2 (uppercase, e.g. `DE`, `US`, `GB`)
- **Headers**: every response includes `X-Cache: HIT|MISS` and `X-RateLimit-Remaining` for observability
- **Errors**: `{ "error": string, "code": string }` with stable machine-readable codes

## Supported countries (partial list)

Germany (DE), Austria (AT), Switzerland (CH), United States (US), United Kingdom (GB), France (FR), Spain (ES), Italy (IT), Netherlands (NL), Belgium (BE), Luxembourg (LU), Ireland (IE), Portugal (PT), Denmark (DK), Sweden (SE), Norway (NO), Finland (FI), Iceland (IS), Poland (PL), Czech Republic (CZ), Slovakia (SK), Hungary (HU), Romania (RO), Bulgaria (BG), Croatia (HR), Slovenia (SI), Greece (GR), Cyprus (CY), Malta (MT), Estonia (EE), Latvia (LV), Lithuania (LT), Canada (CA), Mexico (MX), Brazil (BR), Argentina (AR), Chile (CL), Colombia (CO), Peru (PE), Australia (AU), New Zealand (NZ), Japan (JP), South Korea (KR), Singapore (SG), Philippines (PH), Indonesia (ID), Vietnam (VN), India-adjacent markets, South Africa (ZA), Egypt (EG), Morocco (MA), Tunisia (TN), and **65+ more**.

## FAQ

**Is this API free?** Yes — the BASIC plan gives you 500 requests per month at $0. Paid tiers start at $9/month for 10,000 requests.

**How current is the holiday data?** Holiday lists are sourced from the open-source Nager.Date dataset (MIT licensed) and cached per country/year. Data covers years 2020 through 2030.

**Do you support regional holidays (e.g. Oktoberfest in Bavaria)?** Regional holiday metadata is returned in the `regions` field on each holiday. For the `is-business-day` and `calculate` endpoints, only nationwide (global) public holidays block a business day in v1 — regional support is on the roadmap for v2.

**Does your weekend definition include Friday (for Gulf/Islamic countries)?** Not in v1 — weekends are Saturday + Sunday globally. Configurable weekend rules are planned for v2.

**What happens on a rate limit?** Responses return HTTP 429 with `{ "error": "...", "code": "RATE_LIMIT_EXCEEDED" }`. Upgrade your plan in RapidAPI to raise the limit.

**Is the data legally authoritative?** No. This is a convenience API for developer tooling. For legally binding deadlines (tax filings, court dates, contractual cutoffs) always verify against the official government gazette or publication of the relevant country.

## Keywords

business days API, public holidays API, working days calculator, holidays by country, bank holidays API, calendar API, business day calculator, workday calculator, holiday lookup API, ISO country holidays, Nager Date wrapper, REST API holidays, JSON holidays API, is business day check, next working day API, SLA calculator API, delivery date API, payment due date calculator, payroll holidays API, scheduling API.

## Disclaimer

Holiday data is sourced from the open-source Nager.Date project. Data may lag or miss regional edge cases. Do not use as the sole source of truth for legally binding deadlines — verify against official government publications where accuracy is critical.
```

---

## Pricing tiers

| Tier | Price/mo | Requests/mo | Overage |
|---|---|---|---|
| Free / BASIC | $0 | 500 | Hard cap |
| Basic / PRO | $9 | 10,000 | $0.002/req |
| Pro / ULTRA | $29 | 100,000 | $0.001/req |
| Business / MEGA | $99 | 1,000,000 | $0.0005/req |

Rate limit per plan: 10 req/sec (all tiers).

---

## Code examples

### cURL

```bash
curl -X GET 'https://business-days-api.p.rapidapi.com/holidays/DE/2026' \
  -H 'x-rapidapi-host: business-days-api.p.rapidapi.com' \
  -H 'x-rapidapi-key: YOUR_RAPIDAPI_KEY'
```

### JavaScript (fetch)

```js
const res = await fetch(
  'https://business-days-api.p.rapidapi.com/is-business-day?date=2026-12-25&country=DE',
  {
    headers: {
      'x-rapidapi-host': 'business-days-api.p.rapidapi.com',
      'x-rapidapi-key': 'YOUR_RAPIDAPI_KEY',
    },
  }
);
const data = await res.json();
console.log(data.is_business_day, data.reason); // false "public_holiday"
```

### Python (requests)

```python
import requests

r = requests.get(
    "https://business-days-api.p.rapidapi.com/business-days/calculate",
    params={"start": "2026-04-20", "days": 5, "country": "DE", "direction": "forward"},
    headers={
        "x-rapidapi-host": "business-days-api.p.rapidapi.com",
        "x-rapidapi-key": "YOUR_RAPIDAPI_KEY",
    },
)
print(r.json()["result_date"])  # "2026-04-27"
```

---

## Studio Tests (configure before Go-Live)

> **Free plan limit:** RapidAPI Studio free tier allows only 2 active tests per API. The first two below are the minimum; the rest only if the plan is upgraded.

| # | Test | Location | Schedule | URL | Assertion |
|---|---|---|---|---|---|
| 1 | Health | Frankfurt | every 15 min | `{base}/api/health` | Expression `health.data.status` equals `ok` |
| 2 | Happy — holidays | Frankfurt | every 60 min | `{base}/api/v1/holidays/DE/2026` | Expression `holidays.data.country` equals `DE` |
| 3 _(optional, needs paid plan)_ | Happy — is-business-day | Frankfurt | every 60 min | `{base}/api/v1/is-business-day?date=2026-12-25&country=DE` | `bizday.data.reason` equals `public_holiday` |
| 4 _(optional, needs paid plan)_ | Error — invalid country | Frankfurt | every 60 min | `{base}/api/v1/is-business-day?date=2026-04-20&country=XX` | `errcase.data.code` equals `COUNTRY_NOT_SUPPORTED` |

**Header for all guarded tests (#2–#4):** `X-RapidAPI-Proxy-Secret: c7afb1b7-5d56-4117-9bbd-be8f9b2ab107`. Test #1 (`/api/health`) is unguarded, no header needed.

**Expression syntax in Studio:** enter path without `{{ }}` braces (e.g. `health.data.status`), response body lives under `<var>.data.<field>`, not `<var>.body.<field>`.

---

## Go-Live Checklist

- [x] GitHub repo created: `arrijr/business-days`
- [x] Vercel deployed: `https://business-days-kohl.vercel.app` (fra1)
- [x] Env vars set: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `RAPIDAPI_PROXY_SECRET`, `NAGER_DATE_ENDPOINT`
- [x] SSO protection disabled
- [x] Smoke tests green (all 4 endpoints + guard)
- [x] README, PRIVACY, TERMS, openapi.yaml live on `main`
- [x] Logo at `public/logo.svg`
- [ ] Create RapidAPI Studio API (manual — UI only)
- [ ] Paste OpenAPI URL → auto-populate endpoints
- [ ] Set Proxy Secret in Studio → must match Vercel env
- [ ] Configure 4 Studio Tests above
- [ ] Smoke test via RapidAPI playground (both free + paid key)
- [ ] Publish listing
```
