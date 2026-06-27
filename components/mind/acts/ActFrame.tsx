'use client';

import { motion, type Variants } from 'framer-motion';
import { ReactNode } from 'react';

const EASE = [0.16, 1, 0.3, 1] as const;

export const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

export const reveal: Variants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE } },
};

export function Section({
    id,
    align = 'center',
    children,
}: {
    id: string;
    align?: 'center' | 'left';
    children: ReactNode;
}) {
    return (
        <section data-act={id} className={`mind-act mind-act--${align}`}>
            <motion.div
                className="mind-act__inner"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.35 }}
            >
                {children}
            </motion.div>
        </section>
    );
}

export function Eyebrow({ children }: { children: ReactNode }) {
    return (
        <motion.p variants={reveal} className="mind-eyebrow">
            {children}
        </motion.p>
    );
}

export function Title({ children }: { children: ReactNode }) {
    return (
        <motion.h2 variants={reveal} className="mind-title">
            {children}
        </motion.h2>
    );
}

export function Lead({ children }: { children: ReactNode }) {
    return (
        <motion.p variants={reveal} className="mind-lead">
            {children}
        </motion.p>
    );
}
