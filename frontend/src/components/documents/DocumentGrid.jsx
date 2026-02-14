import React from 'react';
import { motion } from 'framer-motion';
import { FileText, File, MoreVertical, Search, Plus, Filter, Grid, List } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import GlowButton from '../ui/GlowButton';
import Badge from '../ui/Badge';

import { uploadFile } from '../../services/api';

const DocumentGrid = ({ files = [] }) => {
    const fileInputRef = React.useRef(null);
    const [isUploading, setIsUploading] = React.useState(false);

    const handleFileSelect = async (e) => {
        if (e.target.files && e.target.files[0]) {
            setIsUploading(true);
            try {
                await uploadFile(e.target.files[0]);
                alert("File uploaded successfully! (Refresh to see changes when backend is fully connected)");
            } catch (error) {
                alert("Upload failed. Check console for details.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    return (
        <div className="flex flex-col h-full p-6 space-y-6 overflow-y-auto custom-scrollbar">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
            />
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Documents</h2>
                    <p className="text-gray-400 text-sm">Manage and analyze your knowledge base.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search files..."
                            className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary-500/50 w-64"
                        />
                    </div>
                    <GlowButton
                        variant="primary"
                        className="!px-4 !py-2"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">{isUploading ? 'Uploading...' : 'Upload'}</span>
                    </GlowButton>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {files.length > 0 ? (
                    files.map((doc, index) => (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <GlassCard hoverEffect className="h-full flex flex-col group cursor-pointer">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-white/5 rounded-lg text-primary-400 group-hover:text-primary-300 group-hover:bg-primary-500/10 transition-colors">
                                        <FileText size={24} />
                                    </div>
                                    <button className="text-gray-400 hover:text-white transition-colors">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>

                                <h3 className="font-semibold truncate mb-1" title={doc.title}>{doc.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                                    <span>{doc.size}</span>
                                    <span>•</span>
                                    <span>{doc.date}</span>
                                </div>

                                <div className="mt-auto flex flex-wrap gap-2">
                                    {doc.tags && doc.tags.map(tag => (
                                        <Badge key={tag} variant="neutral" className="!text-[10px]">{tag}</Badge>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500 py-10">
                        No documents found. Upload one to get started!
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: files.length * 0.05 }}
                >
                    <div
                        className="h-full min-h-[200px] border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 hover:border-primary-500/30 hover:bg-white/5 transition-all cursor-pointer group"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="p-4 rounded-full bg-white/5 mb-3 group-hover:text-primary-400 transition-colors">
                            <Plus size={24} />
                        </div>
                        <span className="text-sm font-medium">New Document</span>
                        <span className="text-xs text-gray-500 mt-1">Drag text, PDF, or images</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DocumentGrid;
