import React from 'react';

const HeroLanding = ({ onEnter }) => {
  return (
    <div className="landing-shell">
      <div className="landing-grid-overlay" />
      <main className="landing-main">
        <section className="landing-card">
          <p className="label-mono">Knowledge Twin / Clinical Tactical Interface</p>
          <h1 className="landing-title">Analyze Documents, Media, and Conversations in One Console</h1>
          <p className="landing-subtitle">
            Precision-focused assistant with memory, multimodal understanding, and low-latency chat.
          </p>
          <div className="landing-actions">
            <button type="button" className="btn-submit" onClick={onEnter}>
              Enter Chat Console
            </button>
          </div>
          <div className="landing-features">
            <div className="glass-card">
              <div className="label-mono">RAG</div>
              <p className="section-subtitle">Document-grounded answers with context retrieval.</p>
            </div>
            <div className="glass-card">
              <div className="label-mono">Multimodal</div>
              <p className="section-subtitle">Image and video uploads with AI interpretation.</p>
            </div>
            <div className="glass-card">
              <div className="label-mono">Memory</div>
              <p className="section-subtitle">Session continuity with recent conversation state.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HeroLanding;
