'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Globe, Lock, Shield, ShieldCheck, Eye, Terminal, Download, AlertOctagon } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ScanResponse {
    url: string;
    is_phishing: boolean;
    confidence_score: number;
    risk_level: string;
    domain_age_days?: number;
    status: string;
    insights?: string[];
}

const ResultCard = ({ result }: { result: ScanResponse }) => {
    const isSafe = result.risk_level === 'SAFE' || result.risk_level === 'Low';
    const isCaution = result.risk_level === 'CAUTION' || result.risk_level === 'Medium' || result.risk_level === 'High';
    const isVerified = result.status === 'VERIFIED';
    const safeUrl = result?.url || '';

    // PDF Generation Logic
    const handleDownloadPDF = () => {
        if (!result) {
            alert("No scan data available");
            return;
        }

        const doc = new jsPDF();

        // Dark Theme PDF not easily possible with standard jsPDF without heavy config, 
        // staying with standard white paper report for printability.
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("PhishGuard Security Report", 10, 20);
        doc.setLineWidth(0.5);
        doc.line(10, 25, 200, 25);

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");

        doc.text(`Target URL: ${safeUrl}`, 10, 40);
        doc.text(`Scan Date: ${new Date().toLocaleString()}`, 10, 50);

        doc.text("Risk Level: ", 10, 60);
        if (isSafe) doc.setTextColor(0, 128, 0);
        else if (isCaution) doc.setTextColor(255, 165, 0);
        else doc.setTextColor(255, 0, 0);

        doc.text(result.risk_level, 35, 60);
        doc.setTextColor(0, 0, 0);

        if (result.insights && result.insights.length > 0) {
            const tableBody = result.insights.map((insight) => [insight]);
            autoTable(doc, {
                startY: 70,
                head: [['Security Insights / Reasons']],
                body: tableBody,
                theme: 'grid',
                headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
            });
        }

        doc.save('PhishGuard_Report.pdf');
    };

    let statusColor = 'text-red-400';
    let bgStatus = 'bg-red-500/10';
    let borderStatus = 'border-red-500/20';
    let icon = <AlertOctagon className="w-12 h-12 text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]" />;

    if (isSafe) {
        statusColor = 'text-emerald-400';
        bgStatus = 'bg-emerald-500/10';
        borderStatus = 'border-emerald-500/20';
        icon = <ShieldCheck className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />;
    } else if (isCaution) {
        statusColor = 'text-amber-400';
        bgStatus = 'bg-amber-500/10';
        borderStatus = 'border-amber-500/20';
        icon = <Eye className="w-12 h-12 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />;
    }

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full mt-6 space-y-6"
        >
            {/* Status Banner */}
            <motion.div
                className={`flex flex-col items-center justify-center p-8 rounded-2xl border ${borderStatus} ${bgStatus} text-center backdrop-blur-md relative overflow-hidden`}
                variants={item}
            >
                <div className="absolute inset-0 bg-noise opacity-10" />

                <div className="mb-4 bg-black/20 p-4 rounded-full border border-white/5 shadow-inner">
                    {icon}
                </div>

                <h2 className={`text-3xl font-bold tracking-tight ${statusColor} flex flex-col md:flex-row items-center gap-3 uppercase`}>
                    {isSafe ? 'Verified Safe' : isCaution ? 'Caution Required' : 'Critical Threat'}
                    {isVerified && (
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase rounded-full border border-emerald-500/30 tracking-widest">
                            Verified Entity
                        </span>
                    )}
                </h2>

                <p className="text-slate-400 text-base mt-2 max-w-lg">
                    {isSafe
                        ? 'Traffic analysis confirms no malicious patterns on this domain.'
                        : isCaution
                            ? 'This domain is unverified. Do not share sensitive credentials.'
                            : 'Immediate threat detected. Block this domain immediately.'}
                </p>
            </motion.div>

            {/* Metrics Grid */}
            <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Confidence Score with SVG Gauge */}
                <div className="lg:col-span-2 p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-row items-center justify-between backdrop-blur-md relative overflow-hidden">
                    <div className="z-10">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Confidence Score</span>
                        <span className={`text-5xl font-black ${statusColor} tracking-tighter`}>{result.confidence_score}%</span>
                        <p className="text-xs text-slate-400 mt-2">AI detection certainty</p>
                    </div>
                    {/* SVG Radial Gauge */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-700/30" />
                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                                strokeDasharray={251.2}
                                strokeDashoffset={251.2 - (251.2 * result.confidence_score) / 100}
                                className={`${isSafe ? 'text-emerald-500' : isCaution ? 'text-amber-500' : 'text-red-500'} transition-all duration-1000 ease-out`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <ShieldCheck className={`w-8 h-8 absolute ${statusColor}`} />
                    </div>
                </div>

                {/* Threat Level */}
                <div className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col justify-center backdrop-blur-md">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Threat Level</span>
                    <div className={`px-4 py-2 rounded-lg text-sm font-bold tracking-widest w-fit border ${isSafe ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : isCaution ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {result.risk_level.toUpperCase()}
                    </div>
                </div>

                {/* Domain Age (Mocked if not present) */}
                <div className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col justify-center backdrop-blur-md">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Domain Age</span>
                    <span className="text-2xl font-bold text-slate-200">
                        {result.domain_age_days ? `${result.domain_age_days} Days` : 'Unknown'}
                    </span>
                    <div className="w-full bg-slate-700/30 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${Math.min((result.domain_age_days || 0) / 365 * 100, 100)}%` }} />
                    </div>
                </div>
            </motion.div>

            {/* Technical Details */}
            <motion.div variants={item} className="rounded-2xl border border-white/10 bg-white/5 divide-y divide-white/5 overflow-hidden backdrop-blur-md">
                <div className="flex justify-between items-center p-4 hover:bg-white/5 transition-colors">
                    <span className="text-slate-400 flex items-center gap-3 text-sm"><Globe className="w-4 h-4 text-cyan-400" /> Host Domain</span>
                    <span className="font-mono text-slate-200 truncate max-w-[200px]">
                        {safeUrl.replace(/^https?:\/\//, '').split('/')[0]}
                    </span>
                </div>
                <div className="flex justify-between items-center p-4 hover:bg-white/5 transition-colors">
                    <span className="text-slate-400 flex items-center gap-3 text-sm"><Lock className="w-4 h-4 text-cyan-400" /> Encryption Protocol</span>
                    <span className="font-mono text-slate-200">
                        {safeUrl.startsWith('https') ? 'HTTPS (TLS 1.3)' : 'HTTP (Unsecured)'}
                    </span>
                </div>
                {!isSafe && (
                    <div className="flex justify-between items-center p-4 bg-red-500/10">
                        <span className="text-red-400 font-medium flex items-center gap-3 text-sm"><Shield className="w-4 h-4" /> Recommended Action</span>
                        <span className="font-bold text-red-500 tracking-wider text-sm">TERMINATE CONNECTION</span>
                    </div>
                )}
            </motion.div>

            {/* Security Analysis / Insights Section */}
            {result.insights && result.insights.length > 0 && (
                <motion.div variants={item} className="mt-6">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Terminal className="w-4 h-4" /> Heuristic Analysis Log
                    </h3>
                    <div className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
                        {result.insights.map((insight, index) => {
                            let icon = <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
                            let textColor = "text-slate-300";
                            let bgColor = "bg-transparent";

                            if (insight.startsWith('🚨') || insight.startsWith('⛔')) {
                                icon = <AlertOctagon className="w-4 h-4 text-red-500" />;
                                textColor = "text-red-300";
                                bgColor = "bg-red-500/10";
                            } else if (insight.startsWith('⚠️') || insight.startsWith('🎣')) {
                                icon = <AlertTriangle className="w-4 h-4 text-amber-500" />;
                                textColor = "text-amber-300";
                                bgColor = "bg-amber-500/10";
                            }

                            const cleanText = insight.replace(/^[🚨⛔⚠️🎣✅🔒ℹ️]*/g, '').trim();

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`flex items-start gap-4 p-4 border-b border-white/5 last:border-0 ${bgColor}`}
                                >
                                    <div className="mt-0.5 shrink-0 opacity-80">{icon}</div>
                                    <span className={`text-sm font-medium ${textColor} leading-relaxed`}>{cleanText}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            <button
                onClick={handleDownloadPDF}
                className="w-full mt-4 py-3 flex items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
                <Download className="w-4 h-4" /> Export Security Report
            </button>
        </motion.div>
    );
};

export default ResultCard;
