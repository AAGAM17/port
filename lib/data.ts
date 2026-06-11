// === TYPES ===

export interface Project {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    longDescription: string;
    category: ProjectCategory;
    techStack: string[];
    status: 'active' | 'completed' | 'research';
    metrics: { label: string; value: string }[];
    github?: string;
    demo?: string;
}

export type ProjectCategory = 'ai' | 'robotics' | 'web' | 'aerospace' | 'startup';

export interface Skill {
    id: string;
    name: string;
    cluster: SkillCluster;
    proficiency: number;
    connections: string[];
}

export type SkillCluster = 'ai' | 'robotics' | 'fullstack' | 'aerospace' | 'embedded';

export interface Achievement {
    id: string;
    rank: string;
    title: string;
    description: string;
    quote?: string;
    category: string;
    year: string;
}

export interface Experience {
    id: string;
    company: string;
    role: string;
    period: string;
    description: string;
    highlights: string[];
    techStack: string[];
    type: 'work' | 'research' | 'leadership';
}

export interface VisionIdea {
    id: string;
    title: string;
    problem: string;
    solution: string;
    impact: string;
    status: 'exploring' | 'building' | 'launched';
}

// === PERSONAL INFO ===

export const personalInfo = {
    name: 'Aagam Shah',
    role: 'Full-Stack Developer · AI Engineer · UAV Software Lead',
    tagline: 'Web apps, AI products, and autonomous aircraft — built end to end.',
    location: 'Mumbai, MH (open to relocate)',
    phone: '+91 7715018407',
    email: 'aagamcshah172005@gmail.com',
    github: 'https://github.com/AAGAM17',
    linkedin: 'https://linkedin.com/in/aagamshah',
    education: {
        college: "SVKM's Dwarkadas J. Sanghvi College of Engineering",
        degree: 'B.Tech in Mechanical Engineering',
        period: 'Aug 2023 — May 2027',
        location: 'Mumbai, MH',
    },
    bio: 'Mumbai engineer who ships. I\'ve built AI SaaS platforms end to end, automated away 60-hour workweeks, and written the computer-vision landing system behind a top-10 world ranking at SAE Aero Design 2025.',
};

// === SYSTEM METRICS (Landing) ===

export const systemMetrics = [
    { label: 'PRODUCTS SHIPPED', value: '10', unit: '+', icon: 'Rocket' },
    { label: 'SAE AERO · WORLD RANK', value: '#7', unit: '', icon: 'Globe' },
    { label: 'LINES IN PRODUCTION', value: '100', unit: 'K+', icon: 'Code' },
    { label: 'HACKATHON RANKINGS', value: '6', unit: '+', icon: 'Trophy' },
];

// === PROJECTS (REAL) ===

