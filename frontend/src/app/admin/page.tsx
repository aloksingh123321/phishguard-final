'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, Database, Trash2, Download, Search, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminPage() {
    const [stats, setStats] = useState({ total: 0, high_risk: 0, verified: 0 });
    const [history, setHistory] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
        fetchStats();
    }, []);

    const fetchData = async () => {
        const res = await fetch('http://localhost:8000/admin/all-data');
        const data = await res.json();
        setHistory(data);
    };

    const fetchStats = async () => {
        const res = await fetch('http://localhost:8000/admin/stats');
        const data = await res.json();
        setStats(data);
    };

    const handleClearLogs = async () => {
        if (!confirm("⚠️ ARE YOU SURE? This will delete ALL scan history permanently.")) return;
        await fetch('http://localhost:8000/admin/clear-logs', { method: 'DELETE' });
        fetchData();
        fetchStats();
    };

    const handleExport = () => {
        window.open('http://localhost:8000/admin/export', '_blank');
    };

    const filteredHistory = history.filter((item: any) =>
        item.url.toLowerCase().includes(search.toLowerCase()) ||
        item.risk_level.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500/30">
            {/* Cyber Grid Background */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            {/* Topbar */}
            <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
                            <LayoutDashboard className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            PhishGuard <span className="text-cyan-400">Admin</span>
                        </h1>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 relative z-10">

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard icon={<Database />} label="Total Scans" value={stats.total} color="cyan" />
                    <StatCard icon={<ShieldCheck />} label="Verified Safe" value={stats.verified} color="emerald" />
                    <StatCard icon={<AlertTriangle />} label="High Risk Threats" value={stats.high_risk} color="red" />
                </div>

                {/* Main Content */}
                <div className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search Database..."
                                className="w-full bg-slate-950 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button onClick={handleExport} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm font-medium transition-colors">
                                <Download className="w-4 h-4" /> Export CSV
                            </button>
                            <button onClick={handleClearLogs} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-sm font-medium transition-colors">
                                <Trash2 className="w-4 h-4" /> Clear Database
                            </button>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-400">
                            <thead className="text-xs uppercase bg-slate-950/50 text-slate-300">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">ID</th>
                                    <th className="px-6 py-4 font-semibold">Timestamp</th>
                                    <th className="px-6 py-4 font-semibold">Target URL</th>
                                    <th className="px-6 py-4 font-semibold">Risk Level</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredHistory.map((row: any) => (
                                    <tr key={row.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-mono text-slate-600">#{row.id}</td>
                                        <td className="px-6 py-4 font-mono text-xs">{row.timestamp}</td>
                                        <td className="px-6 py-4 text-white font-medium max-w-sm truncate">{row.url}</td>
                                        <td className="px-6 py-4">
                                            <Badge value={row.risk_level} type="risk" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge value={row.status} type="status" />
                                        </td>
                                    </tr>
                                ))}
                                {filteredHistory.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-600">
                                            No records found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}

const StatCard = ({ icon, label, value, color }: any) => {
    const colorClasses: any = {
        cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        red: "text-red-400 bg-red-500/10 border-red-500/20"
    };

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className={`p-6 rounded-xl border ${colorClasses[color].split(' ')[2]} ${colorClasses[color].split(' ')[1]} backdrop-blur-sm relative overflow-hidden`}
        >
            <div className="flex items-center justify-between relative z-10">
                <div>
                    <p className="text-sm font-medium text-slate-400 mb-1">{label}</p>
                    <h3 className="text-3xl font-bold text-white">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color].split(' ')[1]}`}>
                    {React.cloneElement(icon, { className: `w-6 h-6 ${colorClasses[color].split(' ')[0]}` })}
                </div>
            </div>
        </motion.div>
    );
};

const Badge = ({ value, type }: any) => {
    let classes = "bg-slate-800 text-slate-400 border-slate-700";

    if (type === 'risk') {
        if (value === 'SAFE' || value === 'Low') classes = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        else if (value === 'Medium') classes = "bg-amber-500/10 text-amber-400 border-amber-500/20";
        else classes = "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse";
    }

    if (type === 'status') {
        if (value === 'VERIFIED') classes = "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    }

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}>
            {value}
        </span>
    );
};
