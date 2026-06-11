'use client';

import { motion } from 'framer-motion';
import { personalInfo, projects, experiences, achievements } from '@/lib/data';

/* ═══════════════════════════════════════
   THE DAILY AAGAM — NEWSPAPER THEME v2
   Premium broadsheet editorial layout
   ═══════════════════════════════════════ */

export default function NewspaperTheme() {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#fdf8f0', color: '#1a1a1a' }}>
            <div className="max-w-[900px] mx-auto px-6 py-8 pb-24">

                {/* ── MASTHEAD ── */}
                <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-1">
                    <div className="flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.35em] mb-2" style={{ fontFamily: 'Georgia, serif', color: '#888' }}>
                        <span>Vol. XXII</span>
                        <span style={{ color: '#ccc' }}>·</span>
                        <span>No. 1</span>
                        <span style={{ color: '#ccc' }}>·</span>
                        <span>Mumbai Edition</span>
                    </div>
                    <div className="border-t-[3px] border-b border-black pt-2 pb-1">
                        <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-black tracking-[-0.02em] leading-none" style={{ fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif" }}>
                            The Daily Aagam
                        </h1>
                    </div>
                    <div className="border-b border-black flex items-center justify-between py-1.5 text-[9px] uppercase tracking-[0.2em]" style={{ fontFamily: 'Georgia, serif', color: '#888' }}>
                        <span>Est. 2005</span>
                        <span>{dateStr}</span>
                        <span>Price: ₹15.00</span>
                    </div>
                </motion.header>

                {/* ── HEADLINE ── */}
                <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 mb-6">
                    <h2 className="text-[clamp(1.5rem,4.5vw,2.5rem)] font-bold leading-[1.12] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Local Engineer Teaches Aircraft To Land Themselves, Ships AI Products Between Lectures
                    </h2>
                    <p className="text-[14px] italic leading-snug mb-2" style={{ fontFamily: 'Georgia, serif', color: '#555' }}>
                        Student of mechanical engineering ranks 7th worldwide at SAE Aero Design; recruiters advised to act before graduation.
                    </p>
                    <p className="text-[11px] mb-4" style={{ fontFamily: 'Georgia, serif', color: '#777' }}>
                        By Our Technology Correspondent · Mumbai Bureau · {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>

                    <div className="border-t border-gray-300 pt-4">
                        <div className="sm:columns-2 gap-7 text-[13.5px] leading-[1.75]" style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
                            <p className="mb-3">
                                <span className="text-[2.8rem] font-bold float-left mr-2 mt-[2px] leading-[0.8]" style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a1a' }}>M</span>
                                UMBAI — {personalInfo.name}, a {personalInfo.education.degree} student at {personalInfo.education.college}, has emerged as one of the most prolific young engineers in the country&apos;s burgeoning tech scene, shipping over {projects.length} products across artificial intelligence, autonomous systems, and full-stack development.
                            </p>
                            <p className="mb-3">{personalInfo.bio}</p>
                            <p className="mb-3">
                                Asked how he balances coursework with production deadlines, the engineer was characteristically brief. &ldquo;Slide decks don&apos;t fly,&rdquo; he said. &ldquo;Everything I build either runs in production or lands on a runway. Preferably both.&rdquo;
                            </p>
                            <p className="mb-3">
                                Industry observers note an unusual range: by day, full-stack platforms and AI automation for paying clients; by competition season, computer-vision landing systems speaking MAVLink to flight controllers. His internship at Serenovolante alone produced fifteen thousand lines of production code.
                            </p>
                        </div>
                    </div>
                </motion.article>

                <div className="border-t-2 border-black mb-5" />

                {/* ── TWO-COLUMN: PROJECTS + SIDEBAR ── */}
                <div className="grid md:grid-cols-[1fr_280px] gap-6 mb-6">
                    {/* Projects */}
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                        <h3 className="text-[9px] uppercase tracking-[0.25em] border-b border-gray-300 pb-1 mb-4" style={{ fontFamily: 'Georgia, serif', color: '#888' }}>Featured Projects</h3>
                        <div className="space-y-5">
                            {projects.slice(0, 4).map((p, i) => (
                                <article key={i} className="pb-4 border-b border-gray-200">
                                    <h4 className="text-[16px] font-bold leading-snug mb-1 hover:underline cursor-pointer" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{p.title}</h4>
                                    <p className="text-[11px] italic mb-2" style={{ fontFamily: 'Georgia, serif', color: '#999' }}>{p.subtitle}</p>
                                    <p className="text-[12.5px] leading-[1.6] line-clamp-3" style={{ fontFamily: 'Georgia, serif', color: '#444' }}>{p.description}</p>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {p.techStack.slice(0, 4).map((t, j) => (
                                            <span key={j} className="text-[8px] uppercase tracking-[0.15em]" style={{ color: '#aaa' }}>{t}</span>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </motion.div>

                    {/* Sidebar */}
                    <motion.aside initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="md:border-l md:border-gray-300 md:pl-5">
                        {/* Experience */}
                        <h3 className="text-[9px] uppercase tracking-[0.25em] border-b border-gray-300 pb-1 mb-3" style={{ fontFamily: 'Georgia, serif', color: '#888' }}>Career Dispatches</h3>
                        <div className="space-y-3 mb-6">
                            {experiences.slice(0, 4).map((e, i) => (
                                <div key={i} className="pb-2 border-b border-gray-100">
                                    <h4 className="text-[13px] font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{e.role}</h4>
                                    <p className="text-[11px]" style={{ fontFamily: 'Georgia, serif', color: '#888' }}>{e.company} · {e.period}</p>
                                </div>
                            ))}
                        </div>

                        {/* Pull Quote */}
                        <div className="border-t-2 border-b-2 border-black py-4 mb-5">
                            <p className="text-[15px] italic leading-relaxed" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#2a2a2a' }}>
                                &ldquo;{achievements[0]?.quote ?? 'Slide decks don\'t fly.'}&rdquo;
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.15em] mt-2" style={{ color: '#888' }}>— Pinned above the engineer&apos;s desk</p>
                        </div>

                        {/* Weather-style info box */}
                        <div className="border-2 border-black p-3 text-center">
                            <p className="text-[9px] uppercase tracking-[0.25em] border-b border-gray-300 pb-1.5 mb-2" style={{ fontFamily: 'Georgia, serif', color: '#666' }}>Today&apos;s Forecast</p>
                            <p className="text-[22px] font-black leading-none mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>100%</p>
                            <p className="text-[11px] font-bold">Chance of Shipping</p>
                            <p className="text-[10px] mt-1.5 pt-1.5 border-t border-gray-200" style={{ color: '#888' }}>Status: Open to Opportunities<br />Mumbai, Maharashtra</p>
                        </div>
                    </motion.aside>
                </div>

                <div className="border-t border-gray-300 mb-5" />

                {/* ── AWARDS ── */}
                <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                    <h3 className="text-[9px] uppercase tracking-[0.25em] border-b border-gray-300 pb-1 mb-4" style={{ fontFamily: 'Georgia, serif', color: '#888' }}>Honours & Distinctions</h3>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-3 mb-6">
                        {achievements.slice(0, 6).map((a, i) => (
                            <div key={i} className="pb-2 border-b border-gray-200">
                                <h4 className="text-[12.5px] font-bold leading-snug" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                    <span className="text-[10px] font-normal tracking-[0.1em] mr-1.5" style={{ color: '#8b7355' }}>{a.rank} —</span>
                                    {a.title}
                                </h4>
                                <p className="text-[10.5px] leading-relaxed line-clamp-2 mt-0.5" style={{ fontFamily: 'Georgia, serif', color: '#777' }}>{a.description}</p>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* ── CLASSIFIEDS (Contact) ── */}
                <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="border-t-2 border-black pt-4">
                    <h3 className="text-[9px] uppercase tracking-[0.25em] mb-4" style={{ fontFamily: 'Georgia, serif', color: '#888' }}>Classified Advertisements</h3>
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 text-[11px]" style={{ fontFamily: 'Georgia, serif' }}>
                        <div className="border border-gray-400 p-3">
                            <p className="font-bold text-[10px] uppercase tracking-wider mb-1">Professional Inquiries</p>
                            <p>Write to: <a href={`mailto:${personalInfo.email}`} className="underline">{personalInfo.email}</a></p>
                        </div>
                        <div className="border border-gray-400 p-3">
                            <p className="font-bold text-[10px] uppercase tracking-wider mb-1">Source Code Repository</p>
                            <p>Visit: <a href="https://github.com/AAGAM17" target="_blank" rel="noreferrer" className="underline">github.com/AAGAM17</a></p>
                        </div>
                        <div className="border border-gray-400 p-3">
                            <p className="font-bold text-[10px] uppercase tracking-wider mb-1">Professional Networking</p>
                            <p>Connect: <a href="https://linkedin.com/in/aagamshah" target="_blank" rel="noreferrer" className="underline">LinkedIn</a></p>
                        </div>
                        <div className="border border-gray-400 p-3">
                            <p className="font-bold text-[10px] uppercase tracking-wider mb-1">Tenders Invited</p>
                            <p>Ambitious projects seeking an engineer who ships may apply within. Serious offers only.</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-6 pt-3 border-t border-gray-300 text-[9px]" style={{ fontFamily: 'Georgia, serif', color: '#aaa' }}>
                        <span>Page A1 · The Daily Aagam</span>
                        <span>© {today.getFullYear()} — Not an actual newspaper. The engineer, however, is real.</span>
                        <span>Printed in Mumbai</span>
                    </div>
                </motion.footer>
            </div>
        </div>
    );
}
