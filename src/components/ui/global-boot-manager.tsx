'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BootSequence } from '@/components/ui/boot-sequence';

export function GlobalBootManager({ children }: { children: React.ReactNode }) {
    const [booting, setBooting] = useState(true);

    // Optional: only show on initial load (session storage)
    useEffect(() => {
        const hasBooted = sessionStorage.getItem('aethercore_booted');
        if (hasBooted) {
            setBooting(false);
        }
    }, []);

    const handleComplete = () => {
        sessionStorage.setItem('aethercore_booted', 'true');
        setBooting(false);
    };

    return (
        <>
            <AnimatePresence>
                {booting && <BootSequence onComplete={handleComplete} />}
            </AnimatePresence>
            {!booting && children}
        </>
    );
}
