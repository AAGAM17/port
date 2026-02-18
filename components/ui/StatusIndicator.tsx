'use client';

import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
    status: 'online' | 'amber' | 'offline';
    label?: string;
    className?: string;
}

export function StatusIndicator({ status, label, className }: StatusIndicatorProps) {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <div
                className={cn(
                    'w-2 h-2 rounded-full animate-pulse-glow',
                    status === 'online' && 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]',
                    status === 'amber' && 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]',
                    status === 'offline' && 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]'
                )}
            />
            {label && (
                <span className="text-xs font-mono tracking-wider text-gray-400 uppercase">{label}</span>
            )}
        </div>
    );
}
