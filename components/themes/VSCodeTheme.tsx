'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personalInfo, projects, experiences, achievements, skills, clusterLabels, SkillCluster } from '@/lib/data';

/* ═══════════════════════════════════════
   VS CODE THEME
   Portfolio as an IDE — file tree, tabs,
   editor, integrated terminal
   ═══════════════════════════════════════ */

interface FileItem {
    name: string;
    badge: string;
    badgeColor: string;
    id: string;
}

const FILES: FileItem[] = [
    { name: 'about.ts', badge: 'TS', badgeColor: '#3178c6', id: 'about' },
    { name: 'projects.json', badge: '{}', badgeColor: '#cbcb41', id: 'projects' },
    { name: 'experience.yaml', badge: 'Y', badgeColor: '#a074c4', id: 'experience' },
    { name: 'skills.toml', badge: 'T', badgeColor: '#9c4221', id: 'skills' },
    { name: 'achievements.md', badge: 'M↓', badgeColor: '#519aba', id: 'achievements' },
    { name: '.env.contact', badge: '≡', badgeColor: '#8a8a8a', id: 'contact' },
    { name: 'README.md', badge: 'M↓', badgeColor: '#519aba', id: 'readme' },
];

function FileBadge({ file, size = 'text-[8px]' }: { file?: FileItem; size?: string }) {
    if (!file) return null;
    return (
        <span className={`${size} font-bold leading-none w-4 text-center shrink-0`} style={{ color: file.badgeColor }}>
            {file.badge}
        </span>
    );
}

function renderAbout() {
    return (
        <div className="space-y-1">
            <Line n={1} c="comment">{'// about.ts — Personal Information'}</Line>
            <Line n={2} c="comment">{'// Last updated: ' + new Date().toISOString().split('T')[0]}</Line>
            <Line n={3} />
            <Line n={4}><K>export</K> <K>const</K> <V>developer</V> = {'{'}</Line>
            <Line n={5}>  <P>name</P>: <S>&apos;{personalInfo.name}&apos;</S>,</Line>
            <Line n={6}>  <P>role</P>: <S>&apos;{personalInfo.role}&apos;</S>,</Line>
            <Line n={7}>  <P>location</P>: <S>&apos;Mumbai, India&apos;</S>,</Line>
            <Line n={8}>  <P>email</P>: <S>&apos;{personalInfo.email}&apos;</S>,</Line>
            <Line n={9}>  <P>bio</P>: <S>&apos;{personalInfo.bio}&apos;</S>,</Line>
            <Line n={10}>  <P>education</P>: {'{'}</Line>
            <Line n={11}>    <P>degree</P>: <S>&apos;{personalInfo.education.degree}&apos;</S>,</Line>
            <Line n={12}>    <P>school</P>: <S>&apos;{personalInfo.education.college}&apos;</S>,</Line>
            <Line n={13}>    <P>period</P>: <S>&apos;{personalInfo.education.period}&apos;</S>,</Line>
            <Line n={14}>  {'}'},</Line>
            <Line n={15}>{'}'};</Line>
        </div>
    );
}

function renderProjects() {
    const lines: React.ReactNode[] = [];
    lines.push(<Line key={1} n={1} c="comment">{'// projects.json — Shipped Products'}</Line>);
    lines.push(<Line key={2} n={2}>{'{'}</Line>);
    lines.push(<Line key={3} n={3}>  <S>&quot;projects&quot;</S>: {'['}</Line>);
    projects.forEach((p, i) => {
        const base = 4 + i * 5;
        lines.push(<Line key={base} n={base}>{'    {'}</Line>);
        lines.push(<Line key={base + 1} n={base + 1}>      <S>&quot;name&quot;</S>: <S>&quot;{p.title}&quot;</S>,</Line>);
        lines.push(<Line key={base + 2} n={base + 2}>      <S>&quot;description&quot;</S>: <S>&quot;{p.description?.slice(0, 60)}...&quot;</S>,</Line>);
        lines.push(<Line key={base + 3} n={base + 3}>      <S>&quot;tags&quot;</S>: [<S>{p.techStack?.map((t: string) => `"${t}"`).join(', ')}</S>]</Line>);
        lines.push(<Line key={base + 4} n={base + 4}>{'    }'}{i < projects.length - 1 ? ',' : ''}</Line>);
    });
    lines.push(<Line key={900} n={4 + projects.length * 5}>{']'}</Line>);
    lines.push(<Line key={901} n={5 + projects.length * 5}>{'}'}</Line>);
    return <div className="space-y-1">{lines}</div>;
}

