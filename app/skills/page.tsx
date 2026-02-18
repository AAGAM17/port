'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { skills, clusterColors, clusterLabels, type SkillCluster, navLinks } from '@/lib/data';
import { cn } from '@/lib/utils';
import { ArrowLeft, Telescope } from 'lucide-react';

/* ═══════════════════════════════════════
   SKILLS · NEURAL CONSTELLATION MAP
   Starfield, violet/purple, SVG constellation.
   ═══════════════════════════════════════ */

const clusters: (SkillCluster | 'all')[] = ['all', 'ai', 'robotics', 'fullstack', 'aerospace', 'embedded'];
const clusterCenters: Record<SkillCluster, { x: number; y: number }> = {
    ai: { x: 250, y: 200 }, robotics: { x: 750, y: 180 }, fullstack: { x: 500, y: 380 }, aerospace: { x: 200, y: 520 }, embedded: { x: 800, y: 500 },
};

function getNodePosition(skill: typeof skills[0]): { x: number; y: number } {
    const center = clusterCenters[skill.cluster];
    const clusterSkills = skills.filter(s => s.cluster === skill.cluster);
    const localIndex = clusterSkills.indexOf(skill);
    const angle = (localIndex / clusterSkills.length) * Math.PI * 2;
    const radius = 55 + (localIndex % 3) * 30;
    return { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius };
}

