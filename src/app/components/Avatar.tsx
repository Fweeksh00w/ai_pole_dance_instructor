'use client';

import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

type AvatarProps = {
  moveId: string;
  isPlaying: boolean;
};

function Character({ moveId, isPlaying }: AvatarProps) {
  const group = useRef<THREE.Group | null>(null);
  const { scene, animations } = useGLTF('/models/avatar.glb');
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    if (isPlaying && actions[moveId]) {
      const action = actions[moveId];
      if (action) {
        action.reset().fadeIn(0.5).play();
        return () => {
          action.fadeOut(0.5);
        };
      }
    }
  }, [moveId, isPlaying, actions]);

  useFrame((state, delta) => {
    if (mixer) {
      mixer.update(delta);
    }
  });

  // Customize avatar appearance
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        // Set red hair
        if (child.name.includes('Hair')) {
          child.material.color.setHex(0xff4040);
        }
        // Set fair skin tone
        if (child.name.includes('Skin')) {
          child.material.color.setHex(0xffe0d0);
        }
      }
    });
  }, [scene]);

  return <primitive ref={group} object={scene} position={[0, -1, 0]} scale={1} />;
}

export default function Avatar({ moveId, isPlaying }: AvatarProps) {
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [0, 1.5, 3], fov: 50 }}
        shadows
        className="bg-gray-900"
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <Character moveId={moveId} isPlaying={isPlaying} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
} 