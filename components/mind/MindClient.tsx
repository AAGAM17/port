'use client';

import dynamic from 'next/dynamic';

const MindJourney = dynamic(() => import('./MindJourney'), {
    ssr: false,
    loading: () => (
        <div className="mind-loading" aria-label="Loading">
            <span className="mind-loading__pulse" />
        </div>
    ),
});

export default function MindClient() {
    return <MindJourney />;
}
