'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { projects, type ProjectCategory, navLinks } from '@/lib/data';
import { cn } from '@/lib/utils';
import { X, ExternalLink, Github, ArrowRight, ArrowLeft, FlaskConical } from 'lucide-react';

/* ═══════════════════════════════════════
   PROJECTS · BLUEPRINT R&D LAB
   Blue-tinted palette, blueprint grid,
   corner-marker cards, spec sheets.
   ═══════════════════════════════════════ */

const categories: { value: ProjectCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'ALL PROJECTS' },
    { value: 'ai', label: 'AI / ML' },
    { value: 'aerospace', label: 'AEROSPACE' },
    { value: 'startup', label: 'STARTUP' },
    { value: 'web', label: 'WEB' },
];

const statusColors = {
    active: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-400/30' },
    completed: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-400/30' },
    research: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-400/30' },
};

export default function ProjectsPage() {
    const [filter, setFilter] = useState<ProjectCategory | 'all'>('all');
    const [selected, setSelected] = useState<typeof projects[0] | null>(null);
    const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);

    return (
        <div className="min-h-screen bg-[#020817] relative">
            <div className="fixed inset-0 blueprint-grid pointer-events-none" />

            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-40 bg-[#020817]/80 backdrop-blur-xl border-b border-blue-500/10">
                <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-1.5 text-gray-600 hover:text-blue-400 transition-colors"><ArrowLeft size={16} /></Link>
                        <FlaskConical size={14} className="text-blue-400/50" />
                        <span className="text-[10px] font-mono tracking-[0.3em] text-blue-400/60">R&D LAB</span>
                        <span className="text-[9px] font-mono text-gray-700 ml-2">{projects.length} PROJECTS · {projects.filter(p => p.status === 'active').length} ACTIVE</span>
                    </div>
                    <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-gray-700">
                        {navLinks.filter(l => l.href !== '/projects').slice(0, 5).map(l => (
                            <Link key={l.href} href={l.href} className="hover:text-blue-400 transition-colors">{l.label}</Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Header */}
            <section className="relative z-10 pt-20 pb-8 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-3 h-3 rounded-sm bg-blue-500/20 border border-blue-500/40" />
                            <span className="text-[10px] font-mono tracking-[0.5em] text-blue-400/50">RESEARCH & DEVELOPMENT</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-grotesk)' }}>Project Lab</h1>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button key={cat.value} onClick={() => setFilter(cat.value)} className={cn('text-[10px] font-mono tracking-[0.15em] px-4 py-2 rounded border transition-all', filter === cat.value ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'text-gray-600 border-gray-800 hover:border-gray-700 hover:text-gray-400')}>
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Cards */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((project, i) => {
                            const status = statusColors[project.status];
                            return (
                                <motion.div key={project.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }} onClick={() => setSelected(project)} className="group cursor-pointer">
                                    <div className="relative bg-[#0a1628]/80 border border-blue-500/10 rounded-lg p-6 hover:border-blue-500/25 transition-all h-full">
                                        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-blue-500/20" />
                                        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-blue-500/20" />
                                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-blue-500/20" />
                                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-blue-500/20" />
                                        <div className="flex items-center justify-between mb-4">
                                            <span className={cn('text-[9px] font-mono tracking-wider px-2 py-0.5 rounded border', status.bg, status.text, status.border)}>{project.status.toUpperCase()}</span>
                                            <span className="text-[9px] font-mono text-gray-700 tracking-wider">{project.category.toUpperCase()}</span>
                                        </div>
                                        <h3 className="text-lg font-bold tracking-tight mb-2 group-hover:text-blue-400 transition-colors" style={{ fontFamily: 'var(--font-grotesk)' }}>{project.title}</h3>
                                        <p className="text-xs text-gray-500 font-mono mb-4">{project.subtitle}</p>
                                        <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3">{project.description}</p>
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {project.techStack.slice(0, 4).map(tech => (
                                                <span key={tech} className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-500/5 text-blue-400/50 border border-blue-500/10">{tech}</span>
                                            ))}
                                            {project.techStack.length > 4 && <span className="text-[9px] font-mono text-gray-700">+{project.techStack.length - 4}</span>}
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-blue-500/5">
                                            {project.metrics.slice(0, 3).map(m => (
                                                <div key={m.label}><span className="text-sm font-bold text-blue-400" style={{ fontFamily: 'var(--font-grotesk)' }}>{m.value}</span><p className="text-[8px] font-mono text-gray-700 tracking-wider mt-0.5 leading-tight">{m.label}</p></div>
                                            ))}
                                        </div>
                                        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight size={14} className="text-blue-400" /></div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </section>

            {/* Modal */}
            <AnimatePresence>
                {selected && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.96 }} onClick={e => e.stopPropagation()} className="w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-[#0a1628] border border-blue-500/15 rounded-xl">
                            <div className="sticky top-0 bg-[#0a1628]/95 backdrop-blur-sm border-b border-blue-500/10 px-8 py-5 flex items-center justify-between z-10">
                                <span className={cn('text-[9px] font-mono tracking-wider px-2 py-0.5 rounded border', statusColors[selected.status].bg, statusColors[selected.status].text, statusColors[selected.status].border)}>{selected.status.toUpperCase()}</span>
                                <button onClick={() => setSelected(null)} className="p-2 text-gray-600 hover:text-gray-300 transition-colors"><X size={18} /></button>
                            </div>
                            <div className="px-8 py-8">
                                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2" style={{ fontFamily: 'var(--font-grotesk)' }}>{selected.title}</h2>
                                <p className="text-sm font-mono text-blue-400/60 mb-8">{selected.subtitle}</p>
                                <p className="text-gray-400 leading-relaxed text-lg mb-8">{selected.longDescription}</p>
                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    {selected.metrics.map(m => (<div key={m.label} className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-4 text-center"><span className="text-2xl font-bold text-blue-400" style={{ fontFamily: 'var(--font-grotesk)' }}>{m.value}</span><p className="text-[10px] font-mono text-gray-600 tracking-wider mt-1">{m.label}</p></div>))}
                                </div>
                                <div className="mb-8">
                                    <h4 className="text-[10px] font-mono tracking-[0.2em] text-gray-600 mb-3">TECHNOLOGY STACK</h4>
                                    <div className="flex flex-wrap gap-2">{selected.techStack.map(tech => (<span key={tech} className="text-xs font-mono px-3 py-1.5 rounded bg-blue-500/5 text-blue-400/70 border border-blue-500/15">{tech}</span>))}</div>
                                </div>
                                <div className="flex gap-3">
                                    {selected.github && <a href={selected.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 text-sm font-mono text-gray-300 border border-gray-700 rounded-lg hover:border-blue-500/30 hover:text-blue-400 transition-all"><Github size={14} /> SOURCE</a>}
                                    {selected.demo && <a href={selected.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 text-sm font-mono text-blue-400 border border-blue-500/30 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-all"><ExternalLink size={14} /> DEMO</a>}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <footer className="relative z-10 border-t border-blue-500/10 py-6 px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] font-mono text-gray-700">
                    <span>R&D LAB · {projects.length} PROJECTS ARCHIVED</span>
                    <Link href="/" className="text-blue-400/40 hover:text-blue-400 transition-colors">← HOME</Link>
                </div>
            </footer>
        </div>
    );
}
