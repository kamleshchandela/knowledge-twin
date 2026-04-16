import React from 'react';

const RightPanel = ({ data }) => {
  const { recent_history = [], files = [], stats = {} } = data || {};
  const recentFiles = files.slice(0, 4);

  return (
    <aside className="right-column">
      <div className="glass-card scroll-area" style={{ display: 'grid', gap: 12 }}>
        <section className="glass-card">
          <div className="label-mono">Active Status</div>
          <div style={{ marginTop: 8, display: 'grid', gap: 6 }}>
            <div className="mono">MODEL: GEMINI</div>
            <div className="mono">QUERIES: {stats.total_queries ?? 0}</div>
            <div className="mono">LATENCY: {stats.avg_latency_ms ?? 0} ms</div>
          </div>
        </section>

        <section className="glass-card">
          <div className="label-mono">Recent Files</div>
          <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
            {recentFiles.length === 0 ? (
              <p className="section-subtitle">No uploaded files yet.</p>
            ) : (
              recentFiles.map((file) => (
                <div key={file.id} style={{ border: '2px solid #000', padding: 8, background: '#f4f4f5' }}>
                  <div className="mono" style={{ fontSize: 12, fontWeight: 600 }}>
                    {file.title}
                  </div>
                  <div style={{ fontSize: 12, color: '#52525b' }}>
                    {file.type} • {file.size}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="glass-card">
          <div className="label-mono">Recent Memory</div>
          <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
            {recent_history.length === 0 ? (
              <p className="section-subtitle">No recent messages.</p>
            ) : (
              recent_history.slice(-4).reverse().map((item, idx) => (
                <div key={idx} style={{ borderBottom: '2px solid #000', paddingBottom: 8 }}>
                  <div className="mono" style={{ fontSize: 11 }}>
                    {item.role === 'user' ? 'USER' : 'MODEL'}
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: 13 }}>{item.content}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </aside>
  );
};

export default RightPanel;
