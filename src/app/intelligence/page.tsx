'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, AlertCircle, AlertTriangle, AlertOctagon } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { SectionHeading } from '@/components/ui/section-heading';
import { PulseIndicator } from '@/components/ui/pulse-indicator';

interface ThreatEvent {
    id: string;
    timestamp: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
}

const severityConfig = {
    low: { color: 'info' as const, icon: AlertCircle, label: 'Low', bgColor: 'bg-blue-500/10' },
    medium: { color: 'warning' as const, icon: AlertTriangle, label: 'Medium', bgColor: 'bg-yellow-500/10' },
    high: { color: 'danger' as const, icon: AlertTriangle, label: 'High', bgColor: 'bg-orange-500/10' },
    critical: { color: 'danger' as const, icon: AlertOctagon, label: 'Critical', bgColor: 'bg-red-500/10' },
};

const mockThreatEvents: ThreatEvent[] = [
    {
        id: '1',
        timestamp: '23:41:23.847',
        severity: 'critical',
        message: 'Unauthorized access attempt detected on authentication vector',
    },
    {
        id: '2',
        timestamp: '23:40:15.392',
        severity: 'high',
        message: 'Anomalous token usage pattern identified',
    },
    {
        id: '3',
        timestamp: '23:38:52.156',
        severity: 'medium',
        message: 'Suspicious API endpoint queried - rate limit applied',
    },
    {
        id: '4',
        timestamp: '23:37:44.923',
        severity: 'low',
        message: 'Configuration audit log written - no action required',
    },
    {
        id: '5',
        timestamp: '23:35:10.512',
        severity: 'high',
        message: 'Brute force attempt blocked on credential endpoint',
    },
    {
        id: '6',
        timestamp: '23:33:28.741',
        severity: 'low',
        message: 'System health check passed - all components nominal',
    },
];

export default function IntelligencePage() {
    const [events, setEvents] = useState<ThreatEvent[]>(mockThreatEvents);
    const [isLive, setIsLive] = useState(true);

    // Simulate live incoming events
    useEffect(() => {
        if (!isLive) return;

        const interval = setInterval(() => {
            const severities: Array<'low' | 'medium' | 'high' | 'critical'> = [
                'low',
                'medium',
                'high',
                'critical',
            ];
            const messages = [
                'New threat signature detected',
                'Token rotation initiated',
                'Security posture verified',
                'Suspicious activity blocked',
                'Encryption key regenerated',
            ];

            const newEvent: ThreatEvent = {
                id: Date.now().toString(),
                timestamp: new Date().toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    fractionalSecondDigits: 3,
                }).replace(/:/g, ':'),
                severity: severities[Math.floor(Math.random() * severities.length)],
                message: messages[Math.floor(Math.random() * messages.length)],
            };

            setEvents((prev) => [newEvent, ...prev.slice(0, 9)]);
        }, 4000);

        return () => clearInterval(interval);
    }, [isLive]);

    return (
        <div className="space-y-6">
            {/* Header with Live Indicator */}
            <div className="flex items-center justify-between">
                <SectionHeading level="h1" subtitle="Real-time Monitoring">
                    Intelligence
                </SectionHeading>

                {/* Live Indicator */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="flex items-center gap-2 rounded-full bg-red-500/20 border border-red-400/30 px-3 py-1.5"
                >
                    <div className="relative flex h-2 w-2">
                        <motion.div
                            animate={{ opacity: [1, 0.5] }}
                            transition={{ duration: 0.6, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-red-500"
                        />
                        <div className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
                    </div>
                    <span className="text-xs font-bold text-red-300">LIVE</span>
                </motion.div>
            </div>

            {/* Controls */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
            >
                <button
                    onClick={() => setIsLive(!isLive)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${isLive
                            ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20'
                            : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                >
                    {isLive ? '⏸ Pause Live Feed' : '▶ Resume Live Feed'}
                </button>
            </motion.div>

            {/* Terminal-style Threat Feed */}
            <GlassCard>
                <div className="space-y-1 font-mono text-sm">
                    {/* Terminal Header */}
                    <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                        <Terminal className="h-4 w-4 text-cyan-400" strokeWidth={1.5} />
                        <span className="text-cyan-400">threat-intel.log</span>
                        <span className="ml-auto text-xs text-gray-500">
                            {events.length} / {mockThreatEvents.length + 10}
                        </span>
                    </div>

                    {/* Events */}
                    <div className="space-y-2 max-h-96 overflow-y-auto pt-3">
                        <AnimatePresence mode="popLayout">
                            {events.map((event, idx) => {
                                const config = severityConfig[event.severity];
                                const Icon = config.icon;

                                return (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, x: -20, height: 0 }}
                                        animate={{ opacity: 1, x: 0, height: 'auto' }}
                                        exit={{ opacity: 0, x: 20, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`flex gap-2 rounded px-2 py-1.5 text-xs ${config.bgColor}`}
                                    >
                                        {/* Timestamp */}
                                        <span className="flex-shrink-0 font-mono text-gray-500">
                                            [{event.timestamp}]
                                        </span>

                                        {/* Severity Icon */}
                                        <div className="flex-shrink-0">
                                            <Icon className="h-3.5 w-3.5 text-white" strokeWidth={1.5} />
                                        </div>

                                        {/* Severity Badge */}
                                        <Badge color={config.color} className="flex-shrink-0 text-xs">
                                            {config.label}
                                        </Badge>

                                        {/* Message */}
                                        <span className="flex-1 text-gray-300 break-all">
                                            {event.message}
                                        </span>

                                        {/* Live Indicator for latest */}
                                        {idx === 0 && isLive && (
                                            <motion.div
                                                animate={{ opacity: [1, 0.5] }}
                                                transition={{ duration: 0.6, repeat: Infinity }}
                                                className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-red-400"
                                            />
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Terminal Footer */}
                    <div className="border-t border-white/10 pt-2 text-xs text-gray-500">
                        <span className="text-cyan-400">aether</span>
                        <span className="text-white">@</span>
                        <span className="text-green-400">nexus</span>
                        <span className="text-white">:~$</span>
                        <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="ml-1 inline-block h-3 w-1 bg-cyan-400"
                        />
                    </div>
                </div>
            </GlassCard>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                    { label: 'Critical Events', value: '3', color: 'red' },
                    { label: 'High Events', value: '4', color: 'orange' },
                    { label: 'System Status', value: 'Secure', color: 'green' },
                ].map((stat) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-lg border px-4 py-3 text-center border-white/10 bg-gradient-to-b from-white/5 to-transparent`}
                    >
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-gray-400">{stat.label}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
