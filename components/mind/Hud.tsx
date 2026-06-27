'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ACTS, SECTION_COUNT } from '@/lib/mind/journey';

export default function Hud({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
    const [active, setActive] = useState(0);
    const [atTop, setAtTop] = useState(true);

    useEffect(() => {
        let raf = 0;
        const tick = () => {
            const p = progressRef.current;
            const idx = Math.min(SECTION_COUNT - 1, Math.floor(p * SECTION_COUNT));
            setActive((prev) => (prev !== idx ? idx : prev));
            setAtTop((prev) => {
                const t = p < 0.04;
                return prev !== t ? t : prev;
            });
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [progressRef]);

    return (
        <>
            <Link href="/" className="mind-interactive mind-back">
                ← Back
            </Link>

            <nav className="mind-rail" aria-hidden>
                {ACTS.map((a, i) => (
                    <div
                        key={a.id}
                        className={`mind-rail__item${i === active ? ' is-active' : ''}${i < active ? ' is-done' : ''}`}
                    >
                        <span className="mind-rail__tick" />
                        <span className="mind-rail__label">{a.label}</span>
                    </div>
                ))}
            </nav>

            <div className={`mind-hint${atTop ? '' : ' is-hidden'}`} aria-hidden>
                <span>scroll</span>
                <span className="mind-hint__line" />
            </div>
        </>
    );
}
