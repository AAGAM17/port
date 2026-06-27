// ════════════════════════════════════════════════════════════
//  MIND · JOURNEY TIMELINE
//  Single source of truth for the camera flight and morph timing.
//  Scroll progress (0→1) drives everything; overlays in the DOM
//  align to the same fractions via 100vh sections (see ACTS).
// ════════════════════════════════════════════════════════════

import type { Vector3 } from 'three';

export type Vec3 = [number, number, number];

export interface ActMeta {
    id: string;
    label: string;
    index: number; // section index (0-based) in the scroll stack
}

// 7 sections, each ~1/7 of the scroll. Order = scroll order.
export const ACTS: ActMeta[] = [
    { id: 'intro', label: 'Origin', index: 0 },
    { id: 'descent', label: 'Descent', index: 1 },
    { id: 'skills', label: 'Synapses', index: 2 },
    { id: 'projects', label: 'Built', index: 3 },
    { id: 'achievements', label: 'Proof', index: 4 },
    { id: 'experience', label: 'Path', index: 5 },
    { id: 'finale', label: 'Invitation', index: 6 },
];

export const SECTION_COUNT = ACTS.length;

// ── easing ───────────────────────────────────────────────────
const smoothstep = (t: number) => {
    const x = Math.min(1, Math.max(0, t));
    return x * x * (3 - 2 * x);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ── body → brain morph window ────────────────────────────────
// Particles hold the body until 8% scroll, fully a brain by 30%.
export function morphProgress(scroll: number): number {
    return smoothstep((scroll - 0.08) / (0.3 - 0.08));
}

// ── camera keyframes (position + lookAt target) ──────────────
interface Key {
    at: number;
    pos: Vec3;
    target: Vec3;
}

const KEYS: Key[] = [
    { at: 0.0, pos: [0, 0.1, 9.5], target: [0, 0, 0] }, // full body, far
    { at: 0.1, pos: [0.2, 0.35, 7.6], target: [0, 0.4, 0] }, // push toward the head as it dissolves
    { at: 0.24, pos: [0, 0.2, 3.5], target: [0, 0, 0] }, // brain formed, framed whole
    { at: 0.36, pos: [0.15, 0.15, 1.25], target: [0.25, 0, -0.9] }, // inside — skills
    { at: 0.5, pos: [-0.95, -0.05, 0.15], target: [0.4, -0.1, -1.25] }, // weave deeper — projects
    { at: 0.64, pos: [0.85, 0.45, -0.15], target: [-0.35, 0.1, -1.4] }, // achievements
    { at: 0.78, pos: [0.1, 0.35, 3.2], target: [0, 0, 0] }, // pull out — experience
    { at: 0.93, pos: [0, 0.15, 7.2], target: [0, 0, 0] }, // finale, distant & calm
    { at: 1.0, pos: [0, 0.1, 8.0], target: [0, 0, 0] },
];

/** Writes the interpolated camera position + lookAt target for a scroll value. */
export function sampleCamera(scroll: number, outPos: Vector3, outTarget: Vector3): void {
    const p = Math.min(1, Math.max(0, scroll));

    let i = 0;
    while (i < KEYS.length - 1 && p > KEYS[i + 1].at) i++;
    const a = KEYS[i];
    const b = KEYS[Math.min(i + 1, KEYS.length - 1)];
    const span = b.at - a.at || 1;
    const t = smoothstep((p - a.at) / span);

    outPos.set(
        lerp(a.pos[0], b.pos[0], t),
        lerp(a.pos[1], b.pos[1], t),
        lerp(a.pos[2], b.pos[2], t),
    );
    outTarget.set(
        lerp(a.target[0], b.target[0], t),
        lerp(a.target[1], b.target[1], t),
        lerp(a.target[2], b.target[2], t),
    );
}

/** Section fraction → centre scroll value (for aligning overlays / the HUD rail). */
export function sectionCenter(index: number): number {
    return (index + 0.5) / SECTION_COUNT;
}
