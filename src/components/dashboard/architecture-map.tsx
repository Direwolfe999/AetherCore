'use client';

import { motion } from 'framer-motion';
import { Server, Shield, Zap, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

export function ArchitectureMap() {
    return (
        <div className="w-full mt-8 mb-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Server className="text-cyan-400 w-5 h-5" />
                Backend Architecture
            </h2>

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-orange-500/10 to-cyan-500/10 rounded-xl blur-xl" />

                {/* Next.js + Auth0 */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative group z-10 w-full md:w-1/3"
                >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                    <GlassCard className="relative flex flex-col items-center p-6 text-center h-full">
                        <Shield className="w-10 h-10 text-cyan-400 mb-3" />
                        <h3 className="text-lg font-bold text-white">Next.js + Auth0</h3>
                        <p className="text-xs text-gray-400 mt-2">Frontend & Identity</p>

                        {/* Tooltip */}
                        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity -top-12 left-1/2 -translate-x-1/2 bg-black/90 border border-cyan-500/50 text-cyan-400 text-xs px-3 py-1.5 rounded pointer-events-none whitespace-nowrap z-20">
                            Secure authentication gateway
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Arrow */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="hidden md:flex flex-col items-center justify-center z-10"
                >
                    <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ x: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                            >
                                <ArrowRight className="w-5 h-5 text-cyan-500" />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* FastAPI */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="relative group z-10 w-full md:w-1/3"
                >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                    <GlassCard glow="orange" className="relative flex flex-col items-center p-6 text-center h-full">
                        <Server className="w-10 h-10 text-orange-400 mb-3" />
                        <h3 className="text-lg font-bold text-white">FastAPI</h3>
                        <p className="text-xs text-gray-400 mt-2">Orchestration Layer</p>

                        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity -top-12 left-1/2 -translate-x-1/2 bg-black/90 border border-orange-500/50 text-orange-400 text-xs px-3 py-1.5 rounded pointer-events-none whitespace-nowrap z-20">
                            API routing & middleware
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Arrow */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="hidden md:flex flex-col items-center justify-center z-10"
                >
                    <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ x: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                            >
                                <ArrowRight className="w-5 h-5 text-green-500" />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
 {/* Mojo engine real time feed */}
                {/* Mojo Engine */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="relative group z-10 w-full md:w-1/3"
                >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                    <GlassCard glow="cyan" className="relative flex flex-col items-center p-6 text-center h-full">
                        <Zap className="w-10 h-10 text-green-400 mb-3" />
                        <h3 className="text-lg font-bold text-white">Mojo Engine</h3>
                        <p className="text-xs text-gray-400 mt-2">AI Inference & Sync</p>

                        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity -top-12 left-1/2 -translate-x-1/2 bg-black/90 border border-green-500/50 text-green-400 text-xs px-3 py-1.5 rounded pointer-events-none whitespace-nowrap z-20">
                            High-performance processing
                        </div>
                    </GlassCard>
                </motion.div>

            </div>
        </div>
    );
}
