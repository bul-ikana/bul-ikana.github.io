import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Hexagon } from './Hexagon';
import * as THREE from 'three';

interface HexagonGridProps {
  mousePosition: { x: number; y: number; isMobile?: boolean };
  theme: 'light' | 'dark';
}

export function HexagonGrid({ mousePosition, theme }: HexagonGridProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Calculate hexagon grid positions for proper tessellation {6,3}
  const hexagons = useMemo(() => {
    const hexagons: Array<{ x: number; y: number; z: number; id: string }> = [];
    const hexRadius = 1.4; // Grid spacing radius
    
    // Proper hexagonal tessellation {6,3} - three hexagons meet at each vertex
    // Distance from center to center horizontally (flat-top orientation)
    const horizontalSpacing = hexRadius * Math.sqrt(3);
    // Distance from center to center vertically
    const verticalSpacing = hexRadius * 1.5;
    
    // Grid dimensions to cover viewport
    const gridCols = 25;
    const gridRows = 20;
    
    for (let row = -gridRows; row <= gridRows; row++) {
      for (let col = -gridCols; col <= gridCols; col++) {
        // Offset every other row by half the horizontal spacing for proper tessellation
        const offsetX = (row % 2) * (horizontalSpacing / 2);
        const x = col * horizontalSpacing + offsetX;
        const y = row * verticalSpacing;
        
        hexagons.push({
          x,
          y,
          z: 0,
          id: `hex-${row}-${col}`
        });
      }
    }
    
    return hexagons;
  }, []);

  // Convert interaction position to world coordinates
  const worldMouse = useMemo(() => {
    if (!mousePosition) return new THREE.Vector3(0, 0, 0);
    
    // Convert normalized device coordinates to world space
    const x = (mousePosition.x - 0.5) * 20; // Scale to world size
    const y = -(mousePosition.y - 0.5) * 12; // Flip Y and scale
    
    return new THREE.Vector3(x, y, 0);
  }, [mousePosition.x, mousePosition.y]);

  return (
    <group ref={groupRef}>
      {hexagons.map((hex) => (
        <Hexagon
          key={hex.id}
          position={[hex.x, hex.y, hex.z]}
          interactionPosition={worldMouse}
          isMobile={mousePosition.isMobile}
          theme={theme}
        />
      ))}
    </group>
  );
}
