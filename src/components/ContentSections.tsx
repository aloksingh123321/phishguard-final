import { Terminal, Database, Cpu, Send, ShieldAlert, Fingerprint } from 'lucide-react';

export default function ContentSections() {
    return (
        <>
            {/* --- INTELLIGENCE SECTION --- */}
            <section id="detection" className="py-32 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Core <span className="text-gradient">Intelligence Areas</span></h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            Our heuristic engine analyzes over 30+ data points per scan to determine threat levels with military-grade precision.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="glass-card p-10 rounded-3xl group hover:-translate-y-2 transition-all duration-500 border-t border-white/10">
                            <div className="w-16 h-16 bg-violet-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-violet-500/20 transition-colors border border-violet-500/20">
                                <Fingerprint className="w-8 h-8 text-violet-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-violet-300 transition-colors">Brand Impersonation</h3>
                            <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                Detects homograph attacks (e.g., <code className="text-xs bg-white/10 px-1 rounded">g00gle.com</code> vs <code className="text-xs bg-white/10 px-1 rounded">google.com</code>) targeting High Value Brands like PayPal, Amazon, and Microsoft.
                            </p>
                            <ul className="space-y-2 text-xs text-slate-500 font-mono">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-violet-500 rounded-full" /> Levenshtein Distance</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-violet-500 rounded-full" /> IDN Homograph check</li>
                            </ul>
                        </div>

                        {/* Feature 2 */}
                        <div className="glass-card p-10 rounded-3xl group hover:-translate-y-2 transition-all duration-500 border-t border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-[20%] bg-cyan-500/5 blur-[50px] rounded-full pointer-events-none" />
                            <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-cyan-500/20 transition-colors border border-cyan-500/20">
                                <Cpu className="w-8 h-8 text-cyan-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">Entropy Analysis</h3>
                            <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                Flags high-entropy subdomains typical of <span className="text-white font-semibold">DGA (Domain Generation Algorithms)</span> used by botnets and ephemeral phishing kits.
                            </p>
                            <div className="w-full bg-slate-800/50 rounded-lg h-1.5 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-[85%]" />
                            </div>
                            <span className="text-[10px] text-cyan-400 mt-2 block font-mono">Shannon Entropy Risk Detection > 3.5</span>
                        </div>

                        {/* Feature 3 */}
                        <div className="glass-card p-10 rounded-3xl group hover:-translate-y-2 transition-all duration-500 border-t border-white/10">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-500/20 transition-colors border border-emerald-500/20">
                                <Database className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors">Serverless Persistence</h3>
                            <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                Architected for Vercel Serverless with SQLite fallback strategy, ensuring every threat scan is logged and auditable in real-time.
                            </p>
                            <ul className="space-y-2 text-xs text-slate-500 font-mono">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> /tmp write access</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> 500ms transaction speed</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CONTACT SECTION --- */}
            <section id="contact" className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-900/10 pointer-events-none" />

                <div className="max-w-4xl mx-auto px-6 relative z-10 glass-card rounded-3xl p-12 border border-white/10 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-4">Request Access</h2>
                            <p className="text-slate-400 leading-relaxed mb-8">
                                Need deeper insights or API access for your enterprise? Contact our security team directly.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-sm text-slate-300">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"><Terminal className="w-4 h-4" /></div>
                                    <span>Direct Engineering Support</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-300">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"><ShieldAlert className="w-4 h-4" /></div>
                                    <span>False Positive Resolution</span>
                                </div>
                            </div>
                        </div>

                        <form className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Work Email</label>
                                <input type="email" className="input-clean bg-black/40 border-slate-700 h-12" placeholder="security@company.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inquiry Type</label>
                                <select className="input-clean bg-black/40 border-slate-700 h-12">
                                    <option>API Access</option>
                                    <option>Report False Positive</option>
                                    <option>Enterprise Plan</option>
                                </select>
                            </div>
                            <button type="button" className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 text-white font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 group">
                                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                Submit Request
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
