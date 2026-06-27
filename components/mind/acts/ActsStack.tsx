'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Section, Eyebrow, Title, Lead, reveal } from './ActFrame';
import {
    skills,
    projects,
    systemMetrics,
    achievements,
    experiences,
    personalInfo,
    clusterLabels,
    clusterColors,
    type SkillCluster,
} from '@/lib/data';

const clusterCounts = skills.reduce<Record<string, number>>((acc, s) => {
    acc[s.cluster] = (acc[s.cluster] || 0) + 1;
    return acc;
}, {});
const activeClusters = (Object.keys(clusterCounts) as SkillCluster[]).sort(
    (a, b) => clusterCounts[b] - clusterCounts[a],
);

const proofStats = [
    ...systemMetrics.map((m) => ({ value: `${m.value}${m.unit}`, label: m.label })),
];

export default function ActsStack() {
    return (
        <div className="mind-scroll">
            {/* ── ACT I · ORIGIN ───────────────────────────── */}
            <Section id="intro">
                <Eyebrow>A portfolio by Aagam Shah</Eyebrow>
                <Title>
                    Every system I&apos;ve built
                    <br />
                    began as a thought.
                </Title>
                <Lead>Full-stack developer · AI engineer · UAV software lead. Scroll to go inside.</Lead>
            </Section>

            {/* ── ACT II · DESCENT ─────────────────────────── */}
            <Section id="descent">
                <Eyebrow>Descent</Eyebrow>
                <Title>Follow it inward.</Title>
            </Section>

            {/* ── ACT III · SYNAPSES (SKILLS) ──────────────── */}
            <Section id="skills" align="left">
                <Eyebrow>The wiring</Eyebrow>
                <Title>Skills, as a living network.</Title>
                <Lead>
                    {skills.length} capabilities, wired the way I actually use them — languages feeding
                    frameworks, vision feeding flight. Hover a node to trace its connections.
                </Lead>
                <motion.div variants={reveal} className="mind-legend">
                    {activeClusters.map((c) => (
                        <div key={c} className="mind-legend__item">
                            <span className="mind-legend__dot" style={{ background: clusterColors[c] }} />
                            <span className="mind-legend__label">{clusterLabels[c]}</span>
                            <span className="mind-legend__count">{clusterCounts[c]}</span>
                        </div>
                    ))}
                </motion.div>
            </Section>

            {/* ── ACT IV · BUILT (PROJECTS) ────────────────── */}
            <Section id="projects" align="left">
                <Eyebrow>What the wiring builds</Eyebrow>
                <Title>Things I&apos;ve shipped.</Title>
                <div className="mind-cards">
                    {projects.map((p) => (
                        <motion.article key={p.id} variants={reveal} className="mind-card">
                            <div className="mind-card__head">
                                <h3>{p.title}</h3>
                                <span className={`mind-card__status mind-card__status--${p.status}`}>{p.status}</span>
                            </div>
                            <p className="mind-card__sub">{p.subtitle}</p>
                            <div className="mind-card__stack">
                                {p.techStack.slice(0, 5).map((t) => (
                                    <span key={t}>{t}</span>
                                ))}
                            </div>
                            {p.metrics[0] && (
                                <p className="mind-card__metric">
                                    <b>{p.metrics[0].value}</b> {p.metrics[0].label}
                                </p>
                            )}
                        </motion.article>
                    ))}
                </div>
            </Section>

            {/* ── ACT V · PROOF (ACHIEVEMENTS) ─────────────── */}
            <Section id="achievements">
                <Eyebrow>Receipts</Eyebrow>
                <Title>Proof, not promises.</Title>
                <div className="mind-stats">
                    {proofStats.map((s) => (
                        <motion.div key={s.label} variants={reveal} className="mind-stat">
                            <span className="mind-stat__value">{s.value}</span>
                            <span className="mind-stat__label">{s.label}</span>
                        </motion.div>
                    ))}
                </div>
                <motion.div variants={reveal} className="mind-proof-lines">
                    {achievements.slice(0, 3).map((a) => (
                        <p key={a.id}>
                            <b>{a.rank}</b> — {a.title}
                        </p>
                    ))}
                </motion.div>
            </Section>

            {/* ── ACT VI · PATH (EXPERIENCE) ───────────────── */}
            <Section id="experience" align="left">
                <Eyebrow>The path</Eyebrow>
                <Title>Where it&apos;s been put to work.</Title>
                <div className="mind-timeline">
                    {experiences.map((e) => (
                        <motion.div key={e.id} variants={reveal} className="mind-timeline__row">
                            <span className="mind-timeline__period">{e.period}</span>
                            <div className="mind-timeline__body">
                                <h4>{e.role}</h4>
                                <p>{e.company}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* ── ACT VII · INVITATION (FINALE) ────────────── */}
            <Section id="finale">
                <Eyebrow>One more thing</Eyebrow>
                <Title>Let&apos;s build something worth remembering.</Title>
                <Lead>{personalInfo.location} · open to relocate</Lead>
                <motion.div variants={reveal} className="mind-cta">
                    <a className="mind-interactive mind-btn mind-btn--primary" href={`mailto:${personalInfo.email}`}>
                        Get in touch
                    </a>
                    <a className="mind-interactive mind-btn" href={personalInfo.linkedin} target="_blank" rel="noreferrer">
                        LinkedIn
                    </a>
                    <a className="mind-interactive mind-btn" href={personalInfo.github} target="_blank" rel="noreferrer">
                        GitHub
                    </a>
                </motion.div>
                <motion.div variants={reveal}>
                    <Link className="mind-interactive mind-return" href="/">
                        ← Return to the site
                    </Link>
                </motion.div>
            </Section>
        </div>
    );
}
