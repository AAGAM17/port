'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { visionIdeas, navLinks } from '@/lib/data';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react';

const slideColors = ['from-emerald-500/10 to-emerald-500/0', 'from-violet-500/10 to-violet-500/0', 'from-amber-500/10 to-amber-500/0', 'from-rose-500/10 to-rose-500/0'];
const ideaAccents = ['#34d399', '#a78bfa', '#fbbf24', '#fb7185'];

export default function VisionPage() {
    return (
        <div className="bg-[#050505]">
            <nav className="fixed top-0 left-0 right-0 z-40 bg-transparent">
                <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-1.5 text-gray-600 hover:text-white transition-colors"><ArrowLeft size={16} /></Link>
                        <Lightbulb size={14} className="text-emerald-400/40" />
                        <span className="text-[10px] font-mono tracking-[0.3em] text-gray-600">FOUNDER&apos;S THESIS</span>
                    </div>
                    <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-gray-700">
                        {navLinks.filter(l => l.href !== '/vision').slice(0, 5).map(l => (
                            <Link key={l.href} href={l.href} className="hover:text-gray-400 transition-colors">{l.label}</Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-violet-500/5 pointer-events-none" />
                <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="relative z-10 max-w-5xl text-center">
                    <span className="text-[10px] font-mono tracking-[0.5em] text-emerald-400/40 block mb-8">FOUNDER&apos;S THESIS</span>
                    <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-10" style={{ fontFamily: 'var(--font-grotesk)' }}>
                        The future belongs to<br /><span className="text-gradient">autonomous intelligence</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto">AI that doesn&apos;t just think it <em>acts</em>. In the real world. At scale.</p>
                </motion.div>
            </section>

            {/* Beliefs */}
            <section className="min-h-screen flex items-center px-6 py-24">
                <div className="max-w-6xl mx-auto w-full">
                    <span className="text-[10px] font-mono tracking-[0.4em] text-gray-700 block mb-12">CORE BELIEFS</span>
                    {[
                        { n: '01', t: 'AI Should Act, Not Just Predict', d: 'Intelligence isn\'t real until it operates autonomously in the physical world.' },
                        { n: '02', t: 'Ship Fast. Ship Often. Ship Real.', d: 'Rapid prototyping, real feedback, iterating at startup speed is the only way.' },
                        { n: '03', t: 'Taste Is a Technical Skill', d: 'The best systems are designed twice — once for the machine, once for the human. I refuse to ship either half alone.' },
                    ].map((b, i) => (
                        <motion.div key={b.n} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="border-t border-white/5 py-10 md:py-14 flex flex-col md:flex-row gap-6 md:gap-16 items-start">
                            <span className="text-5xl md:text-7xl font-black text-gray-900 shrink-0" style={{ fontFamily: 'var(--font-grotesk)' }}>{b.n}</span>
                            <div><h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3" style={{ fontFamily: 'var(--font-grotesk)' }}>{b.t}</h3><p className="text-gray-500 text-lg leading-relaxed max-w-xl">{b.d}</p></div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Ideas */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <span className="text-[10px] font-mono tracking-[0.4em] text-gray-700 block mb-4">INNOVATION ROADMAP</span>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16" style={{ fontFamily: 'var(--font-grotesk)' }}>Problems I&apos;m solving</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {visionIdeas.map((idea, i) => (
                            <motion.div key={idea.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative p-8 rounded-2xl border border-white/5 overflow-hidden group hover:border-white/10 transition-all">
                                <div className={cn('absolute inset-0 bg-gradient-to-br opacity-30 group-hover:opacity-50 transition-opacity', slideColors[i % slideColors.length])} />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-3xl font-bold" style={{ fontFamily: 'var(--font-grotesk)', color: `${ideaAccents[i % ideaAccents.length]}40` }}>0{i + 1}</span>
                                        <span className={cn('text-[9px] font-mono tracking-[0.2em] px-3 py-1 rounded-full border', idea.status === 'building' ? 'text-amber-400 border-amber-400/20' : idea.status === 'launched' ? 'text-emerald-400 border-emerald-400/20' : 'text-gray-500 border-gray-800')}>{idea.status.toUpperCase()}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold tracking-tight mb-6" style={{ fontFamily: 'var(--font-grotesk)' }}>{idea.title}</h3>
                                    <div className="space-y-4">
                                        <div><span className="text-[9px] font-mono text-red-400/50 tracking-[0.2em]">PROBLEM</span><p className="text-sm text-gray-500 mt-1">{idea.problem}</p></div>
                                        <div><span className="text-[9px] font-mono text-emerald-400/50 tracking-[0.2em]">SOLUTION</span><p className="text-sm text-gray-400 mt-1">{idea.solution}</p></div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-white/5"><span className="text-[9px] font-mono text-amber-400/50 tracking-[0.2em]">IMPACT</span><p className="text-sm text-gray-300 mt-1 font-medium">{idea.impact}</p></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="min-h-[50vh] flex items-center justify-center px-6 pb-24">
                <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="text-center max-w-3xl">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6" style={{ fontFamily: 'var(--font-grotesk)' }}>Building something ambitious?</h2>
                    <p className="text-gray-500 text-lg mb-10">If you&apos;re working on something hard — AI, autonomy, products that matter — I want to hear about it.</p>
                    <Link href="/contact" className="inline-flex items-center gap-3 px-8 py-4 text-sm font-mono tracking-[0.2em] border border-white/10 rounded-full hover:bg-white/5 transition-all text-gray-300 hover:text-white">
                        START A CONVERSATION <ArrowRight size={14} />
                    </Link>
                </motion.div>
            </section>

            <footer className="border-t border-white/5 py-6 px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] font-mono text-gray-700">
                    <span>© {new Date().getFullYear()} AAGAM SHAH · FOUNDER&apos;S THESIS</span>
                    <Link href="/" className="hover:text-gray-400 transition-colors">← HOME</Link>
                </div>
            </footer>
        </div>
    );
}
