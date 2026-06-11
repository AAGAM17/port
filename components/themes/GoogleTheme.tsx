'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personalInfo, projects, experiences, achievements, skills } from '@/lib/data';

/* ═══════════════════════════════════════
   GOOGLE SEARCH THEME
   Portfolio disguised as Google search results —
   AI Overview included, naturally.
   ═══════════════════════════════════════ */

type Tab = 'All' | 'Projects' | 'Experience' | 'Skills';

interface Result {
    title: string;
    url: string;
    snippet: string;
    tab: Exclude<Tab, 'All'> | 'About';
    favicon: { letter: string; color: string };
}

const RESULTS: Result[] = [
    {
        title: `${personalInfo.name} — About`,
        url: 'aagamshah.dev › about',
        snippet: personalInfo.bio,
        tab: 'About',
        favicon: { letter: 'A', color: '#22d3ee' },
    },
    ...projects.slice(0, 4).map(p => ({
        title: `${p.title}: ${p.subtitle}`,
        url: `aagamshah.dev › projects › ${p.id}`,
        snippet: p.description,
        tab: 'Projects' as const,
        favicon: { letter: p.title[0], color: '#4285f4' },
    })),
    ...experiences.slice(0, 3).map(e => ({
        title: `${e.role} — ${e.company}`,
        url: 'aagamshah.dev › experience',
        snippet: `${e.period} · ${e.description}`,
        tab: 'Experience' as const,
        favicon: { letter: e.company[0], color: '#34a853' },
    })),
    {
        title: 'Technical Skills — Full Stack, AI/ML, Aerospace',
        url: 'aagamshah.dev › skills',
        snippet: skills.sort((a, b) => b.proficiency - a.proficiency).slice(0, 10).map(s => s.name).join(' · '),
        tab: 'Skills',
        favicon: { letter: 'S', color: '#fbbc05' },
    },
    {
        title: `Achievements & Awards — ${achievements[0].rank} SAE Aero Design`,
        url: 'aagamshah.dev › achievements',
        snippet: achievements.slice(0, 3).map(a => `${a.rank} — ${a.title}`).join(' · '),
        tab: 'About',
        favicon: { letter: '★', color: '#ea4335' },
    },
    {
        title: `Contact ${personalInfo.name}`,
        url: 'aagamshah.dev › contact',
        snippet: `Email: ${personalInfo.email} · GitHub: github.com/AAGAM17 · Open to opportunities`,
        tab: 'About',
        favicon: { letter: '@', color: '#9aa0a6' },
    },
];

const PAA = [
    {
        q: 'What tech stack does Aagam use?',
        a: 'Primarily TypeScript, React and Next.js for the web; Python with OpenCV and LLM APIs for AI work; and Pixhawk, MAVLink and Raspberry Pi for flight systems. Plus whatever the problem actually needs.',
    },
    {
        q: 'Is Aagam open to opportunities?',
        a: `Yes — full-time roles, freelance builds, and collaborations. The fastest channel is email: ${personalInfo.email}. He replies quickly.`,
    },
    {
        q: 'What is SAE Aero Design?',
        a: 'A worldwide collegiate competition where teams design, build and fly real aircraft. Aagam\'s team, DJS Skylark, ranked 7th worldwide in Advanced Class in 2025 — he led the autonomous-landing software.',
    },
    {
        q: 'Did he really build the AI assistant on this site?',
        a: 'Yes. Veda runs entirely in your browser — a hand-built retrieval engine over this site\'s data, with the Web Speech API for her voice. No cloud, no API keys.',
    },
];

const GOOGLE_COLORS = ['#4285f4', '#ea4335', '#fbbc05', '#4285f4', '#34a853'];

function Wordmark({ size = 'text-2xl' }: { size?: string }) {
    return (
        <h1 className={`${size} font-bold shrink-0`} style={{ fontFamily: 'Arial, sans-serif' }}>
            {'Aagam'.split('').map((ch, i) => (
                <span key={i} style={{ color: GOOGLE_COLORS[i % GOOGLE_COLORS.length] }}>{ch}</span>
            ))}
        </h1>
    );
}

