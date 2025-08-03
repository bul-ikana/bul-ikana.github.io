import { useState, useEffect } from 'react';

export function useMouse() {
  const [mousePosition, setMousePosition] = useState({ x: -10, y: -10 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse position to [0, 1]
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
      // Move mouse position far away so no hexagons are influenced
      setMousePosition({ x: -10, y: -10 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Set initial position far away so hexagons start flat
    setMousePosition({ x: -10, y: -10 });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return mousePosition;
}
