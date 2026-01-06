'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function StatsSection({ data, history }: { data: any[], history: any[] }) {
    const total = history.length;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto mb-24">
            {/* Main Chart Card */}
            <div className="lg:col-span-1 glass-card rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-50"><Activity className="w-6 h-6 text-white" /></div>

                <h3 className="text-lg font-bold text-white mb-2">Threat Overview</h3>
                <p className="text-xs text-slate-400 mb-6">Real-time breakdown of scanned URLs.</p>

                <div className="h-[250px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0a0a0f', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                                cursor={false}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-4xl font-bold text-white">{total}</span>
                        <span className="text-[10px] uppercase tracking-widest text-slate-500">Scans</span>
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-2">
                    {data.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                            {item.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Safe Card */}
                <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:bg-emerald-500/5 transition-all">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h4 className="text-3xl font-bold text-white mb-1">
                        {data.find(d => d.name === 'Safe')?.value || 0}
                    </h4>
                    <span className="text-sm font-medium text-emerald-400">Verified Safe</span>
                    <p className="text-xs text-slate-500 mt-2 px-8">Domains verified against known trusted lists and heuristics.</p>
                </div>

                {/* Critical Card */}
                <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:bg-red-500/5 transition-all">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative">
                        <AlertTriangle className="w-6 h-6 text-red-400 relative z-10" />
                        <div className="absolute inset-0 bg-red-400 blur-lg opacity-20 animate-pulse" />
                    </div>
                    <h4 className="text-3xl font-bold text-white mb-1">
                        {data.find(d => d.name === 'Critical')?.value || 0}
                    </h4>
                    <span className="text-sm font-medium text-red-400">Threats Neutralized</span>
                    <p className="text-xs text-slate-500 mt-2 px-8">Malicious URLs detected by heuristics and blocklists.</p>
                </div>

                {/* Recent Activity Mini-Feed */}
                <div className="md:col-span-2 glass-card rounded-2xl p-6 h-[100px] flex items-center justify-between px-8 relative overflow-hidden">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                        <span className="text-sm text-slate-300 font-mono">Live Feed: {history.length > 0 ? history[0].url : 'Waiting for scan...'}</span>
                    </div>
                    {history.length > 0 && (
                        <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${history[0].risk_level === 'SAFE' ? 'bg-emerald-500/20 text-emerald-400' :
                                history[0].risk_level === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                            }`}>
                            {history[0].risk_level}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
