import React, { useState } from 'react';

const InputBar = ({ onSend, onUpload, isLoading }) => {
  const [input, setInput] = useState('');
  const fileInputRef = React.useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) {
      return;
    }
    const value = input;
    setInput('');
    onSend(value);
  };

  return (
    <form onSubmit={handleSubmit} className="terminal-form" style={{ marginTop: 10 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <label className="label-mono" htmlFor="chat-input">
          Prompt
        </label>
        <input
          id="chat-input"
          className="form-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type command or question..."
        />
      </div>
      <div style={{ display: 'grid', gap: 8, alignContent: 'end' }}>
        <button type="button" className="action-btn" onClick={() => fileInputRef.current?.click()}>
          Attach
        </button>
        <button type="submit" className="btn-submit" disabled={isLoading}>
          Send
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onUpload(e.target.files[0]);
          }
        }}
      />
    </form>
  );
};

export default InputBar;
