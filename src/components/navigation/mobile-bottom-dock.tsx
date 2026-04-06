'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    ShieldCheck,
    Terminal,
    Settings,
    MoreHorizontal,
    BrainCircuit,
    Network,
    Radar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface NavItem {
    name: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
}

const mainNavItems: NavItem[] = [
    {
        name: 'Nexus',
        path: '/dashboard',
        icon: LayoutDashboard,
        label: 'Dashboard',
    },
    {
        name: 'Reasoning',
        path: '/reasoning',
        icon: BrainCircuit,
        label: 'XAI Trace',
    },
    {
        name: 'Radar',
        path: '/radar',
        icon: Radar,
        label: 'Anomalies',
    },
    {
        name: 'Settings',
        path: '/settings',
        icon: Settings,
        label: 'Settings',
    },
];

const extraNavItems: NavItem[] = [
    {
        name: 'Vault',
        path: '/vault',
        icon: ShieldCheck,
        label: 'Token Vault',
    },
    {
        name: 'Governance',
        path: '/governance',
        icon: Network,
        label: 'Identity Map',
    },
    {
        name: 'Intelligence',
        path: '/intelligence',
        icon: Terminal,
        label: 'Threat Feed',
    },
];

export function MobileBottomDock() {
    const pathname = usePathname();
    const [showMore, setShowMore] = useState(false);

    const isActive = (path: string) => {
        return pathname === path || pathname.startsWith(path + '/');
    };

    return (
        <motion.nav
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
                'fixed bottom-0 left-0 right-0 z-40 flex w-full flex-col overflow-x-clip lg:hidden',
                'bg-gradient-to-t from-black/80 via-black/60 to-transparent',
                'backdrop-blur-xl',
                'safe-area-inset-bottom'
            )}
        >
            {/* Expanded Menu for Extra Items */}
            {showMore && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full left-0 right-0 p-4 pb-2 mb-2 bg-black/40 backdrop-blur-3xl border-t border-white/5 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
                >
                    <div className="grid grid-cols-3 gap-2">
                        {extraNavItems.map((item) => {
                            const IconComponent = item.icon;
                            const active = isActive(item.path);

                            return (
                                <Link key={item.path} href={item.path} onClick={() => setShowMore(false)}>
                                    <div className={cn(
                                        'flex flex-col items-center justify-center p-3 rounded-2xl border border-white/5 bg-white/5 transition-all',
                                        active ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.1)]' : 'text-gray-400 focus:bg-white/10'
                                    )}>
                                        <IconComponent className="w-5 h-5 mb-1.5" />
                                        <span className="text-[10px] font-medium leading-none text-center truncate w-full">{item.label}</span>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </motion.div>
            )}

            <div className="relative z-10 grid w-full grid-cols-5 gap-0.5 sm:gap-1 border-t border-white/10 bg-black/30 px-1.5 sm:px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
                {mainNavItems.map((item) => {
                    const IconComponent = item.icon;
                    const active = isActive(item.path);

                    return (
                        <Link key={item.path} href={item.path} className="w-full min-w-0" onClick={() => setShowMore(false)}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.9 }}
                                className={cn(
                                    'relative flex flex-col items-center justify-center gap-1.5 rounded-2xl px-1 py-2 transition-colors duration-200',
                                    active
                                        ? 'bg-gradient-to-t from-cyan-500/20 to-cyan-500/10 text-cyan-400'
                                        : 'text-gray-400 hover:text-white'
                                )}
                            >
                                {/* Active Glow Indicator */}
                                {active && (
                                    <motion.div
                                        layoutId="dock-active"
                                        className="absolute -top-2 h-1 w-8 rounded-full bg-gradient-to-r from-cyan-400 to-orange-400"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}

                                {/* Icon with glow */}
                                <motion.div
                                    animate={{
                                        scale: active ? 1.15 : 1,
                                        filter: active ? 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.6))' : 'drop-shadow(none)',
                                    }}
                                    className="flex items-center justify-center"
                                >
                                    <IconComponent
                                        className="h-[22px] w-[22px]"
                                    />
                                </motion.div>

                                {/* Label */}
                                <span className="text-[9px] sm:text-[10px] font-medium leading-none truncate w-full text-center">{item.label}</span>
                            </motion.div>
                        </Link>
                    );
                })}

                {/* More Button */}
                <button
                    className="w-full min-w-0 flex flex-col items-center justify-center gap-1.5 rounded-2xl px-1 py-2 text-gray-400 transition-colors"
                    onClick={() => setShowMore(!showMore)}
                >
                    <motion.div
                        animate={{
                            rotate: showMore ? 180 : 0,
                            scale: showMore ? 1.15 : 1
                        }}
                        className={cn(
                            "flex items-center justify-center transition-colors",
                            showMore ? "text-white" : ""
                        )}
                    >
                        <MoreHorizontal className="h-[22px] w-[22px]" />
                    </motion.div>
                    <span className={cn(
                        "text-[9px] sm:text-[10px] font-medium leading-none transition-colors truncate w-full text-center",
                        showMore ? "text-white" : ""
                    )}>More</span>
                </button>

            </div>
        </motion.nav>
    );
}
