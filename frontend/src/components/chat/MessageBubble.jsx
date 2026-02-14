import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { User, Bot, Copy, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

const MessageBubble = ({ message }) => {
    const isAi = message.sender === 'ai';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx(
                "flex gap-4 max-w-4xl mx-auto w-full mb-6",
                isAi ? "flex-row" : "flex-row-reverse"
            )}
        >
            {/* Avatar */}
            <div className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg",
                isAi
                    ? "bg-gradient-to-br from-primary-500 to-accent-500 text-white"
                    : "bg-white/10 text-gray-300"
            )}>
                {isAi ? <Bot size={18} /> : <User size={18} />}
            </div>

            {/* Bubble */}
            <div className={clsx(
                "group relative p-4 rounded-xl shadow-lg border backdrop-blur-sm",
                isAi
                    ? "bg-white/5 border-white/10 rounded-tl-none text-gray-200"
                    : "bg-primary-600 border-primary-500 rounded-tr-none text-white max-w-[80%]"
            )}>
                <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>

                {/* Actions (AI only) */}
                {isAi && (
                    <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors" title="Copy">
                            <Copy size={14} />
                        </button>
                        <button className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors" title="Regenerate">
                            <RefreshCw size={14} />
                        </button>
                        <div className="h-3 w-px bg-white/10 mx-1" />
                        <button className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
                            <ThumbsUp size={14} />
                        </button>
                        <button className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
                            <ThumbsDown size={14} />
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default MessageBubble;
