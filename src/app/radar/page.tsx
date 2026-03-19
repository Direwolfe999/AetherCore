'use client';

import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/section-heading';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Radar, Crosshair, MapPin, Activity, AlertTriangle, ShieldAlert } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';

// Audio synth for radar ping
const playPing = (isAnomaly: boolean = false) => {
    // Only play if the user globally enabled audio
    if (typeof window !== 'undefined' && window.sessionStorage.getItem('aether_audio') !== '1') {
        return;
    }
    
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(isAnomaly ? 880 : 440, ctx.currentTime); // Higher pitch for anomaly
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(isAnomaly ? 0.3 : 0.05, ctx.currentTime + 0.05); // low volume
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
        // silently fail if audio context blocked by browser policy without interaction
    }
};

// Heatmap Data Generation
const generateHeatmap = () => {
    return Array.from({ length: 64 }, (_, i) => {
        // Creating some clustered heat for realistic visualization
        const isHotspot = [22, 23, 30, 31, 45, 52].includes(i);
        const isAnomaly = i === 14 || Math.random() > 0.95;
        return {
            id: i,
            intensity: isAnomaly ? 95 : isHotspot ? Math.random() * 40 + 40 : Math.random() * 20 + 5,
            isAnomaly,
        };
    });
};

export default function RadarPage() {
    const [heatmapData, setHeatmapData] = useState(generateHeatmap());
    const [anomalyRotator, setAnomalyRotator] = useState(0);
    const [hoveredNode, setHoveredNode] = useState<number | null>(null);

    // Rotate anomaly randomly to mock live data
    useEffect(() => {
        const interval = setInterval(() => {
            const nextData = generateHeatmap();
            setHeatmapData(nextData);
            setAnomalyRotator(prev => prev + 1);

            const hasAnomaly = nextData.some(d => d.isAnomaly);
            if (hasAnomaly && anomalyRotator > 0) {
                playPing(true);
            }
        }, 4000);
        return () => clearInterval(interval);
    }, [anomalyRotator]);

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Radar className="w-8 h-8 text-cyan-500" />
                    <SectionHeading subtitle="Behavioral Baseline & Execution Heatmap" className="m-0">
                        Drift & Anomaly Radar
                    </SectionHeading>
                </div>
                <Badge color="orange" className="animate-pulse">
                    SYSTEM DRIFT: 12% (ELEVATED)
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Radar / Heatmap View */}
                <div className="lg:col-span-2">
                    <GlassCard className="p-8 relative overflow-hidden h-[450px] flex items-center justify-center border-white/5 bg-[#050505] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
                        {/* Background Grid Lines (Radar aesthetic) */}
                        <div className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: 'radial-gradient(circle at center, #00f0ff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                        </div>
                        <div className="absolute inset-0 border border-cyan-500/10 rounded-full w-[400px] h-[400px] m-auto"></div>
                        <div className="absolute inset-0 border border-cyan-500/5 rounded-full w-[250px] h-[250px] m-auto"></div>
                        <div className="absolute inset-0 border border-cyan-500/10 w-full h-px top-1/2 -translate-y-1/2"></div>
                        <div className="absolute inset-0 border border-cyan-500/10 h-full w-px left-1/2 -translate-x-1/2"></div>

                        {/* Scanning Laser */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 w-[400px] h-[400px] origin-center z-10 opacity-30 pointer-events-none rounded-full"
                            style={{
                                background: 'conic-gradient(from 0deg at 50% 50%, transparent 270deg, rgba(0,240,255,1) 360deg)',
                                marginLeft: '-200px',
                                marginTop: '-200px'
                            }}
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                        />

                        {/* Center Pulse (Listening) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                            <div className="w-4 h-4 bg-cyan-500 rounded-full relative">
                                <div className="absolute inset-0 bg-cyan-500 rounded-full animate-ping opacity-60"></div>
                                <div className="absolute -inset-2 bg-cyan-500/20 rounded-full animate-pulse blur-sm"></div>
                            </div>
                        </div>

                        {/* Simulated Heatmap Grid mapping over the Radar */}
                        <div className="absolute inset-8 z-10 grid grid-cols-8 grid-rows-8 gap-1 opacity-80 mix-blend-screen px-4 py-4">
                            {heatmapData.map((cell) => (
                                <motion.div
                                    key={cell.id}
                                    initial={{ opacity: 0.2 }}
                                    animate={{ opacity: cell.intensity / 100 }}
                                    transition={{ duration: 0.5 }}
                                    onMouseEnter={() => {
                                        setHoveredNode(cell.id);
                                        if (cell.isAnomaly) playPing(true);
                                    }}
                                    onMouseLeave={() => setHoveredNode(null)}
                                    className={`relative rounded-sm transition-colors cursor-crosshair ${cell.isAnomaly ? 'bg-orange-500 shadow-[0_0_15px_#ff4d00] z-20 ' : 'bg-cyan-500 hover:bg-white'
                                        }`}
                                >
                                    {hoveredNode === cell.id && (
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none mt-2">
                                            <div className="bg-black/90 border border-white/10 px-2 py-1 text-[10px] font-mono whitespace-nowrap rounded text-white shadow-xl">
                                                SEC_ID: {cell.id} <br />
                                                <span className={cell.isAnomaly ? "text-orange-400" : "text-cyan-400"}>
                                                    LVL: {Math.round(cell.intensity)}%
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Coordinates Overlay */}
                        <div className="absolute bottom-4 right-4 font-mono text-xs text-zinc-500 text-right">
                            LAT: 34.0522 N<br />
                            LNG: 118.2437 W<br />
                            <span className="text-cyan-400">SYNC: NOMINAL</span>
                        </div>
                    </GlassCard>
                </div>

                {/* Right Side Panel */}
                <div className="space-y-6">
                    <GlassCard className="p-5 border-white/5">
                        <h3 className="text-xs font-mono text-zinc-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-400" /> Recent Anomalies
                        </h3>

                        <div className="space-y-4">
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-red-400 font-medium text-sm">Velocity Spike</span>
                                    <span className="font-mono text-xs text-red-500/70">10s ago</span>
                                </div>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    100x increase in Gmail API READ requests compared to 14-day baseline. Source IP obfuscated.
                                </p>
                                <div className="mt-2 flex w-full bg-black/50 h-1 rounded-full overflow-hidden">
                                    <div className="bg-red-500 h-full w-[95%]"></div>
                                </div>
                                <div className="text-[10px] text-zinc-500 font-mono mt-1 text-right">DEVIATION: 95%</div>
                            </div>

                            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-zinc-300 font-medium text-sm flex items-center gap-1.5">
                                        <MapPin className="w-3 h-3" /> Geo-Drift Warning
                                    </span>
                                    <span className="font-mono text-xs text-zinc-500">2m ago</span>
                                </div>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    Authentication request originating from unrecognized region (Eastern Europe). Blocked by Sovereign ruleset.
                                </p>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-5 border-white/5 flex-1">
                        <h3 className="text-xs font-mono text-zinc-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                            <Activity className="w-4 h-4 text-cyan-400" /> Behavioral Baseline
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Work Hours', value: 85, color: 'cyan' },
                                { label: 'Cloud Execution', value: 62, color: 'cyan' },
                                { label: 'API Consumption', value: 40, color: 'cyan' },
                                { label: 'Token Vault Access', value: 92, color: 'orange' },
                            ].map((metric) => (
                                <div key={metric.label} className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-mono">
                                        <span className="text-zinc-400">{metric.label}</span>
                                        <span className={metric.color === 'orange' ? 'text-orange-400' : 'text-cyan-400'}>
                                            {metric.value}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${metric.value}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className={`h-full rounded-full ${metric.color === 'orange' ? 'bg-orange-500' : 'bg-cyan-500'}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
