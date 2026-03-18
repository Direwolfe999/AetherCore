'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    ShieldCheck,
    Terminal,
    Settings,
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
        label: 'Vault',
    },
    {
        name: 'Intelligence',
        path: '/intelligence',
        icon: Terminal,
        label: 'Intel',
    },
    {
        name: 'Sovereign',
        path: '/settings',
        icon: Settings,
        label: 'Settings',
    },
];

export function MobileBottomDock() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path || pathname.startsWith(path + '/');
    };

    return (
        <motion.nav
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
                'fixed bottom-0 left-0 right-0 z-40 flex lg:hidden',
                'border-t border-white/10',
                'bg-gradient-to-t from-black/40 via-black/20 to-transparent',
                'backdrop-blur-xl',
                'safe-area-inset-bottom'
            )}
        >
            <div className="flex w-full items-end justify-around gap-2 px-4 py-3">
                {navItems.map((item) => {
                    const IconComponent = item.icon;
                    const active = isActive(item.path);

                    return (
                        <Link key={item.path} href={item.path} className="flex-1">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.9 }}
                                className={cn(
                                    'relative flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 transition-colors duration-200',
                                    active
                                        ? 'bg-gradient-to-t from-cyan-500/20 to-cyan-500/10 text-cyan-400'
                                        : 'text-gray-400 hover:text-white'
                                )}
                            >
                                {/* Active Glow Indicator */}
                                {active && (
                                    <motion.div
                                        layoutId="dock-active"
                                        className="absolute -top-2 h-1.5 w-8 rounded-full bg-gradient-to-r from-cyan-400 to-orange-400"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}

                                {/* Icon with glow */}
                                <motion.div
                                    animate={{
                                        scale: active ? 1.2 : 1,
                                        filter: active ? 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.6))' : 'drop-shadow(none)',
                                    }}
                                    className="flex items-center justify-center"
                                >
                                    <IconComponent
                                        className="h-6 w-6"
                                    />
                                </motion.div>

                                {/* Label */}
                                <span className="text-xs font-medium">{item.label}</span>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </motion.nav>
    );
}
