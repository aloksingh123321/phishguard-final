import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function Header() {
    return (
        <header className="fixed top-0 w-full z-50 glass-nav transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                        <ShieldCheck className="w-8 h-8 text-cyan-400 relative z-10" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                        PhishGuard<span className="text-cyan-400">Pro</span>
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#hero" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Hero</Link>
                    <Link href="#detection" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Intelligence</Link>
                    <Link href="#analytics" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Analytics</Link>
                    <Link href="#contact" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Contact</Link>
                </nav>

                {/* Action Button */}
                <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold hover:bg-cyan-500/20 transition-all hover:scale-105 active:scale-95">
                    <span>Enterprise Login</span>
                </button>
            </div>
        </header>
    );
}
