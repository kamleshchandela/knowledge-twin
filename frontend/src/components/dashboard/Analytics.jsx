import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Activity, Database, Zap, Users, ArrowUp, ArrowDown } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Badge from '../ui/Badge';

const data = [
    { name: 'Mon', queries: 400, docs: 240 },
    { name: 'Tue', queries: 300, docs: 139 },
    { name: 'Wed', queries: 200, docs: 980 },
    { name: 'Thu', queries: 278, docs: 390 },
    { name: 'Fri', queries: 189, docs: 480 },
    { name: 'Sat', queries: 239, docs: 380 },
    { name: 'Sun', queries: 349, docs: 430 },
];

const modelUsage = [
    { name: 'GPT-4', value: 400, color: '#6366f1' },
    { name: 'Gemini', value: 300, color: '#8b5cf6' },
    { name: 'Claude', value: 300, color: '#ec4899' },
    { name: 'Llama', value: 200, color: '#10b981' },
];

const StatCard = ({ icon: Icon, label, value, trend, trendValue, color }) => (
    <GlassCard hoverEffect>
        <div className="flex justify-between items-start">
            <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400`}>
                <Icon size={24} />
            </div>
            <Badge variant={trend === 'up' ? 'success' : 'error'} className="flex items-center gap-1">
                {trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {trendValue}
            </Badge>
        </div>
        <div className="mt-4">
            <h3 className="text-3xl font-bold text-white">{value}</h3>
            <p className="text-sm text-gray-400 mt-1">{label}</p>
        </div>
    </GlassCard>
);

const Analytics = ({ stats }) => {
    // Default values if stats is undefined
    const { total_queries = 0, docs_indexed = 0, active_users = 1, avg_latency_ms = 45 } = stats || {};

    return (
        <div className="flex flex-col h-full p-6 space-y-6 overflow-y-auto custom-scrollbar">
            <div>
                <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
                <p className="text-gray-400 text-sm">Real-time insights into AI performance and usage.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Activity} label="Total Queries" value={total_queries} trend="up" trendValue="+1" color="primary" />
                <StatCard icon={Database} label="Documents Indexed" value={docs_indexed} trend="up" trendValue="+1" color="accent" />
                <StatCard icon={Zap} label="Avg. Latency" value={`${avg_latency_ms}ms`} trend="down" trendValue="-2%" color="green" />
                <StatCard icon={Users} label="Active Users" value={active_users} trend="up" trendValue="+0%" color="blue" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard className="h-[400px]">
                    <h3 className="font-semibold mb-6">Query Volume</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="queries" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorQueries)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </GlassCard>

                <GlassCard className="h-[400px]">
                    <h3 className="font-semibold mb-6">Model Usage Distribution</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={modelUsage} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={true} vertical={false} />
                            <XAxis type="number" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} width={60} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                                {modelUsage.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </GlassCard>
            </div>
        </div>
    );
};

export default Analytics;
