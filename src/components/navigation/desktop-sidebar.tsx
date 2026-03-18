'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    ShieldCheck,
    Terminal,
    Settings,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
    name: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
}

const navItems: NavItem[] = [
    {
        name: 'Nexus',
        path: '/dashboard',
        icon: LayoutDashboard,
        label: 'Dashboard',
    },
    {
        name: 'Vault',
        path: '/vault',
        icon: ShieldCheck,
        label: 'Token Vault',
    },
    {
        name: 'Intelligence',
        path: '/intelligence',
        icon: Terminal,
        label: 'Threat Feed',
    },
    {
        name: 'Sovereign',
        path: '/settings',
        icon: Settings,
        label: 'Settings',
    },
];

export function DesktopSidebar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path || pathname.startsWith(path + '/');
    };

    return (
        <motion.aside
            initial={{ width: 80 }}
            animate={{ width: isExpanded ? 280 : 80 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
                'fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-white/10',
                'bg-gradient-to-b from-white/5 via-white/3 to-black/10 backdrop-blur-xl',
                'lg:flex'
            )}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            {/* Header Logo */}
            <div className="flex items-center justify-center border-b border-white/10 px-4 py-6">
                <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-orange-500/20 text-lg font-bold text-cyan-400"
                >
                    Æ
                </motion.div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 space-y-2 px-3 py-6">
                {navItems.map((item) => {
                    const IconComponent = item.icon;
                    const active = isActive(item.path);

                    return (
                        <Link key={item.path} href={item.path}>
                            <motion.div
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    'relative flex items-center gap-3 rounded-lg px-3 py-3 transition-colors duration-200',
                                    active
                                        ? 'bg-white/10 text-cyan-400'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                )}
                            >
                                {/* Active Glow Background */}
                                {active && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/10 to-transparent"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}

                                {/* Icon */}
                                <motion.div
                                    animate={{ scale: active ? 1.1 : 1 }}
                                    className={cn(
                                        'relative z-10 flex-shrink-0',
                                        active && 'drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]'
                                    )}
                                >
                                    <IconComponent
                                        className="h-5 w-5"
                                    />
                                </motion.div>

                                {/* Label */}
                                {isExpanded && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -8 }}
                                        transition={{ delay: 0.1 }}
                                        className="relative z-10 whitespace-nowrap text-sm font-medium"
                                    >
                                        {item.name}
                                    </motion.span>
                                )}

                                {/* Tooltip on hover when collapsed */}
                                {!isExpanded && (
                                    <div className="absolute left-16 top-1/2 -translate-y-1/2 rounded-lg bg-black/80 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 backdrop-blur-sm">
                                        {item.label}
                                    </div>
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse Toggle Button */}
            <div className="border-t border-white/10 px-3 py-6">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex w-full items-center justify-center rounded-lg bg-white/5 p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                >
                    {isExpanded ? (
                        <ChevronLeft className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                </motion.button>
            </div>
        </motion.aside>
    );
}
