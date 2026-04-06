'use client';

import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeading } from '@/components/ui/section-heading';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Printer, BrainCircuit, GitCommit, Search, ShieldAlert, Cpu, CheckCircle2, Lock, AlertOctagon } from 'lucide-react';
import { fetchBackend, type BackendReasoningResponse } from '@/lib/backend';

interface DecisionNode {
    id: string;
    time: string;
    action: string;
    thought: string;
    confidence: number;
    source: string;
    status: 'safe' | 'alert' | 'processing';
    icon: any;
}

const originalTimeline: DecisionNode[] = [
    {
        id: 'n1',
        time: '14:02:45.112',
        action: 'Intercepted Calendar Invite',
        thought: 'Analyzing inbound payload from external domain. Checking sender reputation and parsing embedded links.',
        confidence: 100,
        source: 'Google Workspace API',
        status: 'processing',
        icon: Search
    },
    {
        id: 'n2',
        time: '14:02:45.340',
        action: 'Mojo Pattern Match',
        thought: 'Detected 92% similarity to known phishing pattern "Shadow-Invite-v4". Link redirects to obfuscated IP.',
        confidence: 92,
        source: 'Mojo Global Threat DB',
        status: 'alert',
        icon: ShieldAlert
    },
    {
        id: 'n3',
        time: '14:02:45.601',
        action: 'Policy Evaluation',
        thought: 'User policy "Zero-Trust Calendar" active. Action required: Quarantine and strip malicious links.',
        confidence: 99,
        source: 'Auth0 Sovereign Ruleset',
        status: 'safe',
        icon: Cpu
    },
    {
        id: 'n4',
        time: '14:02:46.012',
        action: 'Execution & Logging',
        thought: 'Event logged to immutable ledger. User notified. Invite neutralized.',
        confidence: 100,
        source: 'AetherCore Executor',
        status: 'safe',
        icon: CheckCircle2
    }
];

const attackTimeline: DecisionNode[] = [
    {
        id: 'a1',
        time: '15:10:02.112',
        action: 'Mass Authentication Spike',
        thought: 'Detected 400+ login attempts from unverified IPs in last 5 seconds.',
        confidence: 98,
        source: 'Auth0 Anomalies',
        status: 'alert',
        icon: AlertOctagon
    },
    {
        id: 'a2',
        time: '15:10:02.340',
        action: 'Mojo Neural Net Escalation',
        thought: 'Cross-referencing signature. Identifying multi-vector brute force attack. Initiating countermeasures.',
        confidence: 100,
        source: 'Core XAI',
        status: 'processing',
        icon: Cpu
    },
    {
        id: 'a3',
        time: '15:10:02.905',
        action: 'Global Vault Encryption',
        thought: 'Freezing all active refresh tokens. Enforcing zero-trust lock on primary databases.',
        confidence: 100,
        source: 'Sovereign Guardian',
        status: 'safe',
        icon: Lock
    }
];

