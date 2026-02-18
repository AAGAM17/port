'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { personalInfo, projects, experiences, achievements } from '@/lib/data';

/* ═══════════════════════════════════════
   GITHUB PROFILE THEME
   Portfolio as a GitHub profile page
   ═══════════════════════════════════════ */

function ContributionGraph() {
    const weeks = 52;
    const days = 7;
    const levels = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];

    const cells = useMemo(() => {
        const data: number[][] = [];
        for (let w = 0; w < weeks; w++) {
            const row: number[] = [];
            for (let d = 0; d < days; d++) {
                // Simulate activity — more towards recent weeks
                const recencyBoost = w / weeks;
                const rand = Math.random();
                const level = rand < 0.2 + recencyBoost * 0.3
                    ? Math.floor(Math.random() * 4) + 1
                    : 0;
                row.push(level);
            }
            data.push(row);
        }
        return data;
    }, []);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="overflow-x-auto">
            <div className="mb-1 flex gap-0 text-[10px] text-gray-500 ml-7">
                {months.map((m, i) => (
                    <span key={i} style={{ width: `${100 / 12}%` }}>{m}</span>
                ))}
            </div>
            <div className="flex gap-0.5">
                <div className="flex flex-col gap-0.5 text-[9px] text-gray-500 mr-1 shrink-0">
                    <span className="h-[11px]" /><span className="h-[11px]">Mon</span><span className="h-[11px]" /><span className="h-[11px]">Wed</span><span className="h-[11px]" /><span className="h-[11px]">Fri</span><span className="h-[11px]" />
                </div>
                {cells.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-0.5">
                        {week.map((level, di) => (
                            <div
                                key={di}
                                className="w-[11px] h-[11px] rounded-[2px]"
                                style={{ backgroundColor: levels[level] }}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-gray-500">
                <span>Less</span>
                {levels.map((c, i) => (
                    <div key={i} className="w-[10px] h-[10px] rounded-[2px]" style={{ backgroundColor: c }} />
                ))}
                <span>More</span>
            </div>
        </div>
    );
}

function PinnedRepo({ project }: { project: typeof projects[0] }) {
    return (
        <div className="border border-[#30363d] rounded-md p-4 hover:border-[#58a6ff] transition-colors flex flex-col h-full">
            <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-gray-500" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" /></svg>
                <h3 className="text-[14px] font-semibold text-[#58a6ff] hover:underline cursor-pointer">{project.title.toLowerCase().replace(/\s+/g, '-')}</h3>
            </div>
            <p className="text-[12px] text-gray-400 leading-relaxed flex-1 line-clamp-2 mb-3">{project.description}</p>
            <div className="flex items-center gap-4 text-[12px] text-gray-500 mt-auto">
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: project.category === 'ai' ? '#3178c6' : project.category === 'web' ? '#f1e05a' : '#e34c26' }} />
                    {project.category === 'ai' ? 'TypeScript' : project.category === 'web' ? 'JavaScript' : 'Python'}
                </span>
                <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" /></svg>
                    {Math.floor(Math.random() * 80 + 20)}
                </span>
                <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" /></svg>
                    {Math.floor(Math.random() * 15 + 3)}
                </span>
            </div>
        </div>
    );
}