function renderExperience() {
    const lines: React.ReactNode[] = [];
    lines.push(<Line key={1} n={1} c="comment">{'# experience.yaml — Work History'}</Line>);
    lines.push(<Line key={2} n={2} />);
    experiences.forEach((e, i) => {
        const base = 3 + i * 5;
        lines.push(<Line key={base} n={base}><P>- role</P>: <S>{e.role}</S></Line>);
        lines.push(<Line key={base + 1} n={base + 1}>  <P>company</P>: <S>{e.company}</S></Line>);
        lines.push(<Line key={base + 2} n={base + 2}>  <P>period</P>: <S>{e.period}</S></Line>);
        lines.push(<Line key={base + 3} n={base + 3}>  <P>type</P>: <S>{e.type}</S></Line>);
        lines.push(<Line key={base + 4} n={base + 4} />);
    });
    return <div className="space-y-1">{lines}</div>;
}

function renderSkills() {
    const clusters: SkillCluster[] = ['fullstack', 'ai', 'aerospace', 'embedded'];
    let n = 2;
    const lines: React.ReactNode[] = [
        <Line key={1} n={1} c="comment">{'# skills.toml — proficiency is 0-100, measured in shipped things'}</Line>,
    ];
    clusters.forEach(cluster => {
        lines.push(<Line key={`s${n}`} n={n++} />);
        lines.push(<Line key={`h${n}`} n={n++}>[<V>{clusterLabels[cluster].toLowerCase().replace(/[^a-z]+/g, '_')}</V>]</Line>);
        skills.filter(s => s.cluster === cluster)
            .sort((a, b) => b.proficiency - a.proficiency)
            .slice(0, 5)
            .forEach(s => {
                lines.push(
                    <Line key={s.id} n={n++}>
                        <P>{s.id}</P> = {'{ '}<P>proficiency</P> = <N>{s.proficiency}</N>{' }'}
                    </Line>
                );
            });
    });
    return <div className="space-y-1">{lines}</div>;
}

function renderAchievements() {
    return (
        <div className="space-y-1">
            <Line n={1} c="comment">{'# Achievements & Awards'}</Line>
            <Line n={2} />
            {achievements.map((a, i) => (
                <div key={i}>
                    <Line n={3 + i * 3}>## <K>{a.rank}</K> — {a.title}</Line>
                    <Line n={4 + i * 3} c="comment">{a.description}</Line>
                    <Line n={5 + i * 3} />
                </div>
            ))}
        </div>
    );
}

function renderContact() {
    return (
        <div className="space-y-1">
            <Line n={1} c="comment">{'# contact.env — Reach Out'}</Line>
            <Line n={2} />
            <Line n={3}><V>EMAIL</V>=<S>{personalInfo.email}</S></Line>
            <Line n={4}><V>GITHUB</V>=<S>https://github.com/AAGAM17</S></Line>
            <Line n={5}><V>LINKEDIN</V>=<S>https://linkedin.com/in/aagamshah</S></Line>
            <Line n={6}><V>LOCATION</V>=<S>Mumbai, India</S></Line>
            <Line n={7}><V>STATUS</V>=<S>Open to opportunities</S></Line>
        </div>
    );
}

