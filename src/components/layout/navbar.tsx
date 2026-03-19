'use client';

import Link from 'next/link';
import { Shield, Lock, Activity } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <nav className="sticky top-0 z-50 glass-card m-0 rounded-none border-b border-l-0 border-r-0 border-t-0 bg-white/5 backdrop-blur-xl">
            <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
                <div className="flex items-center justify-between gap-8">
                    {/* Logo & Branding */}
                    <a href="/" className="flex items-center gap-3 transition-all duration-300 hover:opacity-80 cursor-pointer">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-orange-500/30 rounded-lg blur" />
                            <div className="relative bg-white/10 p-2 rounded-lg border border-white/20">
                                <Shield className="w-6 h-6 text-cyan-400 icon-thin" strokeWidth={1.5} />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-orange-500 bg-clip-text text-transparent">
                                AetherCore
                            </h1>
                            <p className="text-xs text-gray-400 leading-none">Sovereign Guardian</p>
                        </div>
                    </a>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link
                            href="/dashboard"
                            className="px-3 py-2 rounded-lg text-sm text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-cyan-400 flex items-center gap-2"
                        >
                            <Activity className="w-4 h-4 icon-thin" strokeWidth={1.5} />
                            Dashboard
                        </Link>
                        <Link
                            href="#"
                            className="px-3 py-2 rounded-lg text-sm text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-cyan-400 flex items-center gap-2"
                        >
                            <Lock className="w-4 h-4 icon-thin" strokeWidth={1.5} />
                            Vault
                        </Link>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <button className="hidden sm:inline-flex px-4 py-2 rounded-lg text-sm text-gray-300 border border-white/10 transition-all duration-300 hover:bg-white/5 hover:border-white/20">
                            Docs
                        </button>

                        <button
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className="relative px-6 py-2 rounded-lg font-semibold text-black overflow-hidden transition-all duration-300 group"
                        >
                            {/* Shimmer Background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-400 bg-size-200 animate-pulse" />

                            {/* Glow Effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400/50 to-cyan-400/50 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-300" />

                            {/* Content */}
                            <span className="relative flex items-center gap-2 whitespace-nowrap">
                                Connect to Vault
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Subtle divider line */}
            <div className="h-px bg-gradient-to-r from-cyan-400/0 via-cyan-400/50 to-cyan-400/0" />
        </nav>
    );
}
