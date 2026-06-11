import {
    personalInfo, projects, skills, experiences, achievements,
    visionIdeas, testimonials, clusterLabels, SkillCluster,
} from './data';

/* ═══════════════════════════════════════
   VEDA · Aagam's personal AI assistant
   "Veda" (वेद) — Sanskrit for "knowledge".
   A retrieval brain over the site's data.
   Runs entirely in the browser. No APIs.
   ═══════════════════════════════════════ */

export const VEDA = {
    name: 'Veda',
    tagline: "Aagam's personal AI assistant",
    origin: 'Sanskrit — "knowledge"',
};

export interface VedaReply {
    /** Rendered in the chat bubble (can include newlines). */
    text: string;
    /** What she says out loud — shorter, no URLs or symbols. */
    speech: string;
    /** Follow-up suggestion chips. */
    chips: string[];
}

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const firstName = personalInfo.name.split(' ')[0];

/* ── Greeting (spoken on first open) ── */

export function vedaGreeting(): VedaReply {
    const text = `Hey! I'm Veda — ${firstName}'s personal AI assistant. My name means "knowledge" in Sanskrit, and fittingly, I know everything about him that's on this site.\n\nAsk me about his projects, his drones, his work — or just how to hire him.`;
    return {
        text,
        speech: `Hey! I'm Veda, Aagam's personal AI assistant. Ask me anything about him — his projects, his drones, or how to hire him.`,
        chips: ['Who is Aagam?', 'Show me his best work', 'Is he open to work?', 'Tell me a fun fact'],
    };
}

/* ── Intent matching ── */

interface Intent {
    match: RegExp;
    reply: () => VedaReply;
}

const projectByKeyword: { match: RegExp; id: string }[] = [
    { match: /aethera|app generator|nl to app|text to app/i, id: 'aethera' },
    { match: /reel\s*forge|video|clip|short[- ]form/i, id: 'reelforge' },
    { match: /instagram|\bdm\b|automation saas|social media/i, id: 'ig-automation' },
    { match: /realtac|website builder|mnc/i, id: 'realtac' },
    { match: /swarm|drone|uav|aircraft|mavlink|pixhawk|aero(?!space engineer)/i, id: 'uas-swarm' },
];

function projectReply(id: string): VedaReply {
    const p = projects.find(pr => pr.id === id)!;
    const openers = [
        `${p.title} — one of my favorites to talk about.`,
        `Ah, ${p.title}. Good choice.`,
        `${p.title}? Sure.`,
    ];
    const text = `${pick(openers)}\n\n${p.longDescription}\n\nStack: ${p.techStack.join(' · ')}\nStatus: ${p.status}`;
    return {
        text,
        speech: `${p.title}: ${p.description}`,
        chips: ['What else has he built?', 'What skills does he have?', 'How do I contact him?'],
    };
}

function fmtProjects(): string {
    return projects.map(p => `▸ ${p.title} — ${p.subtitle}`).join('\n');
}

