'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { experiences, navLinks } from '@/lib/data';
import { cn } from '@/lib/utils';
import { ArrowLeft, Briefcase, ChevronRight, ExternalLink, Calendar, MapPin } from 'lucide-react';

/* ═══════════════════════════════════════
   EXPERIENCE · MISSION DOSSIER
   Cinematic vertical timeline with glowing
   pulse nodes, expandable dossier cards,
   and dramatic staggered reveals.
   Deep indigo/dark palette.
   ═══════════════════════════════════════ */

const typeConfig = {
    work: { color: '#06b6d4', glow: 'shadow-cyan-500/20', label: 'EMPLOYMENT', bg: 'bg-cyan-500/5', border: 'border-cyan-500/15', text: 'text-cyan-400' },
    research: { color: '#a78bfa', glow: 'shadow-violet-500/20', label: 'RESEARCH', bg: 'bg-violet-500/5', border: 'border-violet-500/15', text: 'text-violet-400' },
    leadership: { color: '#f59e0b', glow: 'shadow-amber-500/20', label: 'STUDENT TEAM', bg: 'bg-amber-500/5', border: 'border-amber-500/15', text: 'text-amber-400' },
};

export default function ExperiencePage() {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-[#030712] relative overflow-hidden">
            {/* Ambient glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/3 -left-64 w-[500px] h-[500px] bg-cyan-500/[0.015] rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -right-64 w-[500px] h-[500px] bg-violet-500/[0.015] rounded-full blur-[120px]" />
            </div>

            {/* Subtle grid */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />

            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-40 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-1.5 text-gray-600 hover:text-white transition-colors"><ArrowLeft size={16} /></Link>
                        <Briefcase size={14} className="text-cyan-400/40" />
                        <span className="text-[10px] font-mono tracking-[0.3em] text-cyan-400/50">MISSION DOSSIER</span>
                    </div>
                    <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-gray-700">
                        {navLinks.filter(l => l.href !== '/experience').slice(0, 5).map(l => (
                            <Link key={l.href} href={l.href} className="hover:text-gray-400 transition-colors">{l.label}</Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Header */}
            <section className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-16">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-3 h-3 rounded-full bg-cyan-400/20 border border-cyan-400/40 animate-pulse" />
                        <span className="text-[10px] font-mono tracking-[0.5em] text-gray-600">CAREER TRAJECTORY</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95] mb-6" style={{ fontFamily: 'var(--font-grotesk)' }}>
                        Where I&apos;ve<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400">shipped code</span>
                    </h1>
                    <p className="text-gray-500 text-lg max-w-xl leading-relaxed">
                        From startup trenches to research labs — every role shaped how I build.
                    </p>
                </motion.div>

                {/* Stats bar */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-white/5">
                    {[
                        { val: experiences.length, label: 'ROLES' },
                        { val: new Set(experiences.map(e => e.company.split(' — ')[0])).size, label: 'ORGANIZATIONS' },
                        { val: `${new Set(experiences.flatMap(e => e.techStack)).size}+`, label: 'TECHNOLOGIES' },
                    ].map(stat => (
                        <div key={stat.label}>
                            <span className="text-3xl font-black text-white" style={{ fontFamily: 'var(--font-grotesk)' }}>{stat.val}</span>
                            <p className="text-[9px] font-mono text-gray-600 tracking-[0.2em] mt-1">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* Timeline */}
            <section className="relative z-10 max-w-5xl mx-auto px-6 pb-32">
                {/* Vertical line */}
                <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400/20 via-violet-400/10 to-transparent" />

                {experiences.map((exp, i) => {
                    const config = typeConfig[exp.type];
                    const isExpanded = expandedId === exp.id;
                    const isEven = i % 2 === 0;

                    return (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.6, delay: i * 0.08 }}
                            className={cn(
                                'relative mb-16 md:mb-20',
                                'md:grid md:grid-cols-2 md:gap-12',
                            )}
                        >
                            {/* Timeline node */}
                            <div className="absolute left-[33px] md:left-1/2 md:-translate-x-1/2 z-20">
                                <div className="relative">
                                    <div className={cn('w-3 h-3 rounded-full border-2', isExpanded ? 'bg-white scale-125' : '')} style={{ borderColor: config.color, background: isExpanded ? config.color : `${config.color}30` }} />
                                    <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: config.color }} />
                                </div>
                            </div>

                            {/* Date column (left on even, right on odd for desktop) */}
                            <div className={cn(
                                'pl-16 md:pl-0 mb-4 md:mb-0',
                                isEven ? 'md:text-right md:pr-12' : 'md:col-start-2 md:pl-12'
                            )}>
                                <div className={cn('inline-flex items-center gap-2 md:gap-3', isEven ? 'md:flex-row-reverse' : '')}>
                                    <Calendar size={12} style={{ color: config.color }} className="opacity-40" />
                                    <span className="text-sm font-mono tracking-wider" style={{ color: config.color }}>{exp.period}</span>
                                </div>
                                <div className={cn('mt-2 flex items-center gap-2', isEven ? 'md:justify-end' : '')}>
                                    <span className={cn('text-[9px] font-mono tracking-[0.2em] px-2.5 py-1 rounded-full border', config.bg, config.text, config.border)}>
                                        {config.label}
                                    </span>
                                </div>
                            </div>

                            {/* Card */}
                            <div className={cn(
                                'pl-16 md:pl-0',
                                isEven ? 'md:col-start-2 md:pl-12 md:row-start-1 md:col-end-3' : 'md:col-start-1 md:pr-12 md:row-start-1 md:text-right'
                            )}>
                                <motion.div
                                    onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                                    className={cn(
                                        'relative cursor-pointer rounded-2xl border p-6 md:p-8 transition-all duration-500 group',
                                        isExpanded
                                            ? `border-opacity-30 ${config.glow} shadow-lg bg-white/[0.03]`
                                            : 'border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.02]'
                                    )}
                                    style={isExpanded ? { borderColor: `${config.color}40` } : {}}
                                    whileHover={{ y: -2 }}
                                >
                                    {/* Corner accent */}
                                    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl">
                                        <div className="absolute top-0 right-0 w-24 h-1" style={{ background: `linear-gradient(to left, ${config.color}30, transparent)` }} />
                                        <div className="absolute top-0 right-0 h-24 w-1" style={{ background: `linear-gradient(to bottom, ${config.color}30, transparent)` }} />
                                    </div>

                                    <div className={cn(isEven ? '' : 'md:text-left')}>
                                        <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-1 group-hover:text-white transition-colors" style={{ fontFamily: 'var(--font-grotesk)' }}>
                                            {exp.company}
                                        </h3>
                                        <p className="text-sm font-mono mb-4" style={{ color: config.color, opacity: 0.7 }}>{exp.role}</p>
                                        <p className="text-gray-500 leading-relaxed text-sm md:text-base">{exp.description}</p>
                                    </div>

                                    {/* Expanded content */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div className={cn('mt-6 pt-6 border-t space-y-6', isEven ? '' : 'md:text-left')} style={{ borderColor: `${config.color}15` }}>
                                                    {/* Highlights */}
                                                    <div>
                                                        <span className="text-[9px] font-mono tracking-[0.3em] block mb-3" style={{ color: `${config.color}80` }}>KEY CONTRIBUTIONS</span>
                                                        <ul className="space-y-3">
                                                            {exp.highlights.map((h, j) => (
                                                                <motion.li
                                                                    key={j}
                                                                    initial={{ opacity: 0, x: isEven ? -10 : 10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: j * 0.08 }}
                                                                    className="flex items-start gap-3 text-sm text-gray-400"
                                                                >
                                                                    <ChevronRight size={12} className="mt-1 shrink-0" style={{ color: config.color }} />
                                                                    <span>{h}</span>
                                                                </motion.li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {/* Tech stack */}
                                                    <div>
                                                        <span className="text-[9px] font-mono tracking-[0.3em] block mb-3" style={{ color: `${config.color}80` }}>TECH STACK</span>
                                                        <div className="flex flex-wrap gap-2">
                                                            {exp.techStack.map((tech, j) => (
                                                                <motion.span
                                                                    key={tech}
                                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    transition={{ delay: 0.2 + j * 0.03 }}
                                                                    className={cn('text-[10px] font-mono px-3 py-1.5 rounded-full border', config.bg, config.border)}
                                                                    style={{ color: config.color }}
                                                                >
                                                                    {tech}
                                                                </motion.span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Expand hint */}
                                    <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-gray-700">
                                        <span>{isExpanded ? 'COLLAPSE' : 'VIEW DOSSIER'}</span>
                                        <ChevronRight size={10} className={cn('transition-transform duration-300', isExpanded && 'rotate-90')} />
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    );
                })}

                {/* End marker */}
                <div className="absolute left-[33px] md:left-1/2 md:-translate-x-1/2 bottom-4">
                    <div className="w-3 h-3 rounded-full border-2 border-gray-800 bg-gray-900" />
                </div>
            </section>

            {/* CTA */}
            <section className="relative z-10 pb-24 px-6 text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <p className="text-gray-600 text-sm font-mono tracking-wider mb-6">LOOKING FOR THE NEXT MISSION</p>
                    <div className="flex items-center justify-center gap-4">
                        <Link href="/contact" className="flex items-center gap-2 px-6 py-2.5 text-sm font-mono tracking-wider text-cyan-400 border border-cyan-400/20 rounded-lg hover:bg-cyan-400/10 transition-all">
                            <ExternalLink size={14} /> LET&apos;S TALK
                        </Link>
                        <Link href="/projects" className="px-6 py-2.5 text-sm font-mono tracking-wider text-gray-500 border border-white/5 rounded-lg hover:border-white/10 transition-all">
                            SEE MY WORK
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-6 px-6">
                <div className="max-w-5xl mx-auto flex items-center justify-between text-[10px] font-mono text-gray-700">
                    <span>{experiences.length} MISSIONS COMPLETED</span>
                    <Link href="/" className="hover:text-gray-400 transition-colors">← HOME</Link>
                </div>
            </footer>
        </div>
    );
}
