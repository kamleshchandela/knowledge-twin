import React from 'react';

const SettingsPanel = ({ settings, onChangeSettings, onSaveSettings, onResetSession }) => {
  const { theme = 'light', modelProfile = 'balanced', alerts = true } = settings || {};

  const setTheme = (next) => onChangeSettings((prev) => ({ ...prev, theme: next }));
  const setModelProfile = (next) => onChangeSettings((prev) => ({ ...prev, modelProfile: next }));
  const setAlerts = () => onChangeSettings((prev) => ({ ...prev, alerts: !prev.alerts }));

  return (
    <div className="scroll-area" style={{ display: 'grid', gap: 14 }}>
      <header>
        <h2 className="section-title">Settings</h2>
        <p className="section-subtitle">System-level tactical controls and preferences.</p>
      </header>

      <section className="glass-card">
        <div className="label-mono">Theme Profile</div>
        <div className="radio-group" style={{ marginTop: 8 }}>
          {['light', 'paper', 'clinical'].map((option) => (
            <button
              key={option}
              type="button"
              className={`radio-btn ${theme === option ? 'active' : ''}`}
              onClick={() => setTheme(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <section className="glass-card terminal-form">
        <div style={{ display: 'grid', gap: 8 }}>
          <label className="label-mono" htmlFor="model-profile-select">
            Query Model Profile
          </label>
          <select
            id="model-profile-select"
            className="form-input"
            value={modelProfile}
            onChange={(e) => setModelProfile(e.target.value)}
          >
            <option value="fast">Fast</option>
            <option value="balanced">Balanced</option>
            <option value="quality">Quality</option>
          </select>
        </div>
        <div style={{ display: 'grid', gap: 8, alignContent: 'end' }}>
          <button
            type="button"
            className={`radio-btn ${alerts ? 'active' : ''}`}
            onClick={setAlerts}
          >
            Alerts {alerts ? 'On' : 'Off'}
          </button>
          <button type="button" className="btn-submit" onClick={onSaveSettings}>
            Save Config
          </button>
        </div>
      </section>

      <section className="glass-card">
        <div className="label-mono">Danger Zone</div>
        <p className="section-subtitle" style={{ marginTop: 8 }}>
          Clear tactical memory and reset runtime session.
        </p>
        <button type="button" className="action-btn" style={{ marginTop: 10 }} onClick={onResetSession}>
          Reset Session
        </button>
      </section>
    </div>
  );
};

export default SettingsPanel;