export default function GitHubTheme() {
    const totalContributions = 847 + Math.floor(Math.random() * 200);

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#0d1117', color: '#c9d1d9', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif" }}>
            {/* Nav */}
            <nav className="h-[62px] bg-[#161b22] border-b border-[#30363d] flex items-center px-6 sticky top-0 z-30">
                <svg className="w-8 h-8 text-white mr-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" /></svg>
                <div className="flex items-center gap-3 text-[14px]">
                    <span className="text-white font-semibold hover:text-gray-300 cursor-pointer">AAGAM17</span>
                    <span className="text-gray-500">/</span>
                    <span className="text-gray-400">portfolio</span>
                </div>
                <div className="flex-1" />
                <div className="flex items-center gap-3 text-gray-400 text-[14px]">
                    <span className="hover:text-white cursor-pointer">Pull requests</span>
                    <span className="hover:text-white cursor-pointer">Issues</span>
                    <span className="hover:text-white cursor-pointer">Marketplace</span>
                </div>
            </nav>

            <div className="max-w-[1200px] mx-auto px-6 pt-6 pb-20">
                <div className="grid md:grid-cols-[280px_1fr] gap-6">
                    {/* ── LEFT SIDEBAR ── */}
                    <motion.aside initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        {/* Avatar */}
                        <div className="w-[260px] h-[260px] rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 flex items-center justify-center border-2 border-[#30363d] mx-auto">
                            <span className="text-[80px] text-white font-bold">AS</span>
                        </div>

                        <div>
                            <h1 className="text-[24px] font-bold text-white leading-tight">{personalInfo.name}</h1>
                            <p className="text-[20px] font-light text-gray-400">AAGAM17</p>
                        </div>

                        <p className="text-[14px] text-gray-300 leading-relaxed">{personalInfo.bio}</p>

                        {/* Follow button */}
                        <button className="w-full py-[5px] rounded-md border border-[#30363d] text-[14px] font-medium text-white bg-[#21262d] hover:bg-[#30363d] hover:border-[#8b949e] transition-colors">
                            Follow
                        </button>

                        <div className="flex items-center gap-2 text-[14px] text-gray-400">
                            <span className="font-semibold text-white">142</span> followers ·
                            <span className="font-semibold text-white">67</span> following
                        </div>

                        <div className="space-y-2 text-[14px]">
                            <div className="flex items-center gap-2 text-gray-300">
                                <span>🏢</span><span>{personalInfo.education.college}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                                <span>📍</span><span>Mumbai, India</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                                <span>📧</span><a href={`mailto:${personalInfo.email}`} className="text-[#58a6ff] hover:underline">{personalInfo.email}</a>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                                <span>🔗</span><span className="text-[#58a6ff]">linkedin.com/in/aagamshah</span>
                            </div>
                        </div>

                        {/* Achievements */}
                        <div>
                            <h2 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Achievements</h2>
                            <div className="flex flex-wrap gap-2">
                                {['🚀', '⭐', '🏆', '💡', '🔥', '🎯'].map((e, i) => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center text-lg hover:border-[#58a6ff] transition-colors cursor-pointer" title={achievements[i]?.title}>{e}</div>
                                ))}
                            </div>
                        </div>
                    </motion.aside>

                    {/* ── MAIN CONTENT ── */}
                    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                        {/* Tab bar */}
                        <div className="flex items-center gap-0 border-b border-[#30363d] mb-6 text-[14px] overflow-x-auto">
                            {[
                                { icon: '📖', label: 'Overview', active: true },
                                { icon: '📦', label: `Repositories ${projects.length}`, active: false },
                                { icon: '📊', label: 'Projects', active: false },
                                { icon: '📦', label: 'Packages', active: false },
                                { icon: '⭐', label: `Stars ${achievements.length}`, active: false },
                            ].map((tab, i) => (
                                <div key={i} className={`flex items-center gap-1.5 px-4 py-2.5 cursor-pointer border-b-2 whitespace-nowrap ${tab.active ? 'border-[#f78166] text-white font-semibold' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-[#30363d]'}`}>
                                    <span className="text-[13px]">{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Pinned repos */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-[16px] text-gray-400">
                                    Pinned <span className="text-[12px] text-gray-500 ml-1">— customized</span>
                                </h2>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {projects.slice(0, 6).map((p, i) => (
                                    <PinnedRepo key={i} project={p} />
                                ))}
                            </div>
                        </div>

                        {/* Contribution Graph */}
                        <div className="border border-[#30363d] rounded-md p-4">
                            <h2 className="text-[16px] text-gray-300 mb-4">
                                {totalContributions} contributions in the last year
                            </h2>
                            <ContributionGraph />
                        </div>

                        {/* Activity feed */}
                        <div className="mt-6">
                            <h2 className="text-[16px] text-gray-400 mb-3">Contribution activity</h2>
                            <div className="border-l-2 border-[#30363d] ml-4 space-y-4 pl-6">
                                {experiences.slice(0, 3).map((e, i) => (
                                    <div key={i} className="relative">
                                        <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[#30363d] border-2 border-[#0d1117]" />
                                        <p className="text-[14px] text-gray-300">{e.role} at <span className="text-[#58a6ff]">{e.company}</span></p>
                                        <p className="text-[12px] text-gray-500">{e.period}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.main>
                </div>
            </div>
        </div>
    );
}
