// ════════════════════════════════════════════════════════════
//  MIND · SPATIAL LAYOUT OF DATA
//  Places real portfolio data inside the brain volume:
//   • skill nodes — grouped by cluster into lobes, wired by the
//     real `connections` graph from lib/data.ts
//   • project orbs — larger structures, deeper in, category-coloured
// ════════════════════════════════════════════════════════════

import { skills, projects, clusterColors, type SkillCluster, type ProjectCategory } from '@/lib/data';
import type { Vec3 } from './journey';

function rng(seed: number) {
    let s = seed >>> 0;
    return () => {
        s = (s + 0x6d2b79f5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// each cluster occupies a lobe inside the brain
const CLUSTER_DIR: Record<SkillCluster, Vec3> = {
    ai: [-0.55, 0.5, 0.5],
    fullstack: [0.62, 0.18, 0.5],
    aerospace: [0.05, 0.55, -0.72],
    embedded: [-0.32, -0.52, -0.15],
    robotics: [0.45, -0.32, 0.42],
};

function normalize(v: Vec3): Vec3 {
    const l = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / l, v[1] / l, v[2] / l];
}

export interface SkillNode {
    id: string;
    name: string;
    cluster: SkillCluster;
    proficiency: number;
    color: string;
    position: Vec3;
    radius: number;
}

export function buildSkillNodes(): SkillNode[] {
    const rand = rng(91);
    return skills.map((s) => {
        const dir = normalize(CLUSTER_DIR[s.cluster]);
        const base = 1.35 + rand() * 0.35;
        const spread = 0.6;
        const position: Vec3 = [
            dir[0] * base + (rand() - 0.5) * spread,
            dir[1] * base + (rand() - 0.5) * spread,
            dir[2] * base + (rand() - 0.5) * spread,
        ];
        return {
            id: s.id,
            name: s.name,
            cluster: s.cluster,
            proficiency: s.proficiency,
            color: clusterColors[s.cluster],
            position,
            radius: 0.028 + (s.proficiency / 100) * 0.05,
        };
    });
}

/** Line-segment endpoints for every unique skill connection (count*2*3 floats). */
export function buildSynapses(nodes: SkillNode[]): Float32Array {
    const byId = new Map(nodes.map((n) => [n.id, n]));
    const segments: number[] = [];
    const seen = new Set<string>();
    for (const node of nodes) {
        const src = skills.find((s) => s.id === node.id);
        if (!src) continue;
        for (const targetId of src.connections) {
            const key = [node.id, targetId].sort().join('|');
            if (seen.has(key)) continue;
            seen.add(key);
            const target = byId.get(targetId);
            if (!target) continue;
            segments.push(...node.position, ...target.position);
        }
    }
    return new Float32Array(segments);
}

const PROJECT_COLOR: Record<ProjectCategory, string> = {
    ai: '#22d3ee',
    robotics: '#fbbf24',
    web: '#34d399',
    aerospace: '#a78bfa',
    startup: '#fb7185',
};

export interface ProjectOrb {
    id: string;
    title: string;
    color: string;
    position: Vec3;
    radius: number;
}

export function buildProjectOrbs(): ProjectOrb[] {
    const rand = rng(204);
    const n = projects.length;
    return projects.map((p, i) => {
        // arranged on a gentle descending spiral the camera weaves through
        const a = (i / n) * Math.PI * 2 + 0.6;
        const r = 0.85 + rand() * 0.25;
        return {
            id: p.id,
            title: p.title,
            color: PROJECT_COLOR[p.category],
            position: [
                Math.cos(a) * r,
                0.25 - i * 0.12 + (rand() - 0.5) * 0.2,
                Math.sin(a) * r - 0.6,
            ],
            radius: 0.13 + rand() * 0.04,
        };
    });
}
