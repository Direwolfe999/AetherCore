'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Vault, Shield, RotateCw, Trash2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Badge } from '@/components/ui/badge';
import { SectionHeading } from '@/components/ui/section-heading';
import { PulseIndicator } from '@/components/ui/pulse-indicator';

interface ConnectedAccount {
    id: string;
    provider: string;
    email: string;
    icon: React.ComponentType<{ className?: string }>;
    lastRotated: string;
}

const accounts: ConnectedAccount[] = [
    {
        id: '1',
        provider: 'Google',
        email: 'user@gmail.com',
        icon: Shield,
        lastRotated: '2 days ago',
    },
    {
        id: '2',
        provider: 'GitHub',
        email: 'user@github.com',
        icon: Shield,
        lastRotated: '1 week ago',
    },
];

export default function VaultPage() {
    const [rotatingKey, setRotatingKey] = useState<string | null>(null);
    const [keyInSafe, setKeyInSafe] = useState(false);

    const handleRotateKey = (id: string) => {
        setRotatingKey(id);
        // Simulate key moving into safe
        setTimeout(() => {
            setKeyInSafe(true);
            setTimeout(() => {
                setRotatingKey(null);
                setKeyInSafe(false);
            }, 1000);
        }, 600);
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <SectionHeading level="h1" subtitle="Token Management">
                Secure Perimeter
            </SectionHeading>

            {/* Safe Visualization */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center justify-center"
            >
                <GlassCard>
                    <div className="flex flex-col items-center justify-center gap-6 py-12">
                        {/* Safe Icon */}
                        <div className="relative h-32 w-32">
                            {/* Safe background */}
                            <motion.div
                                animate={{ rotate: keyInSafe ? 0 : -5 }}
                                className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/10 to-orange-500/10 border-2 border-cyan-400/30"
                            >
                                <Vault className="h-16 w-16 text-cyan-400" strokeWidth={1.5} />
                            </motion.div>

                            {/* Rotating Key */}
                            {rotatingKey && (
                                <motion.div
                                    animate={{
                                        x: keyInSafe ? 0 : 100,
                                        y: keyInSafe ? 0 : -50,
                                        rotate: keyInSafe ? 0 : 360,
                                        opacity: keyInSafe ? 0 : 1,
                                    }}
                                    transition={{ duration: 0.8 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <Key className="h-12 w-12 text-orange-400" strokeWidth={1.5} />
                                </motion.div>
                            )}
                        </div>

                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-white mb-2">Token Vault</h2>
                            <p className="text-sm text-gray-400">
                                {accounts.length} connected {accounts.length === 1 ? 'account' : 'accounts'}
                            </p>
                        </div>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Connected Accounts */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-cyan-400" strokeWidth={1.5} />
                    Connected Accounts
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
                    {accounts.map((account, idx) => {
                        const AccountIcon = account.icon;
                        return (
                            <motion.div
                                key={account.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * (idx + 1) }}
                            >
                                <GlassCard glow="cyan">
                                    <div className="space-y-4">
                                        {/* Header */}
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                                                    <AccountIcon className="h-6 w-6 text-cyan-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-semibold text-white">
                                                        {account.provider}
                                                    </h3>
                                                    <p className="text-sm text-gray-400">{account.email}</p>
                                                </div>
                                            </div>
                                            <Badge color="success">Connected</Badge>
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-white/10" />

                                        {/* Info & Actions */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-400">Last Rotated</span>
                                                <span className="text-white font-medium">{account.lastRotated}</span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-400">Encryption</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white font-medium">AES-256</span>
                                                    <PulseIndicator color="green" size="sm" animated />
                                                </div>
                                            </div>

                                            {/* Auth0 Badge */}
                                            <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-orange-400/20 px-3 py-2">
                                                <Vault className="h-4 w-4 text-orange-400" strokeWidth={1.5} />
                                                <span className="text-xs font-medium text-orange-300">
                                                    Secured by Auth0
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 border-t border-white/10 pt-4">
                                            <GlassButton
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleRotateKey(account.id)}
                                                disabled={rotatingKey !== null}
                                                className="flex-1"
                                            >
                                                <RotateCw className="h-4 w-4" strokeWidth={1.5} />
                                                {rotatingKey === account.id ? 'Rotating...' : 'Rotate Keys'}
                                            </GlassButton>
                                            <GlassButton
                                                variant="secondary"
                                                size="sm"
                                                className="flex-1"
                                            >
                                                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                                                Disconnect
                                            </GlassButton>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Info Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <GlassCard>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <Shield className="h-5 w-5 text-cyan-400" strokeWidth={1.5} />
                            Security Standards
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                                All tokens encrypted using AES-256
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                                Auth0 OAuth2.0 compliance
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                                Automatic key rotation every 30 days
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                                Zero-knowledge architecture
                            </li>
                        </ul>
                    </div>
                </GlassCard>
            </motion.div>
        </div>
    );
}
