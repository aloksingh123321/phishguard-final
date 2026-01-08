import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Privacy() {
    return (
        <main className="min-h-screen bg-[#0a0a0f] text-slate-200">
            <Header />
            <div className="max-w-4xl mx-auto px-6 py-32">
                <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
                <div className="space-y-6 text-slate-400 leading-relaxed glass-panel p-8 rounded-2xl">
                    <p><strong>Last Updated: January 2026</strong></p>

                    <h2 className="text-xl font-semibold text-white mt-8">1. Information Collection</h2>
                    <p>We collect information about the URLs you scan to provide our security services. We do not collect personal identifiable information (PII) unless you voluntarily provide it via our contact forms.</p>

                    <h2 className="text-xl font-semibold text-white mt-8">2. Data Usage</h2>
                    <p>Scanned URLs are analyzed and stored in our secure database to improve our threat intelligence engine. This data helps us faster identify zero-day phishing attacks.</p>

                    <h2 className="text-xl font-semibold text-white mt-8">3. Data Security</h2>
                    <p>We implement a variety of security measures to maintain the safety of your data. Our database uses encryption at rest and in transit.</p>

                    <h2 className="text-xl font-semibold text-white mt-8">4. Third-Party Disclosure</h2>
                    <p>We do not sell, trade, or otherwise transfer your Personally Identifiable Information to outside parties.</p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