export const projects: Project[] = [
    {
        id: 'aethera',
        title: 'Aethera',
        subtitle: 'Natural-language to full-stack application generator',
        description: 'Built a natural-language-to-application generator that creates full-stack Next.js apps from user descriptions.',
        longDescription: 'A powerful AI-driven platform that takes natural language descriptions and generates complete full-stack Next.js applications. Implements codegen for pages, API routes, DB schema, auth, and storage with a "regenerate section" feature + context of previous builds for iterative refinement.',
        category: 'ai',
        techStack: ['Next.js', 'Prisma', 'AI', 'TailwindCSS', 'Clerk', 'Inngest'],
        status: 'completed',
        metrics: [
            { label: 'Full Codegen', value: 'Pages + API + DB' },
            { label: 'Auth System', value: 'Clerk' },
            { label: 'Regeneration', value: 'Context-aware' },
        ],
        github: 'https://github.com/AAGAM17',
    },
    {
        id: 'reelforge',
        title: 'ReelForge',
        subtitle: 'AI SaaS for short-form video generation',
        description: 'An AI SaaS platform that allows content creators to upload long-form videos and generate short-form viral clips with auto-subtitling.',
        longDescription: 'Built a complete AI SaaS platform designed for content creators. Users upload long-form videos, and the platform automatically generates engaging short-form clips optimized for virality, complete with auto-generated subtitles and smart cropping.',
        category: 'ai',
        techStack: ['Next.js', 'AWS', 'Tailwind CSS', 'AI'],
        status: 'active',
        metrics: [
            { label: 'Video Processing', value: 'Real-time' },
            { label: 'Auto-subtitling', value: 'AI-driven' },
            { label: 'Platform', value: 'SaaS' },
        ],
        github: 'https://github.com/AAGAM17',
    },
    {
        id: 'ig-automation',
        title: 'Instagram DM Automation SaaS',
        subtitle: 'AI-powered social media automation',
        description: 'An AI-powered Instagram DM automation system converting comments, replies, and keywords into high-intent DM conversations.',
        longDescription: 'Full-stack SaaS platform with a visual automation builder. Converts Instagram comments, replies, and keywords into high-intent DM conversations using AI-driven replies. Implements real-time webhook triggers and a lightweight CRM for hot/warm/cold lead management.',
        category: 'startup',
        techStack: ['Next.js', 'Tailwind CSS', 'Webhooks', 'OpenAI', 'Clerk', 'Prisma'],
        status: 'active',
        metrics: [
            { label: 'Automation', value: 'Visual builder' },
            { label: 'CRM', value: 'Lead tracking' },
            { label: 'Webhooks', value: 'Real-time' },
        ],
        github: 'https://github.com/AAGAM17',
    },
    {
        id: 'realtac',
        title: 'Realtac',
        subtitle: 'Generative AI website builder',
        description: 'A generative AI website with prompt-to-website generator, AI assistant, and LLM trainer. Pitched to major Indian MNCs.',
        longDescription: 'Developed a generative AI platform with features like prompt-to-website generator, AI assistant, and LLM trainer. Pitched the product to major Indian MNCs as a SaaS solution, demonstrating enterprise-grade AI capabilities.',
        category: 'ai',
        techStack: ['Next.js', 'AWS', 'Firebase', 'Tailwind CSS', 'AI'],
        status: 'completed',
        metrics: [
            { label: 'Pitched to', value: 'Major MNCs' },
            { label: 'AI Features', value: '3+' },
            { label: 'Platform', value: 'SaaS' },
        ],
        github: 'https://github.com/AAGAM17',
    },
    {
        id: 'uas-swarm',
        title: 'UAS Swarm System',
        subtitle: 'Dual-UAV coordination with real-time telemetry',
        description: 'Implemented a dual-UAV swarm system with real-time video telemetry, data acquisition, and MAVLink communication.',
        longDescription: 'A cutting-edge dual-UAV swarm system with real-time video telemetry using Wi-Fi adapters. Features a data acquisition system for real-time analytics and model inference on-board, computer vision models on Raspberry Pi, and established MAVLink communication. Automated GPS functions using LUA scripting on Mission Planner.',
        category: 'aerospace',
        techStack: ['Mission Planner', 'Raspberry Pi', 'Pixhawk', 'OpenHD', 'Python', 'OpenCV'],
        status: 'research',
        metrics: [
            { label: 'UAVs Coordinated', value: '2' },
            { label: 'Telemetry', value: 'Real-time' },
            { label: 'CV Models', value: 'On-board' },
        ],
        github: 'https://github.com/AAGAM17',
    },
];

// === SKILLS ===

