'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Shield, Zap } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { SystemStatusGrid } from '@/components/dashboard/system-status-grid';
import { useAuthState } from '@/hooks/use-auth-state';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
};

export default function Home() {
    const { isAuthenticated, login } = useAuthState();

    return (
        <motion.div
            className="space-y-12 md:space-y-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Hero Section */}
            <motion.section variants={itemVariants} className="space-y-8 pt-8 md:pt-12">
                <div className="relative overflow-hidden rounded-2xl">
                    {/* Background gradient glow */}
                    <div className="absolute -inset-20 bg-gradient-to-r from-cyan-500/20 via-transparent to-orange-500/20 blur-3xl opacity-40" />

                    <div className="relative space-y-6">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200"
                        >
                            <Zap className="w-4 h-4 icon-thin" strokeWidth={1.5} />
                            Next-Gen Security Guardian
                        </motion.div>

                        {/* Main Headline */}
                        <SectionHeading
                            level="h1"
                            subtitle="Protect your identity with sovereign, low-latency threat detection powered by Mojo and Auth0."
                            className="text-4xl md:text-6xl lg:text-7xl max-w-5xl"
                        >
                            AetherCore: Your Digital Bodyguard
                        </SectionHeading>

                        {/* Description */}
                        <motion.p
                            variants={itemVariants}
                            className="text-base md:text-lg text-gray-400 max-w-3xl leading-relaxed"
                        >
                            Real-time threat monitoring. Token vault encryption. Mojo-powered inference under 50ms. The future of identity security is here—and it's fast.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
                            <GlassButton
                                variant="primary"
                                size="lg"
                                onClick={login}
                                className="shimmer-button glow-cyan group"
                            >
                                <Shield className="w-5 h-5 icon-thin group-hover:animate-bounce" strokeWidth={1.5} />
                                Connect via Auth0
                                <motion.div
                                    animate={{ x: [0, 4, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <ArrowRight className="w-5 h-5 icon-thin" strokeWidth={1.5} />
                                </motion.div>
                            </GlassButton>

                            {isAuthenticated && (
                                <Link href="/dashboard">
                                    <GlassButton variant="secondary" size="lg" className="w-full sm:w-auto">
                                        <Zap className="w-5 h-5 icon-thin" strokeWidth={1.5} />
                                        Go to Dashboard
                                        <ArrowRight className="w-5 h-5 icon-thin" strokeWidth={1.5} />
                                    </GlassButton>
                                </Link>
                            )}
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* System Status Preview */}
            <motion.section variants={itemVariants} className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Live System Status</h2>
                    <span className="text-sm text-cyan-400 flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        All Systems Operational
                    </span>
                </div>
                <SystemStatusGrid />
            </motion.section>

            {/* Features Grid */}
            <motion.section variants={itemVariants} className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Core Features</h2>

                <div className="grid gap-4 md:grid-cols-3">
                    {[
                        {
                            icon: Shield,
                            title: 'Threat Detection',
                            description: 'Real-time scanning of OAuth flows, token permissions, and auth anomalies',
                        },
                        {
                            icon: Zap,
                            title: 'Lightning Fast',
                            description: 'Mojo-powered inference in under 50ms. Security that doesn\'t slow you down.',
                        },
                        {
                            icon: Shield,
                            title: 'Token Vault',
                            description: 'Encrypted session storage with Auth0 integration and automatic rotation',
                        },
                    ].map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                            >
                                <GlassCard className="p-6 h-full hover" glow={index === 0 ? 'cyan' : 'none'}>
                                    <Icon className="w-8 h-8 icon-thin text-cyan-400 mb-3" strokeWidth={1.5} />
                                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                    <p className="text-sm text-gray-400">{feature.description}</p>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section
                variants={itemVariants}
                className="relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-cyan-500/10 to-transparent p-8 md:p-12"
            >
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">
                        Ready to Guard Your Identity?
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Join operators worldwide who trust AetherCore to protect their digital lives.
                    </p>
                    <GlassButton variant="primary" size="lg" onClick={login} className="shimmer-button glow-cyan">
                        Start Session
                        <ArrowRight className="w-5 h-5 icon-thin" strokeWidth={1.5} />
                    </GlassButton>
                </div>

                {/* Decorative elements */}
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl" />
                <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-orange-400/5 rounded-full blur-3xl" />
            </motion.section>
        </motion.div>
    );
}
