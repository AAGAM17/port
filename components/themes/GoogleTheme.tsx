'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { personalInfo, projects, experiences, achievements } from '@/lib/data';

/* ═══════════════════════════════════════
   GOOGLE SEARCH THEME
   Portfolio disguised as Google search results
   ═══════════════════════════════════════ */

const RESULTS = [
    { title: `${personalInfo.name} — About`, url: 'aagam.sys/about', snippet: personalInfo.bio },
    { title: 'Projects & Engineering Work', url: 'aagam.sys/projects', snippet: projects.slice(0, 3).map(p => p.title).join(' · ') + ` — ${projects.length} projects shipped` },
    { title: 'Work Experience & Leadership', url: 'aagam.sys/experience', snippet: experiences.slice(0, 3).map(e => `${e.role} @ ${e.company}`).join(' · ') },
    { title: `Achievements & Awards`, url: 'aagam.sys/achievements', snippet: achievements.slice(0, 3).map(a => a.title).join(' · ') },
    { title: 'Technical Skills', url: 'aagam.sys/skills', snippet: 'TypeScript · Python · React · Next.js · TensorFlow · AWS · Docker · OpenCV · Embedded Systems · Drone Control' },
    { title: `Contact ${personalInfo.name}`, url: 'aagam.sys/contact', snippet: `Email: ${personalInfo.email} · GitHub: github.com/AAGAM17 · Open to opportunities` },
];