export const skills: Skill[] = [
    // Languages
    { id: 'python', name: 'Python', cluster: 'ai', proficiency: 92, connections: ['opencv', 'flask', 'tensorflow'] },
    { id: 'javascript', name: 'JavaScript', cluster: 'fullstack', proficiency: 90, connections: ['typescript', 'react', 'nodejs'] },
    { id: 'typescript', name: 'TypeScript', cluster: 'fullstack', proficiency: 88, connections: ['javascript', 'react', 'nextjs'] },
    { id: 'java', name: 'Java', cluster: 'fullstack', proficiency: 75, connections: ['javascript'] },
    { id: 'cpp', name: 'C/C++', cluster: 'embedded', proficiency: 78, connections: ['arduino', 'raspberrypi'] },
    { id: 'rust', name: 'Rust', cluster: 'fullstack', proficiency: 60, connections: ['cpp'] },
    { id: 'solidity', name: 'Solidity', cluster: 'fullstack', proficiency: 65, connections: ['javascript'] },
    { id: 'htmlcss', name: 'HTML/CSS', cluster: 'fullstack', proficiency: 95, connections: ['tailwind', 'react'] },

    // Frameworks
    { id: 'react', name: 'React', cluster: 'fullstack', proficiency: 92, connections: ['nextjs', 'typescript', 'tailwind', 'reactnative'] },
    { id: 'nextjs', name: 'Next.js', cluster: 'fullstack', proficiency: 90, connections: ['react', 'typescript', 'prisma'] },
    { id: 'reactnative', name: 'React Native', cluster: 'fullstack', proficiency: 75, connections: ['react', 'javascript'] },
    { id: 'nodejs', name: 'Node.js', cluster: 'fullstack', proficiency: 85, connections: ['javascript', 'express'] },
    { id: 'flask', name: 'Flask', cluster: 'fullstack', proficiency: 78, connections: ['python'] },
    { id: 'express', name: 'Express', cluster: 'fullstack', proficiency: 80, connections: ['nodejs'] },
    { id: 'tailwind', name: 'Tailwind CSS', cluster: 'fullstack', proficiency: 92, connections: ['react', 'nextjs', 'htmlcss'] },
    { id: 'prisma', name: 'Prisma', cluster: 'fullstack', proficiency: 80, connections: ['nextjs', 'nodejs'] },

    // AI/ML
    { id: 'opencv', name: 'OpenCV', cluster: 'ai', proficiency: 85, connections: ['python', 'tensorflow'] },
    { id: 'tensorflow', name: 'TensorFlow', cluster: 'ai', proficiency: 75, connections: ['python', 'opencv'] },
    { id: 'openai', name: 'OpenAI API', cluster: 'ai', proficiency: 85, connections: ['python', 'nextjs'] },

    // Embedded/Aerospace
    { id: 'raspberrypi', name: 'Raspberry Pi', cluster: 'embedded', proficiency: 82, connections: ['python', 'arduino', 'pixhawk'] },
    { id: 'esp32', name: 'ESP32', cluster: 'embedded', proficiency: 70, connections: ['arduino', 'cpp'] },
    { id: 'arduino', name: 'Arduino', cluster: 'embedded', proficiency: 80, connections: ['cpp', 'raspberrypi', 'esp32'] },
    { id: 'pixhawk', name: 'Pixhawk', cluster: 'aerospace', proficiency: 80, connections: ['raspberrypi', 'ardupilot', 'mavlink'] },
    { id: 'ardupilot', name: 'ArduPilot', cluster: 'aerospace', proficiency: 78, connections: ['pixhawk', 'mavlink'] },
    { id: 'mavlink', name: 'MAVLink', cluster: 'aerospace', proficiency: 78, connections: ['pixhawk', 'ardupilot'] },

    // DevOps
    { id: 'git', name: 'Git', cluster: 'fullstack', proficiency: 90, connections: ['docker'] },
    { id: 'docker', name: 'Docker', cluster: 'fullstack', proficiency: 75, connections: ['aws', 'git'] },
    { id: 'aws', name: 'AWS', cluster: 'fullstack', proficiency: 78, connections: ['docker', 'gcp'] },
    { id: 'gcp', name: 'GCP', cluster: 'fullstack', proficiency: 65, connections: ['aws'] },
];

export const clusterColors: Record<SkillCluster, string> = {
    ai: '#22d3ee',
    robotics: '#fbbf24',
    fullstack: '#34d399',
    aerospace: '#a78bfa',
    embedded: '#fb7185',
};

export const clusterLabels: Record<SkillCluster, string> = {
    ai: 'AI / Machine Learning',
    robotics: 'Robotics',
    fullstack: 'Full Stack',
    aerospace: 'Aerospace',
    embedded: 'Embedded Systems',
};

