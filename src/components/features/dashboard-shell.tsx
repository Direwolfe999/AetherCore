import { motion } from "framer-motion";
import { ThreatFeed } from "@/components/features/threat-feed";
import { VaultStatus } from "@/components/features/vault-status";

export function DashboardShell() {
    return (
        <motion.section
            className="grid gap-4 lg:grid-cols-2"
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
        >
            <ThreatFeed />
            <VaultStatus />
        </motion.section>
    );
}
