'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Deep void background + a slow-drifting dust field for parallax & depth. */
export default function Atmosphere({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
    const dustRef = useRef<THREE.Points>(null);

    const geometry = useMemo(() => {
        const n = 700;
        const pos = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) {
            // distribute in a shell so the camera always sits inside it
            const r = 6 + Math.random() * 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            pos[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
            pos[i * 3 + 1] = Math.cos(phi) * r * 0.7;
            pos[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        return g;
    }, []);

    useFrame((state) => {
        if (dustRef.current) {
            dustRef.current.rotation.y = state.clock.elapsedTime * 0.012;
            // dust fades up once we're inside the mind
            const o = 0.25 + Math.min(0.45, progressRef.current * 0.6);
            (dustRef.current.material as THREE.PointsMaterial).opacity = o;
        }
    });

    return (
        <>
            <color attach="background" args={['#04050c']} />
            <points ref={dustRef} geometry={geometry} frustumCulled={false}>
                <pointsMaterial
                    size={0.022}
                    color="#9fb8ff"
                    transparent
                    opacity={0.3}
                    sizeAttenuation
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    toneMapped={false}
                />
            </points>
        </>
    );
}