// === ACHIEVEMENTS ===

export const achievements: Achievement[] = [
    {
        id: 'sae-aero-2025',
        rank: '7th Worldwide',
        title: 'SAE Aero Design 2025',
        description: 'Achieved top global rankings at SAE Aero Design 2025 — 7th Worldwide (Advanced Class Overall), 11th Worldwide (Design Report), and 2nd Worldwide (Oral Presentation) in all 3 Classes.',
        quote: 'Engineering is the art of making what you want from things you can get.',
        category: 'Aerospace',
        year: '2025',
    },
    {
        id: 'sih-2023',
        rank: '6th Nationwide',
        title: 'Smart India Hackathon 2023',
        description: 'Led team to 6th Rank Nationwide in Smart India Hackathon 2023 — Ministry of Defence Problem Statement. Designed a high-complexity defence tech solution and acted as team leader for core software architecture.',
        quote: 'Innovation is not about ideas, it\'s about making ideas happen.',
        category: 'Hackathon',
        year: '2023',
    },
    {
        id: 'codeclash-2025',
        rank: '2nd Position',
        title: 'CodeClash Hackathon',
        description: 'Developed NutriMind, an AI-powered nutrition mobile application that provides dietary insights, meal recommendations, and health tracking. Won 2nd place at BugFormers - College Crave hackathon.',
        category: 'Hackathon',
        year: '2025',
    },
    {
        id: 'synaphack-2025',
        rank: '7th Position',
        title: 'SynapHack 3.0 Hackathon',
        description: 'Built a full-stack AI powered Hackathon Management Platform enabling event creation, participant registration, certificate distribution, and project listing. Designed a scalable multi-role system.',
        category: 'Hackathon',
        year: '2025',
    },
    {
        id: '15k-lines',
        rank: '15,000+',
        title: 'Production Code Delivered',
        description: 'Delivered 15,000+ lines of production-quality code during Full-Stack and AI internship at Serenovolante, building LLM-integrated platforms, CV pipelines, and production-grade automation systems.',
        category: 'Engineering',
        year: '2024-2025',
    },
];

// === EXPERIENCE ===