const INTENTS: Intent[] = [
    // Who is Veda / what are you
    {
        match: /who are (yo)?u|what are (yo)?u|your name|about you|are you (real|an ai|a bot|chatgpt|gpt)|how (were|are) you (built|made)|\bapi key\b|\bwhat llm\b/i,
        reply: () => ({
            text: `I'm Veda — ${firstName}'s personal AI assistant. My name means "knowledge" in Sanskrit.\n\nFull honesty: I'm not a cloud LLM. ${firstName} hand-built me to run entirely in your browser — my whole brain is this site's data and a retrieval engine he wrote. No API keys, no servers, no tracking. I even borrow your device's voice to speak.\n\nWhich, if you think about it, is itself a small demo of what he can build.`,
            speech: `I'm Veda, Aagam's personal AI assistant. He built me to run entirely in your browser — no cloud, no API keys. Even my voice comes from your own device.`,
            chips: ['Who is Aagam?', 'What has he built?', 'Tell me a fun fact'],
        }),
    },
    // Greetings
    {
        match: /^(hi|hii+|hello|hey|heyy+|yo|sup|namaste|hola|good (morning|afternoon|evening))\b/i,
        reply: () => ({
            text: pick([
                `Hey there! Veda here — ${firstName}'s assistant. What would you like to know about him?`,
                `Hello! I'm Veda, and I know everything about ${firstName} that's worth knowing. Try me.`,
                `Namaste! Veda at your service. Ask me anything about ${firstName}.`,
            ]),
            speech: pick([
                `Hey there! What would you like to know about Aagam?`,
                `Hello! Ask me anything about Aagam.`,
            ]),
            chips: ['Who is Aagam?', 'His best projects', 'His achievements', 'Contact info'],
        }),
    },
    // About Aagam
    {
        match: /who is|about (him|aagam)|tell me about|introduce|summary|overview|bio/i,
        reply: () => ({
            text: `${personalInfo.name} is a ${personalInfo.role.toLowerCase().replace(/·/g, 'and')}, based in Mumbai.\n\nIn plain terms: he ships. AI SaaS platforms built end to end, automation systems that erased 60-hour workweeks, and the computer-vision landing system that helped his team rank 7th worldwide at SAE Aero Design 2025.\n\nHe's doing his B.Tech at ${personalInfo.education.college} (class of 2027) — and somehow shipping production software the whole time.`,
            speech: `Aagam is a full-stack and AI engineer from Mumbai. He builds AI SaaS platforms, automation systems, and computer-vision autopilots — including the landing system that helped his team rank seventh worldwide at SAE Aero Design 2025.`,
            chips: ['His best projects', 'Work experience', 'Is he open to work?'],
        }),
    },
    // Why hire (must outrank the general hire intent)
    {
        match: /why (should|would)|convince|sell me|pitch|best (thing|quality)|strength/i,
        reply: () => ({
            text: `Here's my honest pitch:\n\n▸ He owns the whole stack — architecture, UI, models, deployment. No hand-offs.\n▸ Proof over promises: 10+ shipped products, 100K+ lines in production, a 7th-place world ranking.\n▸ One client said his automation work saved them 60+ hours a week.\n\nAlso, he built me from scratch to run in your browser. Who does that for a portfolio?`,
            speech: `He owns the whole stack — architecture, UI, models and deployment. Ten plus shipped products, a hundred thousand lines in production, and a seventh place world ranking. Also — he built me from scratch. Who does that for a portfolio?`,
            chips: ['Contact him', 'See his projects', 'What people say about him'],
        }),
    },
    // Hire / availability
    {
        match: /hire|hiring|available|availab|open to|job|opportunit|recruit|work (with|for)|freelance|collaborat/i,
        reply: () => ({
            text: `Great question — yes! ${firstName} is open to opportunities right now: full-time roles, freelance builds, and ambitious collaborations. He's in Mumbai and open to relocating.\n\nThe fastest way to reach him:\n▸ Email: ${personalInfo.email}\n▸ LinkedIn: linkedin.com/in/aagamshah\n\nBetween us — he replies fast.`,
            speech: `Yes! Aagam is open to opportunities right now — full-time roles, freelance builds, and collaborations. The fastest way to reach him is by email. And between us, he replies fast.`,
            chips: ['Get his email', 'Why should I hire him?', 'His experience'],
        }),
    },
    // Projects (general)
    {
        match: /project|built|build|portfolio|work(s| on)?$|shipped|products|made|creat/i,
        reply: () => ({
            text: `He's shipped ${projects.length} flagship projects (and 10+ overall). The headliners:\n\n${fmtProjects()}\n\nAsk me about any of them by name — I know the details.`,
            speech: `He's shipped over ten products. The headliners: Aethera, an AI that generates full-stack apps from plain English. ReelForge, an AI video platform. An Instagram DM automation SaaS. And a dual-drone swarm system with real-time telemetry. Ask me about any of them.`,
            chips: ['Tell me about Aethera', 'The drone swarm', 'ReelForge', 'Instagram automation'],
        }),
    },
    // Skills
    {
        match: /skill|stack|tech(nolog)?|language|framework|tools|knows?\b|good at/i,
        reply: () => {
            const clusters: SkillCluster[] = ['fullstack', 'ai', 'aerospace', 'embedded'];
            const lines = clusters.map(c => {
                const top = skills.filter(s => s.cluster === c).sort((a, b) => b.proficiency - a.proficiency).slice(0, 4).map(s => s.name);
                return `▸ ${clusterLabels[c]}: ${top.join(', ')}`;
            });
            return {
                text: `His range is the unusual part — from pixels to flight controllers:\n\n${lines.join('\n')}\n\nStrongest weapons: TypeScript/React/Next.js, Python + OpenCV, and making drones do what they're told.`,
                speech: `His range goes from pixels to flight controllers. Full-stack: TypeScript, React, and Next.js. AI: Python, OpenCV, and LLM integration. Plus aerospace tools like Pixhawk and MAVLink, and embedded systems.`,
                chips: ['Projects using these', 'His experience', 'AI work specifically'],
            };
        },
    },
    // Experience
    {
        match: /experience|career|intern|job history|worked|companies|serenovolante|sereno|fyre|webxella|skylark|employment/i,
        reply: () => {
            const lines = experiences.slice(0, 4).map(e => `▸ ${e.role} @ ${e.company} (${e.period})`);
            return {
                text: `His track record so far:\n\n${lines.join('\n')}\n\nHighlight reel: 15,000+ lines of production code in one internship at Serenovolante, and he currently leads all software for DJS Skylark's SAE Aero team while freelancing at Fyre Gig.`,
                speech: `He's currently a freelance developer at Fyre Gig and the Advanced Class Head at DJS Skylark. Before that, he delivered fifteen thousand lines of production code as an AI engineering intern at Serenovolante, and built mobile apps at Webxella.`,
                chips: ['What did he do at Serenovolante?', 'The aero team', 'His achievements'],
            };
        },
    },
    // Achievements
    {
        match: /achievement|award|rank|win|won|trophy|sae|hackathon|smart india|sih|recognition|accomplish/i,
        reply: () => {
            const top = achievements.slice(0, 4).map(a => `▸ ${a.rank} — ${a.title}`);
            return {
                text: `The trophy shelf:\n\n${top.join('\n')}\n\nThe one he's proudest of: 7th worldwide at SAE Aero Design 2025 — his code helped land an aircraft autonomously on the world stage.`,
                speech: `Seventh worldwide at SAE Aero Design 2025. Sixth nationwide at Smart India Hackathon, on a Ministry of Defence problem. Second place at CodeClash. The list goes on — he collects rankings like stamps.`,
                chips: ['What is SAE Aero Design?', 'The hackathon story', 'His projects'],
            };
        },
    },
    // SAE specifics
    {
        match: /what is sae|aero design|sae aero|aircraft competition/i,
        reply: () => ({
            text: `SAE Aero Design is a worldwide engineering competition where university teams design, build, and fly real aircraft against brutal constraints.\n\n${firstName}'s team, DJS Skylark, ranked 7th worldwide overall in Advanced Class in 2025 — plus 2nd worldwide in Oral Presentation and 11th in Design Report. He led the software: a computer-vision autonomous landing system on Raspberry Pi + Pixhawk, talking MAVLink.`,
            speech: `SAE Aero Design is a worldwide competition where university teams design, build and fly real aircraft. Aagam's team ranked seventh worldwide in 2025 — and he led the software, including a computer-vision autonomous landing system.`,
            chips: ['The drone swarm project', 'His other achievements', 'His skills'],
        }),
    },
    // Education
    {
        match: /education|college|degree|study|studies|university|school|btech|b\.tech/i,
        reply: () => ({
            text: `He's doing his ${personalInfo.education.degree} at ${personalInfo.education.college}, Mumbai (${personalInfo.education.period}).\n\nYes — mechanical engineering. The software obsession is entirely self-built, which honestly makes the 100K+ lines of production code more impressive, not less.`,
            speech: `He's doing his B.Tech in Mechanical Engineering at DJ Sanghvi College of Engineering in Mumbai, class of 2027. The software skills are entirely self-taught — which makes them more impressive, not less.`,
            chips: ['His experience', 'His projects', 'Contact him'],
        }),
    },
    // Contact
    {
        match: /contact|email|mail|phone|reach|linkedin|github|connect|social|resume|cv\b/i,
        reply: () => ({
            text: `Here's everything:\n\n▸ Email: ${personalInfo.email}\n▸ Phone: ${personalInfo.phone}\n▸ GitHub: github.com/AAGAM17\n▸ LinkedIn: linkedin.com/in/aagamshah\n\nEmail is the fastest channel. Tell him Veda sent you — he'll know I did my job.`,
            speech: `The fastest way is email — it's on screen now, along with his GitHub and LinkedIn. Tell him Veda sent you.`,
            chips: ['Is he open to work?', 'Why hire him?', 'His best work'],
        }),
    },
    // Location
    {
        match: /where|location|based|live|city|mumbai|india|relocate|remote/i,
        reply: () => ({
            text: `He's based in Mumbai, India — 19.07°N, 72.87°E if you want to send a drone.\n\nHe's open to relocating and works remotely with clients already, so geography isn't a constraint.`,
            speech: `He's based in Mumbai, India — and he's open to relocating or working remotely. Geography is not a constraint.`,
            chips: ['Is he available?', 'Contact info', 'About Aagam'],
        }),
    },
    // Vision / future
    {
        match: /vision|future|ideas|startup|founder|thesis|dream|plan|goals/i,
        reply: () => {
            const v = pick(visionIdeas);
            return {
                text: `His thesis: AI shouldn't just predict — it should act, in the physical world.\n\nWhat he's chewing on right now (sample): ${v.title}. ${v.problem} His answer: ${v.solution}\n\nThe full founder's thesis lives on the Vision page.`,
                speech: `His thesis is that AI shouldn't just predict — it should act in the physical world. From autonomous delivery drones to AI that generates entire applications. The full thesis is on the Vision page.`,
                chips: ['His projects', 'Is he looking for co-founders?', 'About Aagam'],
            };
        },
    },
    // Testimonials
    {
        match: /testimonial|people say|reference|reviews|opinion|colleagues|recommend/i,
        reply: () => {
            const t = pick(testimonials);
            return {
                text: `Here's one from ${t.name}${t.company ? ` (${t.role}, ${t.company})` : ` (${t.role})`}:\n\n"${t.quote}"\n\nThere are more on the home page — all real people, all worked with him.`,
                speech: `${t.name} said: ${t.quote}`,
                chips: ['Another testimonial', 'Why hire him?', 'Contact him'],
            };
        },
    },
    // Fun fact
    {
        match: /fun fact|secret|interesting|surprise|cool|random|something (else|new)/i,
        reply: () => ({
            text: pick([
                `Fun fact: his team's aircraft scored 2nd worldwide in Oral Presentation at SAE Aero 2025 — meaning he can explain hard engineering to a panel of judges under pressure. Useful in standups.`,
                `Fun fact: he started coding in 2021. Four years later he had 100K+ lines in production and a world top-10 ranking. Compounding is real.`,
                `Fun fact: I run with zero servers. ${firstName} wrote my entire brain as a retrieval engine over this site's data — I'm the only assistant you've met today with no cloud bill.`,
                `Fun fact: his automation work at Fyre Gig reportedly saved a team 60+ hours per week. That's 1.5 full-time jobs, automated politely out of existence.`,
            ]),
            speech: pick([
                `His team scored second worldwide in oral presentation at SAE Aero 2025 — he can explain hard engineering under pressure.`,
                `He started coding in 2021. Four years later: a hundred thousand lines in production and a world top-ten ranking.`,
                `I run with zero servers. Aagam wrote my entire brain to live in your browser. No cloud bill.`,
            ]),
            chips: ['Another fun fact', 'His achievements', 'Who is Aagam?'],
        }),
    },
    // Thanks
    {
        match: /thank|thanks|thx|appreciated|great job|good (girl|bot|job)|nice/i,
        reply: () => ({
            text: pick([
                `Anytime! That's literally my whole job. Anything else about ${firstName}?`,
                `My pleasure. I'll be here — I don't exactly have other plans.`,
            ]),
            speech: pick([`Anytime! Anything else about Aagam?`, `My pleasure. I'll be right here.`]),
            chips: ['Contact him', 'Fun fact', 'His projects'],
        }),
    },
    // Bye
    {
        match: /\b(bye|goodbye|see you|later|cya|gtg)\b/i,
        reply: () => ({
            text: `Goodbye! If anything about ${firstName} comes to mind later, you know where I live. (It's this corner. I live in this corner.)`,
            speech: `Goodbye! You know where to find me.`,
            chips: ['Actually, one more thing', 'Contact info'],
        }),
    },
    // How are you
    {
        match: /how are (yo)?u|how('s| is) it going|what'?s up/i,
        reply: () => ({
            text: `Running at full capacity — zero latency, zero downtime, zero salary. Now, what can I tell you about ${firstName}?`,
            speech: `Running at full capacity — zero latency, zero downtime, zero salary. What can I tell you about Aagam?`,
            chips: ['Who is Aagam?', 'His best work', 'Fun fact'],
        }),
    },
];

/* ── Fuzzy fallback: score query tokens against all site content ── */

interface Doc {
    name: string;
    body: string;
    reply: () => VedaReply;
}

const DOCS: Doc[] = [
    ...projects.map(p => ({
        name: p.title,
        body: `${p.title} ${p.subtitle} ${p.description} ${p.longDescription} ${p.techStack.join(' ')} ${p.category}`,
        reply: () => projectReply(p.id),
    })),
    ...experiences.map(e => ({
        name: e.company,
        body: `${e.company} ${e.role} ${e.description} ${e.highlights.join(' ')} ${e.techStack.join(' ')}`,
        reply: (): VedaReply => ({
            text: `That sounds like his time at ${e.company} — ${e.role} (${e.period}).\n\n${e.description}\n\n${e.highlights.slice(0, 2).map(h => `▸ ${h}`).join('\n')}`,
            speech: `At ${e.company}, he was ${e.role}. ${e.description}`,
            chips: ['Full experience', 'His skills', 'Contact him'],
        }),
    })),
    ...achievements.map(a => ({
        name: a.title,
        body: `${a.title} ${a.description} ${a.category} ${a.rank}`,
        reply: (): VedaReply => ({
            text: `You might mean ${a.title} (${a.rank}, ${a.year}).\n\n${a.description}`,
            speech: `${a.title}: ${a.description}`,
            chips: ['All achievements', 'His projects', 'About Aagam'],
        }),
    })),
];

function fuzzyLookup(query: string): VedaReply | null {
    const tokens = query.toLowerCase().split(/[^a-z0-9+#]+/).filter(t => t.length > 2);
    if (!tokens.length) return null;
    let best: { doc: Doc; score: number } | null = null;
    for (const doc of DOCS) {
        const hay = doc.body.toLowerCase();
        const score = tokens.reduce((acc, t) => acc + (hay.includes(t) ? 1 : 0), 0);
        if (score > 0 && (!best || score > best.score)) best = { doc, score };
    }
    if (best && best.score >= Math.min(2, tokens.length)) return best.doc.reply();
    return null;
}

/* ── Main entry ── */

export function vedaReply(input: string): VedaReply {
    const q = input.trim();
    if (!q) return vedaGreeting();

    for (const intent of INTENTS) {
        if (intent.match.test(q)) return intent.reply();
    }

    const fuzzy = fuzzyLookup(q);
    if (fuzzy) return fuzzy;

    return {
        text: pick([
            `Hmm — that one's outside my brain. I know everything on this site: ${firstName}'s projects, skills, experience, achievements, education, and how to reach him. Try one of those?`,
            `I'll be honest, I don't have that in my knowledge base. But ask me anything about ${firstName} — his work, his drones, his rankings — and I'll deliver.`,
        ]),
        speech: pick([
            `That one's outside my brain. But ask me anything about Aagam — his projects, skills, or how to reach him.`,
            `I don't have that one. Try asking about his work, his drones, or his rankings.`,
        ]),
        chips: ['His projects', 'His skills', 'His achievements', 'Contact info'],
    };
}
