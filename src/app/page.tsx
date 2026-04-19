export default function Home() {
  return (
    <main style={{ fontFamily: "Inter, system-ui, sans-serif", padding: "3rem", maxWidth: 720, margin: "0 auto" }}>
      <h1>Business Days API</h1>
      <p>Check business days & public holidays for 100+ countries.</p>
      <p>
        Available on <a href="https://rapidapi.com/">RapidAPI</a>. See{" "}
        <code>openapi.yaml</code> for the full spec.
      </p>
      <ul>
        <li><code>GET /api/v1/holidays/{"{country}"}/{"{year}"}</code></li>
        <li><code>GET /api/v1/is-business-day?date=&country=</code></li>
        <li><code>GET /api/v1/business-days/calculate?start=&days=&country=&direction=</code></li>
        <li><code>GET /api/health</code></li>
      </ul>
    </main>
  );
}
