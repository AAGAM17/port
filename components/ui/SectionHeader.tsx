'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
    code: string;
    title: string;
    subtitle?: string;
    className?: string;
}

export function SectionHeader({ code, title, subtitle, className }: SectionHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className={cn('mb-12', className)}
        >
            <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono tracking-[0.3em] text-cyan-400/60 uppercase">
                    [{code}]
                </span>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-400/30 to-transparent" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                {title}
            </h2>
            {subtitle && (
                <p className="mt-3 text-gray-400 max-w-2xl text-lg">
                    {subtitle}
                </p>
            )}
        </motion.div>
    );
}
