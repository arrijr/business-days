# Business Days API

Check business days & public holidays for 100+ countries. Powered by [Nager.Date](https://date.nager.at), cached aggressively on Upstash Redis, deployed on Vercel (fra1).

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/holidays/{country}/{year}` | All public holidays for a country + year |
| GET | `/api/v1/is-business-day?date=&country=` | Is a given date a business day? |
| GET | `/api/v1/business-days/calculate?start=&days=&country=&direction=` | N business days forward/backward |
| GET | `/api/health` | Service health + Nager reachability |

All `/api/v1/*` routes require the `x-rapidapi-proxy-secret` header (enforced by middleware). Every response carries `X-Cache: HIT|MISS` and `X-RateLimit-Remaining`.

Full schema: [`openapi.yaml`](./openapi.yaml).

## Stack

- Next.js 15 App Router, TypeScript
- Upstash Redis (caching + sliding-window rate limit)
- Nager.Date v3 REST API (MIT licensed, 100+ countries)
- Vercel, region `fra1`

## Local development

```bash
cp .env.example .env.local
# fill in UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, RAPIDAPI_PROXY_SECRET
npm install
npm run dev
```

Smoke test:

```bash
curl -H "x-rapidapi-proxy-secret: $RAPIDAPI_PROXY_SECRET" \
  "http://localhost:3000/api/v1/holidays/DE/2026"
```

## Caching

- `holidays:{country}:{year}` — TTL until Dec 31 of that year
- `bizday:{date}:{country}` — TTL 24h

Holiday datasets are stable once published, so long TTLs are safe.

## License

Code: MIT. Holiday data: Nager.Date (MIT).
