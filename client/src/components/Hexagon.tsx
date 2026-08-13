import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HexagonProps {
  position: [number, number, number];
  interactionPosition: THREE.Vector3;
  isMobile?: boolean;
  theme: 'light' | 'dark';
}

export function Hexagon({
  position,
  interactionPosition,
  isMobile,
  theme,
}: HexagonProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  // Create hexagon geometry with flat-top orientation for proper {6,3} tessellation
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const radius = 1.3;

    // Create flat-top hexagon path (rotated 30 degrees from pointy-top)
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + Math.PI / 6; // +30 degrees for flat-top
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }
    shape.closePath();

    // Extrude the hexagon to give it depth
    const extrudeSettings = {
      depth: 0.1,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  // Create materials for different parts with smooth transitions
  const materials = useMemo(() => {
    const faceMaterial = new THREE.MeshLambertMaterial({
      color: '#707070', // Start with dark mode values
      emissive: '#000000',
    });
    const edgeMaterial = new THREE.MeshLambertMaterial({
      color: '#505050', // Start with dark mode values
      emissive: '#000000',
    });
    return [faceMaterial, edgeMaterial];
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Smoothly transition material colors
    if (materials[0] && materials[1]) {
      const colorLerpFactor = delta * 6.5; // Match 0.75s transition speed

      if (theme === 'dark') {
        // Target dark mode colors
        materials[0].color.lerp(new THREE.Color('#707070'), colorLerpFactor);
        materials[0].emissive.lerp(new THREE.Color('#000000'), colorLerpFactor);
        materials[1].color.lerp(new THREE.Color('#505050'), colorLerpFactor);
        materials[1].emissive.lerp(new THREE.Color('#000000'), colorLerpFactor);
      } else {
        // Target light mode colors
        materials[0].color.lerp(new THREE.Color('#D8D8D2'), colorLerpFactor);
        materials[0].emissive.lerp(new THREE.Color('#000000'), colorLerpFactor);
        materials[1].color.lerp(new THREE.Color('#B8B8B2'), colorLerpFactor);
        materials[1].emissive.lerp(new THREE.Color('#000000'), colorLerpFactor);
      }
    }

    const hexPosition = new THREE.Vector3(...position);

    if (isMobile) {
      // On mobile, every hexagon rotates based on the overall tilt
      const maxRotationMobile = Math.PI * (35 / 180); // cap at 35 degrees

      // interactionPosition maps tilt to world space; normalise back to -1..1 range
      const rawX = THREE.MathUtils.clamp(interactionPosition.x / 10, -1, 1);
      const rawY = THREE.MathUtils.clamp(interactionPosition.y / 6, -1, 1);

      targetRotation.current.x = -rawY * maxRotationMobile;
      targetRotation.current.y = rawX * maxRotationMobile;
    } else {
      const distance = hexPosition.distanceTo(interactionPosition);
      const maxDistance = 5;
      const influence = Math.max(0, 1 - distance / maxDistance);

      // Calculate rotation based on interaction position and distance
      const direction = new THREE.Vector3()
        .subVectors(interactionPosition, hexPosition)
        .normalize();

      // Subtle rotation when mouse is closer
      const maxRotation = Math.PI * 0.3;
      targetRotation.current.x = direction.y * influence * maxRotation;
      targetRotation.current.y = direction.x * influence * maxRotation;
    }

    // Smooth interpolation to target rotation
    const lerpFactor = delta * 4;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      targetRotation.current.x,
      lerpFactor
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetRotation.current.y,
      lerpFactor
    );

    // Subtle floating animation
    const time = state.clock.getElapsedTime();
    const floatOffset = Math.sin(time * 0.5 + position[0] + position[1]) * 0.02;
    meshRef.current.position.z = floatOffset;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      geometry={geometry}
      material={materials}
      castShadow
      receiveShadow
    />
  );
}