export default function GoogleTheme() {
    const [query, setQuery] = useState(`${personalInfo.name}`);
    const [searched, setSearched] = useState(true);
    const [lucky, setLucky] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearched(true);
    };

    if (lucky) {
        return (
            <div className="min-h-screen bg-white p-8 flex items-center justify-center">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">🎯 You got lucky!</h1>
                    <p className="text-gray-600 mb-2">Here&apos;s a random project:</p>
                    <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto border">
                        <h2 className="text-xl font-semibold text-blue-700">{projects[Math.floor(Math.random() * projects.length)]?.title}</h2>
                        <p className="text-sm text-gray-500 mt-2">{projects[Math.floor(Math.random() * projects.length)]?.description}</p>
                    </div>
                    <button onClick={() => setLucky(false)} className="mt-4 text-sm text-blue-600 hover:underline">← Back to results</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Google-style Header */}
            {searched ? (
                <>
                    <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
                        <div className="max-w-[690px] mx-auto px-6 py-4 flex items-center gap-6">
                            {/* Google Logo → Name */}
                            <h1 className="text-2xl font-bold shrink-0 hidden sm:block">
                                <span className="text-[#4285f4]">A</span>
                                <span className="text-[#ea4335]">a</span>
                                <span className="text-[#fbbc05]">g</span>
                                <span className="text-[#4285f4]">a</span>
                                <span className="text-[#34a853]">m</span>
                            </h1>
                            <form onSubmit={handleSearch} className="flex-1">
                                <div className="flex items-center border border-gray-300 rounded-full px-5 py-2.5 hover:shadow-md transition-shadow bg-white">
                                    <svg className="w-4 h-4 text-gray-400 mr-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                                    <input
                                        value={query}
                                        onChange={e => setQuery(e.target.value)}
                                        className="w-full outline-none text-base text-gray-700"
                                        autoFocus
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="max-w-[690px] mx-auto px-6 flex gap-4 text-xs text-gray-600">
                            <span className="pb-3 border-b-2 border-blue-600 text-blue-600">All</span>
                            <span className="pb-3 hover:text-gray-800 cursor-pointer">Projects</span>
                            <span className="pb-3 hover:text-gray-800 cursor-pointer">Experience</span>
                            <span className="pb-3 hover:text-gray-800 cursor-pointer">Skills</span>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="max-w-[690px] mx-auto px-6 py-6">
                        <p className="text-xs text-gray-500 mb-6">About {(Math.random() * 100000 + 50000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} results (0.42 seconds)</p>

                        {/* Knowledge Panel */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="sm:float-right sm:w-[300px] sm:ml-6 mb-6 bg-[#f8f9fa] border border-gray-200 rounded-xl p-5">
                            <div className="w-full h-20 bg-gradient-to-r from-blue-500 via-green-400 to-yellow-400 rounded-lg mb-4" />
                            <h2 className="text-xl font-semibold text-gray-800">{personalInfo.name}</h2>
                            <p className="text-sm text-gray-500 mb-3">{personalInfo.role}</p>
                            <div className="space-y-2 text-sm">
                                <div className="flex gap-2"><span className="text-gray-500 w-20 shrink-0">Education</span><span className="text-gray-700">{personalInfo.education.degree}</span></div>
                                <div className="flex gap-2"><span className="text-gray-500 w-20 shrink-0">Location</span><span className="text-gray-700">Mumbai, India</span></div>
                                <div className="flex gap-2"><span className="text-gray-500 w-20 shrink-0">Projects</span><span className="text-gray-700">{projects.length}+ shipped</span></div>
                            </div>
                            <div className="mt-4 pt-4 border-t flex gap-3">
                                <a href="https://github.com/AAGAM17" target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">GitHub</a>
                                <a href="https://linkedin.com/in/aagamshah" target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">LinkedIn</a>
                                <a href={`mailto:${personalInfo.email}`} className="text-xs text-blue-600 hover:underline">Email</a>
                            </div>
                        </motion.div>

                        {/* Search Results */}
                        <div className="space-y-8">
                            {RESULTS.map((r, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                    <p className="text-xs text-green-800 mb-0.5">{r.url}</p>
                                    <h3 className="text-lg text-blue-700 hover:underline cursor-pointer mb-1">{r.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{r.snippet}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* People also ask */}
                        <div className="mt-10 border border-gray-200 rounded-xl overflow-hidden">
                            <h3 className="text-base font-medium text-gray-800 p-4">People also ask</h3>
                            {[
                                'What tech stack does Aagam use?',
                                'Is Aagam open to opportunities?',
                                'What is SAE Aero Design?',
                                'How to contact Aagam Shah?'
                            ].map((q, i) => (
                                <div key={i} className="border-t border-gray-200 p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
                                    <span className="text-sm text-gray-700">{q}</span>
                                    <svg className="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="mt-10 pt-6 border-t text-center text-xs text-gray-500 pb-20">
                            <p>Mumbai, India — from your IP address</p>
                            <div className="flex justify-center gap-6 mt-4">
                                <span className="hover:underline cursor-pointer">Help</span>
                                <span className="hover:underline cursor-pointer">Privacy</span>
                                <span className="hover:underline cursor-pointer">Terms</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                /* Landing Page */
                <div className="min-h-screen flex flex-col items-center justify-center px-6">
                    <h1 className="text-6xl font-bold mb-8">
                        <span className="text-[#4285f4]">A</span>
                        <span className="text-[#ea4335]">a</span>
                        <span className="text-[#fbbc05]">g</span>
                        <span className="text-[#4285f4]">a</span>
                        <span className="text-[#34a853]">m</span>
                    </h1>
                    <form onSubmit={handleSearch} className="w-full max-w-lg">
                        <div className="flex items-center border border-gray-300 rounded-full px-5 py-3 hover:shadow-md transition-shadow">
                            <svg className="w-4 h-4 text-gray-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                            <input
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                className="w-full outline-none text-base text-gray-700"
                                autoFocus
                            />
                        </div>
                        <div className="flex justify-center gap-4 mt-6">
                            <button type="submit" className="px-4 py-2 text-sm bg-[#f8f9fa] border border-gray-300 rounded text-gray-700 hover:border-gray-400 hover:shadow-sm">
                                Aagam Search
                            </button>
                            <button type="button" onClick={() => setLucky(true)} className="px-4 py-2 text-sm bg-[#f8f9fa] border border-gray-300 rounded text-gray-700 hover:border-gray-400 hover:shadow-sm">
                                I&apos;m Feeling Lucky
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
