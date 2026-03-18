'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { PulseIndicator } from '@/components/ui/pulse-indicator';

interface LatencyMeterProps {
    currentLatency?: number;
    targetLatency?: number;
}

export function LatencyMeter({ currentLatency = 34, targetLatency = 50 }: LatencyMeterProps) {
    const percentage = Math.min((currentLatency / targetLatency) * 100, 100);

    // Determine color based on latency
    let color = 'green';
    let colorClass = 'text-green-400';
    let bgColor = 'from-green-500/50 to-green-500/20';

    if (percentage > 60) {
        color = 'orange';
        colorClass = 'text-orange-400';
        bgColor = 'from-orange-500/50 to-orange-500/20';
    }

    if (percentage > 80) {
        color = 'red';
        colorClass = 'text-red-400';
        bgColor = 'from-red-500/50 to-red-500/20';
    }

    return (
        <GlassCard className="p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 icon-thin text-yellow-400" strokeWidth={1.5} />
                <h3 className="text-lg font-semibold text-white">Latency Meter</h3>
            </div>

            <div className="space-y-4">
                {/* Gauge */}
                <div className="relative h-24 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center z-10">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.4 }}
                                className="text-3xl font-bold text-white"
                            >
                                {currentLatency}
                                <span className="text-lg text-gray-400 ml-1">ms</span>
                            </motion.div>
                            <p className="text-xs text-gray-500 mt-1">Current Response Time</p>
                        </div>
                    </div>

                    {/* Progress bar background */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${bgColor} opacity-40`}
                    />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-white/5 border border-white/10 p-2 text-center">
                        <p className="text-xs text-gray-400">Target</p>
                        <p className="text-sm font-semibold text-white">{targetLatency}ms</p>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 p-2 text-center">
                        <p className="text-xs text-gray-400">Status</p>
                        <div className="flex items-center justify-center gap-1 mt-1">
                            <PulseIndicator color={color as 'cyan' | 'orange' | 'green'} size="sm" />
                            <span className={`text-xs font-semibold ${colorClass}`}>
                                {percentage > 80 ? 'High' : percentage > 60 ? 'Medium' : 'Optimal'}
                            </span>
                        </div>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 p-2 text-center">
                        <p className="text-xs text-gray-400">Efficiency</p>
                        <p className={`text-sm font-semibold ${colorClass}`}>{Math.round(percentage)}%</p>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
