'use client';

import { motion } from 'framer-motion';
import { Lock, Shield, Network } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { PulseIndicator } from '@/components/ui/pulse-indicator';
import { Badge } from '@/components/ui/badge';

interface VaultStatusItem {
    label: string;
    status: 'active' | 'encrypted' | 'secure';
    value: string;
}

const vaultStatus: VaultStatusItem[] = [
    {
        label: 'Auth0 Token Vault',
        status: 'active',
        value: 'Active',
    },
    {
        label: 'Encryption Standard',
        status: 'encrypted',
        value: 'AES-256',
    },
    {
        label: 'Connection Status',
        status: 'secure',
        value: 'Secure',
    },
];

function VaultStatusRow({ item }: { item: VaultStatusItem }) {
    const statusColors = {
        active: { indicator: 'green', badge: 'success' as const },
        encrypted: { indicator: 'cyan', badge: 'info' as const },
        secure: { indicator: 'green', badge: 'success' as const },
    };

    const colors = statusColors[item.status];

    return (
        <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-white/3 border border-white/5">
            <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 icon-thin text-gray-400" strokeWidth={1.5} />
                <span className="text-sm text-gray-300">{item.label}</span>
            </div>
            <Badge variant={colors.badge}>{item.value}</Badge>
        </div>
    );
}

export function VaultStatus() {
    return (
        <GlassCard className="p-5 md:p-6 relative overflow-hidden glow-cyan">
            {/* Ambient glow background */}
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl" />

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 icon-thin text-cyan-400" strokeWidth={1.5} />
                    <h3 className="text-lg font-semibold text-white">Vault Status</h3>
                </div>

                <div className="space-y-2 mb-4">
                    {vaultStatus.map((item) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <VaultStatusRow item={item} />
                        </motion.div>
                    ))}
                </div>

                <div className="pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Network className="w-4 h-4 icon-thin" strokeWidth={1.5} />
                        <span>Connected to: us.auth0.com</span>
                        <PulseIndicator color="green" size="sm" animated className="ml-auto" />
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