function renderReadme() {
    return (
        <div className="space-y-1">
            <Line n={1}>{'# '}<K>{personalInfo.name}</K></Line>
            <Line n={2} />
            <Line n={3}><S>{personalInfo.bio}</S></Line>
            <Line n={4} />
            <Line n={5}>## Quick Stats</Line>
            <Line n={6} />
            <Line n={7}>- **{projects.length}** projects shipped</Line>
            <Line n={8}>- **{experiences.length}** professional roles</Line>
            <Line n={9}>- **{achievements.length}** awards & achievements</Line>
            <Line n={10} />
            <Line n={11}>## Connect</Line>
            <Line n={12} />
            <Line n={13}>- [Email](mailto:{personalInfo.email}) — fastest channel</Line>
            <Line n={14}>- [GitHub](https://github.com/AAGAM17)</Line>
            <Line n={15}>- [LinkedIn](https://linkedin.com/in/aagamshah)</Line>
            <Line n={16} />
            <Line n={17} c="comment">{'<!-- psst: open the Terminal menu -->'}</Line>
        </div>
    );
}

const CONTENT_MAP: Record<string, () => React.ReactNode> = {
    about: renderAbout,
    projects: renderProjects,
    experience: renderExperience,
    skills: renderSkills,
    achievements: renderAchievements,
    contact: renderContact,
    readme: renderReadme,
};

/* Syntax components */
function Line({ n, c, children }: { n: number; c?: string; children?: React.ReactNode }) {
    return (
        <div className="flex hover:bg-[#2a2d32] group">
            <span className="w-10 text-right pr-4 text-gray-600 text-xs select-none shrink-0 group-hover:text-gray-400">{n}</span>
            <span className={`text-sm ${c === 'comment' ? 'text-[#6a9955]' : 'text-[#d4d4d4]'}`}>{children}</span>
        </div>
    );
}
function K({ children }: { children: React.ReactNode }) { return <span className="text-[#c586c0]">{children}</span>; }
function V({ children }: { children: React.ReactNode }) { return <span className="text-[#4ec9b0]">{children}</span>; }
function S({ children }: { children: React.ReactNode }) { return <span className="text-[#ce9178]">{children}</span>; }
function P({ children }: { children: React.ReactNode }) { return <span className="text-[#9cdcfe]">{children}</span>; }
function N({ children }: { children: React.ReactNode }) { return <span className="text-[#b5cea8]">{children}</span>; }

const TERMINAL_LINES = [
    { prompt: true, text: 'aagam --version' },
    { prompt: false, text: 'aagam-shah v21.0.0 (mumbai-build) — stable since 2005' },
    { prompt: true, text: 'npm run hire-aagam' },
    { prompt: false, text: '> portfolio@3.0.0 hire-aagam' },
    { prompt: false, text: '> open mailto:aagamcshah172005@gmail.com' },
    { prompt: false, text: '✓ Compiled successfully. Response time: fast.' },
    { prompt: true, text: '' },
];

export default function VSCodeTheme() {
    const [activeFile, setActiveFile] = useState('readme');
    const [openTabs, setOpenTabs] = useState<string[]>(['readme']);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [terminalOpen, setTerminalOpen] = useState(false);

    const openFile = (id: string) => {
        setActiveFile(id);
        if (!openTabs.includes(id)) {
            setOpenTabs(prev => [...prev, id]);
        }
    };

    const closeTab = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenTabs(prev => prev.filter(t => t !== id));
        if (activeFile === id) {
            const remaining = openTabs.filter(t => t !== id);
            setActiveFile(remaining[remaining.length - 1] || '');
        }
    };

    const render = CONTENT_MAP[activeFile];

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#1e1e1e', fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
            {/* Title Bar */}
            <div className="h-8 bg-[#323233] flex items-center px-3 text-xs text-gray-400 shrink-0">
                <div className="flex gap-1.5 mr-4">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="flex-1 text-center text-gray-500">{FILES.find(f => f.id === activeFile)?.name || 'Welcome'} — {personalInfo.name} — VS Code</span>
            </div>

            {/* Menu Bar */}
            <div className="h-7 bg-[#252526] flex items-center px-4 text-[11px] text-gray-400 gap-4 shrink-0 border-b border-[#1e1e1e]">
                <span className="hover:text-white cursor-pointer">File</span>
                <span className="hover:text-white cursor-pointer">Edit</span>
                <span className="hover:text-white cursor-pointer">Selection</span>
                <span className="hover:text-white cursor-pointer">View</span>
                <span className="hover:text-white cursor-pointer">Go</span>
                <span className="hover:text-white cursor-pointer">Run</span>
                <button onClick={() => setTerminalOpen(!terminalOpen)} className={`hover:text-white cursor-pointer ${terminalOpen ? 'text-white' : ''}`}>Terminal</button>
                <span className="hover:text-white cursor-pointer">Help</span>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Activity Bar */}
                <div className="w-12 bg-[#2d2d2d] flex flex-col items-center py-2 gap-4 shrink-0">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-2 rounded ${sidebarOpen ? 'text-white bg-[#37373d]' : 'text-gray-500 hover:text-white'}`} title="Explorer">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" /></svg>
                    </button>
                    <button className="p-2 text-gray-500 hover:text-white" title="Search">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                    </button>
                    <button className="p-2 text-gray-500 hover:text-white" title="Source Control">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 3a3 3 0 0 0-1 5.83v6.34a3.001 3.001 0 1 0 2 0V15a4 4 0 0 0 4-4V9.17A3.001 3.001 0 0 0 12 3a3 3 0 0 0-1 5.83V11a2 2 0 0 1-2 2H7V8.83A3.001 3.001 0 0 0 6 3z" /></svg>
                    </button>
                </div>

                {/* Sidebar */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 220, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="bg-[#252526] border-r border-[#1e1e1e] overflow-hidden shrink-0"
                        >
                            <div className="p-3">
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">Explorer</p>
                                <p className="text-[11px] text-gray-400 mb-2 font-semibold">▼ PORTFOLIO</p>
                                <div className="ml-2 space-y-0.5">
                                    {FILES.map(f => (
                                        <button
                                            key={f.id}
                                            onClick={() => openFile(f.id)}
                                            className={`w-full text-left flex items-center gap-2 px-2 py-1 rounded text-[12px] transition-colors ${activeFile === f.id ? 'bg-[#37373d] text-white' : 'text-gray-400 hover:bg-[#2a2d32] hover:text-gray-200'
                                                }`}
                                        >
                                            <FileBadge file={f} />
                                            <span>{f.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Editor Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Tabs */}
                    <div className="h-9 bg-[#252526] flex items-end overflow-x-auto shrink-0">
                        {openTabs.map(tab => {
                            const file = FILES.find(f => f.id === tab);
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveFile(tab)}
                                    className={`h-full flex items-center gap-2 px-3 text-[12px] border-r border-[#1e1e1e] shrink-0 ${activeFile === tab
                                        ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc]'
                                        : 'bg-[#2d2d2d] text-gray-500 hover:bg-[#2a2d32] border-t-2 border-t-transparent'
                                        }`}
                                >
                                    <FileBadge file={file} />
                                    <span>{file?.name}</span>
                                    <span onClick={(e) => closeTab(tab, e)} className="ml-1 hover:bg-gray-600 rounded p-0.5 text-[10px] leading-none">✕</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Breadcrumb */}
                    <div className="h-6 bg-[#1e1e1e] px-4 flex items-center text-[11px] text-gray-500 border-b border-[#2d2d2d] shrink-0">
                        portfolio &gt; src &gt; {FILES.find(f => f.id === activeFile)?.name || '...'}
                    </div>

                    {/* Code Content */}
                    <div className="flex-1 overflow-y-auto bg-[#1e1e1e] py-3 px-2">
                        {render ? render() : (
                            <div className="flex items-center justify-center h-full text-gray-600 text-sm">
                                <div className="text-center">
                                    <p className="text-2xl mb-3 font-bold text-gray-700">{'</>'}</p>
                                    <p>Select a file to view</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Integrated Terminal */}
                    <AnimatePresence>
                        {terminalOpen && (
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 170 }}
                                exit={{ height: 0 }}
                                className="bg-[#181818] border-t border-[#2d2d2d] overflow-hidden shrink-0"
                            >
                                <div className="flex items-center justify-between px-4 h-8 text-[10px] text-gray-500 uppercase tracking-wider border-b border-[#2d2d2d]">
                                    <div className="flex gap-4">
                                        <span className="text-white border-b border-white pb-2 -mb-2">Terminal</span>
                                        <span className="hover:text-gray-300 cursor-pointer">Problems <span className="text-gray-600">0</span></span>
                                        <span className="hover:text-gray-300 cursor-pointer">Output</span>
                                    </div>
                                    <button onClick={() => setTerminalOpen(false)} className="hover:text-white">✕</button>
                                </div>
                                <div className="p-3 text-[12px] leading-relaxed font-mono overflow-y-auto h-[130px]">
                                    {TERMINAL_LINES.map((l, i) => (
                                        <div key={i} className={l.prompt ? 'text-gray-300' : 'text-gray-500'}>
                                            {l.prompt && <span className="text-[#4ec9b0]">aagam@portfolio</span>}
                                            {l.prompt && <span className="text-gray-600"> ~ % </span>}
                                            {l.text}
                                            {l.prompt && !l.text && <span className="inline-block w-1.5 h-3.5 bg-gray-400 align-middle animate-pulse" />}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Minimap (desktop only) */}
                <div className="hidden lg:block w-16 bg-[#1e1e1e] border-l border-[#2d2d2d] relative overflow-hidden shrink-0">
                    <div className="absolute inset-x-1 top-4 space-y-0.5 opacity-40">
                        {Array.from({ length: 40 }).map((_, i) => (
                            <div key={i} className="h-[2px] rounded-full" style={{
                                backgroundColor: i % 7 === 0 ? '#6a9955' : i % 5 === 0 ? '#c586c0' : i % 3 === 0 ? '#ce9178' : '#d4d4d4',
                                width: `${Math.random() * 60 + 20}%`,
                            }} />
                        ))}
                    </div>
                    <div className="absolute inset-x-0 top-4 h-16 bg-white/5 border border-white/10 rounded-sm" />
                </div>
            </div>

            {/* Status Bar */}
            <div className="h-6 bg-[#007acc] flex items-center justify-between px-3 text-[11px] text-white/85 shrink-0">
                <div className="flex items-center gap-3">
                    <span>⎇ main*</span>
                    <span>0 errors</span>
                    <button onClick={() => setTerminalOpen(!terminalOpen)} className="hover:bg-white/10 px-1.5 rounded">∑ Terminal</button>
                </div>
                <div className="flex items-center gap-3">
                    <span>{activeFile === 'about' ? 'TypeScript' : activeFile === 'projects' ? 'JSON' : activeFile === 'experience' ? 'YAML' : activeFile === 'skills' ? 'TOML' : 'Markdown'}</span>
                    <span>UTF-8</span>
                    <span>LF</span>
                    <span className="hidden sm:inline">Veda: online</span>
                    <span>Prettier ✓</span>
                </div>
            </div>
        </div>
    );
}
