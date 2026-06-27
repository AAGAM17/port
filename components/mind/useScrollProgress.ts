'use client';

import { useEffect } from 'react';

/**
 * Tracks normalised page-scroll (0→1) and writes a *damped* value into `ref`
 * every animation frame. Decoupled from React render — the canvas reads the
 * ref directly inside its own frame loop, so scrolling never triggers re-renders.
 */
export function useScrollProgress(ref: React.MutableRefObject<number>) {
    useEffect(() => {
        let target = 0;
        let raf = 0;

        const read = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        };

        const tick = () => {
            ref.current += (target - ref.current) * 0.09;
            if (Math.abs(target - ref.current) < 1e-4) ref.current = target;
            raf = requestAnimationFrame(tick);
        };

        read();
        ref.current = target;
        window.addEventListener('scroll', read, { passive: true });
        window.addEventListener('resize', read);
        raf = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener('scroll', read);
            window.removeEventListener('resize', read);
            cancelAnimationFrame(raf);
        };
    }, [ref]);
}
