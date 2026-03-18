import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "relative inline-flex items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cyan)] disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                primary:
                    "border-cyan-300/30 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/15 active:scale-[0.99]",
                ghost:
                    "border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white",
            },
            size: {
                sm: "h-9 px-4",
                md: "h-11 px-5",
                lg: "h-12 px-6",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    },
);

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    shimmer?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, shimmer = false, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(buttonVariants({ variant, size }), shimmer && "shimmer", className)}
                {...props}
            >
                {children}
            </button>
        );
    },
);

Button.displayName = "Button";
