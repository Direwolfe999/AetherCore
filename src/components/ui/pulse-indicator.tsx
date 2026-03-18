'use client';

import React from 'react';

interface PulseIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
    color?: 'cyan' | 'orange' | 'green' | 'red';
    size?: 'sm' | 'md' | 'lg';
    animated?: boolean;
}

export const PulseIndicator = React.forwardRef<HTMLDivElement, PulseIndicatorProps>(
    ({ className = '', color = 'cyan', size = 'md', animated = true, ...props }, ref) => {
        const colorStyles = {
            cyan: 'bg-cyan-400 shadow-cyan-400/50',
            orange: 'bg-orange-400 shadow-orange-400/50',
            green: 'bg-green-400 shadow-green-400/50',
            red: 'bg-red-400 shadow-red-400/50',
        };

        const sizeStyles = {
            sm: 'w-2 h-2',
            md: 'w-3 h-3',
            lg: 'w-4 h-4',
        };

        return (
            <div
                ref={ref}
                className={`rounded-full ${sizeStyles[size]} ${colorStyles[color]} ${animated ? 'pulse-glow' : ''} ${className}`}
                {...props}
            />
        );
    }
);

PulseIndicator.displayName = 'PulseIndicator';
