import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, FileText, Sparkles, Cpu } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Badge from '../ui/Badge';

const RightPanel = ({ data }) => {
    const { recent_history = [], files = [] } = data || {};
    const recentFiles = files.slice(0, 3); // Top 3 files

    return (
        <aside className="w-80 h-full border-l border-white/10 bg-navy-900/40 backdrop-blur-xl p-4 hidden xl:block overflow-y-auto custom-scrollbar">
            <div className="space-y-6">

                {/* Context Intelligence */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-primary-400">
                        <Sparkles size={18} />
                        <h3 className="text-sm font-semibold uppercase tracking-wider">Context Intelligence</h3>
                    </div>

                    <GlassCard className="space-y-3">
                        {recentFiles.length > 0 ? (
                            recentFiles.map(file => (
                                <div key={file.id} className="mb-3 last:mb-0">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-primary-500/10">
                                            <FileText size={18} className="text-primary-400" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <h4 className="text-sm font-medium text-white truncate" title={file.title}>{file.title}</h4>
                                            <p className="text-xs text-gray-400 mt-1">{file.size} • {file.type}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-gray-500 italic">No files active in context.</p>
                        )}

                        <div className="h-px bg-white/5 my-2" />
                        <div className="space-y-2">
                            <p className="text-xs text-gray-400">Active Session Status:</p>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="success">Ready</Badge>
                                <Badge variant="neutral">RAG</Badge>
                            </div>
                        </div>
                    </GlassCard>
                </section>

                {/* Active Model */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-accent-400">
                        <Cpu size={18} />
                        <h3 className="text-sm font-semibold uppercase tracking-wider">Active Model</h3>
                    </div>
                    <GlassCard className="!p-4 bg-gradient-to-br from-accent-500/10 to-transparent">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-white">Gemini 1.5 Pro</span>
                            <Badge variant="success">Active</Badge>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1.5 mb-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '45%' }}
                                className="bg-accent-500 h-full rounded-full"
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>12k Context</span>
                            <span>45ms Latency</span>
                        </div>
                    </GlassCard>
                </section>

                {/* Recent Memory */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-gray-400">
                        <Clock size={18} />
                        <h3 className="text-sm font-semibold uppercase tracking-wider">Recent Memory</h3>
                    </div>
                    <div className="space-y-3">
                        {recent_history.length > 0 ? (
                            recent_history.map((msg, i) => (
                                <div key={i} className="p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5 group">
                                    <p className="text-sm text-gray-300 line-clamp-2 group-hover:text-white transition-colors">
                                        {msg.role === 'user' ? "You: " : "AI: "} {msg.content}
                                    </p>
                                    <span className="text-[10px] text-gray-500 mt-2 block">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-gray-500 italic">No recent history yet.</p>
                        )}
                    </div>
                </section>

            </div>
        </aside>
    );
};

export default RightPanel;
