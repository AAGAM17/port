'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { navLinks } from '@/lib/data';
import {
    Search, Command, Home, User, FolderKanban, Brain, Trophy,
    Briefcase, Lightbulb, Terminal, Mail, ArrowRight, type LucideIcon,
} from 'lucide-react';

/* ═══════════════════════════════════════
   COMMAND PALETTE (⌘/Ctrl + K)
   Global navigation spotlight — works on 
   every page. Glassmorphism card with search.
   ═══════════════════════════════════════ */

const pageIcons: Record<string, LucideIcon> = {
    '/': Home,
    '/about': User,
    '/projects': FolderKanban,
    '/skills': Brain,
    '/achievements': Trophy,
    '/experience': Briefcase,
    '/vision': Lightbulb,
    '/terminal': Terminal,
    '/contact': Mail,
};

const pageDescriptions: Record<string, string> = {
    '/': 'Mission Control — Dashboard',
    '/about': 'Story, timeline & testimonials',
    '/projects': 'R&D Lab — All builds',
    '/skills': 'Neural constellation map',
    '/achievements': 'The Aagam Journal',
    '/experience': 'Engineering notebook',
    '/vision': 'Founder\'s thesis & roadmap',
    '/terminal': 'Hacker terminal (CRT)',
    '/contact': 'Communication interface',
};

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const filtered = navLinks.filter(
        (link) =>
            link.label.toLowerCase().includes(query.toLowerCase()) ||
            link.code.toLowerCase().includes(query.toLowerCase()) ||
            (pageDescriptions[link.href] || '').toLowerCase().includes(query.toLowerCase())
    );

    // Add terminal if not in navLinks but matches
    const allItems = [
        ...filtered,
        ...(!filtered.find(f => f.href === '/terminal') && 'terminal'.includes(query.toLowerCase())
            ? [{ href: '/terminal', label: 'TERMINAL', code: '~/tty' }]
            : []),
    ];

    const navigate = useCallback((href: string) => {
        setOpen(false);
        setQuery('');
        router.push(href);
    }, [router]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Open/close
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setOpen(prev => !prev);
                setQuery('');
                setSelectedIndex(0);
            }
            if (e.key === 'Escape') {
                setOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    // Arrow key navigation
    useEffect(() => {
        if (!open) return;
        const handleNav = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, allItems.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (allItems[selectedIndex]) navigate(allItems[selectedIndex].href);
            }
        };
        window.addEventListener('keydown', handleNav);
        return () => window.removeEventListener('keydown', handleNav);
    }, [open, selectedIndex, allItems, navigate]);

    // Reset index on query change
    useEffect(() => { setSelectedIndex(0); }, [query]);

    return (
        <>
            {/* Floating trigger hint */}
            <button
                onClick={() => { setOpen(true); setQuery(''); setSelectedIndex(0); }}
                className="fixed bottom-6 left-6 z-30 hidden md:flex items-center gap-2 px-3 py-2 text-[10px] font-mono text-gray-600 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg hover:border-gray-700 hover:text-gray-400 transition-all"
            >
                <Command size={11} />
                <span>K</span>
            </button>

            {/* Modal */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[20vh]"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg mx-4 bg-gray-950/95 border border-gray-800/80 rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
                        >
                            {/* Search input */}
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800/50">
                                <Search size={16} className="text-gray-600 shrink-0" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Where do you want to go?"
                                    className="flex-1 bg-transparent text-sm text-gray-200 outline-none placeholder:text-gray-700 font-mono"
                                    spellCheck="false"
                                    autoComplete="off"
                                />
                                <kbd className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono text-gray-700 bg-gray-900 border border-gray-800 rounded">
                                    ESC
                                </kbd>
                            </div>

                            {/* Results */}
                            <div className="py-2 max-h-[50vh] overflow-y-auto">
                                {allItems.length === 0 ? (
                                    <div className="px-5 py-8 text-center text-sm text-gray-700 font-mono">
                                        No destinations found
                                    </div>
                                ) : (
                                    <>
                                        <div className="px-5 py-1.5 text-[9px] font-mono text-gray-700 tracking-[0.3em]">
                                            NAVIGATE TO
                                        </div>
                                        {allItems.map((item, i) => {
                                            const Icon = pageIcons[item.href] || ArrowRight;
                                            const desc = pageDescriptions[item.href] || '';
                                            const isSelected = i === selectedIndex;
                                            return (
                                                <button
                                                    key={item.href}
                                                    onClick={() => navigate(item.href)}
                                                    onMouseEnter={() => setSelectedIndex(i)}
                                                    className={`w-full flex items-center gap-4 px-5 py-3 text-left transition-colors ${isSelected
                                                        ? 'bg-cyan-400/5 text-white'
                                                        : 'text-gray-500 hover:bg-gray-900/50'
                                                        }`}
                                                >
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-cyan-400/10 text-cyan-400' : 'bg-gray-900 text-gray-600'
                                                        }`}>
                                                        <Icon size={15} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className={`text-sm font-medium block ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                                                            {item.label}
                                                        </span>
                                                        <span className="text-[10px] font-mono text-gray-700 block truncate">{desc}</span>
                                                    </div>
                                                    <span className={`text-[9px] font-mono tracking-wider ${isSelected ? 'text-cyan-400/60' : 'text-gray-800'}`}>
                                                        {item.code}
                                                    </span>
                                                    {isSelected && <ArrowRight size={12} className="text-cyan-400/60 shrink-0" />}
                                                </button>
                                            );
                                        })}
                                    </>
                                )}
                            </div>

                            {/* Footer hints */}
                            <div className="px-5 py-3 border-t border-gray-800/50 flex items-center gap-4 text-[9px] font-mono text-gray-700">
                                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-gray-900 border border-gray-800 rounded text-[8px]">↑↓</kbd> navigate</span>
                                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-gray-900 border border-gray-800 rounded text-[8px]">↵</kbd> select</span>
                                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-gray-900 border border-gray-800 rounded text-[8px]">esc</kbd> close</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
