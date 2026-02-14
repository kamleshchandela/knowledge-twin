import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Bell, Moon, Smartphone, Globe, Code, Database, Trash2 } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import GlowButton from '../ui/GlowButton';

const Section = ({ title, icon: Icon, children }) => (
    <GlassCard className="mb-6">
        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
            <div className="p-2 bg-white/5 rounded-lg text-primary-400">
                <Icon size={20} />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="space-y-6">
            {children}
        </div>
    </GlassCard>
);

const Toggle = ({ label, description, enabled, onChange }) => (
    <div className="flex items-center justify-between">
        <div>
            <p className="font-medium">{label}</p>
            <p className="text-xs text-gray-400">{description}</p>
        </div>
        <button
            onClick={() => onChange(!enabled)}
            className={`w-12 h-6 rounded-full transition-colors relative ${enabled ? 'bg-primary-500' : 'bg-white/10'}`}
        >
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
    </div>
);

const Select = ({ label, options, value, onChange }) => (
    <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary-500/50"
        >
            {options.map(opt => (
                <option key={opt} value={opt} className="bg-navy-900">{opt}</option>
            ))}
        </select>
    </div>
);

const SettingsPanel = () => {
    const [darkMode, setDarkMode] = useState(true);
    const [notifications, setNotifications] = useState(true);
    const [model, setModel] = useState('Gemini 1.5 Pro');

    return (
        <div className="max-w-4xl mx-auto p-6 overflow-y-auto custom-scrollbar h-full">
            <div className="mb-6">
                <h2 className="text-2xl font-bold">Settings</h2>
                <p className="text-gray-400 text-sm">Configure your AI assistant preferences.</p>
            </div>

            <Section title="General Appearance" icon={Moon}>
                <Toggle
                    label="Dark Mode"
                    description="Use the dark glassmorphic theme."
                    enabled={darkMode}
                    onChange={setDarkMode}
                />
                <div className="h-px bg-white/5" />
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">Accent Color</label>
                    <div className="flex gap-2">
                        {['indigo', 'violet', 'fuchsia', 'emerald', 'blue'].map(c => (
                            <button key={c} className={`w-8 h-8 rounded-full bg-${c}-500 border-2 ${c === 'indigo' ? 'border-white' : 'border-transparent'} hover:scale-110 transition-transform`} />
                        ))}
                    </div>
                </div>
            </Section>

            <Section title="AI Model Configuration" icon={Code}>
                <Select
                    label="Primary Model"
                    value={model}
                    onChange={setModel}
                    options={['Gemini 1.5 Pro', 'Gemini 1.5 Flash', 'GPT-4 Turbo', 'Claude 3 Opus']}
                />
                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span>Response Creativity</span>
                        <span className="text-primary-400">0.7</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.1" className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span>Context Window</span>
                        <span className="text-primary-400">128k</span>
                    </div>
                    <input type="range" min="32" max="1000" step="32" className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                </div>
            </Section>

            <Section title="Data & Privacy" icon={Lock}>
                <Toggle
                    label="Allow Training Data"
                    description="Help improve the model by sharing anonymized chats."
                    enabled={false}
                    onChange={() => { }}
                />
                <div className="h-px bg-white/5" />
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-medium text-red-400">Clear Memory</p>
                        <p className="text-xs text-gray-400">Delete all stored conversation context.</p>
                    </div>
                    <GlowButton variant="secondary" className="!bg-red-500/10 !text-red-400 !border-red-500/20 hover:!bg-red-500/20">
                        <Trash2 size={16} /> Clear Data
                    </GlowButton>
                </div>
            </Section>
        </div>
    );
};

export default SettingsPanel;
