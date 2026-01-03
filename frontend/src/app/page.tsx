'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck, Activity, PieChart as PieChartIcon, AlertTriangle } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import Link from 'next/link';
import ResultCard from '../components/ResultCard';

interface ScanResult {
    url: string;
    is_phishing: boolean;
    confidence_score: number;
    risk_level: string;
    // Keeping status/insights to prevent build errors in ResultCard component
    status: string;
    insights?: any[];
    timestamp?: string;
}

export default function Home() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [scanStatus, setScanStatus] = useState('');
    const [result, setResult] = useState<ScanResult | null>(null);
    const [history, setHistory] = useState([]);

    // Fetch History on Mount
    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            console.log("Fetching history from http://127.0.0.1:8000/api/history...");
            const res = await fetch('http://127.0.0.1:8000/api/history');

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`HTTP error! status: ${res.status} - ${errorText}`);
            }

            const data = await res.json();
            console.log("History loaded:", data);
            setHistory(data);
        } catch (e) {
            console.error("Failed to load history:", e);
            toast.error("Failed to load history from backend");
        }
    };

    // Calculate Stats for Chart - Logic Update for Caution
    const statsData = useMemo(() => {
        let safe = 0;
        let caution = 0;
        let critical = 0;

        history.forEach((item: any) => {
            const risk = item.risk_level?.toUpperCase() || 'UNKNOWN';

            if (risk === 'SAFE' || risk === 'LOW' || risk === 'VERIFIED') {
                safe++;
            } else if (risk === 'CAUTION' || risk === 'MEDIUM' || risk === 'UNVERIFIED') {
                caution++;
            } else {
                critical++; // High, Critical, or anything else
            }
        });

        // Filter out zero values to avoid empty chart segments
        const data = [
            { name: 'Safe', value: safe, color: '#10b981' },    // Emerald-500
            { name: 'Caution', value: caution, color: '#f59e0b' }, // Amber-500
            { name: 'Critical', value: critical, color: '#ef4444' }, // Red-500
        ];
        return data.filter(d => d.value > 0);
    }, [history]);

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;
        setLoading(true);
        setResult(null);

        // Sequence Animation
        const sequence = [
            "🚀 Initializing Security Protocols...",
            "📡 Resolving DNS Records...",
            "🔓 Decrypting SSL Certificates...",
            "🤖 Analyzing Threat Vectors..."
        ];

        for (const status of sequence) {
            setScanStatus(status);
            await new Promise(r => setTimeout(r, 800));
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });
            const data = await response.json();
            setResult(data);

            // Notification Logic
            if (data.risk_level === 'SAFE') toast.success("Scan Complete: Domain Verified Safe");
            else if (data.risk_level === 'CAUTION') toast.warning("Scan Complete: Proceed with Caution");
            else toast.error("Scan Complete: Threat Detected");

            fetchHistory();
        } catch (error) {
            console.error('Error scanning URL:', error);
            toast.error("Error connecting to scanner engine");
        } finally {
            setLoading(false);
            setScanStatus('');
        }
    };

    // Restore History Item to Main View
    const restoreHistoryItem = (item: any) => {
        // Construct a safe result object, handling missing fields
        const safeRisk = item.risk_level?.toUpperCase() || 'UNKNOWN';

        // Infer boolean flags if missing (DB doesn't store them)
        const isSafe = safeRisk === 'SAFE' || safeRisk === 'LOW' || safeRisk === 'VERIFIED';
        const isPhishing = !isSafe && safeRisk !== 'CAUTION' && safeRisk !== 'MEDIUM' && safeRisk !== 'UNVERIFIED';

        setResult({
            url: item.url,
            is_phishing: isPhishing,
            confidence_score: item.confidence_score || 0, // Default to 0 if missing
            risk_level: item.risk_level,
            status: item.status,
            insights: item.insights || [],
            timestamp: item.timestamp
        });

        // Sync URL with Selected History Item
        setUrl(item.url);

        // Scroll to top to show the card
        window.scrollTo({ top: 0, behavior: 'smooth' });
        toast.info("Historical Report Loaded");
    };

    return (
        <main className="min-h-screen w-full flex flex-col items-center justify-start p-8 relative overflow-x-hidden bg-slate-950 bg-cyber-grid text-slate-200 font-sans selection:bg-cyan-500/30">
            <Toaster position="top-center" richColors theme="dark" />

            {/* Background Effects (Static/Subtle) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

            {/* --- SECTION 1: SCANNER --- */}
            {/* STRICTLY STATIC AFTER LOAD: No infinite animations */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-xl glass-panel rounded-2xl shadow-2xl overflow-hidden relative z-10 mb-12"
            >
                {/* Header */}
                <div className="p-8 pb-6 text-center border-b border-white/10">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-4 shadow-lg shadow-cyan-500/10 border border-cyan-500/20">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">PhishGuard Pro</h1>
                    <p className="text-sm text-slate-400 mt-2">
                        Enterprise-Grade AI Threat Detection Engine
                    </p>
                </div>

                {/* Input Form */}
                <div className="p-8 pt-6 bg-black/20">
                    <form onSubmit={handleScan} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="url-input" className="text-xs font-semibold text-cyan-400 uppercase tracking-wider ml-1">
                                Target Endpoint
                            </label>
                            <div className="relative group">
                                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    id="url-input"
                                    type="text"
                                    placeholder="https://example.com"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="input-clean pl-10 h-12 text-base bg-slate-900/50 border-slate-700/50 focus:border-cyan-500/50 focus:bg-slate-900/80 transition-all font-mono"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !url}
                            className="btn-primary w-full h-12 text-base font-semibold bg-cyan-600 hover:bg-cyan-500 border-none text-white shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2 animate-pulse">
                                    <Activity className="w-4 h-4" /> {scanStatus}
                                </span>
                            ) : 'Initialize Scan Sequence'}
                        </button>
                    </form>

                    {/* Result Interface */}
                    <AnimatePresence mode="wait">
                        {result && !loading && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-6"
                            >
                                <ResultCard result={result} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>


            {/* --- SECTION 2: ANALYTICS & DASHBOARD --- */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6"
            >

                {/* 2A. HISTORY TABLE (Spans 2 cols) */}
                <div className="lg:col-span-2 glass-panel rounded-xl border border-white/10 overflow-hidden flex flex-col h-[450px]">
                    <div className="p-4 border-b border-white/10 bg-black/40 flex items-center justify-between backdrop-blur-md">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-cyan-400" /> Live Threat Feed
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-xs text-slate-400 font-mono">SYSTEM ONLINE</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20">
                        <table className="w-full text-sm text-left text-slate-400">
                            <thead className="text-xs text-slate-500 uppercase bg-black/60 sticky top-0 backdrop-blur-md z-10">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Time</th>
                                    <th className="px-6 py-3 font-medium">Target</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium">Risk</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {history.map((scan: any) => (
                                    <tr
                                        key={scan.id}
                                        onClick={() => restoreHistoryItem(scan)}
                                        className="hover:bg-cyan-900/10 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] group border-b border-transparent hover:border-cyan-500/20"
                                        title="Click to view full security report"
                                    >
                                        <td className="px-6 py-3 font-mono text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">
                                            {scan.timestamp ? scan.timestamp.split(' ')[1] : '--:--'}
                                        </td>
                                        <td className="px-6 py-3 font-medium text-slate-300 truncate max-w-[200px] group-hover:text-white transition-colors">
                                            {scan.url}
                                        </td>
                                        <td className="px-6 py-3">
                                            {scan.status === 'VERIFIED ENTITY' ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    VERIFIED
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                                                    ANALYZED
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 font-bold">
                                            {getRiskBadge(scan.risk_level)}
                                        </td>
                                    </tr>
                                ))}
                                {history.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-600 italic">
                                            No scans recorded yet. Initialize a scan to begin.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 2B. ANALYTICS CHART (Spans 1 col) */}
                <div className="glass-panel rounded-xl border border-white/10 overflow-hidden flex flex-col h-[450px]">
                    <div className="p-4 border-b border-white/10 bg-black/40 backdrop-blur-md">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <PieChartIcon className="w-5 h-5 text-purple-400" /> Threat Analytics
                        </h2>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center bg-black/20 p-4 relative">
                        {statsData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statsData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {statsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-slate-500 text-sm">No data to display</div>
                        )}

                        {/* Centered Label */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-white">{history.length}</span>
                            <span className="text-xs text-slate-400 uppercase tracking-widest">Total Scans</span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="p-4 bg-black/40 border-t border-white/5 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-slate-300"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Safe / Verified</span>
                            <span className="font-mono">{statsData.find(d => d.name === 'Safe')?.value || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-slate-300"><span className="w-2 h-2 rounded-full bg-amber-500" /> Caution / Unverified</span>
                            <span className="font-mono">{statsData.find(d => d.name === 'Caution')?.value || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-slate-300"><span className="w-2 h-2 rounded-full bg-red-500" /> Critical Threat</span>
                            <span className="font-mono">{statsData.find(d => d.name === 'Critical')?.value || 0}</span>
                        </div>
                    </div>
                </div>

            </motion.div>

            {/* Footer Admin Link */}
            <div className="fixed bottom-4 right-4 z-50">
                <Link href="/admin" className="px-3 py-1 rounded bg-black/60 border border-white/5 text-[10px] text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all uppercase font-bold tracking-widest backdrop-blur-sm">
                    Admin Console_
                </Link>
            </div>
        </main>
    );
}

// Stats Badge Helper with Yellow Logic
function getRiskBadge(level: string) {
    if (!level) return <span className="text-slate-500">UNKNOWN</span>;
    const l = level.toUpperCase();
    if (l === 'SAFE' || l === 'LOW' || l === 'VERIFIED') return <span className="text-emerald-400 font-bold tracking-wide">SAFE</span>;
    if (l === 'CAUTION' || l === 'MEDIUM' || l === 'UNVERIFIED') {
        return (
            <span className="text-amber-400 font-bold tracking-wide flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> CAUTION
            </span>
        );
    }
    return <span className="text-red-500 font-bold tracking-wide drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">CRITICAL</span>;
}
