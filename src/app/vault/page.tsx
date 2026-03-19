'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Vault, Shield, RotateCw, Trash2, Fingerprint, Smartphone } from 'lucide-react';
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
    const [isDragging, setIsDragging] = useState(false);
    const [tokensInSafe, setTokensInSafe] = useState(0);

    // Step-Up MFA Challenge Simulation
    const [showMfaChallenge, setShowMfaChallenge] = useState<string | null>(null);
    const [mfaStatus, setMfaStatus] = useState<'pending' | 'success'>('pending');

    const handleRotateKeyRequest = (id: string) => {
        setShowMfaChallenge(id);
        setMfaStatus('pending');
    };

    const handleMfaSuccess = () => {
        setMfaStatus('success');
        setTimeout(() => {
            const rotId = showMfaChallenge;
            setShowMfaChallenge(null);
            if (rotId) handleRotateKey(rotId);
        }, 1200);
    };

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

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('text/plain', 'token');
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const data = e.dataTransfer.getData('text/plain');
        if (data === 'token') {
            setTokensInSafe(prev => prev + 1);
            setKeyInSafe(true);
            setTimeout(() => setKeyInSafe(false), 800);
        }
    };

    return (
        <div className="space-y-8">
            {/* Step-Up MFA Challenge Modal */}
            <AnimatePresence>
                {showMfaChallenge && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#0A0A0A] border border-cyan-500/30 p-8 rounded-2xl max-w-md w-full shadow-[0_0_50px_rgba(0,240,255,0.1)] relative overflow-hidden"
                        >
                            {/* Scanning line effect */}
                            <motion.div
                                animate={{ y: ['-100%', '400%'] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="absolute left-0 right-0 h-10 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent pointer-events-none"
                            />

                            <div className="text-center space-y-6 relative z-10">
                                <div className="flex justify-center">
                                    <div className="h-20 w-20 rounded-full bg-cyan-500/10 border-2 border-cyan-500/50 flex items-center justify-center relative">
                                        {mfaStatus === 'pending' ? (
                                            <motion.div
                                                animate={{ opacity: [0.5, 1, 0.5] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                            >
                                                <Fingerprint className="h-10 w-10 text-cyan-400" strokeWidth={1} />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="h-10 w-10 text-cyan-400 bg-cyan-400 rounded-full flex items-center justify-center"
                                            >
                                                <Shield className="h-6 w-6 text-black" />
                                            </motion.div>
                                        )}
                                        {/* Outer ring animation */}
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                                            className="absolute -inset-4 border border-dashed border-cyan-500/30 rounded-full"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Step-Up Authentication</h3>
                                    <p className="text-gray-400 text-sm">
                                        {mfaStatus === 'pending'
                                            ? "Critical action requested. Please verify your identity via Auth0 WebAuthn to proceed."
                                            : "Identity verified. Proceeding with critical action..."}
                                    </p>
                                </div>

                                {mfaStatus === 'pending' && (
                                    <div className="flex gap-4 pt-4 border-t border-white/10">
                                        <GlassButton
                                            variant="secondary"
                                            className="flex-1"
                                            onClick={() => setShowMfaChallenge(null)}
                                        >
                                            Cancel
                                        </GlassButton>
                                        <GlassButton
                                            variant="primary"
                                            className="flex-1 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                                            onClick={handleMfaSuccess}
                                        >
                                            Verify Identity
                                        </GlassButton>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Page Header */}
            <SectionHeading level="h1" subtitle="Token Management">
                Secure Perimeter
            </SectionHeading>

            {/* Safe Visualization & Draggable Token */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center justify-center h-full w-full"
                >
                    <GlassCard className="w-full">
                        <div
                            className={`flex flex-col items-center justify-center gap-6 py-12 rounded-2xl transition-all duration-300 ${isDragging ? 'bg-cyan-500/10 scale-105 border-cyan-400' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {/* Safe Icon */}
                            <div className="relative h-32 w-32">
                                {/* Safe background */}
                                <motion.div
                                    animate={{
                                        rotate: keyInSafe ? 0 : -5,
                                        scale: keyInSafe ? 1.1 : 1
                                    }}
                                    className={`absolute inset-0 flex items-center justify-center rounded-2xl border-2 transition-colors ${keyInSafe ? 'bg-green-500/20 border-green-400' : 'bg-gradient-to-br from-cyan-500/10 to-orange-500/10 border-cyan-400/30'
                                        }`}
                                >
                                    <Vault className={`h-16 w-16 ${keyInSafe ? 'text-green-400' : 'text-cyan-400'}`} strokeWidth={1.5} />
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
                                <p className="text-sm text-gray-400 mb-2">
                                    {accounts.length + tokensInSafe} secured {accounts.length + tokensInSafe === 1 ? 'credential' : 'credentials'}
                                </p>
                                {isDragging && (
                                    <Badge color="info" className="text-cyan-400 animate-pulse">Release to Encrypt</Badge>
                                )}
                                {!isDragging && (
                                    <span className="text-xs text-zinc-500">Drag tokens here to encrypt</span>
                                )}
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Draggable Tokens */}
                <div className="flex flex-col gap-4">
                    <p className="text-sm font-semibold text-white/70">Unsecured Tokens (Draggable)</p>
                    <div
                        draggable
                        onDragStart={handleDragStart}
                        className="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur flex items-center gap-4 cursor-grab active:cursor-grabbing hover:bg-white/10 transition-colors"
                    >
                        <div className="p-3 rounded-lg bg-orange-500/20 border border-orange-500/30">
                            <Key className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">Legacy API Key</p>
                            <p className="text-xs text-white/50">Needs Vault Security</p>
                        </div>
                    </div>
                </div>
            </div>

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
                                                onClick={() => handleRotateKeyRequest(account.id)}
                                                disabled={rotatingKey !== null || showMfaChallenge !== null}
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
