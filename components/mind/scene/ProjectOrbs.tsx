'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { buildProjectOrbs } from '@/lib/mind/nodes';

/** Projects as larger luminous structures, deeper inside the mind. */
export default function ProjectOrbs({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
    const orbs = useMemo(() => buildProjectOrbs(), []);
    const groupRef = useRef<THREE.Group>(null);
    const reveal = useRef(0);

    useFrame((state) => {
        const p = progressRef.current;
        const target = p > 0.42 && p < 0.96 ? 1 : 0;
        reveal.current += (target - reveal.current) * 0.06;
        if (groupRef.current) {
            groupRef.current.scale.setScalar(Math.max(0.0001, reveal.current));
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.04;
        }
    });

    return (
        <group ref={groupRef} scale={0.0001}>
            {orbs.map((o) => (
                <group key={o.id} position={o.position}>
                    <mesh>
                        <sphereGeometry args={[o.radius, 24, 24]} />
                        <meshBasicMaterial
                            color={o.color}
                            transparent
                            opacity={0.8}
                            toneMapped={false}
                            blending={THREE.AdditiveBlending}
                            depthWrite={false}
                            depthTest={false}
                        />
                    </mesh>
                    <mesh scale={2.1}>
                        <sphereGeometry args={[o.radius, 16, 16]} />
                        <meshBasicMaterial
                            color={o.color}
                            transparent
                            opacity={0.1}
                            toneMapped={false}
                            blending={THREE.AdditiveBlending}
                            depthWrite={false}
                            depthTest={false}
                        />
                    </mesh>
                    <mesh rotation={[Math.PI / 2.3, 0.5, 0]}>
                        <torusGeometry args={[o.radius * 1.9, o.radius * 0.05, 12, 64]} />
                        <meshBasicMaterial
                            color={o.color}
                            transparent
                            opacity={0.45}
                            toneMapped={false}
                            blending={THREE.AdditiveBlending}
                            depthWrite={false}
                            depthTest={false}
                        />
                    </mesh>
                </group>
            ))}
        </group>
    );
}