export const experiences: Experience[] = [
    {
        id: 'freelance',
        company: 'Fyre Gig',
        role: 'Freelance Software Developer',
        period: 'July 2025 — Present',
        description: 'Developing and shipping full-fledged cross-platform productivity mobile applications from concept to deployment. Working directly with clients on production-ready builds.',
        highlights: [
            'Shipped a cross-platform productivity mobile app from concept to deployment',
            'Implemented user auth, task workflows, AI integrations, and performance optimization',
            'Resolved complex bugs in existing loan availing and stock market mobile applications',
            'Collaborated directly with clients to deliver production-ready builds under tight deadlines',
        ],
        techStack: ['React Native', 'TypeScript', 'AI', 'Firebase'],
        type: 'work',
    },
    {
        id: 'sae-head',
        company: 'DJS Skylark — SAE Aero Design',
        role: 'Advanced Class Head & Coding Head',
        period: 'June 2025 — Present',
        description: 'Leading the Advanced Class division, managing aircraft design integrations, avionics, autonomous systems, and mission logic. Head of all software development pipelines.',
        highlights: [
            'Head of autonomous landing system using Python, OpenCV, and MAVLink',
            'Managing flight-controller integration (Pixhawk + Raspberry Pi), testing pipelines, and mission-planner automation',
            'Leading the Advanced Class division with cross-functional engineering teams',
        ],
        techStack: ['Python', 'OpenCV', 'MAVLink', 'Pixhawk', 'Raspberry Pi', 'Mission Planner'],
        type: 'leadership',
    },
    {
        id: 'sereno',
        company: 'Serenovolante Software Services Pvt. Ltd.',
        role: 'Software Engineer (AI) Intern & Full Stack Developer',
        period: 'Nov 2024 — Mar 2025',
        description: 'Delivered 15,000+ lines of production-quality code across AI and full-stack roles, contributing to core enterprise AI platforms.',
        highlights: [
            'Delivered 15,000+ lines of production-quality code across both roles',
            'Built and integrated LLM-driven features, multi-model AI APIs, and computer vision inference systems',
            'Developed company-specific CV modules for detection, classification, and real-time inference using Python and OpenCV',
        ],
        techStack: ['Python', 'OpenCV', 'LLM APIs', 'Next.js', 'TypeScript'],
        type: 'work',
    },
    {
        id: 'sae-member',
        company: 'DJS Skylark — SAE Aero Design West 2025',
        role: 'Team Member — Propulsion, Avionics & Autonomous Systems',
        period: 'Sept 2023 — June 2025',
        description: 'Designed and integrated computer-vision-based autonomous landing solutions. Built "Code25," a Python script for aircraft design-score optimization.',
        highlights: [
            'Designed CV-based autonomous landing solutions using Python, OpenCV, and MAVLink',
            'Integrated Pixhawk flight controllers with Raspberry Pi and Mission Planner for autonomous flight',
            'Built "Code25," a Python script for aircraft design-score optimization',
            'Achieved multiple global top rankings across Regular, Micro, and Advanced Classes',
        ],
        techStack: ['Python', 'OpenCV', 'Pixhawk', 'Raspberry Pi', 'MAVLink', 'Mission Planner'],
        type: 'leadership',
    },
    {
        id: 'webxella',
        company: 'Webxella',
        role: 'App Developer Intern',
        period: 'June 2024 — Sept 2024',
        description: 'Developed cross-platform mobile applications using Flutter and worked on integrating AI features into mobile applications.',
        highlights: [
            'Developed cross-platform mobile applications using Flutter',
            'Integrated AI features into mobile applications',
        ],
        techStack: ['Flutter', 'Dart', 'AI', 'Firebase'],
        type: 'work',
    },
];

// === VISION IDEAS ===

export const visionIdeas: VisionIdea[] = [
    {
        id: 'v1',
        title: 'Autonomous Delivery Drones',
        problem: 'Last-mile delivery is expensive, slow, and carbon-intensive in dense urban environments like Mumbai.',
        solution: 'AI-powered drone fleet management with autonomous navigation, swarm coordination, and dynamic route optimization.',
        impact: 'Reduce delivery times by 80%, cut logistics costs by 60%, eliminate last-mile carbon emissions.',
        status: 'exploring',
    },
    {
        id: 'v2',
        title: 'AI Code Generation Platform',
        problem: 'Building full-stack apps from scratch is time-consuming. Non-technical founders can\'t prototype fast enough.',
        solution: 'Natural-language-to-application generator (like Aethera) that creates complete, deployable full-stack apps from descriptions.',
        impact: 'Reduce time-to-MVP from weeks to hours. Democratize software creation.',
        status: 'building',
    },
    {
        id: 'v3',
        title: 'Computer Vision for UAV Inspection',
        problem: 'Infrastructure inspection (bridges, power lines, buildings) requires expensive manual labor and is dangerous.',
        solution: 'Autonomous UAV inspection system with real-time CV-based defect detection, 3D mapping, and automated reporting.',
        impact: 'Make infrastructure inspection 10x cheaper and 5x faster while removing human risk.',
        status: 'exploring',
    },
    {
        id: 'v4',
        title: 'AI-Powered Content Engine',
        problem: 'Content creators spend hours editing long-form video into short-form clips for social media.',
        solution: 'An AI platform (ReelForge) that automatically identifies viral moments, generates clips with subtitles, and optimizes for engagement.',
        impact: 'Save creators 10+ hours per week. Increase content output by 5x.',
        status: 'building',
    },
];

// === TERMINAL COMMANDS ===

