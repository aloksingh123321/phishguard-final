'use client';
import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

export default function Contact() {
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

    const form = useRef<HTMLFormElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        // EMAILJS CONFIGURATION
        // REPLACE THESE PLACEHOLDERS WITH YOUR ACTUAL EMAILJS KEYS
        // 1. Sign up at https://www.emailjs.com/
        // 2. Create a new Email Service (e.g., Gmail) -> Get Service ID
        // 3. Create a new Email Template -> Get Template ID
        //    (Template should accept {{user_name}}, {{user_email}}, {{message}})
        // 4. Go to Account > API Keys -> Get Public Key

        const SERVICE_ID = 'YOUR_SERVICE_ID'; // e.g., 'service_gmail'
        const TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // e.g., 'template_phishguard'
        const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

        // Check if placeholders are still present to avoid error
        if (SERVICE_ID === 'YOUR_SERVICE_ID') {
            // Simulator Mode if keys aren't set yet
            setTimeout(() => {
                console.log("Simulating EmailJS success (Keys not configured)");
                setStatus('sent');
            }, 1500);
            return;
        }

        if (form.current) {
            emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
                .then((result) => {
                    console.log('Email sent:', result.text);
                    setStatus('sent');
                }, (error) => {
                    console.log('Email error:', error.text);
                    setStatus('idle'); // Allow retry
                    alert("Failed to send message. Please check your network or API keys.");
                });
        }
    };

    return (
        <main className="min-h-screen bg-[#0a0a0f] text-slate-200">
            <Header />
            <div className="relative pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Info Column */}
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
                            Let's Talk <br />
                            <span className="text-cyan-400">Security</span>
                        </h1>
                        <p className="text-lg text-slate-400 mb-8 max-w-md">
                            Have a question about our API, enterprise integration, or just want to report a bug? We're here to help.
                        </p>

                        <div className="space-y-6">
                            {[
                                { icon: Mail, label: "support@phishguard.ai", href: "mailto:support@phishguard.ai" },
                                { icon: Phone, label: "+1 (555) 123-4567", href: "#" },
                                { icon: MapPin, label: "San Francisco, CA", href: "#" }
                            ].map((item, i) => (
                                <a key={i} href={item.href} className="flex items-center gap-4 text-slate-300 hover:text-cyan-400 transition-colors p-4 glass rounded-xl border border-white/5 hover:border-cyan-500/20">
                                    <item.icon size={20} className="text-cyan-500" />
                                    <span className="font-medium">{item.label}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Form Column */}
                    <div className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                        {status === 'sent' ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4">
                                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6">
                                    <Send size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                                <p className="text-slate-400">We'll get back to you within 24 hours.</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="mt-8 text-cyan-400 text-sm font-semibold hover:text-cyan-300"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form ref={form} onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">First Name</label>
                                        <input required name="user_name" type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="John" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Last Name</label>
                                        <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="Doe" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                                    <input required name="user_email" type="email" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="john@company.com" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Message</label>
                                    <textarea required name="message" rows={4} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="How can we help?"></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="w-full py-4 bg-gradient-to-r from-cyan-600 to-violet-600 rounded-xl text-white font-bold text-sm uppercase tracking-wider hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50"
                                >
                                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>

                </div>
            </div>
            <Footer />
        </main>
    );
}
