export const PublicProjectShowcase: React.FC = () => {
  return (
    <section className="project-showcase" aria-label="Project presentation">
      <p className="eyebrow">Financial Data Overview</p>
      <h1>Understand your financial routine with clarity.</h1>
      <p className="lead">
        FDO centralizes transaction imports, category rules, daily balances and
        visual analysis so you can follow your money flow with consistency.
      </p>

      <div className="showcase-grid" role="list" aria-label="Main features">
        <article role="listitem" className="showcase-card">
          <h2>Smart Import</h2>
          <p>
            Upload CSV statements of various formats, map columns, and parse
            data into a normalized format for analysis.
          </p>
        </article>
        <article role="listitem" className="showcase-card">
          <h2>Category Rules</h2>
          <p>
            Create custom categories and matching rules to classify entries in a
            practical way.
          </p>
        </article>
        <article role="listitem" className="showcase-card">
          <h2>Daily Analytics</h2>
          <p>
            Explore reconciliation, totals by category and daily behavior with
            interactive charts.
          </p>
        </article>
      </div>

      <article className="host-note" aria-label="Hosting overview">
        <h2>Hosting Overview</h2>
        <p>
          The online version runs frontend and Laravel backend in Docker
          containers on the same VPS, with HTTPS enabled and hardened access
          policies (SSH-only, UFW and fail2ban).
        </p>
      </article>

      <div className="tech-row" aria-label="Technologies used">
        <span>React</span>
        <span>TypeScript</span>
        <span>Vite</span>
        <span>Material UI</span>
        <span>Laravel Echo</span>
        <span>Laravel</span>
        <span>Docker</span>
        <span>Nginx</span>
        <span>VPS</span>
        <span>UFW</span>
        <span>fail2ban</span>
        <span>HTTPS</span>
      </div>
    </section>
  );
};
