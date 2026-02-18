'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personalInfo, projects, experiences, achievements } from '@/lib/data';

/* ═══════════════════════════════════════
   WINDOWS 95 THEME — v2
   Pixel-perfect retro desktop simulation
   ═══════════════════════════════════════ */

type WinId = 'about' | 'projects' | 'experience' | 'skills' | 'achievements' | 'contact';

interface WinState { id: WinId; z: number; }

/* ── CSS helpers for Win95 3D borders ── */
const raised = { borderTop: '2px solid #fff', borderLeft: '2px solid #fff', borderBottom: '2px solid #808080', borderRight: '2px solid #808080' };
const sunken = { borderTop: '2px solid #808080', borderLeft: '2px solid #808080', borderBottom: '2px solid #fff', borderRight: '2px solid #fff' };

/* ── Window Content Components ── */

function AboutWin() {
    return (
        <div className="p-4" style={{ fontFamily: "'Pixelated MS Sans Serif', 'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: 11 }}>
            <div className="flex gap-4 mb-4">
                <div className="w-16 h-16 flex items-center justify-center shrink-0" style={{ ...sunken, background: '#fff' }}>
                    <span className="text-3xl">👤</span>
                </div>
                <div>
                    <p className="font-bold text-sm">{personalInfo.name}</p>
                    <p className="text-gray-600">{personalInfo.role}</p>
                    <p className="text-gray-500 mt-1">Version 2.0 — Mumbai, India</p>
                </div>
            </div>
            <div className="h-px bg-gray-400 my-3" />
            <div className="p-2" style={{ ...sunken, background: '#fff' }}>
                <p className="leading-relaxed">{personalInfo.bio}</p>
            </div>
            <div className="mt-3 space-y-1.5">
                <p><span className="font-bold">University:</span> {personalInfo.education.college}</p>
                <p><span className="font-bold">Degree:</span> {personalInfo.education.degree}</p>
                <p><span className="font-bold">Period:</span> {personalInfo.education.period}</p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <button className="px-6 py-1" style={{ ...raised, background: '#c0c0c0' }}>OK</button>
            </div>
        </div>
    );
}

function ProjectsWin() {
    return (
        <div className="p-2" style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: 11 }}>
            {/* Toolbar */}
            <div className="flex items-center gap-1 mb-2 p-1" style={{ ...sunken, background: '#fff' }}>
                <span className="text-[10px] text-gray-500 px-1">📁 C:\Users\Aagam\Projects</span>
            </div>
            {/* File list */}
            <div className="overflow-y-auto" style={{ ...sunken, background: '#fff', maxHeight: 300 }}>
                <table className="w-full">
                    <thead>
                        <tr style={{ background: '#c0c0c0' }}>
                            <th className="text-left p-1 font-normal" style={{ borderRight: '1px solid #808080', borderBottom: '1px solid #808080' }}>Name</th>
                            <th className="text-left p-1 font-normal" style={{ borderRight: '1px solid #808080', borderBottom: '1px solid #808080' }}>Type</th>
                            <th className="text-left p-1 font-normal" style={{ borderBottom: '1px solid #808080' }}>Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((p, i) => (
                            <tr key={i} className="cursor-pointer group">
                                <td className="p-1 group-hover:bg-[#000080] group-hover:text-white">📄 {p.title}</td>
                                <td className="p-1 group-hover:bg-[#000080] group-hover:text-white">{p.category}</td>
                                <td className="p-1 group-hover:bg-[#000080] group-hover:text-white">{p.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-gray-600 p-1" style={sunken}>
                <span>{projects.length} object(s)</span>
                <span>Disk free: ∞ GB</span>
            </div>
        </div>
    );
}

function ExperienceWin() {
    return (
        <div className="p-3" style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: 11 }}>
            <div className="overflow-y-auto" style={{ maxHeight: 320 }}>
                {experiences.map((e, i) => (
                    <div key={i} className="mb-2 p-2" style={{ ...raised, background: '#c0c0c0' }}>
                        <p className="font-bold">💼 {e.role}</p>
                        <p className="text-gray-700">{e.company}</p>
                        <p className="text-gray-500">{e.period}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SkillsWin() {
    const skills = ['TypeScript', 'Python', 'React', 'Next.js', 'Node.js', 'TensorFlow', 'AWS', 'Docker', 'C++', 'PostgreSQL', 'OpenCV', 'Git'];
    return (
        <div className="p-3" style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: 11 }}>
            <p className="font-bold mb-2">✅ Installed Components</p>
            <div className="p-1 overflow-y-auto" style={{ ...sunken, background: '#fff', maxHeight: 280 }}>
                {skills.map((s, i) => (
                    <div key={i} className="px-1.5 py-[2px] cursor-pointer hover:bg-[#000080] hover:text-white flex items-center gap-2">
                        <span>☑</span><span>{s}</span>
                    </div>
                ))}
            </div>
            <div className="flex justify-end gap-2 mt-3">
                <button className="px-4 py-0.5" style={{ ...raised, background: '#c0c0c0' }}>Apply</button>
                <button className="px-4 py-0.5" style={{ ...raised, background: '#c0c0c0' }}>OK</button>
            </div>
        </div>
    );
}

function AchievementsWin() {
    return (
        <div className="p-2" style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: 12 }}>
            <div className="p-2 overflow-y-auto" style={{ ...sunken, background: '#fff', maxHeight: 300 }}>
                <p className="mb-2 font-bold">====== ACHIEVEMENTS.TXT ======</p>
                {achievements.map((a, i) => (
                    <div key={i} className="mb-2">
                        <p>🏆 {a.title}</p>
                        <p className="text-gray-600 ml-4">{a.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ContactWin() {
    return (
        <div className="p-4 text-center" style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: 11 }}>
            <span className="text-4xl block mb-3">📬</span>
            <p className="font-bold mb-4">Send Message to Aagam Shah</p>
            <div className="space-y-2 text-left p-2" style={{ ...sunken, background: '#fff' }}>
                <p>📧 <a href={`mailto:${personalInfo.email}`} className="text-blue-700 underline">{personalInfo.email}</a></p>
                <p>🌐 <a href="https://github.com/AAGAM17" target="_blank" rel="noreferrer" className="text-blue-700 underline">github.com/AAGAM17</a></p>
                <p>💼 <a href="https://linkedin.com/in/aagamshah" target="_blank" rel="noreferrer" className="text-blue-700 underline">linkedin.com/in/aagamshah</a></p>
            </div>
            <div className="flex justify-center gap-2 mt-4">
                <button className="px-6 py-1" style={{ ...raised, background: '#c0c0c0' }}>Send</button>
                <button className="px-6 py-1" style={{ ...raised, background: '#c0c0c0' }}>Cancel</button>
            </div>
        </div>
    );
}

const WIN_APPS: Record<WinId, { title: string; icon: string; content: React.ReactNode }> = {
    about: { title: 'About Me — Properties', icon: '👤', content: <AboutWin /> },
    projects: { title: 'C:\\Projects — Explorer', icon: '📁', content: <ProjectsWin /> },
    experience: { title: 'Work — Experience Viewer', icon: '💼', content: <ExperienceWin /> },
    skills: { title: 'System Properties', icon: '⚙️', content: <SkillsWin /> },
    achievements: { title: 'ACHIEVEMENTS.TXT — Notepad', icon: '📝', content: <AchievementsWin /> },
    contact: { title: 'Outlook Express', icon: '📬', content: <ContactWin /> },
};

const DESKTOP_ICONS: { id: WinId; icon: string; label: string }[] = [
    { id: 'about', icon: '👤', label: 'About Me' },
    { id: 'projects', icon: '📁', label: 'My Projects' },
    { id: 'experience', icon: '💼', label: 'Work.doc' },
    { id: 'skills', icon: '⚙️', label: 'Settings' },
    { id: 'achievements', icon: '📝', label: 'Awards.txt' },
    { id: 'contact', icon: '📬', label: 'Email' },
];

const START_ITEMS = [
    { icon: '📁', label: 'My Projects', id: 'projects' as WinId },
    { icon: '📄', label: 'Documents', id: 'experience' as WinId },
    { icon: '⚙️', label: 'Settings', id: 'skills' as WinId },
    { icon: '❓', label: 'Help', id: 'about' as WinId },
];

export default function Win95Theme() {
    const [windows, setWindows] = useState<WinState[]>([]);
    const [startOpen, setStartOpen] = useState(false);
    const [topZ, setTopZ] = useState(10);

    const openWin = useCallback((id: WinId) => {
        setStartOpen(false);
        setWindows(prev => {
            if (prev.find(w => w.id === id)) return prev.map(w => w.id === id ? { ...w, z: topZ + 1 } : w);
            return [...prev, { id, z: topZ + 1 }];
        });
        setTopZ(z => z + 1);
    }, [topZ]);

    const closeWin = useCallback((id: WinId) => setWindows(p => p.filter(w => w.id !== id)), []);
    const focusWin = useCallback((id: WinId) => {
        setTopZ(z => z + 1);
        setWindows(p => p.map(w => w.id === id ? { ...w, z: topZ + 1 } : w));
    }, [topZ]);

    const now = new Date();

    return (
        <div className="h-screen w-screen relative overflow-hidden select-none bg-[#008080]" style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif" }}>
            {/* ── DESKTOP ICONS ── */}
            <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                {DESKTOP_ICONS.map(item => (
                    <button key={item.id} onClick={() => openWin(item.id)} className="flex flex-col items-center w-[75px] py-2 rounded hover:bg-blue-600/30 group">
                        <span className="text-[32px] drop-shadow-md">{item.icon}</span>
                        <span className="text-[11px] text-white mt-0.5 leading-tight text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* ── WINDOWS ── */}
            <AnimatePresence>
                {windows.map((win, idx) => {
                    const app = WIN_APPS[win.id];
                    const isActive = win.z === Math.max(...windows.map(w => w.z));
                    return (
                        <motion.div
                            key={win.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute overflow-hidden"
                            style={{
                                left: `calc(15% + ${idx * 35}px)`,
                                top: `calc(8% + ${idx * 25}px)`,
                                width: 'min(440px, calc(100vw - 32px))',
                                zIndex: win.z,
                                ...raised,
                                background: '#c0c0c0',
                            }}
                            onMouseDown={() => focusWin(win.id)}
                        >
                            {/* Title bar */}
                            <div className={`h-[22px] flex items-center justify-between px-[3px] py-[2px] ${isActive ? 'bg-[#000080]' : 'bg-[#808080]'}`}>
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="text-[12px] leading-none">{app.icon}</span>
                                    <span className="text-white text-[11px] font-bold truncate">{app.title}</span>
                                </div>
                                <div className="flex gap-[2px] shrink-0">
                                    <button className="w-[16px] h-[14px] flex items-center justify-center text-[10px]" style={{ ...raised, background: '#c0c0c0' }}>_</button>
                                    <button className="w-[16px] h-[14px] flex items-center justify-center text-[10px]" style={{ ...raised, background: '#c0c0c0' }}>□</button>
                                    <button onClick={() => closeWin(win.id)} className="w-[16px] h-[14px] flex items-center justify-center text-[10px] font-bold" style={{ ...raised, background: '#c0c0c0' }}>×</button>
                                </div>
                            </div>
                            {/* Menu bar */}
                            <div className="flex items-center gap-0 text-[11px] pl-1 py-[1px] bg-[#c0c0c0] border-b border-[#808080]">
                                <span className="hover:bg-[#000080] hover:text-white px-1.5 cursor-pointer">File</span>
                                <span className="hover:bg-[#000080] hover:text-white px-1.5 cursor-pointer">Edit</span>
                                <span className="hover:bg-[#000080] hover:text-white px-1.5 cursor-pointer">View</span>
                                <span className="hover:bg-[#000080] hover:text-white px-1.5 cursor-pointer">Help</span>
                            </div>
                            {/* Content */}
                            <div className="bg-[#c0c0c0] overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
                                {app.content}
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {/* ── START MENU ── */}
            <AnimatePresence>
                {startOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.1 }}
                        className="fixed left-0 z-[70]"
                        style={{ bottom: 28, ...raised, background: '#c0c0c0', width: 200 }}
                    >
                        <div className="flex">
                            {/* Vertical banner */}
                            <div className="w-[24px] bg-gradient-to-t from-[#000080] to-[#1084d0] flex items-end justify-center py-3">
                                <span className="text-white text-[10px] font-bold [writing-mode:vertical-rl] rotate-180 tracking-wider">Aagam<span className="font-extrabold">95</span></span>
                            </div>
                            {/* Menu items */}
                            <div className="flex-1 py-[2px]">
                                {START_ITEMS.map((item, i) => (
                                    <button key={i} onClick={() => openWin(item.id)} className="w-full flex items-center gap-3 px-3 py-[6px] hover:bg-[#000080] hover:text-white text-[11px] text-left">
                                        <span className="text-[16px]">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                                <div className="border-t border-gray-400 border-b border-b-white my-[2px] mx-1" />
                                <button className="w-full flex items-center gap-3 px-3 py-[6px] hover:bg-[#000080] hover:text-white text-[11px] text-left">
                                    <span className="text-[16px]">🔌</span>
                                    <span>Shut Down...</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── TASKBAR ── */}
            <div className="fixed bottom-0 left-0 right-0 h-[28px] z-[60] flex items-center px-[2px] gap-[2px]" style={{ ...raised, background: '#c0c0c0' }}>
                {/* Start button */}
                <button
                    onClick={() => setStartOpen(!startOpen)}
                    className="h-[22px] flex items-center gap-1 px-2 text-[11px] font-bold shrink-0"
                    style={{ ...(startOpen ? sunken : raised), background: '#c0c0c0' }}
                >
                    <span className="text-[14px]">🪟</span>
                    <span>Start</span>
                </button>

                <div className="w-px h-4 bg-[#808080] mx-0.5" />

                {/* Task buttons */}
                <div className="flex-1 flex gap-[2px] overflow-x-auto">
                    {windows.map(win => {
                        const app = WIN_APPS[win.id];
                        const isTop = win.z === Math.max(...windows.map(w => w.z));
                        return (
                            <button
                                key={win.id}
                                onClick={() => focusWin(win.id)}
                                className="h-[22px] flex items-center gap-1.5 px-2 text-[11px] max-w-[150px] truncate"
                                style={{ ...(isTop ? sunken : raised), background: '#c0c0c0' }}
                            >
                                <span className="text-[12px]">{app.icon}</span>
                                <span className="truncate">{app.title.split('—')[0].trim()}</span>
                            </button>
                        );
                    })}
                </div>

                {/* System tray */}
                <div className="h-[22px] flex items-center gap-2 px-2 text-[11px] shrink-0" style={sunken}>
                    <span>🔊</span>
                    <span>{now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                </div>
            </div>
        </div>
    );
}
