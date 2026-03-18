import { LockKeyhole, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";

export function VaultStatus() {
    return (
        <Card className="relative overflow-hidden">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-300/10 blur-2xl" />
            <div className="mb-3 flex items-center gap-2 text-white">
                <LockKeyhole strokeWidth={1.5} size={16} className="text-cyan-200" />
                <h3 className="text-sm font-medium">Vault Status</h3>
            </div>
            <div className="space-y-2 text-sm text-white/75">
                <p className="flex items-center justify-between">
                    Session Token Vault <span className="text-cyan-200">Encrypted</span>
                </p>
                <p className="flex items-center justify-between">
                    Integrity Monitor <span className="text-cyan-200">Live</span>
                </p>
                <p className="flex items-center justify-between">
                    Last Alert <span className="inline-flex items-center gap-1 text-[var(--color-orange)]"><ShieldAlert strokeWidth={1.5} size={14} /> 0 Critical</span>
                </p>
            </div>
        </Card>
    );
}