export const terminalCommands: Record<string, string> = {
    help: `
Available commands:
  about        Display information about Aagam Shah
  skills       List technical skills
  projects     Show project portfolio
  experience   View work experience
  contact      Get contact information
  achievements Show achievements
  education    View education

  neofetch     System info splash
  banner       ASCII art name banner
  whoami       Who is the operator?
  uptime       How long I've been running
  fortune      Random tech quote
  ping         Check if I'm online
  ls           List portfolio files
  pwd          Print working directory
  date         Current date & time
  history      Show command history
  echo <msg>   Print a message

  github       Open GitHub profile
  linkedin     Open LinkedIn profile
  resume       Request resume / CV
  clear        Clear terminal (or Ctrl+L)
  exit         Return to the homepage

  sudo hire-me   🚀
  matrix         Try it ;)
  launch         Initiating launch sequence...
  `,
    about: `
╔══════════════════════════════════════════╗
║           AAGAM SHAH                     ║
║  Full Stack × AI/ML × Aerospace Systems ║
╠══════════════════════════════════════════╣
║  Location: Mumbai, MH (open to relocate)║
║  Focus: AI × Aerospace × Startups       ║
║  Education: B.Tech Mech, DJ Sanghvi     ║
║  Status: Open to opportunities          ║
╚══════════════════════════════════════════╝

Building at the intersection of AI, autonomous systems,
and aerospace. From UAV swarms to production AI SaaS —
I ship complex engineering into elegant systems.
  `,
    skills: `
[Languages]    Java, Python, C/C++, JavaScript, TypeScript, Rust, Solidity
[Embedded]     Raspberry Pi, ESP32, Arduino, GSM, GPS
[Frameworks]   React, React Native, Next.js, Node.js, Flask, Tailwind
[AI/ML]        OpenCV, TensorFlow, OpenAI API, LLM Integration
[Aerospace]    ArduPilot, MAVLink, Pixhawk, Mission Planner
[DevTools]     Git, Docker, AWS, GCP, Modal, Inngest
  `,
    education: `
🎓 SVKM's Dwarkadas J. Sanghvi College of Engineering
   B.Tech in Mechanical Engineering
   Aug 2023 — May 2027 | Mumbai, MH

🏫 Jai Hind College
   High School (12th Standard)
   June 2021 — Feb 2023 | Mumbai, MH
  `,
    contact: `
📧  Email:    aagamcshah172005@gmail.com
📞  Phone:    +91 7715018407
🐙  GitHub:   github.com/AAGAM17
💼  LinkedIn: linkedin.com/in/aagamshah
📄  Resume:   available on request
  `,
    'sudo hire-me': `
🚀 LAUNCHING RECRUITMENT SEQUENCE...

> Compiling skills... ██████████ 100%
> Loading 100,000+ lines of prod code... ██████████ 100%
> SAE Aero Global Rankings loaded... ██████████ 100%
> Deploying enthusiasm... ██████████ 100%

✅ READY FOR DEPLOYMENT
   Contact: aagamcshah172005@gmail.com
   Status: Available for exciting opportunities!
  `,
    matrix: `
Wake up, Neo...
The Matrix has you...
Follow the white rabbit.

🐇 Just kidding — but my autonomous drones ARE the Matrix.
  `,
    launch: `
🚀 LAUNCH SEQUENCE INITIATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━
T-10... Systems check NOMINAL
T-5...  Pixhawk armed ████████
T-3...  MAVLink locked
T-1...  IGNITION
T-0...  LIFTOFF! 🔥

Aagam has left the atmosphere.
Next stop: your engineering team.
  `,
};

// === NAV LINKS ===

export const navLinks = [
    { href: '/', label: 'HOME', code: '~/' },
    { href: '/projects', label: 'PROJECTS', code: '~/projects' },
    { href: '/skills', label: 'SKILLS', code: '~/skills' },
    { href: '/achievements', label: 'ACHIEVEMENTS', code: '~/achievements' },
    { href: '/experience', label: 'EXPERIENCE', code: '~/experience' },
    { href: '/vision', label: 'VISION', code: '~/vision' },
    { href: '/contact', label: 'CONTACT', code: '~/contact' },
];