export default function GoogleTheme() {
    const [query, setQuery] = useState(personalInfo.name);
    const [submitted, setSubmitted] = useState(personalInfo.name);
    const [tab, setTab] = useState<Tab>('All');
    const [lucky, setLucky] = useState<number | null>(null);
    const [openPaa, setOpenPaa] = useState<number | null>(null);
    const [aiExpanded, setAiExpanded] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(query);
    };

    const filtered = useMemo(() => {
        let r = tab === 'All' ? RESULTS : RESULTS.filter(x => x.tab === tab);
        const q = submitted.trim().toLowerCase();
        const isNameQuery = !q || 'aagam shah'.includes(q) || q.includes('aagam');
        if (!isNameQuery) {
            const matches = r.filter(x => `${x.title} ${x.snippet}`.toLowerCase().includes(q));
            if (matches.length) r = matches;
        }
        return r;
    }, [tab, submitted]);

    if (lucky !== null) {
        const p = projects[lucky];
        return (
            <div className="min-h-screen bg-white p-8 flex items-center justify-center">
                <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-lg">
                    <Wordmark size="text-4xl" />
                    <p className="text-gray-500 text-sm mt-6 mb-4">You got lucky — here&apos;s a random project:</p>
                    <div className="bg-[#f8f9fa] rounded-2xl p-7 border border-gray-200 text-left">
                        <h2 className="text-xl font-semibold text-[#1a0dab] mb-1">{p.title}</h2>
                        <p className="text-xs text-[#006621] mb-3">aagamshah.dev › projects › {p.id}</p>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">{p.longDescription}</p>
                        <div className="flex flex-wrap gap-2">
                            {p.techStack.map(t => (
                                <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-600">{t}</span>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-center gap-4 mt-6">
                        <button onClick={() => setLucky(Math.floor(Math.random() * projects.length))} className="text-sm text-[#1a0dab] hover:underline">Feeling lucky again</button>
                        <button onClick={() => setLucky(null)} className="text-sm text-[#1a0dab] hover:underline">← Back to results</button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            {/* Header */}
            <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
                <div className="max-w-[760px] mx-auto px-6 pt-4 pb-0 flex items-center gap-6">
                    <div className="hidden sm:block"><Wordmark /></div>
                    <form onSubmit={handleSearch} className="flex-1 max-w-[560px]">
                        <div className="flex items-center border border-gray-200 rounded-full px-5 py-2.5 shadow-[0_1px_6px_rgba(32,33,36,0.18)] hover:shadow-[0_1px_8px_rgba(32,33,36,0.25)] transition-shadow bg-white">
                            <svg className="w-4 h-4 text-[#9aa0a6] mr-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                            <input
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                className="w-full outline-none text-base text-[#202124]"
                                aria-label="Search"
                            />
                            {query && (
                                <button type="button" onClick={() => { setQuery(''); }} className="text-[#70757a] hover:text-[#202124] px-1 text-lg leading-none" aria-label="Clear">×</button>
                            )}
                        </div>
                    </form>
                </div>
                <div className="max-w-[760px] mx-auto px-6 mt-3 flex gap-6 text-[13px] text-[#5f6368]">
                    {(['All', 'Projects', 'Experience', 'Skills'] as Tab[]).map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`pb-2.5 border-b-[3px] transition-colors ${tab === t ? 'border-[#1a73e8] text-[#1a73e8]' : 'border-transparent hover:text-[#202124]'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div className="max-w-[760px] mx-auto px-6 py-5 pb-28">
                <p className="text-[13px] text-[#70757a] mb-5">About 1,72,005 results (0.17 seconds)</p>

                {/* AI Overview */}
                {tab === 'All' && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-7 rounded-2xl border border-gray-200 bg-gradient-to-br from-[#f8fbff] to-[#fdf7ff] p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2l2.1 5.9L20 10l-5.9 2.1L12 18l-2.1-5.9L4 10l5.9-2.1L12 2z" fill="url(#aig)" />
                                <defs><linearGradient id="aig" x1="4" y1="2" x2="20" y2="18"><stop stopColor="#4285f4" /><stop offset="1" stopColor="#a142f4" /></linearGradient></defs>
                            </svg>
                            <span className="text-[14px] font-medium text-[#202124]">AI Overview</span>
                        </div>
                        <p className="text-[14px] leading-relaxed text-[#3c4043]">
                            <strong>Aagam Shah</strong> is a Mumbai-based full-stack and AI engineer best known for shipping
                            production software unusually early in his career: AI SaaS platforms like Aethera and ReelForge,
                            an Instagram DM automation product, and the computer-vision landing system that helped DJS Skylark
                            rank <strong>7th worldwide</strong> at SAE Aero Design 2025.
                            {aiExpanded && (
                                <> He is currently a freelance developer at Fyre Gig and the Advanced Class Head of his
                                    SAE Aero team, while completing a B.Tech at DJ Sanghvi College of Engineering (2027).
                                    Sources describe him as <em>&ldquo;delivering production-grade code at a pace most senior
                                        engineers don&apos;t&rdquo;</em>. He is open to opportunities.</>
                            )}
                        </p>
                        <button onClick={() => setAiExpanded(!aiExpanded)} className="mt-3 text-[13px] text-[#1a73e8] hover:underline">
                            {aiExpanded ? 'Show less' : 'Show more'}
                        </button>
                    </motion.div>
                )}

                {/* Knowledge Panel */}
                {tab === 'All' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="sm:float-right sm:w-[300px] sm:ml-6 mb-6 bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="h-24 bg-gradient-to-r from-[#0a0f1e] via-[#10254d] to-[#0a0f1e] relative">
                            <div className="absolute bottom-3 left-5 w-14 h-14 rounded-full bg-white grid place-items-center text-xl font-bold text-[#10254d] border-2 border-white shadow">AS</div>
                        </div>
                        <div className="p-5 pt-4">
                            <h2 className="text-[22px] text-[#202124]">{personalInfo.name}</h2>
                            <p className="text-sm text-[#70757a] mb-4">{personalInfo.role}</p>
                            <div className="space-y-2 text-[13px] text-[#3c4043]">
                                <p><span className="font-medium">Education:</span> {personalInfo.education.degree}</p>
                                <p><span className="font-medium">Location:</span> Mumbai, India</p>
                                <p><span className="font-medium">Known for:</span> Shipping. Constantly.</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4">
                                <a href={personalInfo.github} target="_blank" rel="noreferrer" className="text-[13px] text-[#1a73e8] hover:underline">GitHub</a>
                                <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-[13px] text-[#1a73e8] hover:underline">LinkedIn</a>
                                <a href={`mailto:${personalInfo.email}`} className="text-[13px] text-[#1a73e8] hover:underline">Email</a>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Sponsored (joke) */}
                {tab === 'All' && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mb-7">
                        <p className="text-[13px] font-bold text-[#202124] mb-0.5">Sponsored</p>
                        <div className="flex items-center gap-2 text-[13px]">
                            <span className="w-[18px] h-[18px] rounded-full bg-emerald-600 text-white grid place-items-center text-[10px] font-bold">A</span>
                            <span className="text-[#202124]">hire.aagamshah.dev</span>
                        </div>
                        <a href={`mailto:${personalInfo.email}`} className="block text-xl text-[#1a0dab] hover:underline mt-0.5">Hire Aagam Shah — Ships Faster Than Your Current Roadmap</a>
                        <p className="text-sm text-[#4d5156]">Full-stack · AI · Autonomous flight. One engineer, entire stack. Replies to email faster than this page loaded.</p>
                    </motion.div>
                )}

                {/* Organic results */}
                <div className="space-y-7">
                    {filtered.map((r, i) => (
                        <motion.div key={r.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                            <div className="flex items-center gap-2.5 mb-1">
                                <span className="w-[26px] h-[26px] rounded-full border border-gray-200 grid place-items-center text-[12px] font-bold text-white" style={{ backgroundColor: r.favicon.color }}>
                                    {r.favicon.letter}
                                </span>
                                <div className="leading-tight">
                                    <p className="text-[13px] text-[#202124]">aagamshah.dev</p>
                                    <p className="text-[12px] text-[#4d5156]">{r.url}</p>
                                </div>
                            </div>
                            <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer mb-1">{r.title}</h3>
                            <p className="text-sm text-[#4d5156] leading-relaxed">{r.snippet}</p>
                        </motion.div>
                    ))}
                    {filtered.length === 0 && (
                        <p className="text-sm text-[#4d5156]">
                            Your search did not match any documents. Did you mean: <button onClick={() => { setQuery(personalInfo.name); setSubmitted(personalInfo.name); }} className="text-[#1a0dab] italic hover:underline">Aagam Shah</button>
                        </p>
                    )}
                </div>

                {/* People also ask */}
                {tab === 'All' && (
                    <div className="mt-10 clear-both">
                        <h3 className="text-[20px] text-[#202124] mb-3">People also ask</h3>
                        <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200">
                            {PAA.map((item, i) => (
                                <div key={i}>
                                    <button onClick={() => setOpenPaa(openPaa === i ? null : i)} className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
                                        <span className="text-[15px] text-[#202124]">{item.q}</span>
                                        <svg className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${openPaa === i ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                                    </button>
                                    <AnimatePresence>
                                        {openPaa === i && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                <p className="px-4 pb-4 text-sm text-[#4d5156] leading-relaxed">{item.a}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Feeling lucky + footer */}
                <div className="mt-10 flex justify-center">
                    <button onClick={() => setLucky(Math.floor(Math.random() * projects.length))} className="px-4 py-2 text-sm bg-[#f8f9fa] border border-[#f8f9fa] rounded text-[#3c4043] hover:border-gray-300 hover:shadow-sm transition-all">
                        I&apos;m Feeling Lucky
                    </button>
                </div>
                <div className="mt-10 pt-6 border-t border-gray-200 text-center text-[13px] text-[#70757a]">
                    <p>Mumbai, India — from his actual address</p>
                    <div className="flex justify-center gap-6 mt-3">
                        <span className="hover:underline cursor-pointer">Help</span>
                        <span className="hover:underline cursor-pointer">Privacy</span>
                        <span className="hover:underline cursor-pointer">Terms</span>
                        <span className="hover:underline cursor-pointer">Hire him</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
