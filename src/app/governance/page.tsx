'use client';

import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/section-heading';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Badge } from '@/components/ui/badge';
import { Network, Shield, Key, Bot, Database, Zap, Activity, AlertOctagon, XCircle } from 'lucide-react';
import React from 'react';
import { fetchBackend, type BackendOverview } from '@/lib/backend';

export default function GovernancePage() {
    const [isRevoked, setIsRevoked] = React.useState(false);
    const [isGlitching, setIsGlitching] = React.useState(false);
    const [backendOverview, setBackendOverview] = React.useState<BackendOverview | null>(null);

    React.useEffect(() => {
        const loadOverview = async () => {
            const result = await fetchBackend<BackendOverview>('/api/status/overview');
            if (result.ok && result.data) {
                setBackendOverview(result.data);
            }
        };

        loadOverview();
    }, []);

    const activePermissions = backendOverview
        ? [
            { id: 1, name: 'Auth0 Session Validation', service: 'Auth0', status: backendOverview.auth0_configured ? 'active' : 'paused' },
            { id: 2, name: 'Mojo Runtime Health', service: 'Mojo', status: backendOverview.mojo.exists ? 'active' : 'paused' },
            { id: 3, name: 'Queue Broker Connectivity', service: 'Redis/Celery', status: backendOverview.queue.broker.includes('redis') ? 'active' : 'paused' },
        ]
        : [
            { id: 1, name: 'Backend Status', service: 'Unknown', status: 'paused' },
        ];

    const auditLogs = backendOverview
        ? [
            { id: 1, time: 'LIVE', action: 'Environment Loaded', actor: 'Backend', target: backendOverview.environment, status: 'Success' },
            { id: 2, time: 'LIVE', action: 'Auth0 Config Checked', actor: 'Backend', target: backendOverview.auth0_configured ? 'Configured' : 'Missing', status: backendOverview.auth0_configured ? 'Success' : 'Blocked' },
            { id: 3, time: 'LIVE', action: 'Mojo Runtime Checked', actor: 'Backend', target: backendOverview.mojo.status, status: backendOverview.mojo.exists ? 'Success' : 'Blocked' },
            { id: 4, time: 'LIVE', action: 'Queue Broker Checked', actor: 'Backend', target: backendOverview.queue.broker, status: 'Success' },
        ]
        : [];

    const handleRevoke = () => {
        setIsGlitching(true);
        setTimeout(() => {
            setIsGlitching(false);
            setIsRevoked(!isRevoked);
        }, 600);
    };

    return (
        <div className={`space-y-8 max-w-5xl mx-auto pb-10 transition-all ${isGlitching ? 'animate-pulse blur-[1px]' : ''}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Network className="w-8 h-8 text-cyan-500" />
                    <SectionHeading subtitle="Real-time Data Lineage and Token Usage" className="m-0">
                        Identity Sovereignty Map
                    </SectionHeading>
                </div>
                <button
                    onClick={handleRevoke}
                    className={`group relative inline-flex items-center justify-center px-6 py-2.5 font-medium border rounded-lg overflow-hidden transition-all ${isRevoked
                            ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20 hover:bg-cyan-500/20 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                            : 'text-red-500 bg-red-500/10 border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                        }`}>
                    <span className={`relative flex items-center gap-2 ${isGlitching ? 'translate-x-[-2px] translate-y-[2px]' : ''}`}>
                        {isRevoked ? <Network className="w-4 h-4" /> : <AlertOctagon className="w-4 h-4" />}
                        {isRevoked ? 'Restore Access' : 'Revoke All Access'}
                    </span>
                </button>
            </div>

            {/* Node Graph Visualization (Simulated with Flexbox & SVG) */}
            <GlassCard className={`p-4 sm:p-6 md:p-8 relative overflow-hidden transition-all duration-500 ${isRevoked ? 'opacity-50 grayscale' : ''} ${isGlitching ? 'scale-[1.02] skew-x-1 border-red-500' : 'border-white/5'}`} glow={isRevoked ? 'orange' : 'cyan'}>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.05)_0%,transparent_70%)]"></div>
                <h3 className="text-sm font-mono text-zinc-400 mb-8 uppercase tracking-widest flex items-center gap-2">
                    <Activity className={`w-4 h-4 ${isRevoked ? 'text-red-500' : 'text-cyan-400'}`} /> {isRevoked ? 'Authorization Severed' : 'Live Authorization Flow'}
                </h3>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0 max-w-4xl mx-auto">

                    {/* Node: User */}
                    <div className={`flex flex-col items-center gap-3 relative z-10 transition-transform ${isGlitching ? 'translate-x-[-10px]' : ''}`}>
                        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/5 border flex items-center justify-center ${isRevoked ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]'}`}>
                            <Shield className={`w-6 h-6 sm:w-8 sm:h-8 ${isRevoked ? 'text-red-500' : 'text-white'}`} />
                        </div>
                        <span className="font-mono text-xs font-semibold">User Identity</span>
                    </div>

                    {/* Connection 1 */}
                    <div className={`hidden md:flex flex-1 h-[2px] relative transition-colors ${isRevoked ? 'bg-red-500/20' : 'bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent'}`}>
                        {!isRevoked && <div className="absolute inset-0 bg-cyan-400 blur-[2px] opacity-50 w-1/3 animate-[slide_3s_infinite_linear]"></div>}
                    </div>
                    <div className={`md:hidden w-[2px] h-8 ${isRevoked ? 'bg-red-500/20' : 'bg-cyan-500/50'}`}></div>

                    {/* Node: Auth0 Vault */}
                    <div className={`flex flex-col items-center gap-3 relative z-10 transition-transform ${isGlitching ? 'translate-y-[-10px]' : ''}`}>
                        <div className={`group w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0a0a0a] border flex items-center justify-center ${isRevoked ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-cyan-500/30 shadow-[0_0_20px_rgba(0,240,255,0.2)]'}`}>
                            <Key className={`w-8 h-8 sm:w-10 sm:h-10 ${isRevoked ? 'text-red-500' : 'text-cyan-400'} group-hover:scale-110 transition-transform`} />
                        </div>
                        <div className="flex flex-col items-center">
                            <span className={`font-mono text-xs font-semibold ${isRevoked ? 'text-red-500' : 'text-cyan-400'}`}>Auth0 Token Vault</span>
                            <span className="text-[10px] text-zinc-500">{isRevoked ? 'LOCKED' : 'AES-256 Secured'}</span>
                        </div>
                        {/* Kill Switch */}
                        {!isRevoked && (
                            <button
                                onClick={handleRevoke}
                                className="text-[10px] uppercase font-mono tracking-wider text-red-400 hover:text-red-300 flex items-center gap-1 mt-1 opacity-70 hover:opacity-100 transition-opacity"
                            >
                                <XCircle className="w-3 h-3" /> Cut Flow
                            </button>
                        )}
                    </div>

                    {/* Connection 2 */}
                    <div className={`hidden md:flex flex-1 h-[2px] relative transition-colors ${isRevoked ? 'bg-red-500/20' : 'bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent'}`}>
                        {!isRevoked && <div className="absolute inset-0 bg-cyan-400 blur-[2px] opacity-50 w-1/3 animate-[slide_2s_infinite_linear]"></div>}
                    </div>
                    <div className={`md:hidden w-[2px] h-8 ${isRevoked ? 'bg-red-500/20' : 'bg-cyan-500/50'}`}></div>

                    {/* Node: Agent */}
                    <div className="flex flex-col items-center gap-3 relative z-10">
                        <div className="group w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/5 border border-white/20 flex items-center justify-center relative">
                            {!isRevoked && <div className="absolute inset-0 border border-cyan-500/50 rounded-full animate-ping opacity-20"></div>}
                            <Bot className={`w-6 h-6 sm:w-8 sm:h-8 ${isRevoked ? 'text-zinc-600' : 'text-white'} group-hover:text-cyan-400 transition-colors`} />
                        </div>
                        <span className={`font-mono text-xs font-semibold ${isRevoked ? 'text-zinc-600' : ''}`}>Aether Agent</span>
                    </div>

                    {/* Connection 3 */}
                    <div className={`hidden md:flex flex-1 h-[2px] relative transition-colors ${isRevoked ? 'bg-transparent' : 'bg-gradient-to-r from-transparent via-orange-500/50 to-transparent'}`}>
                        {!isRevoked && <div className="absolute inset-0 bg-orange-400 blur-[2px] opacity-50 w-1/3 animate-[slide_4s_infinite_linear]"></div>}
                    </div>
                    <div className={`md:hidden w-[2px] h-8 ${isRevoked ? 'bg-transparent' : 'bg-orange-500/50'}`}></div>

                    {/* Node: Endpoint */}
                    <div className={`flex flex-col items-center gap-3 relative z-10 transition-transform ${isGlitching ? 'translate-x-[10px]' : ''}`}>
                        <div className={`group w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-orange-500/5 border flex items-center justify-center ${isRevoked ? 'border-zinc-800' : 'border-orange-500/30 shadow-[0_0_15px_rgba(255,77,0,0.1)]'}`}>
                            <Database className={`w-6 h-6 sm:w-8 sm:h-8 ${isRevoked ? 'text-zinc-700' : 'text-orange-400'} group-hover:scale-110 transition-transform`} />
                        </div>
                        <span className={`font-mono text-xs font-semibold ${isRevoked ? 'text-zinc-600' : 'text-orange-400'}`}>Google API</span>
                    </div>

                </div>
            </GlassCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                {/* Active Permissions */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-cyan-400" /> Active Permissions
                    </h3>
                    <div className="grid gap-3">
                        {activePermissions.map((perm) => (
                            <GlassCard key={perm.id} className="p-4 border-white/5 group">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0">
                                    <h4 className="font-medium text-sm text-white">{perm.name}</h4>
                                    <p className="text-xs text-zinc-500 font-mono mt-1">{perm.service}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge color={perm.status === 'active' ? 'cyan' : 'outline'}>
                                        {perm.status.toUpperCase()}
                                    </Badge>
                                    <button className="text-zinc-500 hover:text-red-400 transition-colors">
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>

                {/* Sovereign Audit Log */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-cyan-400" /> Sovereign Audit Log
                    </h3>
                    <GlassCard className="p-0 overflow-hidden border-white/5">
                        <div className="divide-y divide-white/5">
                            {auditLogs.map((log) => (
                                <div key={log.id} className="p-3 text-sm transition-colors hover:bg-white/5">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex gap-3 items-start sm:items-center">
                                        <span className="font-mono text-xs text-zinc-500 w-16 shrink-0">{log.time}</span>
                                        <div>
                                            <span className="text-zinc-300 font-medium block">{log.action}</span>
                                            <span className="text-xs text-zinc-500 font-mono break-words">
                                                {log.actor} → {log.target}
                                            </span>
                                        </div>
                                    </div>
                                    <Badge color={log.status === 'Success' ? 'green' : 'orange'} className="text-[10px] w-fit">
                                        {log.status}
                                    </Badge>
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