export default function ReasoningPage() {
    const [isAttackMode, setIsAttackMode] = useState(false); // To let user test the agent
    const [backendTimeline, setBackendTimeline] = useState<DecisionNode[] | null>(null);
    const [backendSummary, setBackendSummary] = useState<BackendReasoningResponse | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [dataSource, setDataSource] = useState<'mock' | 'real'>('mock');

    const fetchMojoReasoning = async () => {
        try {
            const result = await fetchBackend<BackendReasoningResponse>('/api/security/reasoning');
            if (result.ok && result.data) {
                const data = result.data;
                const steps = data.chain_of_thought.length > 0 ? data.chain_of_thought : [data.action_taken];
                const realTimeline: DecisionNode[] = steps.slice(0, 4).map((step, index) => ({
                    id: `real-${index + 1}`,
                    time: new Date().toISOString().split('T')[1].slice(0, 12),
                    action: index === 0 ? data.action_taken : `Reasoning Step ${index + 1}`,
                    thought: step,
                    confidence: Math.round(data.confidence_score),
                    source: data.engine || 'FastAPI + Mojo Backend',
                    status: data.analysis_status === 'fallback' ? 'alert' : 'safe',
                    icon: Cpu,
                }));
                const newNode: DecisionNode = {
                    id: 'summary',
                    time: new Date().toISOString().split('T')[1].slice(0, 12),
                    action: data.action_taken || 'Mojo Threat Analysis',
                    thought: data.chain_of_thought.join(' • '),
                    confidence: Math.round(data.confidence_score),
                    source: 'FastAPI + Mojo Backend',
                    status: data.confidence_score > 70 ? 'safe' : 'alert',
                    icon: Cpu
                };
                setBackendSummary(data);
                setBackendTimeline([realTimeline[0] ?? newNode, newNode, ...realTimeline.slice(1)]);
                setDataSource('real');
            } else {
                setBackendTimeline(originalTimeline);
                setDataSource('mock');
            }
        } catch (error) {
            console.warn("Failed to connect to backend, falling back to mock timeline.");
            setBackendTimeline(originalTimeline);
            setDataSource('mock');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMojoReasoning();
    }, []);

    const mockTimeline = isAttackMode ? attackTimeline : (backendTimeline || originalTimeline);
    const dataLabel = backendSummary?.analysis_status === 'fallback' ? 'BACKEND FALLBACK' : dataSource === 'real' ? 'REAL MOJO DATA' : 'MOCK DATA';

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3">
                    <BrainCircuit className="w-8 h-8 text-cyan-500" />
                    <SectionHeading subtitle="Real-time Explainable AI (XAI) Thought Process" className="m-0">
                        Neural Trace
                    </SectionHeading>
                </div>

                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                    <button
                        onClick={() => setIsAttackMode(!isAttackMode)}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all border ${isAttackMode
                            ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse'
                            : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <AlertOctagon className="w-4 h-4" />
                        {isAttackMode ? 'SIMULATION ACTIVE' : 'SIMULATE ATTACK'}
                    </button>
                    <button
                        onClick={() => { toast.success('Initializing Neural PDF Export...', { description: 'Compiling session logs headers. Launching Print Dialogue.' }); setTimeout(() => window.print(), 1500) }}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all border bg-white/5 text-zinc-400 border-white/10 hover:bg-cyan-500/10 hover:text-cyan-400"
                    >
                        <Printer className="w-4 h-4" />
                        EXPORT PDF
                    </button>
                </div>
            </div>

            <GlassCard className="p-0 overflow-hidden border border-white/10" glow="cyan">
                {/* Header toolbar */}
                <div className="flex flex-col gap-3 border-b border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                        </div>
                        <span className="text-xs font-mono text-cyan-400">aethercore_debugger_v2.1</span>
                    </div>
                    <div className="flex flex-wrap gap-2"><Badge color={dataSource === "real" ? "success" : "warning"} variant="neutral">{dataLabel}</Badge><Badge color="cyan" variant="neutral">XAI MODE: ACTIVE</Badge></div>
                </div>

                {/* Timeline body */}
                <div className="p-6 md:p-10 relative">
                    {/* Vertical line connecting nodes */}
                    <div className="absolute top-10 bottom-10 left-[43px] md:left-[59px] w-px bg-gradient-to-b from-cyan-500/50 via-cyan-500/10 to-transparent"></div>

                    <div className="space-y-12">
                        {isLoading && !isAttackMode ? (
                            <div className="space-y-12 animate-pulse">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="relative flex items-start gap-6">
                                        <div className="h-10 w-10 shrink-0 rounded-full border border-white/10 bg-white/5" />
                                        <div className="flex-1 space-y-3">
                                            <div className="h-4 w-32 bg-white/10 rounded" />
                                            <div className="h-20 w-full bg-white/5 rounded-lg border border-white/5" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : mockTimeline.map((node, index) => (
                            <motion.div
                                key={node.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2, type: 'spring' }}
                                className="relative flex items-start gap-6 group"
                            >
                                {/* Node connector dot */}
                                <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-[#0a0a0a] shadow-lg
                  ${node.status === 'alert' ? 'shadow-orange-500/20 text-orange-400' : 'shadow-cyan-500/20 text-cyan-400'}
                `}>
                                    <node.icon className="h-5 w-5" />
                                    {/* Pulse effect */}
                                    <div className={`absolute inset-0 rounded-full animate-ping opacity-20 
                    ${node.status === 'alert' ? 'bg-orange-500' : 'bg-cyan-500'}
                  `}></div>
                                </div>

                                {/* Content Card */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-xs text-zinc-500">{node.time}</span>
                                            <h3 className="font-medium text-white">{node.action}</h3>
                                        </div>
                                        <Badge color={node.status === 'alert' ? 'orange' : 'outline'} className="w-fit font-mono text-[10px]">
                                            {node.source}
                                        </Badge>
                                    </div>

                                    <GlassCard className={`p-4 border ${node.status === 'alert' ? 'border-orange-500/30 bg-orange-500/5' : 'border-white/5'} backdrop-blur-none`}>
                                        <div className="flex items-start gap-3">
                                            <GitCommit className={`w-5 h-5 shrink-0 mt-0.5 ${node.status === 'alert' ? 'text-orange-400' : 'text-zinc-500'}`} />
                                            <p className="text-sm text-zinc-300 font-mono leading-relaxed">
                                                {node.thought}
                                            </p>
                                        </div>
                                    </GlassCard>

                                    {/* Confidence Bar */}
                                    <div className="pt-2">
                                        <div className="flex items-center justify-between text-xs mb-1.5">
                                            <span className="text-zinc-500 uppercase tracking-wider">Confidence Score</span>
                                            <span className={node.confidence > 90 ? 'text-cyan-400' : 'text-zinc-400'}>{node.confidence}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${node.confidence}%` }}
                                                transition={{ duration: 1, delay: 0.5 + (index * 0.2) }}
                                                className={`h-full rounded-full ${node.status === 'alert' ? 'bg-orange-500' : 'bg-cyan-500'}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}