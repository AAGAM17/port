import type { Metadata } from 'next';
import './globals.css';
import CommandPalette from '@/components/CommandPalette';
import ThemeLayout from '@/components/themes/ThemeLayout';

export const metadata: Metadata = {
    title: 'Aagam Shah | Full Stack × AI × Deep Tech',
    description: 'Portfolio of Aagam Shah — Full Stack Developer, AI/ML Engineer, and Systems Architect building at the intersection of autonomous intelligence and deep tech.',
    keywords: ['Aagam Shah', 'Full Stack Developer', 'AI Engineer', 'Aerospace', 'SAE Aero Design', 'Portfolio'],
    openGraph: {
        title: 'Aagam Shah | Full Stack × AI × Deep Tech',
        description: 'Building the future of autonomous intelligence.',
        type: 'website',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=JetBrains+Mono:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700&family=Chakra+Petch:wght@300;400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,400;1,9..144,500;1,9..144,600;1,9..144,700&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,300;1,6..72,400;1,6..72,500&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="noise-overlay">
                <ThemeLayout>
                    <CommandPalette />
                    {children}
                </ThemeLayout>
            </body>
        </html>
    );
}

