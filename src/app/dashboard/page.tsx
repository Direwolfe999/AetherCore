'use client';

import { toast } from 'sonner';
import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, Zap, Cpu, Server, Network, ShieldCheck, Globe as GlobeIcon } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { PulseIndicator } from '@/components/ui/pulse-indicator';
import { SectionHeading } from '@/components/ui/section-heading';
import { Badge } from '@/components/ui/badge';
import { Globe } from '@/components/dashboard/globe';
import { ArchitectureMap } from '@/components/dashboard/architecture-map';

interface SecurityMetric {
    label: string;
    value: number | string;
    color: 'cyan' | 'orange' | 'green' | 'red';
    unit?: string;
    data: { val: number }[];
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

    // Animate stability bars
    const [coreLoad, setCoreLoad] = useState(32);
    const [networkLatency, setNetworkLatency] = useState(12);
    const [vaultSync, setVaultSync] = useState(99);

    useEffect(() => {
        const interval = setInterval(() => {
            setCoreLoad(prev => Math.max(10, Math.min(90, prev + (Math.random() * 20 - 10))));
            setNetworkLatency(prev => Math.max(5, Math.min(50, prev + (Math.random() * 10 - 5))));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const metrics: SecurityMetric[] = useMemo(() => [
        { label: 'Active Scans', value: 3, color: 'cyan', data: Array.from({ length: 20 }, () => ({ val: Math.random() * 10 })) },
        { label: 'Threats Blocked', value: 247, color: 'green', data: Array.from({ length: 20 }, () => ({ val: 100 + Math.random() * 150 })) },
        { label: 'System Health', value: '98%', color: 'cyan', data: Array.from({ length: 20 }, () => ({ val: 90 + Math.random() * 10 })) },
        { label: 'Response Time', value: 34, unit: 'ms', color: 'green', data: Array.from({ length: 20 }, () => ({ val: 20 + Math.random() * 30 })) },
    ], []);

    const threatActive = coreLoad > 60 || networkLatency > 30;

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <SectionHeading level="h1" subtitle="Command Center">
                The Nexus
            </SectionHeading>

            {/* Top Section: Score & Globe */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center justify-center pt-4 pb-8">
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

                {/* 3D WebGL Threat Globe */}
                <div className="flex flex-col items-center justify-center w-full max-w-[400px] mx-auto h-[350px]">
                    <div className="relative w-full h-full">
                        <div onClick={() => toast.success('Secure channel active', { description: 'Global uplink to all data centers established.' })} className='cursor-pointer'><Globe threatActive={threatActive} /></div>

                        {/* Overlay data over the globe */}
                        <div className="absolute top-4 left-4 z-10">
                            <Badge variant="info" className={`bg-black/50 backdrop-blur-md ${threatActive ? 'border-red-500/50' : 'border-cyan-500/30'}`}>
                                <GlobeIcon className={`w-3 h-3 mr-1 ${threatActive ? 'text-red-400' : 'text-cyan-400'}`} />
                                {threatActive ? 'Threat Detected' : 'Global Uplink Active'}
                            </Badge>
                        </div>
                    </div>
                </div>
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
                            <div className="space-y-3 relative overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-300 relative z-10">
                                        {metric.label}
                                    </span>
                                    <PulseIndicator color={metric.color} size="sm" animated />
                                </div>
                                <div className="text-3xl font-bold text-white relative z-10 flex items-baseline">
                                    {metric.value}
                                    {metric.unit && (
                                        <span className="ml-1 text-lg text-gray-400">{metric.unit}</span>
                                    )}
                                </div>

                                {/* Recharts Sparkline */}
                                <div className="absolute bottom-0 left-0 w-full h-16 opacity-30 pointer-events-none -mb-3 z-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={metric.data}>
                                            <YAxis domain={['dataMin', 'dataMax']} hide />
                                            <Line
                                                type="monotone"
                                                dataKey="val"
                                                stroke={
                                                    metric.color === 'cyan' ? '#00f0ff' :
                                                        metric.color === 'orange' ? '#ff4d00' :
                                                            metric.color === 'green' ? '#00ffaa' : '#ff0044'
                                                }
                                                strokeWidth={2}
                                                dot={false}
                                                isAnimationActive={true}
                                                animationDuration={2000}
                                                animationEasing="ease-in-out"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            <ArchitectureMap />

            {/* Bottom Grid: Activity & Stability */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
                {/* Real-time Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="h-full"
                >
                    <GlassCard className="h-full">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Activity className="h-5 w-5 text-cyan-400" />
                                <h2 className="text-lg font-semibold text-white">Live Activity Log</h2>
                                <PulseIndicator color="cyan" size="sm" animated />
                            </div>

                            <div className="space-y-3 border-t border-white/10 pt-4">
                                {[
                                    { msg: 'Auth0 API Rate Limit hit -> Graceful Backoff', time: 'Just now', color: 'bg-orange-400' },
                                    { msg: 'Agent re-routed to secondary Auth0 RPC', time: '2m ago', color: 'bg-cyan-400' },
                                    { msg: 'Missing Google Token: Handled via 403 UI', time: '14m ago', color: 'bg-green-400' },
                                    { msg: 'Threat signature DB synced to v4.2', time: '1h ago', color: 'bg-cyan-400' },
                                ].map((activity, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 + idx * 0.1 }}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group text-sm"
                                    >
                                        <div className="flex items-center gap-3 text-gray-300 group-hover:text-white">
                                            <div className={`h-2 w-2 rounded-full ${activity.color} shadow-[0_0_8px_currentColor]`} />
                                            <span>{activity.msg}</span>
                                        </div>
                                        <span className="text-xs font-mono text-gray-500">{activity.time}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* System Stability Matrix */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="h-full"
                >
                    <GlassCard className="h-full" glow="cyan">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Server className="h-5 w-5 text-cyan-400" />
                                    <h2 className="text-lg font-semibold text-white">Stability Telemetry</h2>
                                </div>
                                <Badge color="green" variant="neutral" className="text-xs animate-pulse">
                                    SYSTEM OPTIMAL
                                </Badge>
                            </div>

                            <div className="space-y-5 border-t border-white/10 pt-4">
                                {/* Core Load */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end text-sm">
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <Cpu className="w-4 h-4 text-cyan-400" />
                                            <span>Mojo Engine Compute</span>
                                        </div>
                                        <span className="font-mono text-cyan-400">{Math.round(coreLoad)}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full relative"
                                            animate={{ width: `${coreLoad}%` }}
                                            transition={{ type: "spring", stiffness: 100 }}
                                        >
                                            <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/50 blur-[2px] animate-[slide_1s_infinite_linear]"></div>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Network Latency */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end text-sm">
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <Network className="w-4 h-4 text-orange-400" />
                                            <span>Auth0 Identity Gateway</span>
                                        </div>
                                        <span className="font-mono text-orange-400">{Math.round(networkLatency)}ms</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full relative"
                                            animate={{ width: `${Math.min(100, networkLatency * 2)}%` }}
                                            transition={{ type: "spring", stiffness: 100 }}
                                        >
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Vault Sync */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end text-sm">
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <ShieldCheck className="w-4 h-4 text-green-400" />
                                            <span>Vault Encryption Loop</span>
                                        </div>
                                        <span className="font-mono text-green-400">{vaultSync}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full"
                                            initial={{ width: "0%" }}
                                            animate={{ width: `${vaultSync}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    );
}
