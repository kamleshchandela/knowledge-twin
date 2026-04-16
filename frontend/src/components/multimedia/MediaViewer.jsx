import React, { useState } from 'react';
import { uploadFile } from '../../services/api';

const MediaViewer = () => {
  const [mode, setMode] = useState('image');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleFileSelect = async (e) => {
    if (!e.target.files?.[0]) {
      return;
    }
    setIsUploading(true);
    try {
      await uploadFile(e.target.files[0]);
      alert('Media uploaded.');
    } catch {
      alert('Media upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="scroll-area" style={{ display: 'grid', gap: 14 }}>
      <header>
        <h2 className="section-title">Multimedia Lab</h2>
        <p className="section-subtitle">Clinical review console for visual/audio evidence.</p>
      </header>

      <section className="glass-card">
        <div className="label-mono">Mode</div>
        <div className="radio-group" style={{ marginTop: 8 }}>
          {['image', 'video', 'audio'].map((item) => (
            <button
              key={item}
              type="button"
              className={`radio-btn ${mode === item ? 'active' : ''}`}
              onClick={() => setMode(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="glass-card" style={{ minHeight: 280, display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p className="label-mono">Preview Surface</p>
          <p className="section-subtitle">Awaiting uploaded {mode} content.</p>
        </div>
      </section>

      <section className="glass-card">
        <div className="terminal-form">
          <div style={{ display: 'grid', gap: 8 }}>
            <label className="label-mono">Transcript / Notes</label>
            <textarea className="form-input" rows={4} placeholder="Timestamped analysis notes..." />
          </div>
          <button type="button" className="btn-submit" onClick={() => fileInputRef.current?.click()}>
            {isUploading ? 'Uploading' : 'Upload Media'}
          </button>
        </div>
        <input
          ref={fileInputRef}
          className="hidden"
          type="file"
          accept="image/*,video/*,audio/*"
          onChange={handleFileSelect}
        />
      </section>
    </div>
  );
};

export default MediaViewer;
