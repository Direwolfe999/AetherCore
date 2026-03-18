import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const events = [
    "Scanning calendar metadata... no malicious invite patterns.",
    "Analyzing mailbox routing rules... no unauthorized forwarding.",
    "Token vault heartbeat confirmed.",
];

export function ThreatFeed() {
    return (
        <Card>
            <div className="mb-3 flex items-center gap-2 text-white">
                <AlertTriangle strokeWidth={1.5} size={16} className="text-[var(--color-orange)]" />
                <h3 className="text-sm font-medium">Threat Monitor Feed</h3>
            </div>
            <ul className="space-y-2 text-sm text-white/75">
                {events.map((event) => (
                    <li key={event} className="flex items-start gap-2">
                        <CheckCircle2
                            strokeWidth={1.5}
                            size={15}
                            className="mt-0.5 shrink-0 text-cyan-200"
                        />
                        <span>{event}</span>
                    </li>
                ))}
            </ul>
        </Card>
    );
}
