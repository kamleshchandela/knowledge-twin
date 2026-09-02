import React from 'react';

const CounterCard = ({ label, value, gauge }) => (
  <div className="glass-card counter-instrument">
    <div className="label-mono">{label}</div>
    <div className="counter-value mono">{value}</div>
    <div className="gauge-track">
      <div className="gauge-fill" style={{ width: `${Math.max(5, Math.min(100, gauge))}%` }} />
    </div>
  </div>
);

const Analytics = ({ stats }) => {
  const { total_queries = 0, docs_indexed = 0, active_users = 1, avg_latency_ms = 0 } = stats || {};

  return (
    <div className="scroll-area" style={{ display: 'grid', gap: 14 }}>
      <header>
        <h2 className="section-title">Analytics Console</h2>
        <p className="section-subtitle">Brutalist telemetry for query and memory performance.</p>
      </header>

      <section className="table-grid">
        <CounterCard label="Total Queries" value={total_queries} gauge={(total_queries % 100) || 8} />
        <CounterCard label="Docs Indexed" value={docs_indexed} gauge={(docs_indexed * 7) % 100} />
        <CounterCard label="Active Users" value={active_users} gauge={(active_users * 20) % 100} />
        <CounterCard label="Avg Latency (ms)" value={avg_latency_ms} gauge={100 - Math.min(95, avg_latency_ms / 10)} />
      </section>

      <section className="glass-card">
        <div className="label-mono">Manual Controls</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type="button" className="circle-btn">-</button>
          <button type="button" className="circle-btn">+</button>
        </div>
      </section>
    </div>
  );
};

export default Analytics;
