import { Terminal, Database, Cpu, Send } from 'lucide-react';

export default function ContentSections() {
    return (
        <>
            {/* --- INTELLIGENCE SECTION --- */}
            <section id="detection" className="py-24 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Core <span className="text-cyan-400">Intelligence</span></h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">Our multi-layered detection engine combines static analysis, heuristics, and real-time threat intelligence.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="glass-card p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-12 h-12 bg-violet-500/10 rounded-lg flex items-center justify-center mb-6">
                                <Terminal className="w-6 h-6 text-violet-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Heuristic Logic</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Detects brand impersonation (e.g., g00gle.com) and homograph attacks using advanced string similarity algorithms and normalization techniques.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="glass-card p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-6">
                                <Cpu className="w-6 h-6 text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Entropy Analysis</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Analyzes subdomain randomness to flag DGA (Domain Generation Algorithm) domains used by botnets and temporary phishing kits.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="glass-card p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6">
                                <Database className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Real-time History</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Powered by Turso (libSQL) for persistent threat logging across serverless environments, enabling historical audits.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CONTACT SECTION --- */}
            <section id="contact" className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-500/5 pointer-events-none" />

                <div className="max-w-3xl mx-auto px-6 relative z-10 glass-card rounded-2xl p-10 border border-white/10">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-white">Get in Touch</h2>
                        <p className="text-slate-400 mt-2">Have a question or want to report a false positive?</p>
                    </div>

                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Name</label>
                                <input type="text" className="input-clean bg-black/40 border-slate-700" placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Email</label>
                                <input type="email" className="input-clean bg-black/40 border-slate-700" placeholder="john@example.com" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Message</label>
                            <textarea className="w-full h-32 rounded-md border border-slate-700 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="How can we help?"></textarea>
                        </div>
                        <button type="button" className="btn-primary w-full h-12 text-base bg-gradient-to-r from-cyan-600 to-cyan-500 border-none hover:opacity-90">
                            <Send className="w-4 h-4 mr-2" /> Send Message
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}
