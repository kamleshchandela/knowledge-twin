import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Hash, Calendar, Search, Network } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Badge from '../ui/Badge';

const memories = [
    { id: 1, content: "User prefers dark mode and high contrast interfaces.", type: 'Preference', confidence: 0.98, date: '2 days ago' },
    { id: 2, content: "Project Titan deadline is set for Q3 2025.", type: 'Fact', confidence: 0.95, date: '1 week ago' },
    { id: 3, content: "Marketing team contact is Sarah Jenkins.", type: 'Entity', confidence: 0.88, date: '2 weeks ago' },
    { id: 4, content: "Budget constraints for the new campaign are $50k.", type: 'Constraint', confidence: 0.92, date: '3 days ago' },
    { id: 5, content: "Competitor Analysis report is located in the shared drive.", type: 'Location', confidence: 0.85, date: 'Yesterday' },
    { id: 6, content: "User is working on a React + Vite + Tailwind stack.", type: 'Context', confidence: 0.99, date: 'Just now' },
];

const MemoryView = () => {
    return (
        <div className="flex flex-col h-full p-6 space-y-6 overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold">Memory Bank</h2>
                    <p className="text-gray-400 text-sm">Long-term knowledge storage and retrieval.</p>
                </div>
                <div className="flex items-center gap-2 text-primary-400 bg-primary-500/10 px-3 py-1.5 rounded-lg border border-primary-500/20">
                    <Network size={16} />
                    <span className="text-xs font-medium">Graph View Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Memory Search */}
                <GlassCard className="col-span-full !p-4 flex items-center gap-3">
                    <Search className="text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search memories..."
                        className="bg-transparent border-none outline-none text-white w-full placeholder:text-gray-500"
                    />
                </GlassCard>

                {memories.map((mem, index) => (
                    <motion.div
                        key={mem.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <GlassCard hoverEffect className="h-full flex flex-col">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-white/5 rounded-lg text-accent-400">
                                        <Brain size={16} />
                                    </div>
                                    <Badge variant="neutral">{mem.type}</Badge>
                                </div>
                                <span className="text-xs text-gray-500">{mem.date}</span>
                            </div>
                            <p className="text-gray-200 mb-4 flex-1">"{mem.content}"</p>
                            <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-3 border-t border-white/5">
                                <div className="flex items-center gap-1">
                                    <Hash size={12} />
                                    <span>ID: {mem.id}</span>
                                </div>
                                <span className="text-green-400">{Math.round(mem.confidence * 100)}% Confidence</span>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default MemoryView;
