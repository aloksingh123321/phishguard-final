import React from 'react';

const ThreatChart = () => {
    const metrics = [
        { label: 'Malware', value: 'Low', color: 'bg-green-500', width: '20%' },
        { label: 'Dom Age', value: '>5Y', color: 'bg-blue-500', width: '80%' },
        { label: 'SSL', value: 'Valid', color: 'bg-teal-400', width: '100%' },
    ];

    return (
        <div className="w-full mt-3 p-2 border border-[#64ffda] border-opacity-30 rounded bg-[#112240] text-[10px]">
            <div className="flex justify-between items-center mb-2 border-b border-gray-700 pb-1">
                <span className="text-neon font-bold tracking-wider">THREAT PROTOCOL</span>
                <span className="text-secondary animate-pulse">● LIVE</span>
            </div>

            <div className="space-y-2">
                {metrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between gap-2">
                        <div className="w-16 text-secondary font-mono text-[9px]">{metric.label}</div>
                        <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${metric.color} shadow-[0_0_5px_currentColor]`}
                                style={{ width: metric.width }}
                            />
                        </div>
                        <div className="w-8 text-right text-white font-mono text-[9px]">{metric.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ThreatChart;
