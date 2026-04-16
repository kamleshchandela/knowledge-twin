import React from 'react';
import ReactMarkdown from 'react-markdown';

const MessageBubble = ({ message }) => {
  const isAi = message.sender === 'ai';

  return (
    <div className={`message-row ${isAi ? 'ai' : 'user'}`}>
      <div className={`message-bubble ${isAi ? 'ai' : 'user'}`}>
        {message.isTyping ? (
          <div className="typing-dots">
            <span />
            <span />
            <span />
          </div>
        ) : (
          <ReactMarkdown>{message.content || ''}</ReactMarkdown>
        )}
        {typeof message.latencyMs === 'number' && !message.isTyping && (
          <div className="latency-tag">Backend latency: {message.latencyMs} ms</div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
