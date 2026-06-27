'use client';

import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { sampleBody, sampleBrain } from '@/lib/mind/sampling';
import { morphProgress } from '@/lib/mind/journey';

const vertexShader = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute vec3 aBrain;
  attribute float aRand;
  varying float vRand;
  varying float vMix;

  void main() {
    // staggered start per particle → flowing murmuration, not a lockstep slide
    float stagger = aRand * 0.22;
    float t = clamp((uProgress - stagger) / (1.0 - 0.22), 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);

    vec3 pos = mix(position, aBrain, t);

    // swirl that peaks mid-transit then settles
    float bell = sin(t * 3.14159265);
    float ang = aRand * 6.2831853 + uTime * 0.25;
    float swirl = bell * (0.32 + aRand * 0.5);
    pos.x += cos(ang) * swirl;
    pos.z += sin(ang) * swirl;

    // soft breathing while still a body
    pos.y += sin(uTime * 0.6 + aRand * 6.2831853) * 0.025 * (1.0 - t);

    vMix = t;
    vRand = aRand;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float size = uSize * uPixelRatio * (0.55 + aRand * 0.8) * (8.5 / -mv.z);
    gl_PointSize = clamp(size, 1.0, 9.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vRand;
  varying float vMix;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = dot(c, c);
    float alpha = smoothstep(0.25, 0.0, d);
    vec3 col = mix(uColorA, uColorB, clamp(vMix * 0.7 + vRand * 0.25, 0.0, 1.0));
    col += (1.0 - smoothstep(0.0, 0.05, d)) * 0.12; // faint core
    gl_FragColor = vec4(col, alpha * uOpacity);
  }
`;

export default function ParticleField({
    progressRef,
    count,
}: {
    progressRef: React.MutableRefObject<number>;
    count: number;
}) {
    const gl = useThree((s) => s.gl);

    const geometry = useMemo(() => {
        const body = sampleBody(count);
        const brain = sampleBrain(count);
        const rand = new Float32Array(count);
        for (let i = 0; i < count; i++) rand[i] = Math.random();
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(body.positions, 3));
        g.setAttribute('aBrain', new THREE.BufferAttribute(brain.positions, 3));
        g.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));
        return g;
    }, [count]);

    const material = useMemo(
        () =>
            new THREE.ShaderMaterial({
                uniforms: {
                    uProgress: { value: 0 },
                    uTime: { value: 0 },
                    uSize: { value: 1.15 },
                    uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
                    uColorA: { value: new THREE.Color('#86c9ff') },
                    uColorB: { value: new THREE.Color('#6f93ff') },
                    uOpacity: { value: 0.5 },
                },
                vertexShader,
                fragmentShader,
                transparent: true,
                depthWrite: false,
                depthTest: false,
                blending: THREE.AdditiveBlending,
            }),
        [gl],
    );

    useFrame((state) => {
        material.uniforms.uProgress.value = morphProgress(progressRef.current);
        material.uniforms.uTime.value = state.clock.elapsedTime;
    });

    useEffect(
        () => () => {
            geometry.dispose();
            material.dispose();
        },
        [geometry, material],
    );

    return <points geometry={geometry} material={material} frustumCulled={false} />;
}
