'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    Lock,
    ShieldAlert,
} from 'lucide-react';
import { useAuthState } from '@/hooks/use-auth-state';

export function SystemStatusBar() {
    const { session } = useAuthState();
    const [mojoActive, setMojoActive] = useState(true);
    const [panicMode, setPanicMode] = useState(false);

    // Simulate Mojo pulse animation
    useEffect(() => {
        const interval = setInterval(() => {
            setMojoActive(prev => !prev);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    // Get user initials for avatar
    const getUserInitials = () => {
        if (session?.user) {
            const name = session.user.name || 'User';
            return name.split(' ').map(n => n[0]).join('').toUpperCase();
        }
        return '?';
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 py-3 md:px-6">
                {/* Left: Mojo Engine Status */}
                <div className="flex items-center gap-3">
                    <motion.div
                        animate={{
                            backgroundColor: mojoActive
                                ? 'rgba(0, 240, 255, 0.3)'
                                : 'rgba(0, 240, 255, 0.1)',
                            boxShadow: mojoActive
                                ? '0 0 16px rgba(0, 240, 255, 0.4)'
                                : '0 0 4px rgba(0, 240, 255, 0.2)',
                        }}
                        transition={{ duration: 1, ease: 'easeInOut' }}
                        className="flex items-center gap-2 rounded-full border border-cyan-400/30 px-3 py-1.5"
                    >
                        <Zap className="h-4 w-4 text-cyan-400" strokeWidth={1.5} />
                        <span className="text-xs font-medium text-cyan-300">
                            Mojo {mojoActive ? 'Active' : 'Idle'}
                        </span>
                    </motion.div>
                </div>

                {/* Center: Title (hidden on mobile) */}
                <div className="hidden sm:block">
                    <h1 className="text-sm font-semibold text-white">AetherCore</h1>
                </div>

                {/* Right: User Avatar + Panic Button */}
                <div className="flex items-center gap-3">
                    {/* User Avatar */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 hover:bg-white/10"
                    >
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-orange-400 text-xs font-bold text-white">
                            {getUserInitials()}
                        </div>
                        <span className="hidden text-xs font-medium text-gray-300 sm:inline">
                            {session?.user?.name || 'Guest'}
                        </span>
                    </motion.div>

                    {/* Panic Button */}
                    <motion.button
                        onClick={() => setPanicMode(!panicMode)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                            backgroundColor: panicMode
                                ? 'rgba(255, 77, 0, 0.2)'
                                : 'rgba(255, 77, 0, 0.1)',
                        }}
                        className="flex items-center gap-1.5 rounded-full border border-orange-400/30 px-3 py-1.5 transition-all hover:border-orange-400/50"
                        title="Emergency Lock - Clears sensitive data"
                    >
                        <Lock className="h-4 w-4 text-orange-400" strokeWidth={1.5} />
                        <span className="hidden text-xs font-medium text-orange-300 sm:inline">
                            {panicMode ? 'Locked' : 'Safe'}
                        </span>
                    </motion.button>

                    {/* Alert Indicator */}
                    {panicMode && (
                        <motion.div
                            animate={{ opacity: [1, 0.5] }}
                            transition={{ duration: 0.6, repeat: Infinity }}
                            className="flex items-center gap-1 rounded-full bg-orange-500/20 px-2 py-1"
                        >
                            <ShieldAlert className="h-3.5 w-3.5 text-orange-400" strokeWidth={1.5} />
                            <span className="text-xs font-semibold text-orange-300">ALERT</span>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
