import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "glass-panel rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5",
                className,
            )}
            {...props}
        />
    );
}
