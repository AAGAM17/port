import type { Metadata } from 'next';
import MindClient from '@/components/mind/MindClient';

export const metadata: Metadata = {
    title: 'Inside the Mind — Aagam Shah',
    description:
        'A cinematic scroll through the mind of Aagam Shah — from a human form into the brain, where skills become synapses and projects become the structures they built.',
};

export default function MindPage() {
    return <MindClient />;
}
