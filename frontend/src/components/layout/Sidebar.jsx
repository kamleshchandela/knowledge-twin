import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    FileText,
    Image as ImageIcon,
    Brain,
    BarChart2,
    Settings,
    Upload,
    ChevronLeft,
    ChevronRight,
    Zap
} from 'lucide-react';
import clsx from 'clsx';
import GlassCard from '../ui/GlassCard';
import GlowButton from '../ui/GlowButton';
import Badge from '../ui/Badge';

const Sidebar = ({ activeTab, setActiveTab, isMobile, isOpen, setIsOpen }) => {
    const menuItems = [
        { id: 'chat', label: 'Chat', icon: MessageSquare },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'multimedia', label: 'Multimedia Lab', icon: ImageIcon },
        { id: 'memory', label: 'Memory', icon: Brain },
        { id: 'analytics', label: 'Analytics', icon: BarChart2 },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const sidebarVariants = {
        expanded: { width: 280 },
        collapsed: { width: 80 },
    };

    return (
        <>
            {/* Mobile Toggle */}
            {isMobile && !isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed top-4 left-4 z-50 p-2 glass-button rounded-lg"
                >
                    <ChevronRight />
                </button>
            )}

            <motion.aside
                initial={false}
                animate={isMobile ? (isOpen ? { x: 0 } : { x: -300 }) : isOpen ? "expanded" : "collapsed"}
                variants={isMobile ? {} : sidebarVariants}
                className={clsx(
                    "fixed left-0 top-0 h-full z-40 bg-navy-900/50 backdrop-blur-xl border-r border-white/10 flex flex-col transition-all duration-300",
                    isMobile ? "w-72" : ""
                )}
            >
                {/* Header */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/20">
                            <Brain className="text-white w-5 h-5" />
                        </div>
                        {isOpen && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-bold text-lg tracking-tight whitespace-nowrap"
                            >
                                Knowledge<span className="text-primary-400">Twin</span>
                            </motion.span>
                        )}
                    </div>
                    {!isMobile && (
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ChevronLeft className={clsx("transition-transform", !isOpen && "rotate-180")} size={20} />
                        </button>
                    )}
                    {isMobile && (
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={clsx(
                                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                                activeTab === item.id
                                    ? "bg-primary-500/10 text-primary-400"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            {activeTab === item.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary-500/10 rounded-xl border border-primary-500/20"
                                />
                            )}
                            <item.icon
                                className={clsx(
                                    "shrink-0 transition-colors",
                                    activeTab === item.id ? "text-primary-400" : "group-hover:text-white"
                                )}
                                size={22}
                            />
                            {isOpen && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="font-medium truncate"
                                >
                                    {item.label}
                                </motion.span>
                            )}

                            {/* Active Indicator Dot */}
                            {!isOpen && activeTab === item.id && (
                                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-white/5 space-y-4">
                    {isOpen ? (
                        <GlassCard className="p-4 !bg-white/5">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-gray-400">Storage</span>
                                <span className="text-xs font-medium text-white">75%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full w-3/4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
                            </div>
                            <GlowButton variant="primary" className="w-full mt-4 text-sm py-2">
                                <Upload size={16} />
                                Upload Files
                            </GlowButton>
                        </GlassCard>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                                <Upload size={20} className="text-gray-400" />
                            </button>
                        </div>
                    )}

                    {isOpen && (
                        <div className="flex items-center gap-2 px-2">
                            <Badge variant="success" className="animate-pulse">API Online</Badge>
                            <span className="text-xs text-gray-500">v2.4.0</span>
                        </div>
                    )}
                </div>
            </motion.aside>
        </>
    );
};

export default Sidebar;
