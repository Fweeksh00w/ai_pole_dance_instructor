'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

type AvatarProps = {
  moveId: string;
  isPlaying: boolean;
};

function FallbackBox() {
  return (
    <mesh>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="purple" />
    </mesh>
  );
}

function Character({ moveId, isPlaying }: AvatarProps) {
  const group = useRef<THREE.Group | null>(null);
  const [modelError, setModelError] = useState(false);
  let scene: THREE.Group;
  let animations: THREE.AnimationClip[] = [];

  try {
    const result = useGLTF('/models/avatar.glb');
    scene = result.scene;
    animations = result.animations;
  } catch (error) {
    console.warn('Failed to load avatar model:', error);
    return <FallbackBox />;
  }

  const { actions, mixer } = useAnimations(animations, group);

  // Custom body proportions
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Customize body proportions
        if (child.name.includes('Hips') || child.name.includes('Buttocks')) {
          // Enhance hip and buttocks area
          child.scale.set(1.2, 1.2, 1.3);
        }
        if (child.name.includes('Waist')) {
          // Slim waist
          child.scale.set(0.9, 1, 0.9);
        }
        
        // Set materials and colors
        if (child.material instanceof THREE.MeshStandardMaterial) {
          // Red hair with shine
          if (child.name.includes('Hair')) {
            child.material.color.setHex(0xff3333);
            child.material.roughness = 0.3;
            child.material.metalness = 0.4;
          }
          // Fair skin tone with subtle shine
          if (child.name.includes('Body') || child.name.includes('Skin')) {
            child.material.color.setHex(0xffe0d0);
            child.material.roughness = 0.5;
            child.material.metalness = 0.1;
          }
          // Add subsurface scattering for more realistic skin
          if (child.material.name.includes('Skin')) {
            child.material.envMapIntensity = 1.5;
          }
        }
      }
    });
  }, [scene]);

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

  if (modelError) {
    return <FallbackBox />;
  }

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
        {/* Add rim light for better body definition */}
        <pointLight position={[-5, 2, -5]} intensity={0.5} color="#ffffff" />
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