export default function SkillsPage() {
    const [activeCluster, setActiveCluster] = useState<SkillCluster | 'all'>('all');
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

    const positions = useMemo(() => {
        const map: Record<string, { x: number; y: number }> = {};
        skills.forEach(skill => { map[skill.id] = getNodePosition(skill); });
        return map;
    }, []);

    const connections = useMemo(() => {
        const lines: { from: string; to: string }[] = [];
        const seen = new Set<string>();
        skills.forEach(skill => {
            skill.connections.forEach(connId => {
                const key = [skill.id, connId].sort().join('-');
                if (!seen.has(key) && positions[connId]) { seen.add(key); lines.push({ from: skill.id, to: connId }); }
            });
        });
        return lines;
    }, [positions]);

    const filteredSkills = activeCluster === 'all' ? skills : skills.filter(s => s.cluster === activeCluster);
    const isVisible = useCallback((id: string) => activeCluster === 'all' || skills.find(s => s.id === id)?.cluster === activeCluster, [activeCluster]);

    return (
        <div className="min-h-screen bg-[#020612] relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none">
                {Array.from({ length: 80 }).map((_, i) => (
                    <div key={i} className="absolute w-px h-px bg-white rounded-full" style={{ left: `${(i * 1.25) % 100}%`, top: `${(i * 1.75 + 10) % 100}%`, opacity: (i % 4 + 1) * 0.1, animation: `pulse-glow ${2 + (i % 4)}s ease-in-out infinite`, animationDelay: `${(i % 5) * 0.8}s` }} />
                ))}
            </div>

            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-40 bg-[#020612]/80 backdrop-blur-xl border-b border-violet-400/10">
                <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-1.5 text-gray-600 hover:text-violet-400 transition-colors"><ArrowLeft size={16} /></Link>
                        <Telescope size={14} className="text-violet-400/40" />
                        <span className="text-[10px] font-mono tracking-[0.3em] text-violet-400/50">OBSERVATORY · SKILL MAP</span>
                    </div>
                    <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-gray-700">
                        {navLinks.filter(l => l.href !== '/skills').slice(0, 5).map(l => (
                            <Link key={l.href} href={l.href} className="hover:text-violet-400 transition-colors">{l.label}</Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Header */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-4">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-grotesk)' }}>Neural <span className="text-violet-400">Constellation</span></h1>
                    <div className="flex flex-wrap gap-2">
                        {clusters.map(c => (
                            <button key={c} onClick={() => setActiveCluster(c)} className={cn('text-[10px] font-mono tracking-[0.15em] px-3 py-1.5 rounded-full border transition-all', activeCluster === c ? 'border-violet-400/40 text-violet-400 bg-violet-400/10' : 'border-gray-800 text-gray-600 hover:text-gray-400 hover:border-gray-700')}>
                                {c === 'all' ? 'ALL NODES' : clusterLabels[c].toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* SVG */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-4">
                <div className="relative w-full aspect-[10/7] border border-violet-400/5 rounded-xl bg-[#020612]/60 overflow-hidden">
                    <svg viewBox="0 0 1000 700" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                        {connections.map(({ from, to }) => {
                            const a = positions[from]; const b = positions[to]; if (!a || !b) return null;
                            const bothVisible = isVisible(from) && isVisible(to);
                            const isHovered = hoveredSkill === from || hoveredSkill === to;
                            return <line key={`${from}-${to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#a78bfa" strokeOpacity={!bothVisible ? 0.02 : isHovered ? 0.5 : 0.08} strokeWidth={isHovered ? 1.5 : 0.5} className="transition-all duration-300" />;
                        })}
                        {activeCluster === 'all' && Object.entries(clusterCenters).map(([cluster, pos]) => (
                            <text key={cluster} x={pos.x} y={pos.y - 85} textAnchor="middle" fill={clusterColors[cluster as SkillCluster]} fillOpacity={0.15} fontSize="11" fontFamily="var(--font-mono)" letterSpacing="3">{clusterLabels[cluster as SkillCluster].toUpperCase()}</text>
                        ))}
                        {skills.map(skill => {
                            const pos = positions[skill.id]; if (!pos) return null;
                            const visible = isVisible(skill.id);
                            const hovered = hoveredSkill === skill.id;
                            const connected = hoveredSkill ? skills.find(s => s.id === hoveredSkill)?.connections.includes(skill.id) : false;
                            const color = clusterColors[skill.cluster];
                            const radius = 4 + (skill.proficiency / 100) * 6;
                            return (
                                <g key={skill.id} onMouseEnter={() => setHoveredSkill(skill.id)} onMouseLeave={() => setHoveredSkill(null)} className="cursor-pointer" opacity={visible ? (hoveredSkill && !hovered && !connected ? 0.2 : 1) : 0.05} style={{ transition: 'opacity 0.3s' }}>
                                    {(hovered || connected) && <circle cx={pos.x} cy={pos.y} r={radius + 12} fill={color} opacity={0.08} />}
                                    <circle cx={pos.x} cy={pos.y} r={radius + 2} fill="none" stroke={color} strokeOpacity={hovered ? 0.6 : 0.15} strokeWidth={0.5} />
                                    <circle cx={pos.x} cy={pos.y} r={radius} fill={color} fillOpacity={hovered ? 0.4 : 0.15} stroke={color} strokeOpacity={hovered ? 0.8 : 0.3} strokeWidth={1} />
                                    <text x={pos.x} y={pos.y + radius + 14} textAnchor="middle" fill={hovered ? '#fff' : '#6b7280'} fontSize={hovered ? '11' : '9'} fontFamily="var(--font-mono)" className="select-none">{skill.name}</text>
                                    {hovered && <text x={pos.x} y={pos.y + 3} textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold" fontFamily="var(--font-mono)">{skill.proficiency}%</text>}
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </section>

            {/* Grid */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-8 pb-24">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {filteredSkills.map(skill => (
                        <motion.div key={skill.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onMouseEnter={() => setHoveredSkill(skill.id)} onMouseLeave={() => setHoveredSkill(null)} className="px-4 py-3 border border-violet-400/5 rounded-lg hover:border-violet-400/20 transition-all group cursor-default bg-[#020612]/60">
                            <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full" style={{ background: clusterColors[skill.cluster] }} /><span className="text-sm font-medium group-hover:text-white transition-colors">{skill.name}</span></div>
                            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${skill.proficiency}%`, background: clusterColors[skill.cluster], opacity: 0.4 }} /></div>
                            <span className="text-[10px] font-mono text-gray-700 mt-1 block">{skill.proficiency}%</span>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-violet-400/10 py-6 px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] font-mono text-gray-700">
                    <span>{skills.length} NODES MAPPED · {Object.keys(clusterCenters).length} CLUSTERS</span>
                    <Link href="/" className="text-violet-400/40 hover:text-violet-400 transition-colors">← HOME</Link>
                </div>
            </footer>
        </div>
    );
}
