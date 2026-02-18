'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personalInfo, projects, experiences, achievements } from '@/lib/data';

/* ═══════════════════════════════════════
   macOS SEQUOIA THEME — v2
   Ultra-realistic macOS desktop simulation
   ═══════════════════════════════════════ */

type AppId = 'about' | 'projects' | 'experience' | 'skills' | 'achievements' | 'contact' | 'terminal';

interface WinState { id: AppId; zIndex: number; minimized: boolean; }

/* ---------- window content ---------- */

function AboutWindow() {
    return (
        <div className="flex h-[360px]">
            {/* Sidebar */}
            <div className="w-[180px] bg-[#f5f5f7]/80 backdrop-blur-xl border-r border-black/5 p-4 space-y-1 shrink-0">
                {['General', 'Education', 'Contact'].map(item => (
                    <div key={item} className="text-[11px] py-1 px-2 rounded-md text-gray-600 hover:bg-black/5 cursor-default">{item}</div>
                ))}
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-semibold shadow-lg">AS</div>
                    <div>
                        <h2 className="text-[20px] font-semibold text-gray-900 tracking-tight">{personalInfo.name}</h2>
                        <p className="text-[13px] text-gray-500">{personalInfo.role}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Mumbai, India</p>
                    </div>
                </div>
                <p className="text-[13px] text-gray-600 leading-[1.6] mb-5">{personalInfo.bio}</p>
                <div className="space-y-3">
                    {[
                        ['Degree', personalInfo.education.degree],
                        ['College', personalInfo.education.college],
                        ['Period', personalInfo.education.period],
                    ].map(([k, v]) => (
                        <div key={k} className="flex items-baseline gap-3">
                            <span className="text-[11px] text-gray-400 w-16 text-right shrink-0">{k}</span>
                            <span className="text-[13px] text-gray-700">{v}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ProjectsWindow() {
    const [selected, setSelected] = useState(-1);
    return (
        <div className="flex h-[400px]">
            {/* Finder sidebar */}
            <div className="w-[170px] bg-[#f5f5f7]/80 backdrop-blur-xl border-r border-black/5 p-3 space-y-0.5 shrink-0 overflow-y-auto">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">Favorites</p>
                {projects.map((p, i) => (
                    <button key={i} onClick={() => setSelected(i)} className={`w-full text-left text-[12px] py-1 px-2 rounded-md truncate transition-colors ${selected === i ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-black/5'}`}>
                        📁 {p.title}
                    </button>
                ))}
            </div>
            {/* Detail pane */}
            <div className="flex-1 p-5 overflow-y-auto">
                {selected >= 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={selected}>
                        <h3 className="text-[17px] font-semibold text-gray-900 mb-1">{projects[selected].title}</h3>
                        <p className="text-[11px] text-gray-400 mb-3">{projects[selected].subtitle}</p>
                        <p className="text-[13px] text-gray-600 leading-relaxed mb-4">{projects[selected].description}</p>
                        <div className="flex flex-wrap gap-1.5">
                            {projects[selected].techStack.map((t, j) => (
                                <span key={j} className="px-2 py-0.5 text-[10px] bg-gray-100 text-gray-600 rounded-full">{t}</span>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <div className="h-full flex items-center justify-center text-[13px] text-gray-400">Select a project</div>
                )}
            </div>
        </div>
    );
}

function ExperienceWindow() {
    return (
        <div className="p-5 space-y-3 overflow-y-auto max-h-[380px]">
            {experiences.map((e, i) => (
                <div key={i} className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-[13px] font-semibold text-gray-900">{e.role}</h3>
                            <p className="text-[12px] text-gray-500">{e.company}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 px-2 py-0.5 bg-gray-200 rounded-full shrink-0">{e.period}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

function SkillsWindow() {
    const clusters = [
        { name: 'Languages', items: ['TypeScript', 'Python', 'C++', 'JavaScript'] },
        { name: 'Frameworks', items: ['React', 'Next.js', 'Node.js', 'TensorFlow'] },
        { name: 'Tools', items: ['AWS', 'Docker', 'Git', 'PostgreSQL'] },
        { name: 'Domains', items: ['Computer Vision', 'NLP', 'Drone Systems', 'Embedded'] },
    ];
    return (
        <div className="p-5 space-y-5 overflow-y-auto max-h-[380px]">
            {clusters.map((c, ci) => (
                <div key={ci}>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">{c.name}</p>
                    <div className="flex flex-wrap gap-2">
                        {c.items.map((s, j) => (
                            <span key={j} className="px-3 py-1.5 text-[12px] bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-default">{s}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function AchievementsWindow() {
    return (
        <div className="p-5 space-y-2 overflow-y-auto max-h-[380px]">
            {achievements.map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-lg">{a.rank || '🏆'}</span>
                    <div className="min-w-0">
                        <p className="text-[13px] font-medium text-gray-900 truncate">{a.title}</p>
                        <p className="text-[11px] text-gray-400 truncate">{a.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ContactWindow() {
    return (
        <div className="p-6 space-y-4">
            {[
                { icon: '✉️', label: 'Email', value: personalInfo.email, href: `mailto:${personalInfo.email}` },
                { icon: '🐙', label: 'GitHub', value: 'github.com/AAGAM17', href: 'https://github.com/AAGAM17' },
                { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/aagamshah', href: 'https://linkedin.com/in/aagamshah' },
            ].map((c, i) => (
                <a key={i} href={c.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors group">
                    <span className="text-xl">{c.icon}</span>
                    <div>
                        <p className="text-[11px] text-gray-400">{c.label}</p>
                        <p className="text-[13px] text-gray-700 group-hover:text-blue-600 transition-colors">{c.value}</p>
                    </div>
                </a>
            ))}
        </div>
    );
}

function TermWindow() {
    return (
        <div className="bg-[#1e1e1e] h-[300px] p-4 font-mono text-[13px] overflow-y-auto" style={{ fontFamily: "'Menlo', 'Monaco', monospace" }}>
            <p className="text-[#4ec9b0]">aagam@macbook <span className="text-[#808080]">~</span> <span className="text-white">%</span></p>
            <p className="text-gray-400 mt-1.5"><span className="text-white">$ </span>whoami</p>
            <p className="text-[#ce9178]">{personalInfo.name} — {personalInfo.role}</p>
            <p className="text-gray-400 mt-1.5"><span className="text-white">$ </span>cat ~/skills.txt</p>
            <p className="text-[#dcdcaa]">TypeScript · Python · React · Next.js · TensorFlow · AWS · Docker</p>
            <p className="text-gray-400 mt-1.5"><span className="text-white">$ </span>ls ~/projects/ | wc -l</p>
            <p className="text-[#b5cea8]">{projects.length}</p>
            <p className="text-gray-400 mt-1.5"><span className="text-white">$ </span>echo $STATUS</p>
            <p className="text-[#6a9955]">Open to opportunities ✨</p>
            <p className="text-[#4ec9b0] mt-1.5">aagam@macbook <span className="text-[#808080]">~</span> <span className="text-white">%</span> <span className="animate-pulse">▊</span></p>
        </div>
    );
}

const APPS: Record<AppId, { title: string; icon: string; w: number; h: number; content: React.ReactNode }> = {
    about: { title: 'About Aagam', icon: '👤', w: 560, h: 400, content: <AboutWindow /> },
    projects: { title: 'Projects — Finder', icon: '📁', w: 620, h: 440, content: <ProjectsWindow /> },
    experience: { title: 'Experience', icon: '💼', w: 480, h: 420, content: <ExperienceWindow /> },
    skills: { title: 'Skills', icon: '⚡', w: 440, h: 400, content: <SkillsWindow /> },
    achievements: { title: 'Achievements', icon: '🏆', w: 480, h: 420, content: <AchievementsWindow /> },
    contact: { title: 'Contact', icon: '✉️', w: 400, h: 340, content: <ContactWindow /> },
    terminal: { title: 'Terminal — zsh', icon: '🖥️', w: 540, h: 360, content: <TermWindow /> },
};

const DOCK: AppId[] = ['about', 'projects', 'experience', 'skills', 'achievements', 'contact', 'terminal'];

export default function MacOSTheme() {
    const [windows, setWindows] = useState<WinState[]>([]);
    const [topZ, setTopZ] = useState(10);

    const open = useCallback((id: AppId) => {
        setWindows(prev => {
            if (prev.find(w => w.id === id)) {
                return prev.map(w => w.id === id ? { ...w, minimized: false, zIndex: topZ + 1 } : w);
            }
            return [...prev, { id, zIndex: topZ + 1, minimized: false }];
        });
        setTopZ(z => z + 1);
    }, [topZ]);

    const close = useCallback((id: AppId) => setWindows(p => p.filter(w => w.id !== id)), []);
    const focus = useCallback((id: AppId) => {
        setTopZ(z => z + 1);
        setWindows(p => p.map(w => w.id === id ? { ...w, zIndex: topZ + 1 } : w));
    }, [topZ]);
    const minimize = useCallback((id: AppId) => setWindows(p => p.map(w => w.id === id ? { ...w, minimized: true } : w)), []);

    const now = new Date();

    return (
        <div className="h-screen w-screen relative overflow-hidden select-none" style={{ background: 'linear-gradient(160deg, #2c1654 0%, #4a1b8a 25%, #1a3a7a 50%, #0d2147 75%, #1a1040 100%)' }}>
            {/* ── MENU BAR ── */}
            <div className="h-[25px] bg-black/20 backdrop-blur-2xl flex items-center justify-between px-4 relative z-50" style={{ fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif" }}>
                <div className="flex items-center gap-5 text-[13px] font-medium text-white/90">
                    <span className="text-[15px]">&#63743;</span>
                    <span className="font-semibold">Finder</span>
                    <span className="text-white/60">File</span>
                    <span className="text-white/60">Edit</span>
                    <span className="text-white/60">View</span>
                    <span className="text-white/60">Go</span>
                    <span className="text-white/60">Window</span>
                    <span className="text-white/60">Help</span>
                </div>
                <div className="flex items-center gap-4 text-[12px] text-white/70">
                    <span>🔋</span>
                    <span>Wi-Fi</span>
                    <span>🔍</span>
                    <span>{now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} {now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                </div>
            </div>

            {/* ── DESKTOP WATERMARK ── */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="text-center">
                    <div className="text-white/[0.03] text-[160px] font-bold tracking-tighter leading-none" style={{ fontFamily: 'var(--font-grotesk)' }}>AS</div>
                </div>
            </div>

            {/* ── WINDOWS ── */}
            <AnimatePresence>
                {windows.filter(w => !w.minimized).map((win, idx) => {
                    const app = APPS[win.id];
                    return (
                        <motion.div
                            key={win.id}
                            initial={{ opacity: 0, scale: 0.92, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 15 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                            className="absolute rounded-[10px] overflow-hidden"
                            style={{
                                left: `calc(50% - ${app.w / 2}px + ${idx * 30}px)`,
                                top: `calc(20% + ${idx * 25}px)`,
                                width: `min(${app.w}px, calc(100vw - 32px))`,
                                zIndex: win.zIndex,
                                boxShadow: '0 22px 70px 4px rgba(0,0,0,0.56), 0 0 0 0.5px rgba(0,0,0,0.2)',
                            }}
                            onMouseDown={() => focus(win.id)}
                        >
                            {/* Title Bar */}
                            <div className="h-[38px] bg-[#e8e6ed] flex items-center px-3.5 relative border-b border-black/10" style={{ fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}>
                                {/* Traffic Lights */}
                                <div className="flex gap-[7px] group z-10">
                                    <button onClick={() => close(win.id)} className="w-[12px] h-[12px] rounded-full bg-[#ff5f57] border border-[#e0443e] group-hover:brightness-90 transition-all flex items-center justify-center">
                                        <svg className="w-[6px] h-[6px] opacity-0 group-hover:opacity-100 text-[#4a0002]" viewBox="0 0 10 10" fill="currentColor"><path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
                                    </button>
                                    <button onClick={() => minimize(win.id)} className="w-[12px] h-[12px] rounded-full bg-[#febc2e] border border-[#e09e0c] group-hover:brightness-90 transition-all flex items-center justify-center">
                                        <svg className="w-[6px] h-[6px] opacity-0 group-hover:opacity-100 text-[#663800]" viewBox="0 0 10 10" fill="currentColor"><rect x="1" y="4.5" width="8" height="1" /></svg>
                                    </button>
                                    <div className="w-[12px] h-[12px] rounded-full bg-[#28c840] border border-[#17a832] group-hover:brightness-90 transition-all" />
                                </div>
                                <span className="absolute inset-0 flex items-center justify-center text-[13px] text-gray-600 font-normal pointer-events-none">{app.title}</span>
                            </div>
                            {/* Content */}
                            <div className="bg-white" style={{ fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif" }}>
                                {app.content}
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {/* ── DOCK ── */}
            <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[60]">
                <div className="flex items-end gap-[3px] px-2.5 py-1.5 bg-white/15 backdrop-blur-2xl border border-white/20 rounded-2xl" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
                    {DOCK.map(id => {
                        const app = APPS[id];
                        const isOpen = windows.find(w => w.id === id);
                        return (
                            <button
                                key={id}
                                onClick={() => open(id)}
                                className="group relative flex flex-col items-center"
                            >
                                <span className="absolute -top-8 bg-gray-900/90 text-white text-[11px] px-2.5 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-lg backdrop-blur-sm" style={{ fontFamily: "-apple-system, sans-serif" }}>{APPS[id].title.split('—')[0].trim()}</span>
                                <div className="w-[48px] h-[48px] sm:w-[52px] sm:h-[52px] flex items-center justify-center rounded-[11px] bg-white/10 backdrop-blur-sm border border-white/10 text-[26px] sm:text-[28px] transition-transform group-hover:scale-110 group-hover:-translate-y-2 group-active:scale-95" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                                    {app.icon}
                                </div>
                                {isOpen && <div className="w-1 h-1 rounded-full bg-white/70 mt-0.5" />}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
