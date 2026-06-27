'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { MotionConfig, useReducedMotion } from 'framer-motion';
import { recommendedParticleCount } from '@/lib/mind/sampling';
import { useScrollProgress } from './useScrollProgress';
import Atmosphere from './scene/Atmosphere';
import ParticleField from './scene/ParticleField';
import NeuralNodes from './scene/NeuralNodes';
import ProjectOrbs from './scene/ProjectOrbs';
import CameraRig from './scene/CameraRig';
import ActsStack from './acts/ActsStack';
import Hud from './Hud';

export default function MindJourney() {
    const progressRef = useRef(0);
    const reduced = useReducedMotion();
    const [count, setCount] = useState(0);

    useEffect(() => {
        setCount(recommendedParticleCount());
    }, []);

    useScrollProgress(progressRef);

    const showCanvas = !reduced && count > 0;

    return (
        <MotionConfig reducedMotion="user">
            <div className="mind-root">
                {showCanvas ? (
                    <div className="mind-canvas">
                        <Canvas
                            camera={{ position: [0, 0.1, 9.5], fov: 55, near: 0.01, far: 60 }}
                            dpr={[1, 2]}
                            gl={{ antialias: true, powerPreference: 'high-performance' }}
                        >
                            <Atmosphere progressRef={progressRef} />
                            <ParticleField progressRef={progressRef} count={count} />
                            <NeuralNodes progressRef={progressRef} />
                            <ProjectOrbs progressRef={progressRef} />
                            <CameraRig progressRef={progressRef} />
                        </Canvas>
                    </div>
                ) : (
                    <div className="mind-canvas mind-canvas--static" aria-hidden />
                )}

                <ActsStack />
                <Hud progressRef={progressRef} />

                <div className="mind-vignette" aria-hidden />
                <div className="mind-letterbox mind-letterbox--top" aria-hidden />
                <div className="mind-letterbox mind-letterbox--bottom" aria-hidden />
            </div>
        </MotionConfig>
    );
}
