'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HUDMetricProps {
    label: string;
    value: string;
    unit?: string;
    delay?: number;
    className?: string;
}

export function HUDMetric({ label, value, unit = '', delay = 0, className }: HUDMetricProps) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    const numericValue = parseInt(value, 10);

    useEffect(() => {
        if (!isInView) return;
        const timer = setTimeout(() => {
            const duration = 1500;
            const steps = 40;
            const increment = numericValue / steps;
            let current = 0;
            const interval = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    setCount(numericValue);
                    clearInterval(interval);
                } else {
                    setCount(Math.floor(current));
                }
            }, duration / steps);
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(timer);
    }, [isInView, numericValue, delay]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: delay / 1000 }}
            className={cn(
                'glass-panel p-6 relative overflow-hidden group hover:border-cyan-400/40 transition-all duration-300',
                className
            )}
        >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-400/50" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan-400/50" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan-400/50" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-400/50" />

            {/* Background glow on hover */}
            <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/5 transition-colors duration-300" />

            <p className="text-xs font-mono tracking-[0.2em] text-gray-500 uppercase mb-3 relative z-10">
                {label}
            </p>
            <div className="flex items-baseline gap-1 relative z-10">
                <span className="text-4xl font-bold font-mono neon-text tabular-nums">
                    {count}
                </span>
                {unit && (
                    <span className="text-xl font-bold text-cyan-400/70">{unit}</span>
                )}
            </div>

            {/* Horizontal line decoration */}
            <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-cyan-400/30 to-transparent relative z-10" />
        </motion.div>
    );
}
