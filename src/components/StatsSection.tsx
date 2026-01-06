'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity, ShieldCheck, AlertTriangle, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StatsSection({ data, history }: { data: any[], history: any[] }) {
    const total = history.length;

    // Default data if empty to show an empty chart placeholder
    const chartData = data.length > 0 ? data : [{ name: 'Empty', value: 1, color: '#334155' }];

    return (
        <div id="analytics" className="w-full max-w-7xl mx-auto px-6 mb-32 -mt-20 relative z-30">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* --- MAIN CHART CARD --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="lg:col-span-1 glass-card rounded-3xl p-8 relative overflow-hidden border-t border-white/10"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-cyan-400" />
                                Threat Landscape
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">Global Scan Distribution</p>
                        </div>
                    </div>

                    <div className="h-[280px] w-full relative mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(10, 10, 15, 0.9)',
                                        borderColor: 'rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                                    cursor={false}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Center Metric */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-5xl font-black text-white tracking-tighter">{total}</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-500 font-bold mt-1">Total Scans</span>
                        </div>
                    </div>

                    <div className="flex justify-center gap-6 mt-4">
                        {data.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs font-mono text-slate-300">
                                <div className="w-2 h-2 rounded-full shadow-[0_0_8px]" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }} />
                                {item.name}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* --- STAT CARDS GRID --- */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Safe Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="glass-card rounded-3xl p-8 relative overflow-hidden group hover:border-emerald-500/30 transition-colors"
                    >
                        <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />

                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h4 className="text-4xl font-bold text-white mb-2">{data.find(d => d.name === 'Safe')?.value || 0}</h4>
                            <span className="text-sm font-semibold text-emerald-400 tracking-wide">VERIFIED SAFE</span>
                            <p className="text-xs text-slate-500 mt-2 leading-relaxed">Domains passed trusted entity checks and heuristic analysis.</p>
                        </div>
                    </motion.div>

                    {/* Critical Threat Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="glass-card rounded-3xl p-8 relative overflow-hidden group hover:border-red-500/30 transition-colors"
                    >
                        <div className="absolute top-0 right-0 p-32 bg-red-500/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-red-500/10 transition-colors" />

                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 text-red-400 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <h4 className="text-4xl font-bold text-white mb-2">{data.find(d => d.name === 'Critical')?.value || 0}</h4>
                            <span className="text-sm font-semibold text-red-500 tracking-wide">THREATS BLOCKED</span>
                            <p className="text-xs text-slate-500 mt-2 leading-relaxed">Malicious URLs identified via branding spoofing or blacklists.</p>
                        </div>
                    </motion.div>

                    {/* Live Feed Ticker */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="md:col-span-2 glass-card rounded-2xl p-4 flex items-center gap-4 border border-cyan-500/20 shadow-[0_0_30px_rgba(0,0,0,0.2)]"
                    >
                        <div className="flex items-center gap-2 px-3 py-1 bg-cyan-950/50 rounded-lg border border-cyan-500/20">
                            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider whitespace-nowrap">Live Feed</span>
                        </div>

                        <div className="h-6 w-[1px] bg-white/10" />

                        <div className="flex-1 overflow-hidden">
                            {history.length > 0 ? (
                                <div className="flex items-center justify-between animate-in slide-in-from-right duration-500 fade-in">
                                    <span className="text-sm text-slate-300 font-mono truncate max-w-[200px] md:max-w-md">{history[0].url}</span>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${history[0].risk_level === 'SAFE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            history[0].risk_level === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        }`}>
                                        {history[0].risk_level}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-xs text-slate-500 italic">Waiting for incoming traffic...</span>
                            )}
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
