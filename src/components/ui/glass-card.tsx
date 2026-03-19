'use client';

import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    glow?: 'cyan' | 'orange' | 'none';
    children: React.ReactNode;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className = '', hover = true, glow = 'none', children, ...props }, ref) => {
        const glowClass = glow === 'cyan' ? 'glow-cyan' : glow === 'orange' ? 'glow-orange' : '';
        const hoverClass = hover ? 'glass-card-hover' : 'glass-card';

        return (
            <div
                ref={ref}
                className={`${hoverClass} ${glowClass} ${className} relative overflow-hidden`}
                {...props}
            >
                <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-20 Mix-blend-overlay" />
                <div className="pointer-events-none absolute inset-0 z-0 h-[200%] w-full bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-scanline mix-blend-overlay" />
                <div className="relative z-[1] h-full w-full">{children}</div>
            </div>
        );
    }
);

GlassCard.displayName = 'GlassCard';
