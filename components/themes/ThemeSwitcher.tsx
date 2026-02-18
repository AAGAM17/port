'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, THEMES, ThemeId } from './ThemeContext';
import { Palette, X } from 'lucide-react';

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                onClick={() => setOpen(true)}
                className="fixed bottom-20 right-6 z-[9998] w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all group"
                style={{
                    background: theme === 'default'
                        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
                        : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    border: `1px solid ${THEMES.find(t => t.id === theme)?.color || '#22d3ee'}40`,
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="Switch Theme"
            >
                <Palette size={18} className="text-white/80 group-hover:text-white transition-colors" />
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: THEMES.find(t => t.id === theme)?.color }} />
            </motion.button>

            {/* Theme Picker Modal */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed z-[10000] bottom-24 right-6 w-[360px] max-h-[80vh] overflow-y-auto rounded-2xl bg-[#0f172a] border border-white/10 shadow-2xl"
                        >
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">Switch Theme</h3>
                                        <p className="text-[10px] text-gray-500 font-mono mt-0.5">Pick a UI skin for the entire site</p>
                                    </div>
                                    <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors">
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {THEMES.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => { setTheme(t.id as ThemeId); setOpen(false); }}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group ${theme === t.id
                                                ? 'bg-white/10 border border-white/20'
                                                : 'hover:bg-white/5 border border-transparent'
                                                }`}
                                        >
                                            <span className="text-2xl w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: `${t.color}15` }}>
                                                {t.icon}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-white">{t.name}</span>
                                                    {theme === t.id && (
                                                        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-full bg-white/10 text-white/60">ACTIVE</span>
                                                    )}
                                                </div>
                                                <span className="text-[11px] text-gray-500">{t.description}</span>
                                            </div>
                                            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: t.color, boxShadow: theme === t.id ? `0 0 12px ${t.color}60` : 'none' }} />
                                        </button>
                                    ))}
                                </div>

                                <p className="text-[9px] text-gray-600 font-mono text-center mt-4">Theme persists across refreshes</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
