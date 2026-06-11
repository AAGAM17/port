'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { personalInfo, navLinks } from '@/lib/data';
import { ArrowLeft, Zap, Send, Mail, Github, Linkedin, Phone, Copy, Check, ExternalLink } from 'lucide-react';

/* ═══════════════════════════════════════
   CONTACT · COMMUNICATION INTERFACE
   Emerald/green palette, comms terminal.
   ═══════════════════════════════════════ */

const channels = [
    { label: 'Email', value: personalInfo.email, href: `mailto:${personalInfo.email}`, icon: Mail, color: '#34d399' },
    { label: 'GitHub', value: 'AAGAM17', href: personalInfo.github, icon: Github, color: '#a78bfa' },
    { label: 'LinkedIn', value: 'aagamshah', href: personalInfo.linkedin, icon: Linkedin, color: '#22d3ee' },
    { label: 'Phone', value: personalInfo.phone, href: `tel:${personalInfo.phone}`, icon: Phone, color: '#f59e0b' },
];

export default function ContactPage() {
    const [copied, setCopied] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [opened, setOpened] = useState(false);

    const sendViaEmail = (e: React.FormEvent) => {
        e.preventDefault();
        const body = `${message}\n\n— ${name}${email ? ` (${email})` : ''}`;
        window.location.href = `mailto:${personalInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setOpened(true);
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="min-h-screen bg-[#030a06] relative">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/[0.02] rounded-full blur-[120px]" />
            </div>

            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-40 bg-[#030a06]/80 backdrop-blur-xl border-b border-emerald-400/10">
                <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-1.5 text-gray-600 hover:text-emerald-400 transition-colors"><ArrowLeft size={16} /></Link>
                        <Zap size={14} className="text-emerald-400/50" />
                        <span className="text-[10px] font-mono tracking-[0.3em] text-emerald-400/40">COMMS</span>
                    </div>
                    <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-gray-700">
                        {navLinks.filter(l => l.href !== '/contact').slice(0, 5).map(l => (
                            <Link key={l.href} href={l.href} className="hover:text-emerald-400 transition-colors">{l.label}</Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Header */}
            <section className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-12 text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <span className="text-[10px] font-mono tracking-[0.4em] text-emerald-400/40 block mb-4">TRANSMISSION INTERFACE</span>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4" style={{ fontFamily: 'var(--font-grotesk)' }}>
                        Let&apos;s <span className="text-emerald-400">connect</span>
                    </h1>
                    <p className="text-gray-500 max-w-lg mx-auto">Open to exciting opportunities, collaborations, and conversations about AI, startups, and systems engineering.</p>
                </motion.div>
            </section>

            {/* Channels */}
            <section className="relative z-10 max-w-4xl mx-auto px-6 pb-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {channels.map((ch, i) => {
                        const Icon = ch.icon;
                        return (
                            <motion.div key={ch.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="group relative p-6 border border-emerald-400/5 rounded-xl bg-[#040d07]/80 hover:border-emerald-400/15 transition-all">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/5" style={{ background: `${ch.color}10` }}>
                                        <Icon size={18} style={{ color: ch.color }} />
                                    </div>
                                    <div>
                                        <span className="text-xs font-mono text-gray-600 tracking-wider">{ch.label.toUpperCase()}</span>
                                        <p className="text-sm font-medium">{ch.value}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <a href={ch.href} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-mono tracking-wider text-emerald-400/60 border border-emerald-400/10 rounded-lg hover:bg-emerald-400/5 hover:text-emerald-400 transition-all">
                                        <ExternalLink size={10} /> OPEN
                                    </a>
                                    <button onClick={() => copyToClipboard(ch.value, ch.label)} className="flex items-center justify-center gap-2 px-4 py-2 text-[10px] font-mono tracking-wider text-gray-600 border border-white/5 rounded-lg hover:bg-white/5 hover:text-white transition-all">
                                        {copied === ch.label ? <><Check size={10} className="text-emerald-400" /> COPIED</> : <><Copy size={10} /> COPY</>}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* Contact Form */}
            <section className="relative z-10 max-w-2xl mx-auto px-6 pb-24">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <span className="text-[10px] font-mono tracking-[0.4em] text-gray-700 block mb-4">WRITE TO ME</span>
                    <div className="p-8 border border-emerald-400/10 rounded-xl bg-[#040d07]/60">
                        <form onSubmit={sendViaEmail} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><label htmlFor="c-name" className="text-[10px] font-mono text-gray-600 tracking-wider block mb-2">NAME</label><input id="c-name" type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="w-full bg-transparent border border-emerald-400/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-700 focus:border-emerald-400/30 focus:outline-none transition-colors font-mono" /></div>
                                <div><label htmlFor="c-email" className="text-[10px] font-mono text-gray-600 tracking-wider block mb-2">EMAIL</label><input id="c-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="w-full bg-transparent border border-emerald-400/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-700 focus:border-emerald-400/30 focus:outline-none transition-colors font-mono" /></div>
                            </div>
                            <div><label htmlFor="c-subject" className="text-[10px] font-mono text-gray-600 tracking-wider block mb-2">SUBJECT</label><input id="c-subject" type="text" required value={subject} onChange={e => setSubject(e.target.value)} placeholder="What's on your mind?" className="w-full bg-transparent border border-emerald-400/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-700 focus:border-emerald-400/30 focus:outline-none transition-colors font-mono" /></div>
                            <div><label htmlFor="c-message" className="text-[10px] font-mono text-gray-600 tracking-wider block mb-2">MESSAGE</label><textarea id="c-message" required rows={5} value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your message..." className="w-full bg-transparent border border-emerald-400/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-700 focus:border-emerald-400/30 focus:outline-none transition-colors font-mono resize-none" /></div>
                            <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 text-sm font-mono tracking-[0.15em] text-emerald-400 border border-emerald-400/30 bg-emerald-400/5 rounded-lg hover:bg-emerald-400/10 transition-all">
                                <Send size={14} /> SEND VIA YOUR EMAIL APP
                            </button>
                            {opened && (
                                <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1.5">
                                    <Check size={12} className="text-emerald-400" />
                                    Your email app should have opened — if it didn&apos;t, write directly to {personalInfo.email}.
                                </p>
                            )}
                        </form>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-emerald-400/10 py-6 px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] font-mono text-gray-700">
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> COMMS ACTIVE</span>
                    <Link href="/" className="text-emerald-400/40 hover:text-emerald-400 transition-colors">← HOME</Link>
                </div>
            </footer>
        </div>
    );
}
