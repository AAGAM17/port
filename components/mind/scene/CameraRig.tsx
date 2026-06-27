'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { sampleCamera } from '@/lib/mind/journey';

/** Glides the camera along the journey path. Damped lerp = cinematic lag. */
export default function CameraRig({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
    const camera = useThree((s) => s.camera);
    const targetPos = useRef(new THREE.Vector3(0, 0.1, 9.5));
    const targetLook = useRef(new THREE.Vector3(0, 0, 0));
    const currentLook = useRef(new THREE.Vector3(0, 0, 0));

    useFrame(() => {
        sampleCamera(progressRef.current, targetPos.current, targetLook.current);
        camera.position.lerp(targetPos.current, 0.08);
        currentLook.current.lerp(targetLook.current, 0.08);
        camera.lookAt(currentLook.current);
    });

    return null;
}
