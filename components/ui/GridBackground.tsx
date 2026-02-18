'use client';

export function GridBackground() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            {/* Grid lines */}
            <div className="absolute inset-0 grid-overlay opacity-60" />

            {/* Radial gradient from center */}
            <div className="absolute inset-0 bg-gradient-radial" />

            {/* Radar sweep */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03]">
                <div className="absolute inset-0 rounded-full border border-cyan-400/20" />
                <div className="absolute inset-[15%] rounded-full border border-cyan-400/15" />
                <div className="absolute inset-[30%] rounded-full border border-cyan-400/10" />
                <div className="absolute inset-[45%] rounded-full border border-cyan-400/5" />
                <div
                    className="absolute top-1/2 left-1/2 w-1/2 h-[2px] origin-left animate-radar"
                    style={{
                        background: 'linear-gradient(90deg, rgba(34,211,238,0.4), transparent)',
                    }}
                />
            </div>

            {/* Scan line */}
            <div
                className="absolute left-0 right-0 h-[1px] animate-scan-line opacity-20"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.5), transparent)',
                }}
            />

            {/* Vignette */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 40%, rgba(3,7,18,0.8) 100%)',
                }}
            />
        </div>
    );
}
