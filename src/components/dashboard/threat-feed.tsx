'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';

interface ThreatEvent {
    id: string;
    timestamp: string;
    message: string;
    severity: 'info' | 'warning' | 'critical';
}

const mockEvents: ThreatEvent[] = [
    {
        id: '1',
        timestamp: '2 seconds ago',
        message: 'Scanned OAuth flow from Gmail API • No anomalies detected',
        severity: 'info',
    },
    {
        id: '2',
        timestamp: '15 seconds ago',
        message: 'Verified Auth0 tenant certificate • Valid through 2027',
        severity: 'info',
    },
    {
        id: '3',
        timestamp: '42 seconds ago',
        message: 'Token rotation cycle completed • Entropy check passed',
        severity: 'info',
    },
    {
        id: '4',
        timestamp: '1 minute ago',
        message: 'Threat signature update deployed • 847 new patterns',
        severity: 'warning',
    },
];

function ThreatEventItem({ event, index }: { event: ThreatEvent; index: number }) {
    const severityStyles = {
        info: 'text-cyan-400',
        warning: 'text-orange-400',
        critical: 'text-red-400',
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0"
        >
            <CheckCircle2 className={`w-4 h-4 icon-thin mt-0.5 flex-shrink-0 ${severityStyles[event.severity]}`} strokeWidth={1.5} />
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300 break-words">{event.message}</p>
                <div className="flex items-center gap-1.5 mt-1">
                    <Clock className="w-3 h-3 text-gray-500 icon-thin" strokeWidth={1.5} />
                    <span className="text-xs text-gray-500">{event.timestamp}</span>
                </div>
            </div>
        </motion.div>
    );
}

export function ThreatFeed() {
    return (
        <GlassCard className="p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 icon-thin text-orange-400" strokeWidth={1.5} />
                <h3 className="text-lg font-semibold text-white">Threat Monitor</h3>
                <Badge variant="info" className="ml-auto">
                    Live Feed
                </Badge>
            </div>

            <div className="space-y-3">
                {mockEvents.map((event, index) => (
                    <ThreatEventItem key={event.id} event={event} index={index} />
                ))}
            </div>

            <motion.button
                whileHover={{ x: 4 }}
                className="mt-4 text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
                View full history →
            </motion.button>
        </GlassCard>
    );
}
