import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Terms() {
    return (
        <main className="min-h-screen bg-[#0a0a0f] text-slate-200">
            <Header />
            <div className="max-w-4xl mx-auto px-6 py-32">
                <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
                <div className="space-y-6 text-slate-400 leading-relaxed glass-panel p-8 rounded-2xl">
                    <p><strong>Last Updated: January 2026</strong></p>

                    <h2 className="text-xl font-semibold text-white mt-8">1. Acceptance of Terms</h2>
                    <p>By accessing PhishGuard Pro ("the Service"), you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.</p>

                    <h2 className="text-xl font-semibold text-white mt-8">2. Use License</h2>
                    <p>Permission is granted to use PhishGuard Pro for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>

                    <h2 className="text-xl font-semibold text-white mt-8">3. Disclaimer</h2>
                    <p>The materials on PhishGuard Pro are provided on an 'as is' basis. We make no warranties, expressed or implied, regarding the accuracy or reliability of the phishing detection results. Always exercise caution when visiting unknown URLs.</p>

                    <h2 className="text-xl font-semibold text-white mt-8">4. Limitations</h2>
                    <p>In no event shall PhishGuard Pro be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use the Service.</p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
