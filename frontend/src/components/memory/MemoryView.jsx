import React from 'react';

const memories = [
  { id: 'M-104', content: 'User is operating in tactical light mode.', confidence: 99 },
  { id: 'M-121', content: 'Average query latency currently below 2 seconds.', confidence: 94 },
  { id: 'M-132', content: 'Documents and multimedia are analyzed in one thread.', confidence: 89 },
];

const MemoryView = () => {
  return (
    <div className="scroll-area" style={{ display: 'grid', gap: 14 }}>
      <header>
        <h2 className="section-title">Memory Ledger</h2>
        <p className="section-subtitle">Persistent extracted memory vectors and confidence scores.</p>
      </header>

      <div className="glass-card">
        <label className="label-mono" htmlFor="memory-search">
          Search Memory
        </label>
        <input id="memory-search" className="form-input" placeholder="Lookup by keyword..." style={{ marginTop: 8 }} />
      </div>

      <div className="table-grid">
        {memories.map((item) => (
          <article key={item.id} className="glass-card">
            <div className="label-mono">{item.id}</div>
            <p style={{ margin: '10px 0' }}>{item.content}</p>
            <div className="counter-instrument">
              <div className="label-mono">Confidence</div>
              <div className="counter-value">{item.confidence}%</div>
              <div className="gauge-track">
                <div className="gauge-fill" style={{ width: `${item.confidence}%` }} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default MemoryView;
