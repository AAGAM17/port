'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    collection, query, where, onSnapshot, addDoc, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { Quote, ChevronLeft, ChevronRight, MessageSquarePlus, Check, Loader2, X } from 'lucide-react';
import { getDb, isFirebaseConfigured } from '@/lib/firebase';
import { personalInfo } from '@/lib/data';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════
   LIVE TESTIMONIALS
   Visitors submit directly on the site;
   entries land in Firestore as approved:false.
   Aagam flips approved → true and they appear
   here in realtime via onSnapshot.
   ═══════════════════════════════════════ */

export interface LiveTestimonial {
    id: string;
    name: string;
    role: string;
    company: string;
    quote: string;
    createdAt: number;
}

export function useApprovedTestimonials() {
    const [items, setItems] = useState<LiveTestimonial[]>([]);
    const [loading, setLoading] = useState(isFirebaseConfigured);

    useEffect(() => {
        const db = getDb();
        if (!db) return;
        const q = query(collection(db, 'testimonials'), where('approved', '==', true));
        const unsub = onSnapshot(q, snap => {
            const list = snap.docs.map(d => {
                const data = d.data();
                return {
                    id: d.id,
                    name: String(data.name ?? ''),
                    role: String(data.role ?? ''),
                    company: String(data.company ?? ''),
                    quote: String(data.quote ?? ''),
                    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : 0,
                };
            }).sort((a, b) => b.createdAt - a.createdAt);
            setItems(list);
            setLoading(false);
        }, () => setLoading(false));
        return unsub;
    }, []);

    return { items, loading, configured: isFirebaseConfigured };
}

const initials = (name: string) =>
    name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('') || '∙';

const QUOTE_MIN = 20;
const QUOTE_MAX = 600;

function TestimonialForm({ onClose }: { onClose: () => void }) {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [company, setCompany] = useState('');
    const [quote, setQuote] = useState('');
    const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const db = getDb();
        if (!db || state === 'sending') return;
        setState('sending');
        try {
            await addDoc(collection(db, 'testimonials'), {
                name: name.trim().slice(0, 80),
                role: role.trim().slice(0, 80),
                company: company.trim().slice(0, 80),
                quote: quote.trim().slice(0, QUOTE_MAX),
                approved: false,
                createdAt: serverTimestamp(),
            });
            setState('sent');
        } catch {
            setState('error');
        }
    };

    if (state === 'sent') {
        return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-10 px-6">
                <div className="w-12 h-12 rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center mx-auto mb-4">
                    <Check size={20} className="text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">Thank you!</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                    Your words are with Aagam for review. The moment he approves them, they appear here — live.
                </p>
                <button onClick={onClose} className="mt-6 text-[11px] font-mono tracking-[0.15em] text-gray-500 hover:text-cyan-400 transition-colors">
                    CLOSE
                </button>
            </motion.div>
        );
    }

    const inputCls = 'w-full bg-transparent border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-cyan-400/40 focus:outline-none transition-colors';

    return (
        <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={submit}
            className="space-y-4 p-6 sm:p-7 text-left"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white" style={{ fontFamily: 'var(--font-grotesk)' }}>Share a testimonial</h3>
                <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors" aria-label="Close form">
                    <X size={15} />
                </button>
            </div>
            <p className="text-xs text-gray-500 -mt-2">Worked with Aagam? It publishes here the moment he approves it.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required maxLength={80} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className={inputCls} aria-label="Your name" />
                <input required maxLength={80} value={role} onChange={e => setRole(e.target.value)} placeholder="Your role (e.g. Engineering Manager)" className={inputCls} aria-label="Your role" />
            </div>
            <input maxLength={80} value={company} onChange={e => setCompany(e.target.value)} placeholder="Company (optional)" className={inputCls} aria-label="Company" />
            <div>
                <textarea
                    required
                    minLength={QUOTE_MIN}
                    maxLength={QUOTE_MAX}
                    rows={4}
                    value={quote}
                    onChange={e => setQuote(e.target.value)}
                    placeholder="What was it like working with him?"
                    className={cn(inputCls, 'resize-none')}
                    aria-label="Your testimonial"
                />
                <p className={cn('text-[10px] font-mono mt-1.5 text-right', quote.length > QUOTE_MAX - 40 ? 'text-amber-400/80' : 'text-gray-600')}>
                    {quote.length}/{QUOTE_MAX}
                </p>
            </div>
            {state === 'error' && (
                <p className="text-xs text-rose-400">Something went wrong — please try again, or email {personalInfo.email}.</p>
            )}
            <button
                type="submit"
                disabled={state === 'sending' || quote.trim().length < QUOTE_MIN}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-mono tracking-[0.15em] text-cyan-400 border border-cyan-400/30 bg-cyan-400/5 rounded-lg hover:bg-cyan-400/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
                {state === 'sending' ? <><Loader2 size={14} className="animate-spin" /> SUBMITTING…</> : 'SUBMIT FOR APPROVAL'}
            </button>
        </motion.form>
    );
}

