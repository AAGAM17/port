'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { personalInfo, systemMetrics, navLinks, testimonials } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
    Rocket, Code, Trophy, Globe, Terminal, Menu, X, ChevronRight,
    MapPin, Zap, Quote, ChevronLeft, MessageSquarePlus,
} from 'lucide-react';

/* ═══════════════════════════════════════
   HOME · AAGAM.SYS DASHBOARD
   Boot sequence → Hero → Stats → Philosophy
   → Testimonials → Footer with terminal egg.
   Merged About content. No Quick Launch.
   ═══════════════════════════════════════ */

const iconMap: Record<string, React.ElementType> = { Rocket, Code, Trophy, Globe };

const philosophyItems = [
    { title: 'Ship, Don\'t Theorize', body: 'I believe in building real things. Not slide decks. Working systems that users can touch. Every project I ship is a bet on myself.', icon: '🚀' },
    { title: 'Full-Stack = Full Ownership', body: 'From system architecture to pixel-perfect UI, from ML model training to deployment — I own the entire stack. That\'s what makes me fast.', icon: '⚡' },
    { title: 'AI That Acts, Not Predicts', body: 'Most AI stays on a screen. Mine flies. I\'m obsessed with bridging intelligence and the physical world — drones, robotics, autonomous systems.', icon: '🤖' },
    { title: 'Design Is Engineering', body: 'Beautiful interfaces aren\'t a luxury. They\'re a competitive advantage. I treat UI/UX with the same rigor I give to backend architecture.', icon: '🎨' },
];

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

