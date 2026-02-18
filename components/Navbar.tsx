'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { navLinks } from '@/lib/data';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { cn } from '@/lib/utils';

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [time, setTime] = useState('');

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(
                now.toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                })
            );
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <nav
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                    scrolled
                        ? 'bg-space-950/80 backdrop-blur-xl border-b border-cyan-400/10'
                        : 'bg-transparent'
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <StatusIndicator status="online" />
                            <span className="font-mono text-sm tracking-[0.15em] text-gray-300 group-hover:text-cyan-400 transition-colors">
                                AAGAM.SYS
                            </span>
                            <span className="hidden sm:inline text-xs font-mono text-gray-600">v2.0</span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            'relative px-3 py-2 text-xs font-mono tracking-wider transition-all duration-200',
                                            isActive
                                                ? 'text-cyan-400'
                                                : 'text-gray-500 hover:text-gray-300'
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="navbar-active"
                                                className="absolute inset-0 bg-cyan-400/10 rounded border border-cyan-400/20"
                                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                            />
                                        )}
                                        <span className="relative z-10">{link.label}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* System Clock + Coords */}
                        <div className="hidden lg:flex items-center gap-4">
                            <span className="text-xs font-mono text-gray-600 tracking-wider">
                                19.0760°N 72.8777°E
                            </span>
                            <span className="text-xs font-mono text-cyan-400/60 tabular-nums">
                                {time || '--:--:--'}
                            </span>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden p-2 text-gray-400 hover:text-cyan-400 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                        className="fixed inset-0 z-40 lg:hidden"
                    >
                        <div className="absolute inset-0 bg-space-950/95 backdrop-blur-xl grid-overlay" />
                        <div className="relative flex flex-col items-center justify-center h-full gap-2">
                            {navLinks.map((link, i) => {
                                const isActive = pathname === link.href;
                                return (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05, duration: 0.3 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className={cn(
                                                'block px-6 py-3 text-sm font-mono tracking-[0.2em] transition-colors',
                                                isActive ? 'text-cyan-400' : 'text-gray-400 hover:text-gray-200'
                                            )}
                                        >
                                            <span className="text-gray-600 mr-3">{link.code}</span>
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
