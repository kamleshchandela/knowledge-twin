import React, { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import InputBar from './InputBar';
import { sendMessage, uploadFile } from '../../services/api';

const ChatWindow = ({ modelProfile = 'balanced', resetToken = 0 }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      content: 'Clinical tactical console ready. Upload a document or ask a question.',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        content: 'Session reset complete. Clinical tactical console ready.',
      },
    ]);
  }, [resetToken]);

  const handleSend = async (text) => {
    const newUserMsg = { id: Date.now(), sender: 'user', content: text };
    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.content,
      }));
      const response = await sendMessage(text, history, modelProfile);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          content: response.answer,
          latencyMs: response.latency_ms,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          content: 'Error: backend unreachable on port 8000.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (file) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', content: `Uploading ${file.name}...` },
    ]);
    setIsLoading(true);
    try {
      const data = await uploadFile(file);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          content: data.summary || `File uploaded: ${file.name}`,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', content: 'Upload failed. Please retry.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-layout">
      <div className="label-mono" style={{ marginBottom: 10 }}>
        Chat Terminal
      </div>
      <div className="message-stack">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && <MessageBubble message={{ id: 'typing', sender: 'ai', isTyping: true }} />}
        <div ref={messagesEndRef} />
      </div>
      <InputBar onSend={handleSend} onUpload={handleUpload} isLoading={isLoading} />
    </div>
  );
};

export default ChatWindow;
