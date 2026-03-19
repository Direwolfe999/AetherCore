'use client';

import { motion } from 'framer-motion';
import { Zap, Activity, Lock, Cpu } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { PulseIndicator } from '@/components/ui/pulse-indicator';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ElementType;
    unit?: string;
    color?: 'cyan' | 'orange' | 'green';
    index: number;
}

function StatCard({ label, value, icon: Icon, unit, color = 'cyan', index }: StatCardProps) {
    const colorStyles = {
        cyan: 'text-cyan-400',
        orange: 'text-orange-400',
        green: 'text-green-400',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
        >
            <GlassCard className="p-4 md:p-5 scan-line-container relative overflow-hidden">
                <div className="scan-line" />

                <div className="flex items-start justify-between mb-3">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">{label}</p>
                        <p className="text-2xl md:text-3xl font-bold text-white mt-1">
                            {value}
                            {unit && <span className="text-sm text-gray-400 ml-1">{unit}</span>}
                        </p>
                    </div>
                    <Icon className={`w-5 h-5 icon-thin ${colorStyles[color]}`} strokeWidth={1.5} />
                </div>

                <div className="flex items-center gap-2">
                    <PulseIndicator color={color} size="sm" animated />
                    <span className="text-xs text-gray-400">Live</span>
                </div>
            </GlassCard>
        </motion.div>
    );
}

export function SystemStatusGrid() {
    const stats: StatCardProps[] = [
        {
            label: 'Inference Latency',
            value: '34',
            unit: 'ms',
            icon: Zap,
            color: 'green',
            index: 0,
        },
        {
            label: 'Auth0 Telemetry',
            value: '98',
            unit: '%',
            icon: Activity,
            color: 'cyan',
            index: 1,
        },
        {
            label: 'Vault Integrity',
            value: 'Secure',
            icon: Lock,
            color: 'green',
            index: 2,
        },
        {
            label: 'CPU Usage',
            value: '45',
            unit: '%',
            icon: Cpu,
            color: 'cyan',
            index: 3,
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
            ))}
        </div>
    );
}
