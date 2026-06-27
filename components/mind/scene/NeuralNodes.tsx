'use client';

import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { buildSkillNodes, buildSynapses } from '@/lib/mind/nodes';

/** Skills as glowing neural nodes, wired by the real connection graph. */
export default function NeuralNodes({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
    const nodes = useMemo(() => buildSkillNodes(), []);
    const synapses = useMemo(() => buildSynapses(nodes), [nodes]);
    const groupRef = useRef<THREE.Group>(null);
    const reveal = useRef(0);
    const [hovered, setHovered] = useState<string | null>(null);

    const lineGeometry = useMemo(() => {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(synapses, 3));
        return g;
    }, [synapses]);

    useFrame(() => {
        // bloom outward from the brain core once the morph has resolved
        const target = progressRef.current > 0.26 ? 1 : 0;
        reveal.current += (target - reveal.current) * 0.08;
        if (groupRef.current) groupRef.current.scale.setScalar(Math.max(0.0001, reveal.current));
    });

    return (
        <group ref={groupRef} scale={0.0001}>
            <lineSegments geometry={lineGeometry}>
                <lineBasicMaterial
                    color="#7fd4ff"
                    transparent
                    opacity={0.16}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    depthTest={false}
                    toneMapped={false}
                />
            </lineSegments>

            {nodes.map((n) => (
                <group key={n.id} position={n.position}>
                    <mesh
                        scale={hovered === n.id ? 1.7 : 1}
                        onPointerOver={(e) => {
                            e.stopPropagation();
                            setHovered(n.id);
                            document.body.style.cursor = 'pointer';
                        }}
                        onPointerOut={() => {
                            setHovered((h) => (h === n.id ? null : h));
                            document.body.style.cursor = '';
                        }}
                    >
                        <sphereGeometry args={[n.radius, 16, 16]} />
                        <meshBasicMaterial
                            color={n.color}
                            transparent
                            opacity={0.95}
                            toneMapped={false}
                            blending={THREE.AdditiveBlending}
                            depthWrite={false}
                            depthTest={false}
                        />
                    </mesh>
                    <mesh scale={2.6}>
                        <sphereGeometry args={[n.radius, 12, 12]} />
                        <meshBasicMaterial
                            color={n.color}
                            transparent
                            opacity={0.14}
                            toneMapped={false}
                            blending={THREE.AdditiveBlending}
                            depthWrite={false}
                            depthTest={false}
                        />
                    </mesh>
                    {hovered === n.id && (
                        <Html center zIndexRange={[40, 0]} style={{ pointerEvents: 'none' }}>
                            <div className="mind-node-tip">
                                <span>{n.name}</span>
                                <b style={{ color: n.color }}>{n.proficiency}</b>
                            </div>
                        </Html>
                    )}
                </group>
            ))}
        </group>
    );
}
