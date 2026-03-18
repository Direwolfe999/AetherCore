'use client';

import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
    children: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className = '', variant = 'neutral', children, ...props }, ref) => {
        const variantStyles = {
            info: 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30',
            success: 'bg-green-400/20 text-green-300 border border-green-400/30',
            warning: 'bg-orange-400/20 text-orange-300 border border-orange-400/30',
            danger: 'bg-red-400/20 text-red-300 border border-red-400/30',
            neutral: 'bg-white/10 text-gray-300 border border-white/20',
        };

        return (
            <span
                ref={ref}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${variantStyles[variant]} ${className}`}
                {...props}
            >
                {children}
            </span>
        );
    }
);

Badge.displayName = 'Badge';
