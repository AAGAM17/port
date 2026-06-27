'use client';

import { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { personalInfo, systemMetrics, navLinks, projects } from '@/lib/data';
import { cn } from '@/lib/utils';
import TestimonialsSection from '@/components/testimonials/Testimonials';
import {
    Rocket, Code, Trophy, Globe, Terminal, Menu, X, ChevronRight,
    MapPin, ArrowUpRight, type LucideIcon,
} from 'lucide-react';

/* ═══════════════════════════════════════
   HOME · AAGAM SHAH
   Cinematic title sequence (once per
   session) → Hero → Stats → Selected Work
   → Principles → Testimonials → Footer.
   ═══════════════════════════════════════ */

const iconMap: Record<string, LucideIcon> = { Rocket, Code, Trophy, Globe };

const INTRO_KEY = 'aagam.intro.seen';
const EASE_DRAMATIC = [0.83, 0, 0.17, 1] as const;

/* Film title sequence: the name settles in like an opening credit,
   then the screen parts like letterbox bars. Once per session,
   skippable with any key or click, never blocks the page beneath. */
function IntroGate() {
    const [phase, setPhase] = useState<'play' | 'exit' | 'done'>('play');

    useLayoutEffect(() => {
        const seen = sessionStorage.getItem(INTRO_KEY);
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (seen || reduced) {
            setPhase('done');
            return;
        }
        sessionStorage.setItem(INTRO_KEY, '1');
    }, []);

    const skip = useCallback(() => setPhase('done'), []);

    useEffect(() => {
        if (phase !== 'play') return;
        const exitTimer = setTimeout(() => setPhase('exit'), 1600);
        const doneTimer = setTimeout(() => setPhase('done'), 2300);
        window.addEventListener('keydown', skip);
        return () => {
            clearTimeout(exitTimer);
            clearTimeout(doneTimer);
            window.removeEventListener('keydown', skip);
        };
    }, [phase, skip]);

    if (phase === 'done') return null;

    const exiting = phase === 'exit';

    return (
        <div onClick={skip} className="fixed inset-0 z-[10050] cursor-pointer select-none overflow-hidden" aria-hidden="true">
            {/* Letterbox halves — part like theater curtains on exit */}
            <motion.div
                className="absolute inset-x-0 top-0 h-1/2 bg-[#020409]"
                animate={{ y: exiting ? '-101%' : '0%' }}
                transition={{ duration: 0.7, ease: EASE_DRAMATIC }}
            />
            <motion.div
                className="absolute inset-x-0 bottom-0 h-1/2 bg-[#020409]"
                animate={{ y: exiting ? '101%' : '0%' }}
                transition={{ duration: 0.7, ease: EASE_DRAMATIC }}
            />
            {/* Title card */}
            <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6"
                animate={{ opacity: exiting ? 0 : 1 }}
                transition={{ duration: 0.3 }}
            >
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.55 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-[9px] font-mono tracking-[0.5em] text-gray-500"
                >
                    MUMBAI, INDIA — 19.0760° N, 72.8777° E
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, letterSpacing: '0.6em' }}
                    animate={{ opacity: 1, letterSpacing: '0.28em' }}
                    transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
                    className="text-[clamp(1.5rem,7.5vw,3rem)] font-light text-white uppercase whitespace-nowrap pl-[0.28em] text-center"
                    style={{ fontFamily: 'var(--font-grotesk)' }}
                >
                    Aagam Shah
                </motion.h1>
                <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="h-px w-[min(360px,60vw)] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent"
                />
            </motion.div>
        </div>
    );
}

