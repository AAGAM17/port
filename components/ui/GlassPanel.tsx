'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface GlassPanelProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    neon?: boolean;
    solid?: boolean;
}

export function GlassPanel({ children, className, hover = false, neon = false, solid = false }: GlassPanelProps) {
    return (
        <div
            className={cn(
                solid ? 'glass-panel-solid' : 'glass-panel',
                hover && 'transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]',
                neon && 'border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]',
                className
            )}
        >
            {children}
        </div>
    );
}
