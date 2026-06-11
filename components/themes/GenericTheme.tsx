'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import {
    personalInfo, projects, experiences, achievements, skills,
    clusterLabels, SkillCluster,
} from '@/lib/data';
import { useApprovedTestimonials } from '@/components/testimonials/Testimonials';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════
   GENERIC — the beautiful, classic portfolio
   Warm ivory, Fraunces & Newsreader, hairline
   rules, editorial index layout. No gimmicks;
   just craft.
   ═══════════════════════════════════════ */

const INK = '#1C1814';
const MUTED = '#6E675C';
const ACCENT = '#9A3B1E';
const RULE = '#E3DCCE';
const PAPER = '#FAF6EF';

const ed = { fontFamily: 'var(--font-editorial)' };
const rd = { fontFamily: 'var(--font-reader)' };
const mn = { fontFamily: 'var(--font-mono)' };

const categoryLabels: Record<string, string> = {
    ai: 'AI Platform',
    startup: 'SaaS',
    aerospace: 'Aerospace',
    web: 'Web',
    robotics: 'Robotics',
};

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

function SectionHead({ no, title }: { no: string; title: string }) {
    return (
        <motion.div {...fadeUp} className="flex items-baseline gap-5 mb-12">
            <span className="text-[11px] tracking-[0.25em]" style={{ ...mn, color: ACCENT }}>№ {no}</span>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight" style={{ ...ed, color: INK }}>{title}</h2>
            <div className="flex-1 h-px translate-y-[-6px]" style={{ backgroundColor: RULE }} />
        </motion.div>
    );
}

