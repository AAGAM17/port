'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mic, Volume2, VolumeX } from 'lucide-react';
import { VEDA, vedaGreeting, vedaReply, VedaReply } from '@/lib/veda';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════
   VEDA · floating voice assistant
   Speaks with the device's own voice via
   speechSynthesis; listens via the Web
   Speech API where available.
   ═══════════════════════════════════════ */

interface Message {
    id: number;
    from: 'veda' | 'user';
    text: string;
}

const NUDGE_KEY = 'veda.nudged';

/* Prefer a female English voice; Indian English first — it suits her. */
function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    const ranked = [
        (v: SpeechSynthesisVoice) => v.lang.startsWith('en-IN') && /veena|female|woman/i.test(v.name),
        (v: SpeechSynthesisVoice) => v.lang.startsWith('en-IN'),
        (v: SpeechSynthesisVoice) => /samantha|ava|allison|susan|karen|moira|tessa|fiona|zira|aria|jenny|libby|sonia|natasha|female/i.test(v.name) && v.lang.startsWith('en'),
        (v: SpeechSynthesisVoice) => v.name === 'Google UK English Female',
        (v: SpeechSynthesisVoice) => v.name === 'Google US English' || (v.lang.startsWith('en') && v.default),
        (v: SpeechSynthesisVoice) => v.lang.startsWith('en'),
    ];
    for (const test of ranked) {
        const found = voices.find(test);
        if (found) return found;
    }
    return voices[0] ?? null;
}

function VedaOrb({ size = 56, speaking = false, listening = false }: { size?: number; speaking?: boolean; listening?: boolean }) {
    return (
        <div className="relative grid place-items-center" style={{ width: size, height: size }}>
            {speaking && <div className="veda-halo absolute inset-0 rounded-full bg-cyan-400/30" />}
            {listening && <div className="veda-halo absolute inset-0 rounded-full bg-rose-400/40" />}
            <svg className="veda-ring absolute inset-0 opacity-50" viewBox="0 0 56 56" width={size} height={size}>
                <circle cx="28" cy="28" r="26" fill="none" stroke="rgba(165,180,252,0.6)" strokeWidth="1" strokeDasharray="3 7" />
            </svg>
            <div
                className={cn('veda-orb-core rounded-full', speaking && 'speaking')}
                style={{ width: size * 0.62, height: size * 0.62, boxShadow: '0 0 18px rgba(129,140,248,0.45), inset 0 0 10px rgba(255,255,255,0.25)' }}
            />
        </div>
    );
}

function Waveform() {
    return (
        <div className="flex items-end gap-[3px] h-3.5" aria-hidden="true">
            {[0, 1, 2, 3, 4].map(i => (
                <span key={i} className="veda-bar w-[3px] rounded-full bg-cyan-300" style={{ height: '100%', animationDelay: `${i * 0.12}s` }} />
            ))}
        </div>
    );
}

