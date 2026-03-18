import { motion } from "framer-motion";
import { Activity, Database, ShieldCheck, Timer } from "lucide-react";
import { Card } from "@/components/ui/card";

const stats = [
    {
        label: "Inference Latency",
        value: "34ms",
        icon: Timer,
        tone: "text-cyan-200",
    },
    {
        label: "Threat Scan Uptime",
        value: "99.997%",
        icon: ShieldCheck,
        tone: "text-cyan-200",
    },
    {
        label: "Vault Integrity",
        value: "Stable",
        icon: Database,
        tone: "text-white",
    },
    {
        label: "Live Signal",
        value: "Nominal",
        icon: Activity,
        tone: "text-[var(--color-orange)]",
    },
] as const;

export function SystemStatusGrid() {
    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item, index) => {
                const Icon = item.icon;
                return (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 * index, duration: 0.35 }}
                    >
                        <Card className="scan-line relative overflow-hidden">
                            <div className="mb-3 flex items-center justify-between text-white/65">
                                <span className="text-xs tracking-wide">{item.label}</span>
                                <Icon strokeWidth={1.5} size={16} className={item.tone} />
                            </div>
                            <p className="text-xl font-semibold text-white">{item.value}</p>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
}
