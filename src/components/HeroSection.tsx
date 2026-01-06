'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function HeroSection({ children }: { children: React.ReactNode }) {
    return (
        <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-4 overflow-hidden">
            {/* Background Animations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px] -z-10 animate-pulse-glow" />
            <div className="absolute top-0 w-full h-full bg-grid-pattern opacity-20 -z-10" />

            {/* 3D Shield Element (Abstracted with CSS) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="mb-8 relative"
            >
                <div className="relative w-32 h-32 flex items-center justify-center">
                    <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full animate-spin-slow" />
                    <div className="absolute inset-2 border-2 border-dashed border-violet-500/30 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 backdrop-blur-md flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.4)] animate-float">
                        <ShieldCheck className="w-12 h-12 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                    </div>
                </div>
            </motion.div>

            {/* Typography */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-center max-w-4xl space-y-6 mb-12"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm mb-4">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    <span className="text-xs font-mono text-cyan-400 tracking-wider">SYSTEM ACTIVE // V2.0</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
                    Next-Gen AI <br />
                    <span className="text-gradient hover:scale-105 transition-transform inline-block cursor-default">Threat Intelligence</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed text-balance">
                    Detect sophisticated phishing attacks, brand impersonation, and zero-day threats with our enterprise-grade heuristic engine.
                </p>
            </motion.div>

            {/* Scanner Slot - (Input form passed as children) */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="w-full max-w-2xl relative z-20"
            >
                {children}
            </motion.div>
        </section>
    );
}
