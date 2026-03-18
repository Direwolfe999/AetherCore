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
                className={`${hoverClass} ${glowClass} ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

GlassCard.displayName = 'GlassCard';
