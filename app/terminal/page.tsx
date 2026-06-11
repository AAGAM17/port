'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { terminalCommands, experiences, projects, achievements } from '@/lib/data';

/* ═══════════════════════════════════════
   TERMINAL · CRT RETRO INTERFACE v3.1
   Tab autocomplete, ghost suggestions,
   command history, themes, Easter eggs.
   ═══════════════════════════════════════ */

interface OutputLine { type: 'input' | 'output' | 'system' | 'ascii' | 'error'; content: string; }

// Every command available — data-driven + component-level
const BUILTIN_COMMANDS = [
    'help', 'about', 'skills', 'projects', 'experience', 'contact',
    'achievements', 'education', 'sudo hire-me', 'matrix', 'launch',
    'neofetch', 'banner', 'whoami', 'uptime', 'fortune', 'quote',
    'ping', 'ls', 'cat .secrets', 'pwd', 'date', 'time',
    'history', 'echo', 'github', 'linkedin', 'resume', 'cv',
    'clear', 'cls', 'exit', 'quit', 'sudo rm -rf /',
    'theme', 'themes',
];

const QUOTES = [
    '"Any sufficiently advanced technology is indistinguishable from magic." — Arthur C. Clarke',
    '"Move fast and break things. Unless you\'re building avionics." — Aagam',
    '"The best way to predict the future is to build it." — Alan Kay',
    '"First, solve the problem. Then, write the code." — John Johnson',
    '"Talk is cheap. Show me the code." — Linus Torvalds',
    '"Simplicity is the ultimate sophistication." — Leonardo da Vinci',
    '"Code is like humor. When you have to explain it, it\'s bad." — Cory House',
];

// Theme definitions
const THEMES: Record<string, { name: string; primary: string; bg: string; accent: string; dim: string; prompt: string; }> = {
    green: { name: 'Matrix Green', primary: 'text-green-400', bg: 'bg-black', accent: 'text-green-500', dim: 'text-green-900', prompt: 'text-green-600' },
    cyan: { name: 'Cyber Cyan', primary: 'text-cyan-400', bg: 'bg-[#020a14]', accent: 'text-cyan-500', dim: 'text-cyan-900', prompt: 'text-cyan-600' },
    amber: { name: 'Retro Amber', primary: 'text-amber-400', bg: 'bg-[#0a0800]', accent: 'text-amber-500', dim: 'text-amber-900', prompt: 'text-amber-600' },
    violet: { name: 'Neon Violet', primary: 'text-violet-400', bg: 'bg-[#0a0015]', accent: 'text-violet-500', dim: 'text-violet-900', prompt: 'text-violet-600' },
    rose: { name: 'Hot Pink', primary: 'text-rose-400', bg: 'bg-[#0f0005]', accent: 'text-rose-500', dim: 'text-rose-900', prompt: 'text-rose-600' },
    blue: { name: 'Deep Blue', primary: 'text-blue-400', bg: 'bg-[#000510]', accent: 'text-blue-500', dim: 'text-blue-900', prompt: 'text-blue-600' },
};

