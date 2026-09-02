import React from 'react';
import { uploadFile } from '../../services/api';

const DocumentGrid = ({ files = [] }) => {
  const fileInputRef = React.useRef(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileSelect = async (e) => {
    if (!e.target.files?.[0]) {
      return;
    }
    setIsUploading(true);
    try {
      await uploadFile(e.target.files[0]);
      alert('Document uploaded.');
    } catch {
      alert('Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="scroll-area" style={{ display: 'grid', gap: 14 }}>
      <header>
        <h2 className="section-title">Documents</h2>
        <p className="section-subtitle">Blueprint index of uploaded material.</p>
      </header>

      <div className="terminal-form">
        <div style={{ display: 'grid', gap: 8 }}>
          <label className="label-mono" htmlFor="doc-search">
            Search Index
          </label>
          <input id="doc-search" className="form-input" placeholder="Filter by title..." />
        </div>
        <button
          type="button"
          className="btn-submit"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading' : 'Upload File'}
        </button>
      </div>

      <input ref={fileInputRef} className="hidden" type="file" onChange={handleFileSelect} />

      <div className="table-grid">
        {files.length === 0 && <div className="glass-card">No indexed documents found.</div>}
        {files.map((doc) => (
          <article key={doc.id} className="glass-card">
            <div className="label-mono">Document</div>
            <h3 style={{ margin: '8px 0 6px', fontSize: 16 }}>{doc.title}</h3>
            <p className="section-subtitle" style={{ margin: 0 }}>
              {doc.type} • {doc.size} • {doc.date}
            </p>
            <div style={{ marginTop: 10 }} className="radio-group">
              {(doc.tags || []).map((tag) => (
                <span key={tag} className="radio-btn">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default DocumentGrid;
