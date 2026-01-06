'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Globe, Lock } from 'lucide-react';

export default function HeroSection({ children }: { children: React.ReactNode }) {
    return (
        <section id="hero" className="relative min-h-[110vh] flex flex-col items-center justify-center pt-32 pb-20 px-4 overflow-hidden">

            {/* --- ADVANCED BACKGROUND --- */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {/* Radial Gradients */}
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-glow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-glow" style={{ animationDelay: '2s' }} />

                {/* Grid */}
                <div className="absolute inset-0 bg-grid-pattern opacity-30 mask-gradient" />
            </div>

            {/* --- 3D FLOATING ELEMENTS --- */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-[5%] lg:left-[10%] p-3 glass rounded-xl border border-white/10 flex items-center gap-3 shadow-xl backdrop-blur-md opacity-0 lg:opacity-100"
                >
                    <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                        <Zap size={20} />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-white">Threat Blocked</div>
                        <div className="text-[10px] text-gray-400">Just now • 127.0.0.1</div>
                    </div>
                </motion.div>

                <motion.div
                    animate={{ y: [0, 30, 0], rotate: [0, -2, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-1/3 right-[5%] lg:right-[15%] p-3 glass rounded-xl border border-white/10 flex items-center gap-3 shadow-xl backdrop-blur-md opacity-0 lg:opacity-100"
                >
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-white">System Secure</div>
                        <div className="text-[10px] text-gray-400">Real-time protection</div>
                    </div>
                </motion.div>

                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute top-1/3 right-[10%] text-cyan-900/20 -z-10"
                >
                    <Globe className="w-64 h-64" />
                </motion.div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto space-y-8"
            >
                {/* Status Badge */}
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/30 backdrop-blur-md shadow-lg shadow-cyan-500/10 mb-6 group cursor-default hover:border-cyan-500/50 transition-colors">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    <span className="text-xs font-mono text-cyan-300 tracking-widest font-bold">SYSTEM ONLINE // ACTIVE</span>
                </div>

                {/* Typography */}
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.9]">
                    Advanced AI <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 animate-gradient-x bg-300% drop-shadow-2xl">
                        Threat Intelligence
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed text-balance">
                    Deploy enterprise-grade heuristics to detect <span className="text-cyan-400 font-semibold">Zero-Day Phishing</span>, <span className="text-violet-400 font-semibold">Brand Spoofing</span>, and <span className="text-fuchsia-400 font-semibold">DGA Botnets</span> in milliseconds.
                </p>

                {/* Interactive Scanner Area */}
                <div className="w-full max-w-2xl mt-12 mb-8 relative z-20">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 rounded-2xl blur-3xl opacity-30 animate-pulse-glow" />
                    {children}
                </div>

                <p className="text-xs text-slate-500 font-mono tracking-wide">
                    TRUSTED BY SECURITY TEAMS WORLDWIDE
                </p>

            </motion.div>
        </section>
    );
}