/* Full section for the home page (dark theme styling). */
export default function TestimonialsSection() {
    const { items, loading, configured } = useApprovedTestimonials();
    const [current, setCurrent] = useState(0);
    const [formOpen, setFormOpen] = useState(false);

    const count = items.length;
    useEffect(() => {
        if (count < 2) return;
        const timer = setInterval(() => setCurrent(prev => (prev + 1) % count), 6000);
        return () => clearInterval(timer);
    }, [count]);

    const go = useCallback((dir: 1 | -1) => {
        if (!count) return;
        setCurrent(prev => (prev + dir + count) % count);
    }, [count]);

    const active = count ? items[Math.min(current, count - 1)] : null;

    /* Nothing configured and nothing to show — offer email, never a dead end. */
    const shareCta = configured ? (
        <button
            onClick={() => setFormOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-[11px] font-mono tracking-[0.15em] text-gray-500 border border-white/5 rounded-full hover:border-emerald-400/30 hover:text-emerald-400 hover:bg-emerald-400/5 transition-all group"
        >
            <MessageSquarePlus size={14} className="group-hover:text-emerald-400 transition-colors" />
            WORKED WITH ME? SHARE YOUR TESTIMONIAL
        </button>
    ) : (
        <a
            href={`mailto:${personalInfo.email}?subject=${encodeURIComponent('Testimonial for Aagam Shah')}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-[11px] font-mono tracking-[0.15em] text-gray-500 border border-white/5 rounded-full hover:border-emerald-400/30 hover:text-emerald-400 hover:bg-emerald-400/5 transition-all group"
        >
            <MessageSquarePlus size={14} className="group-hover:text-emerald-400 transition-colors" />
            WORKED WITH ME? SHARE YOUR TESTIMONIAL
        </a>
    );

    return (
        <section className="relative z-10 py-20 px-6">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.02] to-transparent pointer-events-none" />
            <div className="max-w-4xl mx-auto relative">
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12 text-center">
                    <span className="text-[10px] font-mono tracking-[0.4em] text-gray-700 block mb-4">SIGNED BY REAL PEOPLE</span>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-grotesk)' }}>
                        Testimonials
                    </h2>
                </motion.div>

                <AnimatePresence mode="wait">
                    {formOpen ? (
                        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-xl mx-auto border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-sm">
                            <TestimonialForm onClose={() => setFormOpen(false)} />
                        </motion.div>
                    ) : active ? (
                        <motion.div key="carousel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
                            <Quote size={40} className="absolute -top-2 -left-2 text-cyan-400/10 z-0" />
                            <AnimatePresence mode="wait">
                                <motion.figure key={active.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="relative z-10 text-center py-8">
                                    <blockquote className="text-xl md:text-2xl lg:text-3xl text-gray-300 leading-relaxed mb-10 max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-serif)' }}>
                                        &ldquo;{active.quote}&rdquo;
                                    </blockquote>
                                    <figcaption className="flex items-center justify-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400/20 to-violet-400/20 border border-white/10 flex items-center justify-center text-sm font-bold text-white">
                                            {initials(active.name)}
                                        </div>
                                        <div className="text-left">
                                            <span className="text-sm font-semibold block text-white">{active.name}</span>
                                            <span className="text-xs text-gray-500">{active.role}{active.company ? ` · ${active.company}` : ''}</span>
                                        </div>
                                    </figcaption>
                                </motion.figure>
                            </AnimatePresence>
                            {count > 1 && (
                                <div className="flex items-center justify-center gap-6 mt-2">
                                    <button onClick={() => go(-1)} className="p-2 text-gray-600 hover:text-white transition-colors border border-white/5 rounded-lg hover:border-cyan-400/20" aria-label="Previous testimonial">
                                        <ChevronLeft size={18} />
                                    </button>
                                    <div className="flex gap-2">
                                        {items.map((t, i) => (
                                            <button key={t.id} onClick={() => setCurrent(i)} aria-label={`Testimonial ${i + 1}`} className={cn('w-2 h-2 rounded-full transition-all', i === current ? 'bg-cyan-400 w-6' : 'bg-gray-800 hover:bg-gray-600')} />
                                        ))}
                                    </div>
                                    <button onClick={() => go(1)} className="p-2 text-gray-600 hover:text-white transition-colors border border-white/5 rounded-lg hover:border-cyan-400/20" aria-label="Next testimonial">
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}
                            <div className="mt-10 text-center">{shareCta}</div>
                        </motion.div>
                    ) : (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-10">
                            {loading ? (
                                <Loader2 size={20} className="animate-spin text-gray-700 mx-auto" />
                            ) : (
                                <>
                                    <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                                        This wall is reserved for the people who&apos;ve actually worked with me.
                                        Be the first to sign it.
                                    </p>
                                    {shareCta}
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
