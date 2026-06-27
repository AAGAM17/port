// ════════════════════════════════════════════════════════════
//  MIND · POINT-CLOUD GENERATORS
//  Pure, deterministic generators for the body→brain morph.
//   • sampleBody  — points sampled from a humanoid silhouette
//                   (rasterised on an offscreen canvas, outline-weighted)
//   • sampleBrain — procedural twin-hemisphere shell with ridged-noise folds
//  Each returns a Float32Array of length count*3. Same `count` → 1:1 morph.
// ════════════════════════════════════════════════════════════

export interface Cloud {
    positions: Float32Array; // count * 3
}

// ── seeded RNG (mulberry32) ──────────────────────────────────
function mulberry32(seed: number) {
    let s = seed >>> 0;
    return () => {
        s = (s + 0x6d2b79f5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// ── adaptive particle budget ─────────────────────────────────
export function recommendedParticleCount(): number {
    if (typeof window === 'undefined') return 9000;
    const w = window.innerWidth;
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    if (w < 640 || mem <= 4) return 6000;
    if (w < 1100) return 11000;
    return 16000;
}

// ════════════════════════════════════════════════════════════
//  BODY — sampled from a drawn humanoid silhouette
// ════════════════════════════════════════════════════════════

const BODY_W = 240;
const BODY_H = 560;
const BODY_WORLD_H = 5.4; // world units tall

function drawHumanoid(ctx: CanvasRenderingContext2D) {
    const cx = BODY_W / 2;
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#fff';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // head
    ctx.beginPath();
    ctx.ellipse(cx, BODY_H * 0.1, BODY_W * 0.085, BODY_H * 0.058, 0, 0, Math.PI * 2);
    ctx.fill();

    // neck
    ctx.lineWidth = BODY_W * 0.09;
    line(ctx, cx, BODY_H * 0.15, cx, BODY_H * 0.19);

    // torso (tapered trapezoid: broad shoulders → waist)
    const shoulderY = BODY_H * 0.2;
    const waistY = BODY_H * 0.49;
    ctx.beginPath();
    ctx.moveTo(cx - BODY_W * 0.2, shoulderY);
    ctx.lineTo(cx + BODY_W * 0.2, shoulderY);
    ctx.lineTo(cx + BODY_W * 0.135, waistY);
    ctx.lineTo(cx - BODY_W * 0.135, waistY);
    ctx.closePath();
    ctx.fill();

    // arms (shoulder → elbow → wrist), slight outward splay
    ctx.lineWidth = BODY_W * 0.072;
    line(ctx, cx - BODY_W * 0.18, shoulderY + 6, cx - BODY_W * 0.26, BODY_H * 0.34);
    line(ctx, cx - BODY_W * 0.26, BODY_H * 0.34, cx - BODY_W * 0.28, BODY_H * 0.5);
    line(ctx, cx + BODY_W * 0.18, shoulderY + 6, cx + BODY_W * 0.26, BODY_H * 0.34);
    line(ctx, cx + BODY_W * 0.26, BODY_H * 0.34, cx + BODY_W * 0.28, BODY_H * 0.5);

    // legs (hip → knee → ankle)
    ctx.lineWidth = BODY_W * 0.092;
    line(ctx, cx - BODY_W * 0.075, waistY, cx - BODY_W * 0.1, BODY_H * 0.74);
    line(ctx, cx - BODY_W * 0.1, BODY_H * 0.74, cx - BODY_W * 0.105, BODY_H * 0.97);
    line(ctx, cx + BODY_W * 0.075, waistY, cx + BODY_W * 0.1, BODY_H * 0.74);
    line(ctx, cx + BODY_W * 0.1, BODY_H * 0.74, cx + BODY_W * 0.105, BODY_H * 0.97);
}

function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

export function sampleBody(count: number, seed = 3): Cloud {
    const rand = mulberry32(seed);
    const positions = new Float32Array(count * 3);

    // SSR / no-canvas fallback → vertical scatter (never actually rendered server-side)
    if (typeof document === 'undefined') {
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (rand() - 0.5) * 2;
            positions[i * 3 + 1] = (rand() - 0.5) * BODY_WORLD_H;
            positions[i * 3 + 2] = (rand() - 0.5) * 0.6;
        }
        return { positions };
    }

    const canvas = document.createElement('canvas');
    canvas.width = BODY_W;
    canvas.height = BODY_H;
    const ctx = canvas.getContext('2d')!;
    drawHumanoid(ctx);
    const data = ctx.getImageData(0, 0, BODY_W, BODY_H).data;

    const filledAt = (x: number, y: number) =>
        x >= 0 && y >= 0 && x < BODY_W && y < BODY_H && data[(y * BODY_W + x) * 4 + 3] > 40;

    const boundary: number[] = [];
    const interior: number[] = [];
    for (let y = 0; y < BODY_H; y++) {
        for (let x = 0; x < BODY_W; x++) {
            if (data[(y * BODY_W + x) * 4 + 3] <= 40) continue;
            const idx = y * BODY_W + x;
            if (!filledAt(x - 1, y) || !filledAt(x + 1, y) || !filledAt(x, y - 1) || !filledAt(x, y + 1)) {
                boundary.push(idx);
            } else {
                interior.push(idx);
            }
        }
    }

    const scale = BODY_WORLD_H / BODY_H;
    const pick = (arr: number[]) => arr[(rand() * arr.length) | 0];

    for (let i = 0; i < count; i++) {
        // outline-weighted: ~64% trace the silhouette edge, the rest fill the volume
        const useOutline = boundary.length > 0 && (interior.length === 0 || rand() < 0.64);
        const idx = useOutline ? pick(boundary) : pick(interior);
        const px = idx % BODY_W;
        const py = (idx / BODY_W) | 0;
        positions[i * 3] = (px - BODY_W / 2) * scale + (rand() - 0.5) * 0.015;
        positions[i * 3 + 1] = (BODY_H / 2 - py) * scale + (rand() - 0.5) * 0.015;
        positions[i * 3 + 2] = (rand() - 0.5) * 0.4; // gentle depth so it isn't paper-flat
    }
    return { positions };
}

// ════════════════════════════════════════════════════════════
//  BRAIN — procedural twin-hemisphere shell, ridged-noise folds
// ════════════════════════════════════════════════════════════

function makeNoise3(seed: number) {
    const perm = new Uint8Array(512);
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    const r = mulberry32(seed ^ 0x9e3779b9);
    for (let i = 255; i > 0; i--) {
        const j = (r() * (i + 1)) | 0;
        const t = p[i];
        p[i] = p[j];
        p[j] = t;
    }
    for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const grad = (h: number, x: number, y: number, z: number) => {
        const g = h & 15;
        const u = g < 8 ? x : y;
        const v = g < 4 ? y : g === 12 || g === 14 ? x : z;
        return ((g & 1) === 0 ? u : -u) + ((g & 2) === 0 ? v : -v);
    };

    return (x: number, y: number, z: number) => {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const Z = Math.floor(z) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);
        z -= Math.floor(z);
        const u = fade(x);
        const v = fade(y);
        const w = fade(z);
        const A = perm[X] + Y;
        const AA = perm[A] + Z;
        const AB = perm[A + 1] + Z;
        const B = perm[X + 1] + Y;
        const BA = perm[B] + Z;
        const BB = perm[B + 1] + Z;
        return lerp(
            lerp(
                lerp(grad(perm[AA], x, y, z), grad(perm[BA], x - 1, y, z), u),
                lerp(grad(perm[AB], x, y - 1, z), grad(perm[BB], x - 1, y - 1, z), u),
                v,
            ),
            lerp(
                lerp(grad(perm[AA + 1], x, y, z - 1), grad(perm[BA + 1], x - 1, y, z - 1), u),
                lerp(grad(perm[AB + 1], x, y - 1, z - 1), grad(perm[BB + 1], x - 1, y - 1, z - 1), u),
                v,
            ),
            w,
        );
    };
}

// brain dimensions (world units) — wider & longer than tall
export const BRAIN = { rx: 2.05, ry: 1.5, rz: 2.45 };

export function sampleBrain(count: number, seed = 7): Cloud {
    const rand = mulberry32(seed);
    const noise = makeNoise3(seed);
    const positions = new Float32Array(count * 3);

    const gap = 0.16; // hemisphere separation
    const foldFreq = 2.1;
    const foldAmp = 0.36;

    const cerebellumStart = Math.floor(count * 0.93);

    for (let i = 0; i < count; i++) {
        // cerebellum — small dense cluster, lower & toward the back
        if (i >= cerebellumStart) {
            const a = rand() * Math.PI * 2;
            const b = Math.acos(2 * rand() - 1);
            const r = 0.6 * Math.cbrt(rand());
            positions[i * 3] = Math.sin(b) * Math.cos(a) * r;
            positions[i * 3 + 1] = -1.05 + Math.cos(b) * r * 0.55;
            positions[i * 3 + 2] = -1.65 + Math.sin(b) * Math.sin(a) * r * 0.85;
            continue;
        }

        const side = i % 2 === 0 ? -1 : 1;
        const u = rand();
        const v = rand();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const dx = Math.sin(phi) * Math.cos(theta);
        const dy = Math.cos(phi);
        const dz = Math.sin(phi) * Math.sin(theta);

        let bx = dx * BRAIN.rx + side * gap * BRAIN.rx;
        let by = dy * BRAIN.ry;
        let bz = dz * BRAIN.rz;

        // ridged fbm displacement along the surface normal → gyri / sulci
        let n = 0;
        let amp = 0.5;
        let freq = foldFreq;
        for (let o = 0; o < 4; o++) {
            n += (1 - Math.abs(noise(bx * freq, by * freq, bz * freq))) * amp;
            amp *= 0.5;
            freq *= 2;
        }
        const disp = (n - 0.62) * foldAmp;
        bx += dx * disp;
        by += dy * disp;
        bz += dz * disp;

        // central longitudinal fissure
        const fissure = Math.exp(-(bx * bx) / 0.03);
        by -= fissure * 0.2;

        // flatten the underside slightly
        if (by < -0.3) by *= 0.82;

        positions[i * 3] = bx;
        positions[i * 3 + 1] = by;
        positions[i * 3 + 2] = bz;
    }

    return { positions };
}
