'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User, LogOut } from 'lucide-react';
import LoginModal from './LoginModal';

export default function Header() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [user, setUser] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = (username: string) => {
        setUser(username);
        setIsLoginOpen(false);
        router.push('/admin');
    };

    const handleLogout = () => {
        setUser(null);
        router.push('/');
    };

    return (
        <>
            <header className="fixed top-0 w-full z-50 glass-nav transition-all duration-300 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group relative">
                        <div className="relative">
                            <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 group-hover:opacity-50 transition-all duration-500" />
                            <ShieldCheck className="w-8 h-8 text-cyan-400 relative z-10 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-50 transition-colors">
                                PhishGuard<span className="text-cyan-400">Pro</span>
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-500/80 font-semibold">
                                Intelligence
                            </span>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-8 bg-black/20 px-8 py-2 rounded-full border border-white/5 backdrop-blur-md">
                        {[
                            ['Home', '#hero'],
                            ['About', '#detection'],
                            ['Analytics', '#analytics'],
                            ['Contact', '#contact']
                        ].map(([label, href]) => (
                            <Link
                                key={label}
                                href={href}
                                className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-all hover:scale-105 active:scale-95"
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* Action Button */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span>{user}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsLoginOpen(true)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-900/20 to-violet-900/20 border border-cyan-500/20 text-cyan-400 text-sm font-bold hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all group"
                            >
                                <Lock className="w-4 h-4 group-hover:text-cyan-300 transition-colors" />
                                <span>Enterprise Login</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onLogin={handleLogin}
            />
        </>
    );
}
