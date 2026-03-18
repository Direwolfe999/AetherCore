'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, Zap } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { PulseIndicator } from '@/components/ui/pulse-indicator';
import { SectionHeading } from '@/components/ui/section-heading';

interface SecurityMetric {
    label: string;
    value: number | string;
    color: 'cyan' | 'orange' | 'green' | 'red';
    unit?: string;
}

export default function DashboardPage() {
    const [securityScore, setSecurityScore] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    // Animate security score from 0 to target on page load
    useEffect(() => {
        setIsLoaded(true);
        const target = 87;
        const duration = 2000;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            setSecurityScore(Math.floor(target * easeOutCubic));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }, []);

    const metrics: SecurityMetric[] = [
        { label: 'Active Scans', value: 3, color: 'cyan' },
        { label: 'Threats Blocked', value: 247, color: 'green' },
        { label: 'System Health', value: '98%', color: 'cyan' },
        { label: 'Response Time', value: 34, unit: 'ms', color: 'green' },
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <SectionHeading level="h1" subtitle="Command Center">
                The Nexus
            </SectionHeading>

            {/* Security Score Circle */}
            <div className="flex flex-col items-center justify-center">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative flex h-64 w-64 items-center justify-center"
                >
                    {/* Outer Ring */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 rounded-full border border-transparent"
                        style={{
                            backgroundImage:
                                'conic-gradient(from 0deg, rgba(0,240,255,0.4), rgba(255,77,0,0.4), rgba(0,240,255,0.4))',
                        }}
                    />

                    {/* Middle Ring */}
                    <motion.div
                        animate={{ rotate: -180 }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-4 rounded-full border border-white/10"
                    />

                    {/* Inner Circle Background */}
                    <div className="absolute inset-8 rounded-full bg-gradient-to-b from-white/5 to-transparent backdrop-blur-md border border-white/10" />

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="relative flex flex-col items-center justify-center"
                    >
                        <div className="flex items-baseline gap-1">
                            <motion.span
                                key={securityScore}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent"
                            >
                                {securityScore}
                            </motion.span>
                            <span className="text-xl text-gray-400">/100</span>
                        </div>
                        <span className="mt-2 text-sm font-medium text-gray-300">
                            Protection Shield
                        </span>
                        <div className="mt-4 flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        opacity: securityScore / 20 > i ? 1 : 0.2,
                                    }}
                                    className="h-2 w-2 rounded-full bg-cyan-400"
                                />
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric, idx) => (
                    <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * idx }}
                    >
                        <GlassCard glow={metric.color === 'green' || metric.color === 'red' ? 'cyan' : metric.color}>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-300">
                                        {metric.label}
                                    </span>
                                    <PulseIndicator color={metric.color} size="sm" animated />
                                </div>
                                <div className="text-3xl font-bold text-white">
                                    {metric.value}
                                    {metric.unit && (
                                        <span className="text-lg text-gray-400">{metric.unit}</span>
                                    )}
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            {/* Real-time Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <GlassCard>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Activity className="h-5 w-5 text-cyan-400" strokeWidth={1.5} />
                            <h2 className="text-lg font-semibold text-white">Live Activity</h2>
                            <PulseIndicator color="cyan" size="sm" animated />
                        </div>

                        <div className="space-y-3 border-t border-white/10 pt-4">
                            {[
                                'Network integrity verified',
                                'Token rotation scheduled',
                                'Threat signature updated',
                                'Encryption standard: AES-256',
                            ].map((activity, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 + idx * 0.1 }}
                                    className="flex items-center gap-3 text-sm text-gray-400"
                                >
                                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-400/50" />
                                    <span>{activity}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </GlassCard>
            </motion.div>
        </div>
    );
}