export default function GenericTheme() {
    const [hovered, setHovered] = useState<string | null>(null);
    const year = new Date().getFullYear();
    const { items: liveTestimonials } = useApprovedTestimonials();
    const quote = liveTestimonials[0];

    return (
        <div className="min-h-screen antialiased" style={{ backgroundColor: PAPER, color: INK }}>
            {/* ── NAV ── */}
            <header className="sticky top-0 z-30 border-b backdrop-blur-md" style={{ borderColor: RULE, backgroundColor: 'rgba(250,246,239,0.88)' }}>
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <a href="#top" className="text-lg italic font-medium tracking-tight" style={{ ...ed, color: INK }}>
                        Aagam Shah
                    </a>
                    <nav className="hidden sm:flex items-center gap-7">
                        {[['Work', '#work'], ['Experience', '#experience'], ['Recognition', '#recognition'], ['Contact', '#contact']].map(([label, href]) => (
                            <a key={href} href={href} className="text-[11px] tracking-[0.2em] uppercase transition-colors hover:opacity-100 opacity-60" style={{ ...mn, color: INK }}>
                                {label}
                            </a>
                        ))}
                        <a
                            href={`mailto:${personalInfo.email}`}
                            className="text-[11px] tracking-[0.18em] uppercase px-4 py-2 rounded-full text-white transition-transform hover:-translate-y-px"
                            style={{ ...mn, backgroundColor: ACCENT }}
                        >
                            Hire me
                        </a>
                    </nav>
                </div>
            </header>

            <main id="top" className="max-w-5xl mx-auto px-6 pb-12">

                {/* ── HERO ── */}
                <section className="pt-24 sm:pt-32 pb-20 sm:pb-28">
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="text-[11px] tracking-[0.3em] uppercase mb-8" style={{ ...mn, color: MUTED }}>
                        Portfolio — Mumbai, India
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="text-[clamp(2.6rem,7vw,5.2rem)] leading-[1.04] font-light tracking-tight mb-10"
                        style={{ ...ed, color: INK }}
                    >
                        Software engineer building things that <em className="font-normal" style={{ color: ACCENT }}>ship</em> — and occasionally, things that <em className="font-normal" style={{ color: ACCENT }}>fly</em>.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18, duration: 0.7 }}
                        className="max-w-xl text-lg leading-relaxed mb-12"
                        style={{ ...rd, color: MUTED }}
                    >
                        I&apos;m Aagam — a full-stack and AI engineer. I&apos;ve built AI SaaS platforms end to end,
                        automated away sixty-hour workweeks, and written the computer-vision landing system behind a
                        top-10 world ranking at SAE Aero Design 2025.
                    </motion.p>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="flex flex-wrap items-center gap-x-8 gap-y-3">
                        <span className="flex items-center gap-2 text-[12px]" style={{ ...mn, color: MUTED }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#3f7d4e' }} />
                            Available for work
                        </span>
                        <a href={`mailto:${personalInfo.email}`} className="text-[12px] underline underline-offset-4 decoration-1 transition-colors" style={{ ...mn, color: INK, textDecorationColor: RULE }}>
                            {personalInfo.email}
                        </a>
                        <span className="text-[12px]" style={{ ...mn, color: MUTED }}>B.Tech &apos;27 · DJ Sanghvi, Mumbai</span>
                    </motion.div>
                </section>

                {/* ── WORK ── */}
                <section id="work" className="py-16 scroll-mt-20">
                    <SectionHead no="01" title="Selected Work" />
                    <div className="border-t" style={{ borderColor: RULE }}>
                        {projects.map((p, i) => (
                            <motion.a
                                key={p.id}
                                {...fadeUp}
                                transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                                href={p.github || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                onMouseEnter={() => setHovered(p.id)}
                                onMouseLeave={() => setHovered(null)}
                                className="group grid grid-cols-[2.5rem_1fr_auto] sm:grid-cols-[3.5rem_1fr_10rem_2rem] items-baseline gap-4 py-8 border-b transition-colors duration-300"
                                style={{ borderColor: RULE, backgroundColor: hovered === p.id ? 'rgba(154,59,30,0.035)' : 'transparent' }}
                            >
                                <span className="text-[12px]" style={{ ...mn, color: hovered === p.id ? ACCENT : MUTED }}>
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <div className="min-w-0">
                                    <h3 className="text-2xl sm:text-[1.7rem] font-medium tracking-tight mb-1.5 transition-colors" style={{ ...ed, color: hovered === p.id ? ACCENT : INK }}>
                                        {p.title}
                                    </h3>
                                    <p className="text-[15px] leading-relaxed max-w-lg" style={{ ...rd, color: MUTED }}>{p.subtitle}</p>
                                    <p className="mt-2 text-[11px] tracking-[0.14em] uppercase" style={{ ...mn, color: MUTED, opacity: 0.7 }}>
                                        {p.techStack.slice(0, 4).join(' · ')}
                                    </p>
                                </div>
                                <span className="hidden sm:block text-[11px] tracking-[0.2em] uppercase text-right" style={{ ...mn, color: MUTED }}>
                                    {categoryLabels[p.category] ?? p.category}
                                </span>
                                <ArrowUpRight
                                    size={18}
                                    className={cn('justify-self-end transition-all duration-300', hovered === p.id ? 'translate-x-0 -translate-y-0.5 opacity-100' : 'opacity-25')}
                                    style={{ color: hovered === p.id ? ACCENT : INK }}
                                />
                            </motion.a>
                        ))}
                    </div>
                </section>

                {/* ── EXPERIENCE ── */}
                <section id="experience" className="py-16 scroll-mt-20">
                    <SectionHead no="02" title="Experience" />
                    <div className="space-y-0 border-t" style={{ borderColor: RULE }}>
                        {experiences.map((e, i) => (
                            <motion.div key={e.id} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.04 }} className="grid sm:grid-cols-[12rem_1fr] gap-2 sm:gap-10 py-8 border-b" style={{ borderColor: RULE }}>
                                <span className="text-[12px] pt-1.5 tracking-wide" style={{ ...mn, color: MUTED }}>{e.period}</span>
                                <div>
                                    <h3 className="text-xl font-medium tracking-tight" style={{ ...ed, color: INK }}>{e.role}</h3>
                                    <p className="text-[13px] mt-0.5 mb-3 tracking-wide" style={{ ...mn, color: ACCENT }}>{e.company}</p>
                                    <p className="text-[15px] leading-relaxed max-w-2xl" style={{ ...rd, color: MUTED }}>{e.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── RECOGNITION ── */}
                <section id="recognition" className="py-16 scroll-mt-20">
                    <SectionHead no="03" title="Recognition" />
                    <div className="grid sm:grid-cols-2 gap-x-14 gap-y-10">
                        {achievements.map((a, i) => (
                            <motion.div key={a.id} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.05 }} className="flex gap-5 items-start">
                                <span className="text-3xl font-light leading-none pt-1 shrink-0 w-28" style={{ ...ed, color: ACCENT }}>{a.rank}</span>
                                <div>
                                    <h3 className="text-[17px] font-medium mb-1" style={{ ...ed, color: INK }}>{a.title}</h3>
                                    <p className="text-[14px] leading-relaxed" style={{ ...rd, color: MUTED }}>{a.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── CAPABILITIES ── */}
                <section className="py-16">
                    <SectionHead no="04" title="Capabilities" />
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
                        {(['fullstack', 'ai', 'aerospace', 'embedded'] as SkillCluster[]).map((cluster, i) => (
                            <motion.div key={cluster} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.06 }}>
                                <h3 className="text-[11px] tracking-[0.25em] uppercase pb-3 mb-4 border-b" style={{ ...mn, color: ACCENT, borderColor: RULE }}>
                                    {clusterLabels[cluster]}
                                </h3>
                                <ul className="space-y-2.5">
                                    {skills.filter(s => s.cluster === cluster).sort((a, b) => b.proficiency - a.proficiency).slice(0, 6).map(s => (
                                        <li key={s.id} className="text-[15px]" style={{ ...rd, color: INK }}>{s.name}</li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── QUOTE ── */}
                {quote && (
                    <motion.section {...fadeUp} className="py-24 text-center">
                        <p className="text-2xl sm:text-3xl italic font-light leading-snug max-w-3xl mx-auto mb-8" style={{ ...ed, color: INK }}>
                            &ldquo;{quote.quote}&rdquo;
                        </p>
                        <p className="text-[11px] tracking-[0.25em] uppercase" style={{ ...mn, color: MUTED }}>
                            {quote.name} — {quote.role}{quote.company ? `, ${quote.company}` : ''}
                        </p>
                    </motion.section>
                )}

                {/* ── CONTACT ── */}
                <section id="contact" className="pt-16 pb-24 border-t scroll-mt-20" style={{ borderColor: RULE }}>
                    <motion.div {...fadeUp}>
                        <p className="text-[11px] tracking-[0.3em] uppercase mb-8 mt-6" style={{ ...mn, color: MUTED }}>№ 05 — Get in touch</p>
                        <a
                            href={`mailto:${personalInfo.email}`}
                            className="group inline-flex items-center gap-5 text-[clamp(2.2rem,6vw,4.4rem)] font-light tracking-tight transition-colors"
                            style={{ ...ed, color: INK }}
                        >
                            <span className="relative">
                                Say hello
                                <span className="absolute left-0 -bottom-1 h-[2px] w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" style={{ backgroundColor: ACCENT }} />
                            </span>
                            <ArrowRight className="transition-transform duration-500 group-hover:translate-x-3" style={{ color: ACCENT }} size={40} strokeWidth={1.5} />
                        </a>
                        <p className="mt-8 max-w-md text-[15px] leading-relaxed" style={{ ...rd, color: MUTED }}>
                            Open to full-time roles, freelance builds, and ambitious collaborations.
                            Based in Mumbai; happy to relocate or work remote.
                        </p>
                        <div className="flex gap-8 mt-10">
                            {[
                                ['GitHub', personalInfo.github],
                                ['LinkedIn', personalInfo.linkedin],
                                ['Email', `mailto:${personalInfo.email}`],
                            ].map(([label, href]) => (
                                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-[11px] tracking-[0.2em] uppercase underline-offset-4 hover:underline" style={{ ...mn, color: INK }}>
                                    {label}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </section>
            </main>

            {/* ── FOOTER ── */}
            <footer className="border-t" style={{ borderColor: RULE }}>
                <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-[11px] tracking-[0.18em]" style={{ ...mn, color: MUTED }}>© {year} Aagam Shah</span>
                    <span className="text-[13px] italic" style={{ ...ed, color: MUTED }}>Designed & engineered by the same person — that&apos;s the point.</span>
                </div>
            </footer>
        </div>
    );
}
