'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Activity } from 'lucide-react';
import { Toaster, toast } from 'sonner';

// Components
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import ContentSections from '../components/ContentSections';
import ResultCard from '../components/ResultCard';

interface ScanResult {
    url: string;
    is_phishing: boolean;
    confidence_score: number;
    risk_level: string;
    status: string;
    insights?: string[];
    [key: string]: any;
}

export default function Home() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [scanStatus, setScanStatus] = useState('');
    const [result, setResult] = useState<ScanResult | null>(null);
    const [history, setHistory] = useState<any[]>([]);

    // --- LOGIC: FETCH HISTORY ---
    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/history');
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (e) {
            console.error("Failed to load history:", e);
        }
    };

    // --- LOGIC: SCAN ---
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
            await new Promise(r => setTimeout(r, 600)); // Faster 600ms
        }

        try {
            const response = await fetch('/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });
            const data = await response.json();
            setResult(data);

            if (data.risk_level === 'SAFE') toast.success("Domain Verified Safe");
            else if (data.risk_level === 'CAUTION') toast.warning("Proceed with Caution");
            else toast.error("CRITICAL THREAT DETECTED");

            fetchHistory();
        } catch (error) {
            toast.error("Error connecting to scanner engine");
        } finally {
            setLoading(false);
            setScanStatus('');
        }
    };
    // --- LOGIC: HISTORY CLICK ---
    const handleHistoryClick = (selectedUrl: string) => {
        setUrl(selectedUrl);
        // Optional: Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- LOGIC: STATS ---
    const statsData = useMemo(() => {
        let safe = 0;
        let caution = 0;
        let critical = 0;

        history.forEach((item: any) => {
            const risk = item.risk_level?.toUpperCase() || 'UNKNOWN';
            if (risk === 'SAFE' || risk === 'LOW' || risk === 'VERIFIED') safe++;
            else if (risk === 'CAUTION' || risk === 'MEDIUM' || risk === 'UNVERIFIED') caution++;
            else critical++;
        });

        const data = [
            { name: 'Safe', value: safe, color: '#10b981' },    // Emerald
            { name: 'Caution', value: caution, color: '#f59e0b' }, // Amber
            { name: 'Critical', value: critical, color: '#ef4444' }, // Red
        ];
        return data.filter(d => d.value > 0);
    }, [history]);

    return (
        <main className="min-h-screen bg-[#0a0a0f] text-slate-200">
            <Toaster position="top-center" richColors theme="dark" />

            <Header />

            {/* HERO & SCANNER WRAPPER */}
            <HeroSection>
                {/* Glass Card Container for Input */}
                <div className="glass-card p-2 rounded-2xl shadow-2xl animate-float" style={{ animationDuration: '8s' }}>
                    <form onSubmit={handleScan} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative flex items-center bg-[#0a0a0f]/80 backdrop-blur-xl rounded-xl border border-white/10 p-2 focus-within:border-cyan-500/50 transition-colors">
                            <Search className="w-6 h-6 text-slate-500 ml-3 group-focus-within:text-cyan-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Enter URL to scan (e.g., google.com)..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full bg-transparent border-none text-white px-4 py-3 focus:ring-0 placeholder:text-slate-600 text-lg font-mono disabled:opacity-50"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading || !url}
                                className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-bold tracking-wide shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-w-[140px]"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Activity className="w-4 h-4 animate-spin" /> Scanning
                                    </span>
                                ) : 'Analyze Now'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Status Bar */}
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-6 text-center"
                        >
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border border-cyan-500/20">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                                <span className="text-cyan-400 font-mono text-sm">{scanStatus}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Result Card */}
                <AnimatePresence mode="wait">
                    {result && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="mt-12 w-full"
                        >
                            <ResultCard result={result} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </HeroSection>

            {/* STATS */}
            <section id="analytics" className="relative z-10 -mt-10 px-4">
                <StatsSection data={statsData} history={history} onHistoryClick={handleHistoryClick} />
            </section>

            {/* INFO & CONTACT */}
            <ContentSections />

            <Footer />
        </main>
    );
}
