'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings,
    ShieldOff,
    Eye,
    Zap,
    Code,
    ChevronRight,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { SectionHeading } from '@/components/ui/section-heading';
import { Badge } from '@/components/ui/badge';

interface SettingToggle {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    enabled: boolean;
    color: 'cyan' | 'orange' | 'green';
}

interface MojoLog {
    timestamp: string;
    level: 'info' | 'warn' | 'error';
    message: string;
}

const mockMojoLogs: MojoLog[] = [
    { timestamp: '23:41:23', level: 'info', message: 'Mojo engine initialized successfully' },
    { timestamp: '23:40:15', level: 'info', message: 'Loading threat intelligence database' },
    { timestamp: '23:38:52', level: 'warn', message: 'High memory usage detected - compacting cache' },
    { timestamp: '23:37:44', level: 'info', message: 'Token vault synchronized' },
    { timestamp: '23:35:10', level: 'error', message: 'Brute force attempt detected - blocking' },
    { timestamp: '23:33:28', level: 'info', message: 'Security audit completed' },
];

export default function SettingsPage() {
    const [settings, setSettings] = useState<SettingToggle[]>([
        {
            id: 'auto-block',
            title: 'Auto-Block',
            description: 'Automatically block suspicious activities',
            icon: ShieldOff,
            enabled: true,
            color: 'cyan',
        },
        {
            id: 'background-monitoring',
            title: 'Background Monitoring',
            description: 'Monitor security threats in the background',
            icon: Eye,
            enabled: true,
            color: 'orange',
        },
        {
            id: 'identity-obfuscation',
            title: 'Identity Obfuscation',
            description: 'Hide your digital footprint with obfuscation',
            icon: Zap,
            enabled: false,
            color: 'green',
        },
    ]);

    const [devMode, setDevMode] = useState(false);

    const toggleSetting = (id: string) => {
        setSettings((prev) =>
            prev.map((setting) =>
                setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
            )
        );
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <SectionHeading level="h1" subtitle="Customize your Guardian">
                Sovereign Controls
            </SectionHeading>

            {/* Security Settings */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-cyan-400" strokeWidth={1.5} />
                    <h2 className="text-lg font-semibold text-white">Security Settings</h2>
                </div>

                <div className="space-y-3">
                    {settings.map((setting, idx) => {
                        const IconComponent = setting.icon;
                        return (
                            <motion.div
                                key={setting.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 * idx }}
                            >
                                <GlassCard glow={setting.color === 'green' ? 'cyan' : setting.color}>
                                    <div className="flex items-center justify-between gap-4">
                                        {/* Icon & Description */}
                                        <div className="flex items-start gap-3">
                                            <motion.div
                                                animate={{ scale: setting.enabled ? 1.1 : 1 }}
                                                className="mt-0.5"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                                                    <IconComponent
                                                        className={`h-5 w-5 ${setting.enabled
                                                            ? 'text-' + setting.color + '-400'
                                                            : 'text-gray-500'
                                                            }`}
                                                    />
                                                </div>
                                            </motion.div>

                                            <div className="flex-1">
                                                <h3 className="font-semibold text-white">{setting.title}</h3>
                                                <p className="text-sm text-gray-400">{setting.description}</p>
                                            </div>
                                        </div>

                                        {/* Toggle Switch */}
                                        <motion.button
                                            onClick={() => toggleSetting(setting.id)}
                                            animate={{
                                                backgroundColor: setting.enabled
                                                    ? 'rgba(0, 240, 255, 0.2)'
                                                    : 'rgba(255, 255, 255, 0.05)',
                                                borderColor: setting.enabled
                                                    ? 'rgba(0, 240, 255, 0.3)'
                                                    : 'rgba(255, 255, 255, 0.1)',
                                            }}
                                            className="relative flex h-8 w-14 flex-shrink-0 rounded-full border transition-all"
                                        >
                                            <motion.div
                                                animate={{
                                                    x: setting.enabled ? 24 : 2,
                                                    backgroundColor: setting.enabled
                                                        ? 'rgba(0, 240, 255, 1)'
                                                        : 'rgba(255, 255, 255, 0.2)',
                                                }}
                                                transition={{ type: 'spring', stiffness: 600, damping: 30 }}
                                                className="h-6 w-6 rounded-full"
                                            />
                                        </motion.button>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Developer Mode Toggle */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <GlassCard glow={devMode ? 'orange' : 'cyan'}>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <motion.div
                                animate={{ rotate: devMode ? 180 : 0 }}
                                className="mt-0.5"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                                    <Code
                                        className={`h-5 w-5 ${devMode ? 'text-orange-400' : 'text-gray-500'}`}
                                        strokeWidth={1.5}
                                    />
                                </div>
                            </motion.div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-white">Developer Mode</h3>
                                    <Badge color={devMode ? 'danger' : 'info'}>
                                        {devMode ? 'Enabled' : 'Disabled'}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-400">
                                    Access Mojo engine logs and advanced diagnostics
                                </p>
                            </div>
                        </div>

                        {/* Toggle Switch */}
                        <motion.button
                            onClick={() => setDevMode(!devMode)}
                            animate={{
                                backgroundColor: devMode
                                    ? 'rgba(255, 77, 0, 0.2)'
                                    : 'rgba(255, 255, 255, 0.05)',
                                borderColor: devMode
                                    ? 'rgba(255, 77, 0, 0.3)'
                                    : 'rgba(255, 255, 255, 0.1)',
                            }}
                            className="relative flex h-8 w-14 flex-shrink-0 rounded-full border transition-all"
                        >
                            <motion.div
                                animate={{
                                    x: devMode ? 24 : 2,
                                    backgroundColor: devMode
                                        ? 'rgba(255, 77, 0, 1)'
                                        : 'rgba(255, 255, 255, 0.2)',
                                }}
                                transition={{ type: 'spring', stiffness: 600, damping: 30 }}
                                className="h-6 w-6 rounded-full"
                            />
                        </motion.button>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Mojo Engine Logs (visible when Developer Mode is enabled) */}
            <AnimatePresence>
                {devMode && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <GlassCard>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                                    <Zap className="h-5 w-5 text-orange-400" strokeWidth={1.5} />
                                    <h3 className="font-semibold text-white">Mojo Engine Logs</h3>
                                    <Badge color="danger" className="ml-auto text-xs">
                                        EXPERIMENTAL
                                    </Badge>
                                </div>

                                {/* Logs */}
                                <div className="space-y-2 font-mono text-xs max-h-64 overflow-y-auto">
                                    {mockMojoLogs.map((log, idx) => {
                                        const logColors = {
                                            info: 'text-cyan-400',
                                            warn: 'text-yellow-400',
                                            error: 'text-red-400',
                                        };

                                        const logBg = {
                                            info: 'bg-cyan-500/10',
                                            warn: 'bg-yellow-500/10',
                                            error: 'bg-red-500/10',
                                        };

                                        return (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.05 * idx }}
                                                className={`rounded px-2 py-1 flex gap-2 ${logBg[log.level]}`}
                                            >
                                                <span className="flex-shrink-0 text-gray-500">[{log.timestamp}]</span>
                                                <span className={`flex-shrink-0 font-bold ${logColors[log.level]}`}>
                                                    {log.level.toUpperCase()}
                                                </span>
                                                <span className="flex-1 text-gray-300">{log.message}</span>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Additional Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <GlassCard>
                    <div className="space-y-4">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <ChevronRight className="h-4 w-4" />
                            Version & Status
                        </h3>

                        <div className="space-y-3 border-t border-white/10 pt-4">
                            {[
                                { label: 'AetherCore Version', value: 'v1.0.0' },
                                { label: 'Mojo Engine', value: 'Operational' },
                                { label: 'Threat Database', value: 'Up to date' },
                                { label: 'System Status', value: 'All Systems Nominal' },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">{item.label}</span>
                                    <span className="text-white font-medium">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </GlassCard>
            </motion.div>
        </div>
    );
}
