'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';

export function BootSequence({ onComplete }: { onComplete: () => void }) {
    const [lines, setLines] = useState<string[]>([]);
    
    useEffect(() => {
        const bootLogs = [
            "INIT AETHERCORE SECURE UPLINK...",
            "[OK] Vault Encryption Key Verified",
            "[OK] Handshake with Auth0 Guardian Node",
            "[OK] Engaging Mojo MAX Kernel",
            "Establishing zero-trust perimeter...",
            "Loading Sovereign Rulesets...",
            "SYSTEM NOMINAL. ACCESS GRANTED."
        ];
        
        let index = 0;
        const interval = setInterval(() => {
            if (index < bootLogs.length) {
                setLines(prev => [...prev, bootLogs[index]]);
                index++;
            } else {
                clearInterval(interval);
                setTimeout(onComplete, 500); // give it half a second before fade out
            }
        }, 300);
        
        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
        >
            <div className="max-w-2xl w-full p-8 font-mono text-sm">
                <div className="flex items-center gap-3 mb-6">
                    <Terminal className="text-cyan-500 w-6 h-6" />
                    <span className="text-cyan-500 font-bold tracking-widest text-lg">AETHERCORE BOOT_SEQ v1.0</span>
                </div>
                
                <div className="space-y-2">
                    {lines.map((line, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`${line.includes('[OK]') ? 'text-green-400' : line.includes('INIT') || line.includes('SYSTEM') ? 'text-cyan-400 font-bold' : 'text-zinc-400'}`}
                        >
                            <span className="opacity-50 mr-2">{new Date().toISOString().split('T')[1].slice(0, 8)}</span>
                            {line}
                        </motion.div>
                    ))}
                    {lines.length < 7 && (
                        <motion.div
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="w-2 h-4 bg-cyan-500 inline-block mt-2"
                        />
                    )}
                </div>
            </div>
        </motion.div>
    );
}
