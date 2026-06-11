'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeId = 'default' | 'galaxy' | 'generic' | 'google' | 'newspaper' | 'vscode';

export interface ThemeInfo {
    id: ThemeId;
    name: string;
    icon: string;
    description: string;
    color: string;
}

export const THEMES: ThemeInfo[] = [
    { id: 'default', name: 'Aagam Shah', icon: 'A', description: 'The cinematic original', color: '#22d3ee' },
    { id: 'galaxy', name: 'Galaxy', icon: '✦', description: 'Skills as a living Milky Way', color: '#a78bfa' },
    { id: 'generic', name: 'Generic', icon: 'Aa', description: 'The beautiful, classic portfolio', color: '#9a3b1e' },
    { id: 'google', name: 'Google Search', icon: 'G', description: 'Google yourself — results included', color: '#4285f4' },
    { id: 'newspaper', name: 'The Daily Aagam', icon: '¶', description: 'Morning broadsheet edition', color: '#8b7355' },
    { id: 'vscode', name: 'VS Code', icon: '{}', description: 'The portfolio as an IDE', color: '#007acc' },
];

interface ThemeContextType {
    theme: ThemeId;
    setTheme: (theme: ThemeId) => void;
    themeInfo: ThemeInfo;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'default',
    setTheme: () => { },
    themeInfo: THEMES[0],
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<ThemeId>('default');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('portfolio-theme') as ThemeId | null;
        if (saved && THEMES.find(t => t.id === saved)) {
            setThemeState(saved);
        }
        setMounted(true);
    }, []);

    const setTheme = (t: ThemeId) => {
        setThemeState(t);
        localStorage.setItem('portfolio-theme', t);
    };

    const themeInfo = THEMES.find(t => t.id === theme) || THEMES[0];

    if (!mounted) return <>{children}</>;

    return (
        <ThemeContext.Provider value={{ theme, setTheme, themeInfo }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
