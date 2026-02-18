'use client';

import { ReactNode } from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';
import ThemeSwitcher from './ThemeSwitcher';
import GoogleTheme from './GoogleTheme';
import MacOSTheme from './MacOSTheme';
import Win95Theme from './Win95Theme';
import NewspaperTheme from './NewspaperTheme';
import VSCodeTheme from './VSCodeTheme';

function ThemeOverlay() {
    const { theme } = useTheme();

    switch (theme) {
        case 'google': return <GoogleTheme />;
        // case 'macos': return <MacOSTheme />;
        // case 'win95': return <Win95Theme />;
        case 'newspaper': return <NewspaperTheme />;
        case 'vscode': return <VSCodeTheme />;
        default: return null;
    }
}

function ThemeContent({ children }: { children: ReactNode }) {
    const { theme } = useTheme();
    const isDefault = theme === 'default';

    return (
        <>
            {/* Theme overlay (full screen) — replaces default site */}
            {!isDefault && (
                <div className="fixed inset-0 z-[100] overflow-y-auto" style={{ backgroundColor: '#000' }}>
                    <ThemeOverlay />
                </div>
            )}

            {/* Default site content — hidden when overlay active */}
            <div style={{ display: isDefault ? 'block' : 'none' }}>
                {children}
            </div>

            {/* Theme switcher FAB — always visible */}
            <ThemeSwitcher />
        </>
    );
}

export default function ThemeLayout({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <ThemeContent>{children}</ThemeContent>
        </ThemeProvider>
    );
}