function LiveClock() {
    const [time, setTime] = useState('');
    useEffect(() => {
        const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);
    return <span className="tabular-nums">{time || '--:--:--'}</span>;
}

const principles = [
    { n: '01', title: 'Ship, don\'t theorize', body: 'Slide decks don\'t fly. Everything on this site either runs in production or flew at a world championship — that\'s the bar for calling something done.' },
    { n: '02', title: 'Own the whole stack', body: 'Architecture, interface, models, deployment: one owner, no hand-offs. It\'s why a team of me ships like a team of five.' },
    { n: '03', title: 'Intelligence should land', body: 'The interesting part of AI isn\'t the prediction — it\'s the consequence. My favorite models end with an aircraft touching down on its own.' },
    { n: '04', title: 'Design is load-bearing', body: 'An interface is a promise about the quality of everything behind it. I keep both ends of that promise.' },
];

const featured = projects.slice(0, 3);

export default function HomePage() {
    const [mobileMenu, setMobileMenu] = useState(false);

    return (
        <div className="min-h-screen bg-space-950 grid-overlay relative">
            <IntroGate />

            {/* ── HUD NAVBAR ── */}
            <nav className="fixed top-0 left-0 right-0 z-40 bg-space-950/80 backdrop-blur-xl border-b border-cyan-400/10">
                <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse-glow" />
                            <span className="text-xs tracking-[0.35em] text-white/90 font-medium" style={{ fontFamily: 'var(--font-grotesk)' }}>AAGAM&nbsp;SHAH</span>
                        </Link>
                        <div className="hidden lg:flex items-center gap-3 text-[10px] font-mono text-gray-600 border-l border-cyan-400/10 pl-4">
                            <span className="relative group flex items-center gap-1 cursor-default"><MapPin size={9} /> 19.07°N, 72.87°E<span className="absolute left-1/2 -translate-x-1/2 -bottom-7 px-2 py-1 bg-gray-900 border border-cyan-400/20 rounded text-[9px] text-cyan-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Mumbai, India</span></span>
                            <span className="text-cyan-400/60"><LiveClock /></span>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="px-3 py-1.5 text-[10px] font-mono tracking-[0.15em] text-gray-500 hover:text-cyan-400 hover:bg-cyan-400/5 rounded transition-all">
                                {link.label}
                            </Link>
                        ))}
                        <Link href="/terminal" className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono tracking-[0.15em] text-gray-600 hover:text-emerald-400 hover:bg-emerald-400/5 rounded transition-all group">
                            <Terminal size={13} className="group-hover:text-emerald-400 transition-colors" />
                            <span>TTY</span>
                        </Link>
                    </div>
                    <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 text-gray-500">
                        {mobileMenu ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
                <AnimatePresence>
                    {mobileMenu && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden border-t border-cyan-400/10 bg-space-950/95 backdrop-blur-xl overflow-hidden">
                            <div className="p-4 space-y-1">
                                {navLinks.map((link, i) => (
                                    <Link key={link.href} href={link.href} onClick={() => setMobileMenu(false)} className="block px-4 py-3 text-xs font-mono tracking-wider text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/5 rounded-lg transition-all">
                                        <span className="text-cyan-400/30 mr-3">0{i + 1}</span>{link.label}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* ── HERO ── */}
            <section className="relative min-h-screen flex items-center justify-center px-6 pt-14">
                <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.05] pointer-events-none">
                    <div className="w-full h-full rounded-full border border-cyan-400/30" />
                    <div className="absolute inset-[15%] rounded-full border border-cyan-400/20" />
                    <div className="absolute inset-[30%] rounded-full border border-cyan-400/10" />
                    <div className="absolute top-0 left-1/2 w-px h-1/2 bg-gradient-to-b from-cyan-400/30 to-transparent origin-bottom animate-radar" />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    className="relative z-10 max-w-4xl text-center"
                >
                    <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/5 mb-8">
                        <div className="status-online w-1.5 h-1.5" />
                        <span className="text-[10px] font-mono tracking-[0.2em] text-emerald-400/80">OPEN TO WORK · MUMBAI / REMOTE</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, letterSpacing: '0.32em' }}
                        animate={{ opacity: 1, letterSpacing: '0.12em' }}
                        transition={{ duration: 1.2, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="text-4xl sm:text-6xl md:text-7xl font-light uppercase leading-[1.05] mb-7 pl-[0.12em] bg-gradient-to-b from-white via-white to-slate-400 bg-clip-text text-transparent"
                        style={{ fontFamily: 'var(--font-grotesk)' }}
                    >
                        Aagam Shah
                    </motion.h1>
                    <p className="text-sm md:text-base font-mono text-gray-500 tracking-wider mb-4">{personalInfo.role}</p>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">{personalInfo.bio}</p>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="text-[11px] font-mono text-gray-600 tracking-wider mb-12">
                        <span className="text-cyan-400/50">NOW →</span> Freelance builds @ Fyre Gig · Advanced Class Head @ DJS Skylark · B.Tech &apos;27
                    </motion.p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/projects" className="flex items-center gap-2 px-8 py-3 text-sm font-mono tracking-[0.15em] bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 rounded-lg hover:bg-cyan-400/20 hover:shadow-[0_0_24px_rgba(34,211,238,0.15)] transition-all">
                            VIEW PROJECTS <ChevronRight size={14} />
                        </Link>
                        <Link href="/contact" className="flex items-center gap-2 px-8 py-3 text-sm font-mono tracking-[0.15em] border border-gray-700 text-gray-400 rounded-lg hover:border-cyan-400/30 hover:text-cyan-400 transition-all">
                            GET IN TOUCH
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* ── SYSTEM METRICS ── */}
            <section className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {systemMetrics.map((metric, i) => {
                        const Icon = iconMap[metric.icon] || Rocket;
                        return (
                            <motion.div key={metric.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-panel p-5 text-center group hover:border-cyan-400/30 transition-colors">
                                <Icon size={18} className="mx-auto text-cyan-400/40 mb-3 group-hover:text-cyan-400 transition-colors" />
                                <div className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-grotesk)' }}>
                                    {metric.value}<span className="text-cyan-400">{metric.unit}</span>
                                </div>
                                <p className="text-[9px] font-mono text-gray-600 tracking-[0.2em] mt-1">{metric.label}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* ── SELECTED WORK ── */}
            <section className="relative z-10 py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-10 flex items-end justify-between gap-4">
                        <div>
                            <span className="text-[10px] font-mono tracking-[0.4em] text-gray-700 block mb-4">FIELD-TESTED</span>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-grotesk)' }}>
                                Selected Work
                            </h2>
                        </div>
                        <Link href="/projects" className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono tracking-[0.15em] text-gray-600 hover:text-cyan-400 transition-colors pb-1">
                            ALL PROJECTS <ArrowUpRight size={12} />
                        </Link>
                    </motion.div>
                    <div className="border-t border-white/5">
                        {featured.map((p, i) => (
                            <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                                <Link href="/projects" className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-4 md:gap-8 py-7 border-b border-white/5 hover:bg-white/[0.015] transition-colors px-2 -mx-2 rounded-lg">
                                    <span className="text-[11px] font-mono text-gray-700 group-hover:text-cyan-400/60 transition-colors">0{i + 1}</span>
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                                            <h3 className="text-xl md:text-2xl font-bold tracking-tight group-hover:text-cyan-400 transition-colors" style={{ fontFamily: 'var(--font-grotesk)' }}>{p.title}</h3>
                                            <span className="text-sm text-gray-500">{p.subtitle}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2.5">
                                            {p.techStack.slice(0, 4).map(t => (
                                                <span key={t} className="text-[9px] font-mono tracking-wider text-gray-600 border border-white/5 rounded px-2 py-0.5">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <span className={cn('text-[9px] font-mono tracking-[0.2em] px-2.5 py-1 rounded-full border self-center justify-self-end',
                                        p.status === 'active' ? 'text-emerald-400/80 border-emerald-400/20' : p.status === 'research' ? 'text-violet-400/80 border-violet-400/20' : 'text-gray-500 border-gray-800')}>
                                        {p.status.toUpperCase()}
                                    </span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                    <Link href="/projects" className="sm:hidden mt-6 flex items-center justify-center gap-1.5 text-[11px] font-mono tracking-[0.15em] text-gray-600 hover:text-cyan-400 transition-colors">
                        ALL PROJECTS <ArrowUpRight size={12} />
                    </Link>
                </div>
            </section>

            {/* ── OPERATING PRINCIPLES ── */}
            <section className="relative z-10 py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12">
                        <span className="text-[10px] font-mono tracking-[0.4em] text-gray-700 block mb-4">HOW I THINK</span>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-grotesk)' }}>
                            Operating Principles
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {principles.map((item, i) => (
                            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative p-7 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-cyan-400/10 transition-all group overflow-hidden">
                                <span className="absolute -top-3 -right-1 text-7xl font-bold text-white/[0.03] group-hover:text-cyan-400/[0.06] transition-colors pointer-events-none select-none" style={{ fontFamily: 'var(--font-grotesk)' }}>{item.n}</span>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-[10px] font-mono text-cyan-400/40 tracking-widest">{item.n}</span>
                                    <span className="h-px w-6 bg-cyan-400/20" />
                                    <h3 className="text-lg font-bold tracking-tight group-hover:text-cyan-400 transition-colors" style={{ fontFamily: 'var(--font-grotesk)' }}>
                                        {item.title}
                                    </h3>
                                </div>
                                <p className="text-gray-500 leading-relaxed text-sm">{item.body}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS (live, visitor-submitted, owner-approved) ── */}
            <TestimonialsSection />

            {/* ── FOOTER with Terminal Easter Egg ── */}
            <footer className="relative z-10 border-t border-cyan-400/10 bg-space-950/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-[10px] font-mono text-gray-700">
                        <span>© {new Date().getFullYear()} AAGAM SHAH</span>
                        <span className="w-px h-3 bg-gray-800" />
                        <span className="flex items-center gap-1.5"><div className="status-online w-1.5 h-1.5" /> AVAILABLE FOR WORK</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {[
                            { label: 'GitHub', href: personalInfo.github },
                            { label: 'LinkedIn', href: personalInfo.linkedin },
                            { label: 'Email', href: `mailto:${personalInfo.email}` },
                        ].map((link) => (
                            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-gray-600 hover:text-cyan-400 transition-colors tracking-wider">
                                {link.label.toUpperCase()}
                            </a>
                        ))}
                        <span className="w-px h-3 bg-gray-800" />
                        <Link href="/terminal" className="text-[10px] font-mono text-gray-800 hover:text-cyan-400 transition-colors tracking-wider group">
                            <span className="group-hover:hidden">~/</span><span className="hidden group-hover:inline">TERMINAL →</span>
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
