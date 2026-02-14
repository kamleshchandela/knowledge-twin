import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import InputBar from './InputBar';
import { sendMessage, uploadFile } from '../../services/api';
import { motion } from 'framer-motion';

const ChatWindow = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', content: "# Hello! \nI'm your **Knowledge Twin**. I can help you analyze documents, generate insights, or just chat. How can I assist you today?" }
    ]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async (text) => {
        const newUserMsg = { id: Date.now(), sender: 'user', content: text };
        setMessages(prev => [...prev, newUserMsg]);
        setIsLoading(true);

        try {
            // Prepare history for context
            const history = messages.map(m => ({
                role: m.sender === 'user' ? 'user' : 'model',
                content: m.content
            }));
            const response = await sendMessage(text, history);

            const newAiMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                content: response
            };
            setMessages(prev => [...prev, newAiMsg]);
        } catch (error) {
            const errorMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                content: "⚠️ **Error:** I couldn't reach the backend. Is it running on port 8000?"
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async (file) => {
        const tempMsg = { id: Date.now(), sender: 'user', content: `📁 Uploading **${file.name}**...` };
        setMessages(prev => [...prev, tempMsg]);
        setIsLoading(true);

        try {
            const data = await uploadFile(file);

            const successMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                content: data.summary || `Successfully uploaded ${file.name}.`
            };
            setMessages(prev => [...prev, successMsg]);
        } catch (error) {
            const errorMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                content: "⚠️ **Upload Failed:** Could not process the file."
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full relative">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pb-2">
                <div className="max-w-4xl mx-auto space-y-2">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center opacity-50">
                            <p>Start a conversation...</p>
                        </div>
                    )}
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <InputBar onSend={handleSend} onUpload={handleUpload} isLoading={isLoading} />
        </div>
    );
};

export default ChatWindow;
