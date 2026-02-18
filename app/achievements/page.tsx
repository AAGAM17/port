'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { achievements, navLinks } from '@/lib/data';
import { cn } from '@/lib/utils';
import { ArrowLeft, BookOpen } from 'lucide-react';

/* ═══════════════════════════════════════
   ACHIEVEMENTS · MAGAZINE / EDITORIAL
   Playfair Display serif, halftone textures,
   oversized rank numerals, feature spreads.
   ═══════════════════════════════════════ */

const categoryAccents: Record<string, string> = {
    Hackathon: '#22d3ee', Aerospace: '#a78bfa', Engineering: '#34d399',
};

export default function AchievementsPage() {
    const [featured, setFeatured] = useState(achievements[0]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] relative">
            <div className="fixed inset-0 halftone-pattern opacity-40 pointer-events-none" />

            {/* Nav: Masthead */}
            <nav className="relative z-10 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-1.5 text-gray-600 hover:text-white transition-colors"><ArrowLeft size={16} /></Link>
                        <BookOpen size={14} className="text-gray-600" />
                        <span className="text-xs tracking-[0.5em] text-gray-500 font-mono">THE AAGAM JOURNAL</span>
                    </div>
                    <div className="hidden md:flex items-center gap-6 text-[10px] tracking-[0.3em] text-gray-600 font-mono">
                        <span>EST. 2020</span><span className="w-px h-3 bg-gray-700" /><span>ISSUE Nº{achievements.length}</span>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 md:px-12 pb-3 hidden md:flex gap-4">
                    {navLinks.filter(l => l.href !== '/achievements').slice(0, 6).map(l => (
                        <Link key={l.href} href={l.href} className="text-[9px] font-mono text-gray-700 hover:text-gray-400 tracking-wider transition-colors">{l.label}</Link>
                    ))}
                </div>
            </nav>

            {/* Cover Story */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <motion.div key={featured.id + '-num'} initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="lg:col-span-4">
                        <span className="block text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter" style={{ fontFamily: 'var(--font-serif)', color: 'transparent', WebkitTextStroke: `1.5px ${categoryAccents[featured.category] || '#22d3ee'}40` }}>
                            {featured.rank.replace(/[^0-9+K,]/g, '') || '#'}
                        </span>
                        <div className="inline-block mt-4 px-4 py-1.5 text-[10px] font-mono tracking-[0.3em] uppercase border rounded-full" style={{ color: categoryAccents[featured.category], borderColor: `${categoryAccents[featured.category]}30` }}>{featured.category}</div>
                    </motion.div>
                    <motion.article key={featured.id + '-article'} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="lg:col-span-8">
                        <p className="text-[10px] font-mono tracking-[0.3em] text-gray-600 mb-4">{featured.year} · VOLUME {achievements.indexOf(featured) + 1}</p>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-8" style={{ fontFamily: 'var(--font-serif)' }}>{featured.title}</h2>
                        <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-10 max-w-2xl" style={{ fontFamily: 'var(--font-serif)', fontWeight: 300 }}>{featured.description}</p>
                        {featured.quote && (
                            <blockquote className="relative pl-6 py-4 border-l-2 mb-10 max-w-xl" style={{ borderColor: categoryAccents[featured.category] }}>
                                <p className="text-xl md:text-2xl italic text-gray-300 leading-relaxed" style={{ fontFamily: 'var(--font-serif)' }}>&ldquo;{featured.quote}&rdquo;</p>
                            </blockquote>
                        )}
                        <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                            <span className="text-3xl font-black" style={{ fontFamily: 'var(--font-serif)', color: categoryAccents[featured.category] }}>{featured.rank}</span>
                            <div><span className="text-xs font-mono text-gray-600 tracking-wider">PLACEMENT</span><p className="text-sm text-gray-400">{featured.year}</p></div>
                        </div>
                    </motion.article>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 md:px-12"><div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" /></div>

            {/* Index */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16">
                <h3 className="text-xs font-mono tracking-[0.4em] text-gray-600 uppercase mb-10">All Issues</h3>
                <div className="space-y-0 border-t border-white/5">
                    {achievements.map((ach, i) => {
                        const isActive = featured.id === ach.id;
                        return (
                            <motion.button key={ach.id} onClick={() => setFeatured(ach)} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className={cn('group w-full text-left border-b border-white/5 py-6 md:py-8 flex items-center gap-6 md:gap-12 transition-all duration-300', isActive ? 'opacity-100' : 'opacity-40 hover:opacity-80')}>
                                <span className="text-3xl md:text-5xl font-black w-20 md:w-28 shrink-0 tabular-nums" style={{ fontFamily: 'var(--font-serif)', color: isActive ? categoryAccents[ach.category] : '#374151' }}>{String(i + 1).padStart(2, '0')}</span>
                                <div className="flex-1 min-w-0">
                                    <h4 className={cn('text-xl md:text-3xl font-bold tracking-tight transition-colors truncate', isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200')} style={{ fontFamily: 'var(--font-serif)' }}>{ach.title}</h4>
                                    <p className="text-xs font-mono text-gray-600 mt-1 tracking-wider">{ach.category} · {ach.year}</p>
                                </div>
                                <span className={cn('hidden md:block text-sm font-mono px-4 py-2 rounded-full border shrink-0', isActive ? 'border-current' : 'border-gray-800 text-gray-600')} style={isActive ? { color: categoryAccents[ach.category], borderColor: `${categoryAccents[ach.category]}40` } : {}}>
                                    {ach.rank}
                                </span>
                                <span className={cn('text-gray-700 transition-transform duration-300', isActive && 'translate-x-1')} style={isActive ? { color: categoryAccents[ach.category] } : {}}>→</span>
                            </motion.button>
                        );
                    })}
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-8">
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between text-[10px] font-mono text-gray-700 tracking-[0.2em]">
                    <span>© AAGAM SHAH · THE JOURNAL</span>
                    <Link href="/" className="hover:text-gray-400 transition-colors">← HOME</Link>
                </div>
            </footer>
        </div>
    );
}
