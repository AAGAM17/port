'use client';

import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { personalInfo } from '@/lib/data';
import { Github, Linkedin, Mail, FileText } from 'lucide-react';

const socialLinks = [
    { href: personalInfo.github, icon: Github, label: 'PORT:GH', code: '443' },
    { href: personalInfo.linkedin, icon: Linkedin, label: 'PORT:LI', code: '8080' },
    { href: `mailto:${personalInfo.email}`, icon: Mail, label: 'PORT:SMTP', code: '25' },
    { href: personalInfo.resume, icon: FileText, label: 'PORT:DOC', code: '21' },
];

export function Footer() {
    return (
        <footer className="relative border-t border-cyan-400/10 bg-space-950/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* System Status */}
                    <div>
                        <p className="text-xs font-mono tracking-[0.2em] text-gray-600 mb-3">SYSTEM STATUS</p>
                        <div className="flex flex-col gap-2">
                            <StatusIndicator status="online" label="ALL SYSTEMS OPERATIONAL" />
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-gray-600">UPTIME: 99.9%</span>
                                <span className="text-xs font-mono text-gray-700">|</span>
                                <span className="text-xs font-mono text-gray-600">v2.0.0</span>
                            </div>
                        </div>
                    </div>

                    {/* Social Ports */}
                    <div>
                        <p className="text-xs font-mono tracking-[0.2em] text-gray-600 mb-3">OPEN PORTS</p>
                        <div className="grid grid-cols-2 gap-2">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-gray-500 hover:text-cyan-400 transition-colors group"
                                >
                                    <link.icon size={14} className="group-hover:drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]" />
                                    <span className="text-xs font-mono tracking-wider">{link.label}</span>
                                    <span className="text-[10px] font-mono text-gray-700">:{link.code}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Coordinates */}
                    <div className="text-right">
                        <p className="text-xs font-mono tracking-[0.2em] text-gray-600 mb-3">TERMINAL</p>
                        <a
                            href="/terminal"
                            className="text-xs font-mono text-gray-600 hover:text-cyan-400 transition-colors"
                        >
                            $ ssh aagam@portfolio
                        </a>
                        <p className="text-xs font-mono text-gray-700 mt-2">
                            Mumbai, IN | 19.0760°N, 72.8777°E
                        </p>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-4 border-t border-gray-800/50">
                    <p className="text-center text-xs font-mono text-gray-700 tracking-wider">
                        © {new Date().getFullYear()} AAGAM SHAH — ENGINEERED WITH PRECISION
                    </p>
                </div>
            </div>
        </footer>
    );
}
