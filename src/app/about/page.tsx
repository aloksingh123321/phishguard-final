import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Shield, Users, Target } from 'lucide-react';

export default function About() {
    return (
        <main className="min-h-screen bg-[#0a0a0f] text-slate-200">
            <Header />
            <div className="relative pt-32 pb-20 px-6">
                {/* Background Effects */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] mix-blend-screen" />
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
                            Securing the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">Digital Frontier</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            PhishGuard Pro leverages advanced AI heuristics to protect millions of users from zero-day phishing attacks and social engineering.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        {[
                            {
                                icon: Shield,
                                title: "Our Mission",
                                desc: "To create a safer internet by democratizing enterprise-grade threat intelligence for everyone."
                            },
                            {
                                icon: Target,
                                title: "Precision AI",
                                desc: "Our heuristic engine analyzes over 50+ data points per URL to detect threats with 99.9% accuracy."
                            },
                            {
                                icon: Users,
                                title: "Global Community",
                                desc: "Powered by a network of security researchers and real-time data from millions of scanners."
                            }
                        ].map((item, i) => (
                            <div key={i} className="glass-card p-8 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all group">
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
                                    <item.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="glass-panel p-10 rounded-3xl text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 to-violet-900/10" />
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold text-white mb-4">Ready to secure your infrastructure?</h2>
                            <p className="text-slate-400 mb-8 max-w-xl mx-auto">Join the leading cybersecurity platform trusted by top enterprises.</p>
                            <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
                                Get Started Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
