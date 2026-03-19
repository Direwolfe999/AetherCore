'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Terminal,
    LayoutDashboard,
    ShieldCheck,
    Radar,
    Network,
    BrainCircuit,
    Settings,
    AlertOctagon,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Command {
    id: string;
    title: string;
    icon: any;
    action: () => void;
    category: string;
}

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Toggle on CMD+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    // Also close on Escape
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const commands: Command[] = [
        { id: 'nexus', title: 'Go to Nexus (Dashboard)', icon: LayoutDashboard, category: 'Navigation', action: () => { router.push('/dashboard'); setOpen(false); } },
        { id: 'vault', title: 'Go to Token Vault', icon: ShieldCheck, category: 'Navigation', action: () => { router.push('/vault'); setOpen(false); } },
        { id: 'intelligence', title: 'Go to Intelligence', icon: Terminal, category: 'Navigation', action: () => { router.push('/intelligence'); setOpen(false); } },
        { id: 'reasoning', title: 'Go to XAI Trace', icon: BrainCircuit, category: 'Navigation', action: () => { router.push('/reasoning'); setOpen(false); } },
        { id: 'radar', title: 'Go to Anomaly Radar', icon: Radar, category: 'Navigation', action: () => { router.push('/radar'); setOpen(false); } },
        { id: 'governance', title: 'Go to Identity Map', icon: Network, category: 'Navigation', action: () => { router.push('/governance'); setOpen(false); } },
        { id: 'settings', title: 'Go to Sovereign Controls', icon: Settings, category: 'Navigation', action: () => { router.push('/settings'); setOpen(false); } },
        { id: 'panic', title: 'Activate Panic Mode (Simulate)', icon: AlertOctagon, category: 'Actions', action: () => { alert('PANIC MODE SIMULATED. ALL TOKENS REVOKED.'); setOpen(false); } },
    ];

    const filteredCommands = commands.filter((command) =>
        command.title.toLowerCase().includes(query.toLowerCase())
    );

    // Reset active index when query changes
    useEffect(() => {
        setActiveIndex(0);
    }, [query]);

    // Keyboard navigation
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : prev));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
            } else if (e.key === 'Enter' && filteredCommands.length > 0) {
                e.preventDefault();
                filteredCommands[activeIndex].action();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, filteredCommands, activeIndex]);

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] sm:pt-[15vh]">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Palette */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="relative w-full max-w-xl mx-4 overflow-hidden rounded-2xl bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,240,255,0.1)]"
                    >
                        {/* Search Input */}
                        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
                            <Search className="w-5 h-5 text-cyan-500" />
                            <input
                                ref={inputRef}
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Type a command or search..."
                                className="flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-500 font-mono text-sm"
                            />
                            <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
                                <span className="px-1.5 py-0.5 rounded-md bg-white/10 border border-white/10">ESC</span>
                                to close
                            </div>
                        </div>

                        {/* Results */}
                        <div className="max-h-[60vh] overflow-y-auto p-2 no-scrollbar">
                            {filteredCommands.length === 0 ? (
                                <div className="py-14 text-center text-zinc-500 font-mono text-sm">
                                    No commands found.
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {filteredCommands.map((command, idx) => {
                                        const isActive = idx === activeIndex;
                                        return (
                                            <div
                                                key={command.id}
                                                onMouseEnter={() => setActiveIndex(idx)}
                                                onClick={() => command.action()}
                                                className={cn(
                                                    "flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-200",
                                                    isActive
                                                        ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400"
                                                        : "bg-transparent border border-transparent text-zinc-400 hover:text-white"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <command.icon className={cn(
                                                        "w-4 h-4",
                                                        isActive ? "text-cyan-400" : "text-zinc-500"
                                                    )} />
                                                    <span className="font-medium text-sm">{command.title}</span>
                                                </div>
                                                {isActive && <ArrowRight className="w-4 h-4" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 bg-white/5">
                            <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-2">
                                <span><span className="px-1 py-0.5 rounded bg-white/10">↑</span> <span className="px-1 py-0.5 rounded bg-white/10">↓</span> to navigate</span>
                                <span><span className="px-1 py-0.5 rounded bg-white/10">↵</span> to select</span>
                            </div>
                            <span className="text-[10px] font-mono text-cyan-500/50">AETHER_OS v2.1</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}