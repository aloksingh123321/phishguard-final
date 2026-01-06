import { Github, Twitter, Shield } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-black/40 backdrop-blur-xl mt-20">
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Brand Column */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white font-bold text-lg">
                        <Shield className="w-6 h-6 text-cyan-400" />
                        <span>PhishGuard Pro</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Enterprise-grade phishing detection powered by advanced heuristic AI.
                        Securing the digital frontier, one URL at a time.
                    </p>
                </div>

                {/* Links Column 1 */}
                <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h3>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li><a href="#" className="hover:text-cyan-400 transition-colors">Feature Tour</a></li>
                        <li><a href="#" className="hover:text-cyan-400 transition-colors">API Access</a></li>
                        <li><a href="#" className="hover:text-cyan-400 transition-colors">Enterprise Plans</a></li>
                    </ul>
                </div>

                {/* Links Column 2 */}
                <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h3>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li><a href="/privacy" className="hover:text-cyan-400 transition-colors text-left">Privacy Policy</a></li>
                        <li><a href="/terms" className="hover:text-cyan-400 transition-colors text-left">Terms of Service</a></li>
                        <li><button className="hover:text-cyan-400 transition-colors text-left">Security Audit</button></li>
                    </ul>
                </div>

                {/* Social Column */}
                <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Connect</h3>
                    <div className="flex gap-4">
                        <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-cyan-400 transition-all">
                            <Github className="w-5 h-5" />
                        </a>
                        <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-cyan-400 transition-all">
                            <Twitter className="w-5 h-5" />
                        </a>
                    </div>
                </div>

            </div>
            <div className="border-t border-white/5 py-6 text-center text-xs text-slate-600">
                © 2026 Alok Singh. All rights reserved. System Version 2.0.4 [Stable]
            </div>
        </footer>
    );
}
