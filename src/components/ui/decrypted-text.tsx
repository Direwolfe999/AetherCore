'use client';

import { useState, useEffect } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:"<>?[]\\;\',./`~';

export function DecryptedText({ text, speed = 50, duration = 1200 }: { text: string; speed?: number; duration?: number }) {
    const [displayedText, setDisplayedText] = useState(text.replace(/./g, () => CHARS[Math.floor(Math.random() * CHARS.length)]));

    useEffect(() => {
        let iterations = 0;
        const totalIterations = Math.floor(duration / speed);

        const interval = setInterval(() => {
            setDisplayedText(prev => {
                let nextText = '';
                for (let i = 0; i < text.length; i++) {
                    const charTarget = totalIterations * (i / text.length);
                    // Gradually reveal the real character based on string index and time
                    if (iterations >= charTarget) {
                        nextText += text[i];
                    } else if (text[i] === ' ') {
                        nextText += ' '; // skip spaces for matrix effect
                    } else {
                        nextText += CHARS[Math.floor(Math.random() * CHARS.length)];
                    }
                }
                return nextText;
            });

            iterations++;
            if (iterations > totalIterations) {
                clearInterval(interval);
                setDisplayedText(text); // Ensure final exact match
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed, duration]);

    return <span>{displayedText}</span>;
}