export default function TerminalPage() {
    const [history, setHistory] = useState<OutputLine[]>([
        { type: 'ascii', content: '  ╔══════════════════════════════════════════════════╗' },
        { type: 'ascii', content: '  ║       AAGAM SHAH — TERMINAL v3.1                   ║' },
        { type: 'ascii', content: '  ║       Welcome, Operator.                         ║' },
        { type: 'ascii', content: '  ╚══════════════════════════════════════════════════╝' },
        { type: 'system', content: '' },
        { type: 'system', content: '  Type "help" for a list of commands.' },
        { type: 'system', content: '  Press [TAB] to autocomplete · [↑↓] for history · "theme" to customize' },
        { type: 'system', content: '' },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [cmdHistory, setCmdHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [suggestion, setSuggestion] = useState('');
    const [matrixActive, setMatrixActive] = useState(false);
    const [matrixChars, setMatrixChars] = useState<string[][]>([]);
    const [theme, setTheme] = useState<string>('green');
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const t = THEMES[theme] || THEMES.green;

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    useEffect(() => {
        if (!isTyping) inputRef.current?.focus();
    }, [isTyping]);

    // Ghost suggestion
    useEffect(() => {
        if (input.length > 0) {
            const lower = input.toLowerCase();
            const match = BUILTIN_COMMANDS.find(cmd => cmd.startsWith(lower) && cmd !== lower);
            setSuggestion(match || '');
        } else {
            setSuggestion('');
        }
    }, [input]);

    // Live matrix rain
    useEffect(() => {
        if (!matrixActive) return;
        const cols = 40;
        const newChars: string[][] = Array.from({ length: cols }, () =>
            Array.from({ length: 25 }, () => String.fromCharCode(0x30A0 + Math.random() * 96))
        );
        setMatrixChars(newChars);
        const interval = setInterval(() => {
            setMatrixChars(prev => prev.map(col =>
                col.map(() => String.fromCharCode(0x30A0 + Math.random() * 96))
            ));
        }, 100);
        return () => clearInterval(interval);
    }, [matrixActive]);

    const addLines = useCallback((lines: OutputLine[]) => {
        setHistory(prev => [...prev, ...lines]);
    }, []);

    const typeLines = useCallback((text: string, callback?: () => void) => {
        setIsTyping(true);
        const lines = text.split('\n');
        let i = 0;
        const typeNext = () => {
            if (i < lines.length) {
                setHistory(prev => [...prev, { type: 'output', content: lines[i] }]);
                i++;
                setTimeout(typeNext, 20 + Math.random() * 20);
            } else {
                setHistory(prev => [...prev, { type: 'system', content: '' }]);
                setIsTyping(false);
                callback?.();
            }
        };
        setTimeout(typeNext, 100);
    }, []);

    const processCommand = useCallback((cmd: string) => {
        const trimmed = cmd.trim().toLowerCase();

        addLines([{ type: 'input', content: `aagam@aagam-sys ~$ ${cmd}` }]);
        if (cmd.trim()) {
            setCmdHistory(prev => [cmd.trim(), ...prev].slice(0, 50));
        }
        setHistoryIndex(-1);

        if (!trimmed) return;

        // ── BUILT-IN COMMANDS ──

        if (trimmed === 'clear' || trimmed === 'cls') {
            setHistory([{ type: 'system', content: 'Terminal cleared.' }, { type: 'system', content: '' }]);
            return;
        }
        if (trimmed === 'exit' || trimmed === 'quit') {
            addLines([{ type: 'system', content: '> Returning to Mission Control...' }]);
            setTimeout(() => { window.location.href = '/'; }, 1000);
            return;
        }
        if (trimmed === 'github') {
            addLines([{ type: 'system', content: '> Opening GitHub...' }]);
            window.open('https://github.com/AAGAM17', '_blank');
            return;
        }
        if (trimmed === 'linkedin') {
            addLines([{ type: 'system', content: '> Opening LinkedIn...' }]);
            window.open('https://linkedin.com/in/aagamshah', '_blank');
            return;
        }
        if (trimmed === 'resume' || trimmed === 'cv') {
            addLines([{ type: 'system', content: '> Resume available on request — email aagamcshah172005@gmail.com' }]);
            return;
        }

        // ── DYNAMIC DATA COMMANDS ──

        if (trimmed === 'projects') {
            const lines = projects.slice(0, 6).map((p, i) =>
                `  ${String(i + 1).padStart(2)}. ${p.title.padEnd(28)} [${p.techStack.slice(0, 3).join(', ')}]`
            );
            typeLines(`  ╔═══ PROJECT PORTFOLIO ═══╗\n\n${lines.join('\n')}\n\n  ${projects.length} projects total — visit /projects for details`);
            return;
        }
        if (trimmed === 'achievements') {
            const lines = achievements.slice(0, 6).map((a, i) =>
                `  ${String(i + 1).padStart(2)}. ${a.title}`
            );
            typeLines(`  ╔═══ ACHIEVEMENTS ═══╗\n\n${lines.join('\n')}\n\n  ${achievements.length} achievements total — visit /achievements for details`);
            return;
        }
        if (trimmed === 'experience') {
            const lines = experiences.map((e, i) =>
                `  ${String(i + 1).padStart(2)}. ${e.role.padEnd(35)} @ ${e.company}\n      ${e.period}`
            );
            typeLines(`  ╔═══ EXPERIENCE LOG ═══╗\n\n${lines.join('\n\n')}\n\n  ${experiences.length} roles — visit /experience for dossier details`);
            return;
        }

        // ── INFO COMMANDS ──

        if (trimmed === 'date' || trimmed === 'time') {
            addLines([{ type: 'output', content: `  ${new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'long' })}` }, { type: 'system', content: '' }]);
            return;
        }
        if (trimmed === 'whoami') {
            addLines([{ type: 'output', content: '  aagam — Full Stack × AI/ML × Aerospace Systems Engineer' }, { type: 'system', content: '' }]);
            return;
        }
        if (trimmed === 'pwd') {
            addLines([{ type: 'output', content: '  /home/aagam/portfolio' }, { type: 'system', content: '' }]);
            return;
        }
        if (trimmed === 'ls') {
            typeLines('  about.txt    skills.json    projects/    experience/\n  achievements/    vision.md    contact.cfg    .secrets/');
            return;
        }
        if (trimmed === 'cat .secrets') {
            typeLines('  🔐 Permission denied.\n  Just kidding... the secret is: I love building things at 3am ☕');
            return;
        }
        if (trimmed === 'uptime') {
            const now = new Date();
            const born = new Date('2005-06-17');
            const years = Math.floor((now.getTime() - born.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
            const days = Math.floor(((now.getTime() - born.getTime()) % (365.25 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
            addLines([{ type: 'output', content: `  up ${years} years, ${days} days — still shipping code` }, { type: 'system', content: '' }]);
            return;
        }
        if (trimmed === 'fortune' || trimmed === 'quote') {
            const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
            addLines([{ type: 'output', content: `  ${q}` }, { type: 'system', content: '' }]);
            return;
        }
        if (trimmed === 'history') {
            if (cmdHistory.length === 0) {
                addLines([{ type: 'output', content: '  No commands in history yet.' }, { type: 'system', content: '' }]);
            } else {
                const histStr = cmdHistory.slice(0, 15).map((c, i) => `  ${String(i + 1).padStart(3)}  ${c}`).join('\n');
                typeLines(histStr);
            }
            return;
        }
        if (trimmed.startsWith('echo ')) {
            addLines([{ type: 'output', content: `  ${cmd.slice(5)}` }, { type: 'system', content: '' }]);
            return;
        }

        // ── FUN COMMANDS ──

        if (trimmed === 'neofetch') {
            typeLines(
                `       ╱╲          aagam@aagam-sys
      ╱  ╲         ─────────────────
     ╱    ╲        OS:     aagamOS 3.1 LTS
    ╱  ╱╲  ╲       Host:   Mumbai, India
   ╱  ╱  ╲  ╲      Kernel: Deep Tech
  ╱  ╱    ╲  ╲     Shell:  TypeScript + Python
 ╱  ╱   ╱╲ ╲  ╲    DE:     Next.js + Tailwind
╱──╱───╱──╲─╲──╲   WM:     Framer Motion
╲──╲───╲──╱─╱──╱   CPU:    AI/ML × Full Stack
 ╲  ╲   ╲╱ ╱  ╱    GPU:    Computer Vision (OpenCV)
  ╲  ╲    ╱  ╱     RAM:    100K+ lines shipped
   ╲  ╲╱╱  ╱      Disk:   15+ projects deployed
    ╲    ╱         Theme:  ${THEMES[theme].name}
     ╲  ╱          ████████████████████
      ╲╱`
            );
            return;
        }
        if (trimmed === 'banner') {
            typeLines(
                `  
   █████╗  █████╗  ██████╗  █████╗ ███╗   ███╗
  ██╔══██╗██╔══██╗██╔════╝ ██╔══██╗████╗ ████║
  ███████║███████║██║  ███╗███████║██╔████╔██║
  ██╔══██║██╔══██║██║   ██║██╔══██║██║╚██╔╝██║
  ██║  ██║██║  ██║╚██████╔╝██║  ██║██║ ╚═╝ ██║
  ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝
                    .SYS v3.1`
            );
            return;
        }
        if (trimmed === 'ping') {
            typeLines(
                `  PING aagam-sys (127.0.0.1): 56 data bytes
  64 bytes: icmp_seq=0 ttl=64 time=0.042ms
  64 bytes: icmp_seq=1 ttl=64 time=0.038ms
  64 bytes: icmp_seq=2 ttl=64 time=0.041ms
  --- aagam-sys ping statistics ---
  3 packets, 0% loss, avg 0.040ms
  Status: ONLINE ● Ready to ship code`
            );
            return;
        }
        if (trimmed === 'matrix') {
            addLines([{ type: 'system', content: '> Entering the Matrix...' }]);
            setMatrixActive(true);
            setTimeout(() => {
                setMatrixActive(false);
                typeLines(
                    `  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Wake up, Neo...
  The Matrix has you...
  Follow the white rabbit. 🐇

  Just kidding — but my autonomous drones
  ARE the Matrix.
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                );
            }, 4000);
            return;
        }
        if (trimmed === 'sudo rm -rf /') {
            typeLines(
                `  ⚠ WARNING: CRITICAL OPERATION
  Verifying credentials...
  ...
  Access denied. Nice try 😏
  This portfolio is protected by pure vibes.`
            );
            return;
        }

        // ── THEME COMMANDS ──

        if (trimmed === 'theme' || trimmed === 'themes') {
            const themeList = Object.entries(THEMES).map(([key, val]) =>
                `  ${key === theme ? '▸' : ' '} ${key.padEnd(8)} ${val.name}${key === theme ? '  ← active' : ''}`
            ).join('\n');
            typeLines(`  ╔═══ TERMINAL THEMES ═══╗\n\n${themeList}\n\n  Usage: theme <name>  (e.g. "theme cyan")`);
            return;
        }
        if (trimmed.startsWith('theme ')) {
            const newTheme = trimmed.split(' ')[1];
            if (THEMES[newTheme]) {
                setTheme(newTheme);
                addLines([
                    { type: 'system', content: `  ✓ Theme changed to ${THEMES[newTheme].name}` },
                    { type: 'system', content: '' },
                ]);
            } else {
                addLines([
                    { type: 'error', content: `  Unknown theme: ${newTheme}` },
                    { type: 'output', content: `  Available: ${Object.keys(THEMES).join(', ')}` },
                    { type: 'system', content: '' },
                ]);
            }
            return;
        }

        // ── DATA.TS COMMANDS ──
        const response = terminalCommands[trimmed];
        if (response) {
            typeLines(response);
        } else {
            addLines([
                { type: 'error', content: `  command not found: ${cmd}` },
                { type: 'output', content: '  Type "help" for available commands.' },
                { type: 'system', content: '' },
            ]);
        }
    }, [addLines, typeLines, cmdHistory, theme]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            if (suggestion) {
                setInput(suggestion);
                setSuggestion('');
            }
            return;
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (cmdHistory.length > 0) {
                const newIndex = Math.min(historyIndex + 1, cmdHistory.length - 1);
                setHistoryIndex(newIndex);
                setInput(cmdHistory[newIndex]);
            }
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(cmdHistory[newIndex]);
            } else {
                setHistoryIndex(-1);
                setInput('');
            }
            return;
        }
        if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            setHistory([{ type: 'system', content: 'Terminal cleared.' }, { type: 'system', content: '' }]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isTyping) return;
        processCommand(input.trim());
        setInput('');
        setSuggestion('');
    };

    // Dynamic color mapping based on theme
    const getLineColor = (type: string) => {
        switch (type) {
            case 'input': return t.primary.replace('400', '300');
            case 'system': return t.dim;
            case 'ascii': return t.accent;
            case 'error': return 'text-red-400';
            default: return t.primary.replace('text-', 'text-').replace('400', '400/80');
        }
    };

    // Theme-aware accent hex for caret and matrix
    const accentHex: Record<string, string> = {
        green: '#4ade80', cyan: '#22d3ee', amber: '#fbbf24',
        violet: '#a78bfa', rose: '#fb7185', blue: '#60a5fa',
    };

    return (
        <div className={`min-h-screen ${t.bg} relative font-mono ${t.primary} cursor-text`} onClick={() => inputRef.current?.focus()}>
            {/* CRT scan lines */}
            <div className="crt-overlay" />
            <div className="fixed inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 150px rgba(0,0,0,0.7)' }} />

            {/* Matrix rain */}
            {matrixActive && (
                <div className="fixed inset-0 z-30 pointer-events-none overflow-hidden">
                    {matrixChars.map((col, i) => (
                        <div key={i} className="absolute top-0 flex flex-col items-center" style={{ left: `${(i / matrixChars.length) * 100}%`, animationDelay: `${Math.random() * 2}s` }}>
                            {col.map((char, j) => (
                                <span
                                    key={j}
                                    className="text-xs leading-none"
                                    style={{
                                        color: accentHex[theme] || '#4ade80',
                                        opacity: j === 0 ? 1 : Math.max(0.05, 1 - j * 0.06),
                                        textShadow: j < 3 ? `0 0 8px ${accentHex[theme] || '#4ade80'}` : 'none',
                                        animationDelay: `${Math.random() * 3}s`,
                                    }}
                                >
                                    {char}
                                </span>
                            ))}
                        </div>
                    ))}
                    {/* Glowing overlay */}
                    <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${accentHex[theme]}10 0%, transparent 70%)` }} />
                </div>
            )}

            {/* Exit hint */}
            <div className="fixed top-3 right-4 z-50">
                <Link href="/" className={`text-[9px] font-mono ${t.dim} hover:${t.primary} transition-colors tracking-wider`}>
                    [ESC] EXIT
                </Link>
            </div>

            {/* Theme indicator */}
            <div className="fixed top-3 left-4 z-50">
                <span className={`text-[9px] font-mono ${t.dim} tracking-wider`}>
                    ● {THEMES[theme].name.toUpperCase()}
                </span>
            </div>

            {/* Terminal content */}
            <div className="max-w-3xl mx-auto px-6 py-8 min-h-screen flex flex-col">
                <div className="flex-1 space-y-0.5">
                    {history.map((line, i) => (
                        <motion.div
                            key={`${i}-${(line.content ?? '').slice(0, 20)}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.05 }}
                            className={getLineColor(line.type)}
                        >
                            <pre className="whitespace-pre-wrap text-sm leading-relaxed">{line.content ?? ''}</pre>
                        </motion.div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                {/* Input prompt */}
                <form onSubmit={handleSubmit} className="sticky bottom-0 py-4 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
                    <div className="flex items-center gap-2">
                        <span className={`${t.prompt} text-sm shrink-0`}>aagam@aagam-sys ~$</span>
                        <div className="flex-1 relative">
                            {/* Ghost suggestion */}
                            {suggestion && input.length > 0 && (
                                <span className={`absolute inset-0 text-sm ${t.dim} pointer-events-none flex items-center`}>
                                    <span className="invisible">{input}</span>
                                    <span>{suggestion.slice(input.length)}</span>
                                    <span className={`${t.dim} text-[10px] ml-3 opacity-60`}>[TAB]</span>
                                </span>
                            )}
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isTyping}
                                className={`w-full bg-transparent ${t.primary} text-sm outline-none relative z-10`}
                                style={{ caretColor: accentHex[theme] || '#4ade80' }}
                                placeholder={isTyping ? 'processing...' : 'type a command...'}
                                autoComplete="off"
                                spellCheck="false"
                                autoFocus
                            />
                        </div>
                    </div>
                    {isTyping && (
                        <div className={`mt-1 ml-[calc(theme(spacing.2)+11ch)] flex items-center gap-2 text-[10px] ${t.dim}`}>
                            <span className="inline-block w-3 h-3 border-2 rounded-full animate-spin" style={{ borderColor: accentHex[theme] || '#4ade80', borderTopColor: 'transparent' }} />
                            processing...
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