export default function VedaAssistant() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [chips, setChips] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [thinking, setThinking] = useState(false);
    const [speaking, setSpeaking] = useState(false);
    const [listening, setListening] = useState(false);
    const [voiceOn, setVoiceOn] = useState(true);
    const [canListen, setCanListen] = useState(false);
    const [nudge, setNudge] = useState(false);

    const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
    const recognitionRef = useRef<{ start: () => void; stop: () => void } | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const idRef = useRef(0);
    const greetedRef = useRef(false);

    /* Voice setup */
    useEffect(() => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
        const load = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length) voiceRef.current = pickVoice(voices);
        };
        load();
        window.speechSynthesis.addEventListener('voiceschanged', load);
        const muted = localStorage.getItem('veda.muted') === '1';
        setVoiceOn(!muted);
        return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
    }, []);

    /* Mic support */
    useEffect(() => {
        const w = window as unknown as Record<string, unknown>;
        setCanListen(Boolean(w.webkitSpeechRecognition || w.SpeechRecognition));
    }, []);

    /* First-visit nudge bubble */
    useEffect(() => {
        if (sessionStorage.getItem(NUDGE_KEY)) return;
        const show = setTimeout(() => setNudge(true), 3500);
        const hide = setTimeout(() => setNudge(false), 11000);
        return () => { clearTimeout(show); clearTimeout(hide); };
    }, []);

    const stopSpeaking = useCallback(() => {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        setSpeaking(false);
    }, []);

    /* Speak in sentence chunks (long utterances get cut off in Chrome). */
    const speak = useCallback((text: string) => {
        if (!voiceOn || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
        const synth = window.speechSynthesis;
        synth.cancel();
        const chunks = text.match(/[^.!?]+[.!?]*/g)?.map(c => c.trim()).filter(Boolean) ?? [text];
        chunks.forEach((chunk, i) => {
            const u = new SpeechSynthesisUtterance(chunk);
            if (voiceRef.current) u.voice = voiceRef.current;
            u.rate = 1.02;
            u.pitch = 1.05;
            if (i === 0) u.onstart = () => setSpeaking(true);
            if (i === chunks.length - 1) {
                u.onend = () => setSpeaking(false);
                u.onerror = () => setSpeaking(false);
            }
            synth.speak(u);
        });
    }, [voiceOn]);

    const deliver = useCallback((reply: VedaReply, delay = 500) => {
        setThinking(true);
        setChips([]);
        setTimeout(() => {
            setThinking(false);
            setMessages(prev => [...prev, { id: ++idRef.current, from: 'veda', text: reply.text }]);
            setChips(reply.chips);
            speak(reply.speech);
        }, delay);
    }, [speak]);

    const ask = useCallback((raw: string) => {
        const q = raw.trim();
        if (!q) return;
        stopSpeaking();
        setMessages(prev => [...prev, { id: ++idRef.current, from: 'user', text: q }]);
        setInput('');
        deliver(vedaReply(q), 450 + Math.random() * 350);
    }, [deliver, stopSpeaking]);

    const openPanel = useCallback(() => {
        setOpen(true);
        setNudge(false);
        sessionStorage.setItem(NUDGE_KEY, '1');
        if (!greetedRef.current) {
            greetedRef.current = true;
            deliver(vedaGreeting(), 600);
        }
    }, [deliver]);

    const closePanel = useCallback(() => {
        setOpen(false);
        stopSpeaking();
        recognitionRef.current?.stop();
        setListening(false);
    }, [stopSpeaking]);

    /* Voice input */
    const toggleListen = useCallback(() => {
        if (listening) {
            recognitionRef.current?.stop();
            setListening(false);
            return;
        }
        const w = window as unknown as Record<string, new () => unknown>;
        const Ctor = (w.SpeechRecognition || w.webkitSpeechRecognition) as new () => {
            lang: string; interimResults: boolean; maxAlternatives: number;
            onresult: (e: { results: { [k: number]: { [k: number]: { transcript: string } } } }) => void;
            onend: () => void; onerror: () => void;
            start: () => void; stop: () => void;
        };
        if (!Ctor) return;
        stopSpeaking();
        const rec = new Ctor();
        rec.lang = 'en-IN';
        rec.interimResults = false;
        rec.maxAlternatives = 1;
        rec.onresult = (e) => {
            const transcript = e.results[0][0].transcript;
            ask(transcript);
        };
        rec.onend = () => setListening(false);
        rec.onerror = () => setListening(false);
        recognitionRef.current = rec;
        rec.start();
        setListening(true);
    }, [listening, ask, stopSpeaking]);

    /* Autoscroll + focus */
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages, thinking, chips]);

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 350);
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closePanel(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, closePanel]);

    const toggleVoice = () => {
        const next = !voiceOn;
        setVoiceOn(next);
        localStorage.setItem('veda.muted', next ? '0' : '1');
        if (!next) stopSpeaking();
    };

    return (
        <>
            {/* ── Launcher orb ── */}
            <div className="fixed bottom-5 right-5 z-[9990] flex items-center gap-3">
                <AnimatePresence>
                    {nudge && !open && (
                        <motion.button
                            initial={{ opacity: 0, x: 12, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 12, scale: 0.95 }}
                            onClick={openPanel}
                            className="max-w-[230px] text-left rounded-2xl rounded-br-sm bg-[#0b1222]/95 border border-indigo-400/25 px-4 py-3 shadow-[0_8px_40px_rgba(99,102,241,0.25)] backdrop-blur-xl"
                        >
                            <span className="block text-[11px] leading-relaxed text-gray-300">
                                Hi, I&apos;m <span className="text-cyan-300 font-semibold">Veda</span> — {VEDA.tagline}. Ask me anything about him.
                            </span>
                        </motion.button>
                    )}
                </AnimatePresence>
                <motion.button
                    onClick={open ? closePanel : openPanel}
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.94 }}
                    className="relative rounded-full bg-[#0b1222]/90 border border-indigo-400/20 shadow-[0_8px_32px_rgba(99,102,241,0.3)] backdrop-blur-xl"
                    aria-label={open ? 'Close Veda' : 'Talk to Veda, Aagam\'s AI assistant'}
                >
                    <VedaOrb size={56} speaking={speaking} listening={listening} />
                </motion.button>
            </div>

            {/* ── Panel ── */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.97 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 360 }}
                        className="fixed z-[9991] bottom-24 right-5 left-5 sm:left-auto sm:w-[390px] max-h-[min(620px,calc(100vh-130px))] flex flex-col rounded-2xl overflow-hidden border border-indigo-400/20 bg-[#080d1a]/95 backdrop-blur-2xl shadow-[0_24px_80px_rgba(8,13,26,0.8)]"
                        role="dialog"
                        aria-label="Veda — Aagam's AI assistant"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-gradient-to-r from-indigo-500/10 via-transparent to-cyan-500/10">
                            <VedaOrb size={34} speaking={speaking} />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold tracking-[0.2em] text-white" style={{ fontFamily: 'var(--font-grotesk)' }}>VEDA</span>
                                    {speaking ? <Waveform /> : (
                                        <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400/80"><span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />ONLINE</span>
                                    )}
                                </div>
                                <p className="text-[10px] text-gray-500 truncate">{VEDA.tagline} · runs in your browser</p>
                            </div>
                            <button onClick={toggleVoice} className={cn('p-2 rounded-lg transition-colors', voiceOn ? 'text-cyan-300 hover:bg-cyan-400/10' : 'text-gray-600 hover:bg-white/5')} aria-label={voiceOn ? 'Mute Veda\'s voice' : 'Unmute Veda\'s voice'} title={voiceOn ? 'Voice on' : 'Voice off'}>
                                {voiceOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
                            </button>
                            <button onClick={closePanel} className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors" aria-label="Close">
                                <X size={15} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[220px]">
                            {messages.map(m => (
                                <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn('flex gap-2.5', m.from === 'user' && 'justify-end')}>
                                    {m.from === 'veda' && <div className="mt-1 shrink-0"><VedaOrb size={22} /></div>}
                                    <div className={cn(
                                        'max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-line',
                                        m.from === 'veda'
                                            ? 'bg-white/[0.04] border border-white/5 text-gray-300 rounded-tl-sm'
                                            : 'bg-cyan-400/10 border border-cyan-400/20 text-cyan-100 rounded-br-sm'
                                    )}>
                                        {m.text}
                                    </div>
                                </motion.div>
                            ))}
                            {thinking && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                                    <div className="mt-1 shrink-0"><VedaOrb size={22} speaking /></div>
                                    <div className="rounded-2xl rounded-tl-sm bg-white/[0.04] border border-white/5 px-4 py-3 flex gap-1.5">
                                        {[0, 1, 2].map(i => (
                                            <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-300/70" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.18 }} />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            {/* Suggestion chips */}
                            {!thinking && chips.length > 0 && (
                                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-wrap gap-2 pl-8">
                                    {chips.map(c => (
                                        <button key={c} onClick={() => ask(c)} className="text-[11px] px-3 py-1.5 rounded-full border border-indigo-400/25 text-indigo-200/90 hover:bg-indigo-400/10 hover:border-indigo-400/50 transition-all">
                                            {c}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </div>

                        {/* Input */}
                        <form
                            onSubmit={(e) => { e.preventDefault(); ask(input); }}
                            className="flex items-center gap-2 px-3 py-3 border-t border-white/5 bg-white/[0.02]"
                        >
                            {canListen && (
                                <button
                                    type="button"
                                    onClick={toggleListen}
                                    className={cn('p-2.5 rounded-xl border transition-all', listening ? 'border-rose-400/50 text-rose-300 bg-rose-400/10 animate-pulse' : 'border-white/10 text-gray-500 hover:text-cyan-300 hover:border-cyan-400/30')}
                                    aria-label={listening ? 'Stop listening' : 'Ask by voice'}
                                    title={listening ? 'Listening…' : 'Ask by voice'}
                                >
                                    <Mic size={15} />
                                </button>
                            )}
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder={listening ? 'Listening…' : 'Ask me about Aagam…'}
                                className="flex-1 bg-transparent text-[13px] text-white placeholder:text-gray-600 outline-none px-2 py-2"
                                aria-label="Message Veda"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="p-2.5 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-cyan-400/20 transition-all"
                                aria-label="Send"
                            >
                                <Send size={15} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
