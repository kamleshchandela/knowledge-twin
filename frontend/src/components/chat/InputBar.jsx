import React, { useState } from 'react';
import { Send, Paperclip, Mic, Image as ImageIcon } from 'lucide-react';
import GlowButton from '../ui/GlowButton';

const InputBar = ({ onSend, onUpload, isLoading }) => {
    const [input, setInput] = useState('');
    const fileInputRef = React.useRef(null);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        const currentInput = input;
        setInput('');
        onSend(currentInput);
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
        }
    };

    return (
        <div className="p-4 border-t border-white/10 bg-navy-900/50 backdrop-blur-md">
            <div className="max-w-4xl mx-auto w-full">
                <form onSubmit={handleSend} className="relative">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                    <div className="absolute left-3 top-3 flex items-center gap-2 text-gray-400">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <Paperclip size={18} />
                        </button>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ImageIcon size={18} />
                        </button>
                    </div>

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-24 pr-12 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary-500/50 focus:bg-white/10 transition-all font-medium"
                    />

                    <div className="absolute right-2 top-2 flex items-center gap-1">
                        {!input.trim() && (
                            <button type="button" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                                <Mic size={18} />
                            </button>
                        )}
                        {input.trim() && (
                            <GlowButton type="submit" variant="primary" className="!p-2 !rounded-lg !min-w-0" disabled={isLoading}>
                                <Send size={16} />
                            </GlowButton>
                        )}
                    </div>
                </form>
                <p className="text-center text-[10px] text-gray-500 mt-2">
                    Knowledge Twin can make mistakes. Verify important information.
                </p>
            </div>
        </div>
    );
};

export default InputBar;
