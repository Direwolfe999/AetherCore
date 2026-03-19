'use client';

import { useEffect, useRef } from 'react';
import createGlobe from 'cobe';

export function Globe({ threatActive = false }: { threatActive?: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let phi = 0;
        let width = 0;

        const onResize = () => {
            if (canvasRef.current) {
                width = canvasRef.current.offsetWidth;
            }
        };
        window.addEventListener('resize', onResize);
        onResize();

        if (!canvasRef.current) return;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: width * 2,
            height: width * 2,
            phi: 0,
            theta: 0.3,
            dark: 0.95,
            diffuse: 1.2,
            scale: 1,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: threatActive ? [1, 0.1, 0.1] : [0.15, 0.2, 0.3], // Dark blue-gray so it is visible
            markerColor: [0, 0.94, 1], // Cyan
            glowColor: threatActive ? [1, 0.1, 0.1] : [0.1, 0.6, 0.9], // Cyan glow
            offset: [0, 0],
            markers: [
                { location: [37.7595, -122.4367], size: 0.03 }, // SF
                { location: [40.7128, -74.0060], size: 0.05 }, // NY
                { location: [51.5074, -0.1278], size: 0.04 }, // London
                { location: [35.6895, 139.6917], size: 0.08 }, // Tokyo
                { location: [-33.8688, 151.2093], size: 0.04 }, // Sydney
            ],
            // @ts-ignore
            onRender: (state) => {
                // Called on every animation frame.
                // `state` will be an empty object, return nothing.
                state.phi = phi;
                phi += 0.005;
                state.width = width * 2;
                state.height = width * 2;
            },
        });

        return () => {
            globe.destroy();
            window.removeEventListener('resize', onResize);
        };
    }, [threatActive]);

    return (
        <div className="w-full aspect-square relative flex items-center justify-center m-auto overflow-hidden">
            <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '100%', contain: 'layout paint size' }}
            />
        </div>
    );
}