export default function HomePage() {
    const [booted, setBooted] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [bootLine, setBootLine] = useState(0);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const bootMessages = [
        'Initializing AAGAM.SYS v2.0...',
        'Loading neural networks...',
        'Compiling skill graph...',
        'System ready.',
    ];

    useEffect(() => {
        if (booted) return;
        const timers: NodeJS.Timeout[] = [];
        bootMessages.forEach((_, i) => {
            timers.push(setTimeout(() => setBootLine(i + 1), (i + 1) * 500));
        });
        timers.push(setTimeout(() => setBooted(true), bootMessages.length * 500 + 600));
        return () => timers.forEach(clearTimeout);
    }, [booted]);

    // Auto-rotate testimonials
    useEffect(() => {
        const timer = setInterval(() => setCurrentTestimonial(prev => (prev + 1) % testimonials.length), 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-space-950 grid-overlay relative">
            {/* ── BOOT SEQUENCE ── */}
            <AnimatePresence>
                {!booted && (
                    <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="fixed inset-0 z-50 bg-space-950 flex items-center justify-center">
                        <div className="font-mono text-sm text-cyan-400/80 space-y-2 max-w-md px-6">
                            {bootMessages.slice(0, bootLine).map((msg, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                                    <span className="text-cyan-400/40">&gt;</span>
                                    <span>{msg}</span>
                                    {i === bootLine - 1 && <span className="animate-typing-cursor">█</span>}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── HUD NAVBAR ── */}
            <nav className="fixed top-0 left-0 right-0 z-40 bg-space-950/80 backdrop-blur-xl border-b border-cyan-400/10">
                <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse-glow" />
                            <span className="text-xs font-mono tracking-[0.3em] text-cyan-400/80">AAGAM.SYS</span>
                        </Link>
                        <div className="hidden lg:flex items-center gap-3 text-[10px] font-mono text-gray-600 border-l border-cyan-400/10 pl-4">
                            <span className="flex items-center gap-1"><MapPin size={9} /> 19.07°N, 72.87°E</span>
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
                                {navLinks.map((link) => (
                                    <Link key={link.href} href={link.href} onClick={() => setMobileMenu(false)} className="block px-4 py-3 text-xs font-mono tracking-wider text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/5 rounded-lg transition-all">
                                        <span className="text-cyan-400/30 mr-2">[{link.code}]</span>{link.label}
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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.03] pointer-events-none">
                    <div className="w-full h-full rounded-full border border-cyan-400/30" />
                    <div className="absolute inset-[15%] rounded-full border border-cyan-400/20" />
                    <div className="absolute inset-[30%] rounded-full border border-cyan-400/10" />
                    <div className="absolute top-0 left-1/2 w-px h-1/2 bg-gradient-to-b from-cyan-400/30 to-transparent origin-bottom animate-radar" />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: booted ? 1 : 0, y: booted ? 0 : 30 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative z-10 max-w-4xl text-center"
                >
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: booted ? 1 : 0, scale: booted ? 1 : 0.9 }} transition={{ delay: 0.4 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/5 mb-8">
                        <div className="status-online w-1.5 h-1.5" />
                        <span className="text-[10px] font-mono tracking-[0.2em] text-cyan-400/70">SYSTEM ACTIVE</span>
                    </motion.div>
                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6" style={{ fontFamily: 'var(--font-grotesk)' }}>
                        AAGAM<br /><span className="text-gradient">SHAH</span>
                    </h1>
                    <p className="text-sm md:text-base font-mono text-gray-500 tracking-wider mb-4">{personalInfo.role}</p>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12">{personalInfo.bio}</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/projects" className="flex items-center gap-2 px-8 py-3 text-sm font-mono tracking-[0.15em] bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 rounded-lg hover:bg-cyan-400/20 transition-all">
                            VIEW PROJECTS <ChevronRight size={14} />
                        </Link>
                        <Link href="/contact" className="flex items-center gap-2 px-8 py-3 text-sm font-mono tracking-[0.15em] border border-gray-700 text-gray-400 rounded-lg hover:border-cyan-400/30 hover:text-cyan-400 transition-all">
                            ESTABLISH CONTACT
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
                            <motion.div key={metric.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-panel p-5 text-center group">
                                <Icon size={18} className="mx-auto text-cyan-400/40 mb-3 group-hover:text-cyan-400 transition-colors" />
                                <div className="text-3xl font-black text-white" style={{ fontFamily: 'var(--font-grotesk)' }}>
                                    {metric.value}<span className="text-cyan-400">{metric.unit}</span>
                                </div>
                                <p className="text-[9px] font-mono text-gray-600 tracking-[0.2em] mt-1">{metric.label}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* ── PHILOSOPHY (from About) ── */}
            <section className="relative z-10 py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12">
                        <span className="text-[10px] font-mono tracking-[0.4em] text-gray-700 block mb-4">HOW I THINK</span>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-grotesk)' }}>
                            Operating Principles
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {philosophyItems.map((item, i) => (
                            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-7 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-cyan-400/10 transition-all group">
                                <div className="flex items-center gap-4 mb-3">
                                    <span className="text-2xl">{item.icon}</span>
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

            {/* ── TESTIMONIALS (from About) ── */}
            <section className="relative z-10 py-20 px-6">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.02] to-transparent pointer-events-none" />
                <div className="max-w-4xl mx-auto relative">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12 text-center">
                        <span className="text-[10px] font-mono tracking-[0.4em] text-gray-700 block mb-4">WHAT PEOPLE SAY</span>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-grotesk)' }}>
                            Testimonials
                        </h2>
                    </motion.div>
                    <div className="relative">
                        <Quote size={40} className="absolute -top-2 -left-2 text-cyan-400/10 z-0" />
                        <AnimatePresence mode="wait">
                            <motion.div key={currentTestimonial} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="relative z-10 text-center py-8">
                                <blockquote className="text-xl md:text-2xl lg:text-3xl text-gray-300 leading-relaxed mb-10 max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-serif)' }}>
                                    &ldquo;{testimonials[currentTestimonial].quote}&rdquo;
                                </blockquote>
                                <div className="flex items-center justify-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400/20 to-violet-400/20 border border-white/10 flex items-center justify-center text-sm font-bold text-white">
                                        {testimonials[currentTestimonial].avatar}
                                    </div>
                                    <div className="text-left">
                                        <span className="text-sm font-semibold block">{testimonials[currentTestimonial].name}</span>
                                        <span className="text-xs text-gray-500">{testimonials[currentTestimonial].role} · {testimonials[currentTestimonial].company}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                        <div className="flex items-center justify-center gap-6 mt-6">
                            <button onClick={() => setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length)} className="p-2 text-gray-600 hover:text-white transition-colors border border-white/5 rounded-lg hover:border-cyan-400/20">
                                <ChevronLeft size={18} />
                            </button>
                            <div className="flex gap-2">
                                {testimonials.map((_, i) => (
                                    <button key={i} onClick={() => setCurrentTestimonial(i)} className={cn('w-2 h-2 rounded-full transition-all', i === currentTestimonial ? 'bg-cyan-400 w-6' : 'bg-gray-800 hover:bg-gray-600')} />
                                ))}
                            </div>
                            <button onClick={() => setCurrentTestimonial(prev => (prev + 1) % testimonials.length)} className="p-2 text-gray-600 hover:text-white transition-colors border border-white/5 rounded-lg hover:border-cyan-400/20">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                        {/* Submit testimonial CTA */}
                        <div className="mt-10 text-center">
                            <a
                                href={`mailto:${personalInfo.email}?subject=${encodeURIComponent('Testimonial for AAGAM.SYS')}&body=${encodeURIComponent('Hey Aagam,\n\nI\'d love to leave a testimonial for your portfolio!\n\nMy Name: \nMy Role/Title: \nCompany/Organization: \nTestimonial:\n\n')}`}
                                className="inline-flex items-center gap-2 px-5 py-2.5 text-[11px] font-mono tracking-[0.15em] text-gray-500 border border-white/5 rounded-full hover:border-emerald-400/30 hover:text-emerald-400 hover:bg-emerald-400/5 transition-all group"
                            >
                                <MessageSquarePlus size={14} className="group-hover:text-emerald-400 transition-colors" />
                                WORKED WITH ME? SHARE YOUR TESTIMONIAL
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER with Terminal Easter Egg ── */}
            <footer className="relative z-10 border-t border-cyan-400/10 bg-space-950/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-[10px] font-mono text-gray-700">
                        <span>AAGAM.SYS v2.0</span>
                        <span className="w-px h-3 bg-gray-800" />
                        <span className="flex items-center gap-1.5"><div className="status-online w-1.5 h-1.5" /> ALL SYSTEMS ONLINE</span>
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
