'use client';

import React from 'react';

interface SectionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    level?: 'h1' | 'h2' | 'h3' | 'h4';
    subtitle?: React.ReactNode;
    children: React.ReactNode;
}

export const SectionHeading = React.forwardRef<HTMLHeadingElement, SectionHeadingProps>(
    ({ className = '', level = 'h2', subtitle, children, ...props }, ref) => {
        const Component = level as React.ElementType;
        const sizeStyles = {
            h1: 'text-4xl md:text-5xl lg:text-6xl',
            h2: 'text-3xl md:text-4xl lg:text-5xl',
            h3: 'text-2xl md:text-3xl lg:text-4xl',
            h4: 'text-xl md:text-2xl lg:text-3xl',
        };

        return (
            <div className="space-y-2">
                <Component
                    ref={ref}
                    className={`font-bold leading-tight text-white ${sizeStyles[level]} ${className}`}
                    {...props}
                >
                    {children}
                </Component>
                {subtitle && <p className="text-gray-400 text-base md:text-lg">{subtitle}</p>}
            </div>
        );
    }
);

SectionHeading.displayName = 'SectionHeading';
