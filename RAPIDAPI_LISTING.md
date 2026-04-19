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
Public holidays & business-day calculator for 100+ countries. Check if a date is a workday, list holidays, calculate N business days forward/back.
```

---

## Long description (Overview tab)

```markdown
# Business Days API

Check whether a date is a business day, list public holidays, and calculate dates N business days forward or backward — for **100+ countries** including Germany, Austria, Switzerland, USA (with states), UK, France, Spain, Italy, and many more.

## Why this API?

- **100+ countries** — largest coverage on RapidAPI
- **Regional holidays** — German Bundesländer, US states, Swiss cantons
- **Business-day math** — "5 working days after April 20?" — answer in one call
- **Fast** — aggressive Redis caching, cached responses < 30ms
- **Accurate** — backed by the open-source Nager.Date dataset (MIT licensed)

## Use cases

- **Scheduling & HR** — compute next working day, SLA deadlines
- **E-commerce** — delivery date estimates across markets
- **Finance & accounting** — payment due dates, invoice aging
- **Payroll** — holiday-aware shift planning
- **Logistics** — dispatch cut-off calculations

## Endpoints

| Endpoint | Purpose |
|---|---|
| `GET /holidays/{country}/{year}` | All public holidays for a country + year |
| `GET /is-business-day?date=&country=` | Is a date a business day? (weekend / holiday detection) |
| `GET /business-days/calculate?start=&days=&country=&direction=` | N business days forward or backward |

## Response format

All responses are JSON, dates are ISO 8601 (`YYYY-MM-DD`), country codes are ISO 3166-1 alpha-2. Every response carries `X-Cache: HIT|MISS` and `X-RateLimit-Remaining` headers. Error responses follow `{ "error": string, "code": string }` with stable error codes (`COUNTRY_NOT_SUPPORTED`, `INVALID_DATE`, `INVALID_YEAR`, `SERVICE_UNAVAILABLE`).

## Disclaimer

Holiday data is sourced from the open-source Nager.Date project. Data may lag or miss regional edge cases. Do not use as the sole source of truth for legally binding deadlines — verify against official government publications where accuracy is critical.
```

---

## Tags (SEO keywords)

```
business days api
public holidays api
working days calculator
holidays by country
calendar api
business day calculation
holiday lookup
workday calculator
iso country holidays
nager date
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
