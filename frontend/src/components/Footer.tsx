import Link from 'next/link';
import { Github, Twitter, Shield, CheckCircle } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-[#050508] relative overflow-hidden mt-32">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/5 blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">

                {/* Brand Column */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-white font-bold text-xl">
                        <div className="p-2 bg-cyan-500/10 rounded-lg">
                            <Shield className="w-6 h-6 text-cyan-400" />
                        </div>
                        <span>PhishGuard Pro</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                        Advanced AI-driven threat intelligence platform detecting zero-day phishing attacks with 99.9% accuracy.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full w-fit border border-emerald-500/20">
                        <CheckCircle className="w-3 h-3" />
                        <span>All Systems Operational</span>
                    </div>
                </div>

                {/* Links Column 1 */}
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-l-2 border-cyan-500 pl-3">Platform</h3>
                    <ul className="space-y-3 text-sm text-slate-400">
                        <li><a href="#detection" className="hover:text-cyan-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Technology</a></li>
                        <li><a href="#analytics" className="hover:text-cyan-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Live Analytics</a></li>
                        <li><a href="#" className="hover:text-cyan-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Enterprise API</a></li>
                    </ul>
                </div>

                {/* Links Column 2 */}
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-l-2 border-violet-500 pl-3">Legal</h3>
                    <ul className="space-y-3 text-sm text-slate-400">
                        <li><Link href="/privacy" className="hover:text-violet-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-violet-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Terms of Service</Link></li>
                        <li><Link href="#" className="hover:text-violet-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Security Audit</Link></li>
                    </ul>
                </div>

                {/* Social Column */}
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-l-2 border-amber-500 pl-3">Company</h3>
                    <ul className="space-y-3 text-sm text-slate-400 mb-6">
                        <li><Link href="/about" className="hover:text-amber-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">About Us</Link></li>
                        <li><Link href="/contact" className="hover:text-amber-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Contact Support</Link></li>
                    </ul>
                    <div className="flex gap-4">
                        <a href="#" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 hover:text-white hover:scale-110 transition-all border border-white/5 hover:border-white/20">
                            <Github className="w-5 h-5" />
                        </a>
                        <a href="#" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 hover:text-cyan-400 hover:scale-110 transition-all border border-white/5 hover:border-cyan-500/30">
                            <Twitter className="w-5 h-5" />
                        </a>
                    </div>
                </div>

            </div>

            <div className="border-t border-white/5 py-8 text-center">
                <p className="text-xs text-slate-600 font-mono">
                    © 2026 Alok Singh. All rights reserved. <span className="text-slate-500">v2.2.0-Enterprise (Monolith)</span>
                </p>
            </div>
        </footer>
    );
}
