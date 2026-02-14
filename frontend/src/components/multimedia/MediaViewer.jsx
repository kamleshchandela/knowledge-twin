import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Upload, Maximize2, FileText, Image as ImageIcon } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import GlowButton from '../ui/GlowButton';
import Badge from '../ui/Badge';

import { uploadFile } from '../../services/api';

const MediaViewer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const fileInputRef = React.useRef(null);
    const [isUploading, setIsUploading] = React.useState(false);

    const handleFileSelect = async (e) => {
        if (e.target.files && e.target.files[0]) {
            setIsUploading(true);
            try {
                await uploadFile(e.target.files[0]);
                alert("Media uploaded successfully! Summary generated in Chat.");
            } catch (error) {
                alert("Upload failed.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    return (
        <div className="flex flex-col h-full p-6 gap-6 overflow-y-auto custom-scrollbar">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,video/*,audio/*"
                onChange={handleFileSelect}
            />
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold">Multimedia Lab</h2>
                    <p className="text-gray-400 text-sm">Analyze audio, video, and images with AI.</p>
                </div>
                <div className="flex gap-2">
                    <GlowButton variant="secondary" className="!px-3 !py-2 text-sm">
                        <ImageIcon size={16} /> Image
                    </GlowButton>
                    <GlowButton
                        variant="primary"
                        className="!px-3 !py-2 text-sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        <Upload size={16} /> {isUploading ? 'Uploading...' : 'Upload'}
                    </GlowButton>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                {/* Main Player Area */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <GlassCard className="flex-1 relative !p-0 bg-black/40 flex items-center justify-center group">
                        {/* Mock Video Content */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                        <div className="text-center z-10">
                            <Play size={64} className="text-white/80 fill-current opacity-80 group-hover:scale-110 transition-transform cursor-pointer" />
                        </div>

                        {/* Controls */}
                        <div className="absolute bottom-0 left-0 w-full p-4 space-y-2">
                            {/* Timeline */}
                            <div className="w-full h-1 bg-white/20 rounded-full cursor-pointer group/timeline">
                                <div className="w-[35%] h-full bg-primary-500 rounded-full relative">
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/timeline:opacity-100 shadow-lg" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-white">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-primary-400 transition-colors">
                                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                    </button>
                                    <SkipBack size={18} className="text-gray-400 hover:text-white cursor-pointer" />
                                    <SkipForward size={18} className="text-gray-400 hover:text-white cursor-pointer" />
                                    <span className="text-xs font-mono">04:12 / 12:45</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Volume2 size={18} className="cursor-pointer" />
                                    <Maximize2 size={18} className="cursor-pointer" />
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Timeline Analysis */}
                    <GlassCard className="h-32 relative overflow-hidden">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">AI Analysis Timeline</h3>
                        <div className="flex items-center gap-2 h-16 overflow-x-auto custom-scrollbar">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="min-w-[120px] h-full bg-white/5 rounded border border-white/5 flex flex-col justify-center p-2 hover:bg-white/10 cursor-pointer transition-colors">
                                    <span className="text-[10px] text-primary-400">02:1{i}</span>
                                    <span className="text-xs text-gray-300 truncate">Object Detected</span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* Sidebar info */}
                <div className="flex flex-col gap-4">
                    <GlassCard className="flex-1">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText size={18} className="text-accent-400" />
                            <h3 className="font-semibold">Transcript</h3>
                        </div>
                        <div className="space-y-4 text-sm text-gray-300 h-[400px] overflow-y-auto custom-scrollbar pr-2">
                            <p><span className="text-primary-400 text-xs font-mono">[00:15]</span> Welcome everyone to the quarterly review.</p>
                            <p><span className="text-primary-400 text-xs font-mono">[00:22]</span> Today we will discuss the Q3 performance metrics.</p>
                            <p className="bg-white/10 p-2 rounded border border-white/10"><span className="text-primary-400 text-xs font-mono">[01:45]</span> Important: We exceeded our revenue targets by 15%.</p>
                            <p><span className="text-primary-400 text-xs font-mono">[02:10]</span> The new marketing campaign was the primary driver.</p>
                            <p><span className="text-primary-400 text-xs font-mono">[03:00]</span> Moving on to product updates...</p>
                            {/* Mock filler content */}
                            {[...Array(5)].map((_, i) => (
                                <p key={i}><span className="text-primary-400 text-xs font-mono">[0{i + 4}:00]</span> Discussion about feature {i + 1}...</p>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default MediaViewer;
