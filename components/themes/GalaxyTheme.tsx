'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import {
    personalInfo, projects, skills, experiences, achievements,
    clusterColors, clusterLabels, Skill, SkillCluster,
} from '@/lib/data';

/* ═══════════════════════════════════════
   GALAXY — a universe of work
   The skills section is a living Milky Way:
   every star in the spiral is real, and the
   bright ones are skills. Move through them.
   ═══════════════════════════════════════ */

/* ── Deterministic pseudo-random (stable star field across renders) ── */
function mulberry32(seed: number) {
    return () => {
        seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const ARMS = 4;
const CLUSTER_ARM: Record<SkillCluster, number> = { fullstack: 0, ai: 1, aerospace: 2, embedded: 3, robotics: 1 };

interface GalaxyStar {
    theta: number;      // angle along the spiral
    radius: number;     // 0..1 of max radius
    jx: number;         // perpendicular jitter
    jy: number;
    size: number;
    twinkle: number;    // phase offset
    warm: boolean;      // warm core star vs blue-white arm star
}

interface SkillStar {
    skill: Skill;
    theta: number;
    radius: number;
    jx: number;
    jy: number;
    /** screen position, refreshed every frame for hit-testing */
    sx: number;
    sy: number;
}

interface Hovered {
    id: string;
    name: string;
    cluster: SkillCluster;
    proficiency: number;
    x: number;
    y: number;
}

function buildGalaxy(): { dust: GalaxyStar[]; nebulae: GalaxyStar[] } {
    const rand = mulberry32(20250217);
    const dust: GalaxyStar[] = [];
    const nebulae: GalaxyStar[] = [];
    for (let i = 0; i < 760; i++) {
        const arm = i % ARMS;
        const t = Math.pow(rand(), 0.72);            // denser toward the core
        const theta = t * 4.6 + (arm * Math.PI * 2) / ARMS + rand() * 0.22;
        const spread = 0.018 + t * 0.075;
        dust.push({
            theta,
            radius: 0.04 + t * 0.96,
            jx: (rand() - 0.5) * spread * 2,
            jy: (rand() - 0.5) * spread * 2,
            size: rand() < 0.85 ? 0.5 + rand() * 0.9 : 1.3 + rand() * 0.9,
            twinkle: rand() * Math.PI * 2,
            warm: t < 0.3 ? rand() < 0.7 : rand() < 0.12,
        });
    }
    for (let i = 0; i < 56; i++) {
        const arm = i % ARMS;
        const t = 0.15 + Math.pow(rand(), 0.9) * 0.8;
        nebulae.push({
            theta: t * 4.6 + (arm * Math.PI * 2) / ARMS + rand() * 0.3,
            radius: 0.05 + t * 0.92,
            jx: (rand() - 0.5) * 0.08,
            jy: (rand() - 0.5) * 0.08,
            size: 22 + rand() * 46,
            twinkle: rand() * Math.PI * 2,
            warm: rand() < 0.4,
        });
    }
    return { dust, nebulae };
}

function buildSkillStars(): SkillStar[] {
    const rand = mulberry32(1722005);
    const byCluster = new Map<SkillCluster, Skill[]>();
    skills.forEach(s => {
        const list = byCluster.get(s.cluster) ?? [];
        list.push(s);
        byCluster.set(s.cluster, list);
    });
    const out: SkillStar[] = [];
    byCluster.forEach((list, cluster) => {
        const arm = CLUSTER_ARM[cluster] ?? 0;
        list.forEach((skill, i) => {
            const t = 0.22 + (i / Math.max(list.length - 1, 1)) * 0.68;
            out.push({
                skill,
                theta: t * 4.6 + (arm * Math.PI * 2) / ARMS + (rand() - 0.5) * 0.16,
                radius: 0.08 + t * 0.9,
                jx: (rand() - 0.5) * 0.05,
                jy: (rand() - 0.5) * 0.05,
                sx: -999,
                sy: -999,
            });
        });
    });
    return out;
}

/* ── The Milky Way canvas ── */
function GalaxyCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: -9999, y: -9999, inside: false });
    const hoveredRef = useRef<string | null>(null);
    const [hovered, setHovered] = useState<Hovered | null>(null);

    const { dust, nebulae } = useMemo(buildGalaxy, []);
    const skillStars = useMemo(buildSkillStars, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrap = wrapRef.current;
        if (!canvas || !wrap) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let raf = 0;
        let rotation = 0;
        let W = 0, H = 0, dpr = 1;

        const resize = () => {
            const rect = wrap.getBoundingClientRect();
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            W = rect.width;
            H = rect.height;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            canvas.style.width = `${W}px`;
            canvas.style.height = `${H}px`;
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(wrap);

        const onMove = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, inside: true };
        };
        const onLeave = () => { mouseRef.current.inside = false; mouseRef.current.x = -9999; };
        canvas.addEventListener('pointermove', onMove);
        canvas.addEventListener('pointerdown', onMove);
        canvas.addEventListener('pointerleave', onLeave);

        /* world → screen: spiral coords, galaxy tilt, slow rotation, mouse parallax */
        let px = 0, py = 0; // eased parallax
        const project = (theta: number, radius: number, jx: number, jy: number) => {
            const maxR = Math.min(W, H * 1.7) * 0.46;
            const a = theta + rotation;
            const x = Math.cos(a) * (radius + jx) * maxR;
            const y = Math.sin(a) * (radius + jy) * maxR * 0.52; // disc tilt
            return { x: W / 2 + px + x, y: H / 2 + py + y };
        };

        const draw = (time: number) => {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, W, H);

            const m = mouseRef.current;
            const targetPx = m.inside ? (m.x - W / 2) * 0.035 : 0;
            const targetPy = m.inside ? (m.y - H / 2) * 0.035 : 0;
            px += (targetPx - px) * 0.05;
            py += (targetPy - py) * 0.05;
            if (!reduced) rotation += 0.00045;

            /* core glow */
            const core = ctx.createRadialGradient(W / 2 + px, H / 2 + py, 0, W / 2 + px, H / 2 + py, Math.min(W, H) * 0.34);
            core.addColorStop(0, 'rgba(255, 244, 214, 0.32)');
            core.addColorStop(0.25, 'rgba(255, 226, 183, 0.12)');
            core.addColorStop(0.6, 'rgba(167, 139, 250, 0.05)');
            core.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = core;
            ctx.fillRect(0, 0, W, H);

            /* nebula haze along the arms */
            for (const n of nebulae) {
                const p = project(n.theta, n.radius, n.jx, n.jy);
                const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, n.size);
                const c = n.warm ? '167,139,250' : '103,232,249';
                g.addColorStop(0, `rgba(${c}, 0.035)`);
                g.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g;
                ctx.fillRect(p.x - n.size, p.y - n.size, n.size * 2, n.size * 2);
            }

            /* dust stars */
            for (const s of dust) {
                const p = project(s.theta, s.radius, s.jx, s.jy);
                if (p.x < -8 || p.x > W + 8 || p.y < -8 || p.y > H + 8) continue;
                const tw = reduced ? 0.75 : 0.55 + 0.45 * Math.sin(time * 0.0011 + s.twinkle);
                /* cursor gravity: nearby dust brightens and leans toward the pointer */
                let bx = p.x, by = p.y, boost = 0;
                if (m.inside) {
                    const dx = m.x - p.x, dy = m.y - p.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < 16900) {
                        const d = Math.sqrt(d2) || 1;
                        const pull = (1 - d / 130) * 7;
                        bx += (dx / d) * pull;
                        by += (dy / d) * pull;
                        boost = (1 - d / 130) * 0.5;
                    }
                }
                ctx.beginPath();
                ctx.arc(bx, by, s.size, 0, Math.PI * 2);
                ctx.fillStyle = s.warm
                    ? `rgba(255, 231, 186, ${(0.5 + boost) * tw})`
                    : `rgba(214, 234, 255, ${(0.55 + boost) * tw})`;
                ctx.fill();
            }

            /* skill stars + hit-testing */
            let hit: SkillStar | null = null;
            let hitD = 32;
            for (const ss of skillStars) {
                const p = project(ss.theta, ss.radius, ss.jx, ss.jy);
                ss.sx = p.x; ss.sy = p.y;
                if (m.inside) {
                    const d = Math.hypot(m.x - p.x, m.y - p.y);
                    if (d < hitD) { hit = ss; hitD = d; }
                }
            }
            const hoverId = hit?.skill.id ?? null;

            /* constellation lines from the hovered skill to its connections */
            if (hit) {
                const color = clusterColors[hit.skill.cluster];
                for (const connId of hit.skill.connections) {
                    const other = skillStars.find(s => s.skill.id === connId);
                    if (!other) continue;
                    const grad = ctx.createLinearGradient(hit.sx, hit.sy, other.sx, other.sy);
                    grad.addColorStop(0, `${color}cc`);
                    grad.addColorStop(1, `${clusterColors[other.skill.cluster]}33`);
                    ctx.beginPath();
                    ctx.moveTo(hit.sx, hit.sy);
                    ctx.lineTo(other.sx, other.sy);
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            for (const ss of skillStars) {
                const color = clusterColors[ss.skill.cluster];
                const isHover = ss.skill.id === hoverId;
                const isLinked = hit ? hit.skill.connections.includes(ss.skill.id) : false;
                const base = 1.7 + (ss.skill.proficiency / 100) * 1.6;
                const r = isHover ? base * 2.4 : isLinked ? base * 1.5 : base;

                ctx.save();
                ctx.shadowColor = color;
                ctx.shadowBlur = isHover ? 26 : isLinked ? 16 : 9;
                ctx.beginPath();
                ctx.arc(ss.sx, ss.sy, r, 0, Math.PI * 2);
                ctx.fillStyle = isHover || isLinked ? '#ffffff' : color;
                ctx.fill();
                ctx.restore();

                if (isHover) {
                    ctx.beginPath();
                    ctx.arc(ss.sx, ss.sy, r + 7, 0, Math.PI * 2);
                    ctx.strokeStyle = `${color}88`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            /* publish hover state to React only when it changes */
            if (hoverId !== hoveredRef.current) {
                hoveredRef.current = hoverId;
                setHovered(hit ? {
                    id: hit.skill.id,
                    name: hit.skill.name,
                    cluster: hit.skill.cluster,
                    proficiency: hit.skill.proficiency,
                    x: hit.sx,
                    y: hit.sy,
                } : null);
            } else if (hit && hoveredRef.current === hoverId) {
                setHovered(prev => (prev && Math.abs(prev.x - hit.sx) + Math.abs(prev.y - hit.sy) > 2)
                    ? { ...prev, x: hit.sx, y: hit.sy }
                    : prev);
            }

            raf = requestAnimationFrame(draw);
        };
        raf = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            canvas.removeEventListener('pointermove', onMove);
            canvas.removeEventListener('pointerdown', onMove);
            canvas.removeEventListener('pointerleave', onLeave);
        };
    }, [dust, nebulae, skillStars]);

    return (
        <div ref={wrapRef} className="relative w-full h-[62vh] min-h-[420px] cursor-crosshair">
            <canvas ref={canvasRef} className="absolute inset-0" aria-label="Interactive galaxy of skills — each bright star is a skill" />
            {/* Skill tooltip */}
            {hovered && (
                <div
                    className="absolute pointer-events-none z-10 -translate-x-1/2 px-3.5 py-2.5 rounded-xl border bg-[#0b0721]/90 backdrop-blur-md"
                    style={{
                        left: Math.max(90, Math.min(hovered.x, (wrapRef.current?.clientWidth ?? 600) - 90)),
                        top: Math.max(10, hovered.y - 86),
                        borderColor: `${clusterColors[hovered.cluster]}55`,
                        boxShadow: `0 8px 32px ${clusterColors[hovered.cluster]}22`,
                    }}
                >
                    <p className="text-[13px] font-semibold text-white whitespace-nowrap">{hovered.name}</p>
                    <p className="text-[9px] font-mono tracking-[0.18em] uppercase mb-1.5" style={{ color: clusterColors[hovered.cluster] }}>
                        {clusterLabels[hovered.cluster]}
                    </p>
                    <div className="w-28 h-[3px] rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${hovered.proficiency}%`, backgroundColor: clusterColors[hovered.cluster] }} />
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── Planet sphere for project cards ── */
const PLANETS = [
    'radial-gradient(circle at 32% 28%, #c4b5fd, #7c3aed 48%, #2e1065 100%)',
    'radial-gradient(circle at 32% 28%, #99f6e4, #0d9488 48%, #042f2e 100%)',
    'radial-gradient(circle at 32% 28%, #fecaca, #e11d48 48%, #4c0519 100%)',
    'radial-gradient(circle at 32% 28%, #fde68a, #d97706 48%, #451a03 100%)',
    'radial-gradient(circle at 32% 28%, #bae6fd, #0284c7 48%, #082f49 100%)',
];

const fadeUp = {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
};

export default function GalaxyTheme() {
    return (
        <div className="min-h-screen text-gray-200 relative" style={{ background: 'radial-gradient(ellipse 120% 70% at 50% -10%, #1b1040 0%, #0a0524 38%, #030014 100%)', fontFamily: 'var(--font-sans)' }}>
            {/* fixed distant starfield */}
            <div className="pointer-events-none fixed inset-0 opacity-60" style={{
                backgroundImage: 'radial-gradient(1px 1px at 12% 22%, rgba(255,255,255,0.7) 50%, transparent 51%), radial-gradient(1px 1px at 78% 12%, rgba(255,255,255,0.5) 50%, transparent 51%), radial-gradient(1.5px 1.5px at 42% 64%, rgba(255,255,255,0.4) 50%, transparent 51%), radial-gradient(1px 1px at 88% 48%, rgba(255,255,255,0.55) 50%, transparent 51%), radial-gradient(1px 1px at 25% 86%, rgba(255,255,255,0.45) 50%, transparent 51%), radial-gradient(1.5px 1.5px at 62% 34%, rgba(167,139,250,0.5) 50%, transparent 51%), radial-gradient(1px 1px at 5% 55%, rgba(103,232,249,0.5) 50%, transparent 51%)',
                backgroundSize: '480px 480px',
            }} />

            <div className="relative z-10">
                {/* ── HERO ── */}
                <section className="min-h-[92vh] flex flex-col items-center justify-center text-center px-6 relative">
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.65 }} transition={{ duration: 1, delay: 0.2 }} className="text-[10px] font-mono tracking-[0.55em] text-violet-300/70 mb-8">
                        A UNIVERSE OF WORK
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, letterSpacing: '0.5em' }}
                        animate={{ opacity: 1, letterSpacing: '0.22em' }}
                        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                        className="text-4xl sm:text-6xl md:text-7xl font-light uppercase pl-[0.22em] mb-8 bg-gradient-to-b from-white via-violet-100 to-violet-400/60 bg-clip-text text-transparent"
                        style={{ fontFamily: 'var(--font-grotesk)' }}
                    >
                        Aagam Shah
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="max-w-xl text-gray-400 leading-relaxed mb-12">
                        Full-stack engineer, AI builder, and the reason a few aircraft know how to land themselves.
                        Scroll down — his skills are an actual galaxy.
                    </motion.p>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="absolute bottom-10 flex flex-col items-center gap-2 text-violet-300/50">
                        <span className="text-[9px] font-mono tracking-[0.4em]">DESCEND</span>
                        <ChevronDown size={16} className="animate-bounce" />
                    </motion.div>
                </section>

                {/* ── THE SKILL GALAXY ── */}
                <section className="py-16 px-2 sm:px-6">
                    <motion.div {...fadeUp} className="text-center mb-4">
                        <p className="text-[10px] font-mono tracking-[0.45em] text-violet-300/60 mb-4">SECTOR 01</p>
                        <h2 className="text-3xl sm:text-5xl font-light tracking-[0.08em] uppercase mb-4" style={{ fontFamily: 'var(--font-grotesk)' }}>
                            The Skill Galaxy
                        </h2>
                        <p className="text-sm text-gray-500 max-w-md mx-auto">
                            Every bright star is a real skill. Drift your cursor through the spiral —
                            stars reveal themselves, and constellations show what works together.
                        </p>
                    </motion.div>
                    <motion.div {...fadeUp}>
                        <GalaxyCanvas />
                    </motion.div>
                    <div className="flex flex-wrap justify-center gap-x-7 gap-y-2 mt-2">
                        {(['fullstack', 'ai', 'aerospace', 'embedded'] as SkillCluster[]).map(c => (
                            <span key={c} className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-gray-500 uppercase">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: clusterColors[c], boxShadow: `0 0 8px ${clusterColors[c]}` }} />
                                {clusterLabels[c]}
                            </span>
                        ))}
                    </div>
                </section>

                {/* ── PLANETARY SYSTEMS (projects) ── */}
                <section className="py-24 px-6 max-w-6xl mx-auto">
                    <motion.div {...fadeUp} className="mb-14 text-center">
                        <p className="text-[10px] font-mono tracking-[0.45em] text-violet-300/60 mb-4">SECTOR 02</p>
                        <h2 className="text-3xl sm:text-5xl font-light tracking-[0.08em] uppercase" style={{ fontFamily: 'var(--font-grotesk)' }}>
                            Planetary Systems
                        </h2>
                    </motion.div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((p, i) => (
                            <motion.a
                                key={p.id}
                                {...fadeUp}
                                transition={{ ...fadeUp.transition, delay: (i % 3) * 0.08 }}
                                href={p.github || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7 overflow-hidden hover:border-violet-400/30 hover:bg-white/[0.04] transition-all duration-500"
                            >
                                <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full opacity-25 blur-2xl group-hover:opacity-50 transition-opacity duration-700" style={{ background: PLANETS[i % PLANETS.length] }} />
                                <div className="w-14 h-14 rounded-full mb-6 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12" style={{ background: PLANETS[i % PLANETS.length], boxShadow: '0 6px 24px rgba(0,0,0,0.5), inset -6px -6px 14px rgba(0,0,0,0.5)' }} />
                                <div className="flex items-start justify-between gap-3">
                                    <h3 className="text-xl font-medium tracking-wide mb-2" style={{ fontFamily: 'var(--font-grotesk)' }}>{p.title}</h3>
                                    <ArrowUpRight size={16} className="mt-1.5 text-violet-300/40 group-hover:text-violet-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                </div>
                                <p className="text-[13px] text-gray-500 leading-relaxed mb-5">{p.description}</p>
                                <p className="text-[9px] font-mono tracking-[0.18em] uppercase text-violet-300/50">
                                    {p.techStack.slice(0, 3).join(' · ')}
                                </p>
                            </motion.a>
                        ))}
                    </div>
                </section>

                {/* ── MISSION LOG (experience) ── */}
                <section className="py-24 px-6 max-w-3xl mx-auto">
                    <motion.div {...fadeUp} className="mb-14 text-center">
                        <p className="text-[10px] font-mono tracking-[0.45em] text-violet-300/60 mb-4">SECTOR 03</p>
                        <h2 className="text-3xl sm:text-5xl font-light tracking-[0.08em] uppercase" style={{ fontFamily: 'var(--font-grotesk)' }}>
                            Mission Log
                        </h2>
                    </motion.div>
                    <div className="relative pl-8 border-l border-violet-400/15 space-y-12">
                        {experiences.map((e, i) => (
                            <motion.div key={e.id} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.05 }} className="relative">
                                <span className="absolute -left-[37px] top-1.5 w-[9px] h-[9px] rounded-full bg-violet-300" style={{ boxShadow: '0 0 12px rgba(196,181,253,0.9)' }} />
                                <p className="text-[10px] font-mono tracking-[0.25em] text-violet-300/60 mb-1.5">{e.period.toUpperCase()}</p>
                                <h3 className="text-lg font-medium tracking-wide" style={{ fontFamily: 'var(--font-grotesk)' }}>{e.role}</h3>
                                <p className="text-[13px] text-gray-500 mb-2">{e.company}</p>
                                <p className="text-sm text-gray-400 leading-relaxed">{e.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── SUPERNOVAE (achievements) ── */}
                <section className="py-24 px-6 max-w-5xl mx-auto">
                    <motion.div {...fadeUp} className="mb-14 text-center">
                        <p className="text-[10px] font-mono tracking-[0.45em] text-violet-300/60 mb-4">SECTOR 04</p>
                        <h2 className="text-3xl sm:text-5xl font-light tracking-[0.08em] uppercase" style={{ fontFamily: 'var(--font-grotesk)' }}>
                            Supernovae
                        </h2>
                        <p className="text-sm text-gray-500 mt-3">Moments bright enough to be seen from other industries.</p>
                    </motion.div>
                    <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
                        {achievements.slice(0, 4).map((a, i) => (
                            <motion.div key={a.id} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.05 }} className="flex gap-5">
                                <span className="text-2xl sm:text-3xl font-light shrink-0 w-32 bg-gradient-to-b from-amber-200 to-amber-500/70 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-grotesk)' }}>
                                    {a.rank}
                                </span>
                                <div>
                                    <h3 className="text-base font-medium mb-1.5 tracking-wide">{a.title}</h3>
                                    <p className="text-[13px] text-gray-500 leading-relaxed">{a.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── TRANSMISSION (contact) ── */}
                <section className="py-32 px-6 text-center relative">
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(124,58,237,0.12), transparent 70%)' }} />
                    <motion.div {...fadeUp} className="relative">
                        <p className="text-[10px] font-mono tracking-[0.45em] text-violet-300/60 mb-6">OPEN CHANNEL</p>
                        <a
                            href={`mailto:${personalInfo.email}`}
                            className="inline-block text-3xl sm:text-5xl md:text-6xl font-light uppercase tracking-[0.1em] bg-gradient-to-b from-white to-violet-300/70 bg-clip-text text-transparent hover:to-violet-200 transition-all"
                            style={{ fontFamily: 'var(--font-grotesk)' }}
                        >
                            Send a transmission
                        </a>
                        <p className="text-sm text-gray-500 mt-6">{personalInfo.email} · responds at light speed</p>
                        <div className="flex justify-center gap-8 mt-10">
                            {[['GitHub', personalInfo.github], ['LinkedIn', personalInfo.linkedin]].map(([label, href]) => (
                                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono tracking-[0.3em] uppercase text-gray-500 hover:text-violet-300 transition-colors">
                                    {label}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </section>

                <footer className="pb-10 text-center">
                    <p className="text-[10px] font-mono tracking-[0.3em] text-gray-600">© {new Date().getFullYear()} AAGAM SHAH · SOMEWHERE IN THE ORION ARM</p>
                </footer>
            </div>
        </div>
    );
}
