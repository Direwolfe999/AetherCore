'use client';

import React from 'react';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    shimmer?: boolean;
    glow?: boolean;
    children: React.ReactNode;
}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
    (
        {
            className = '',
            variant = 'primary',
            size = 'md',
            shimmer = false,
            glow = false,
            children,
            ...props
        },
        ref
    ) => {
        const baseStyles = 'rounded-lg font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

        const variantStyles = {
            primary:
                'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]',
            secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-white/30',
            ghost: 'text-gray-300 hover:text-cyan-400 hover:bg-white/5',
        };

        const sizeStyles = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-base',
            lg: 'px-6 py-3 text-lg',
        };

        const shimmerClass = shimmer ? 'shimmer-button' : '';
        const glowClass = glow ? 'glow-cyan' : '';

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${shimmerClass} ${glowClass} ${className}`}
                {...props}
            >
                {children}
            </button>
        );
    }
);

GlassButton.displayName = 'GlassButton';
