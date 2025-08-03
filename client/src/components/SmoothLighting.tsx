import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SmoothLightingProps {
  theme: 'light' | 'dark';
}

export function SmoothLighting({ theme }: SmoothLightingProps) {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const directionalRef = useRef<THREE.DirectionalLight>(null);
  const pointRef = useRef<THREE.PointLight>(null);
  
  const targetIntensity = useRef({
    ambient: 0.4, // Start with dark mode values
    directional: 0.6,
    point: 0.8
  });

  useEffect(() => {
    // Update target values when theme changes
    targetIntensity.current = {
      ambient: theme === 'light' ? 6 : 0.4,
      directional: theme === 'light' ? 10 : 0.6,
      point: theme === 'light' ? 2 : 0.8
    };
  }, [theme]);

  useFrame((state, delta) => {
    if (ambientRef.current && directionalRef.current && pointRef.current) {
      // Interpolation for lighting intensity (matching 0.75s transition)
      const lerpFactor = delta * 6.5; // Balanced for 0.75s transitions
      
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity,
        targetIntensity.current.ambient,
        lerpFactor
      );
      
      directionalRef.current.intensity = THREE.MathUtils.lerp(
        directionalRef.current.intensity,
        targetIntensity.current.directional,
        lerpFactor
      );
      
      pointRef.current.intensity = THREE.MathUtils.lerp(
        pointRef.current.intensity,
        targetIntensity.current.point,
        lerpFactor
      );
    }
  });

  return (
    <>
      <ambientLight 
        ref={ambientRef}
        intensity={0.4} // Start with dark mode values
      />
      <directionalLight
        ref={directionalRef}
        position={[10, 10, 5]}
        intensity={0.6} // Start with dark mode values
        castShadow
      />
      {/* Additional point light for better hexagon illumination in dark mode */}
      <pointLight
        ref={pointRef}
        position={[0, 0, 5]}
        intensity={0.8} // Start with dark mode values
        color="#ffffff"
      />
    </>
  );
}