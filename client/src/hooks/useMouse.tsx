import { useState, useEffect } from 'react';

export function useMouse() {
  const [position, setPosition] = useState({ x: -10, y: -10, isMobile: false });

  useEffect(() => {
    // Check if device supports orientation (mobile)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        // gamma: left-to-right (range -90 to 90), center is 0
        // beta: front-to-back (range -180 to 180), center is roughly 45 when holding naturally
        
        // Map gamma (-45 to 45) to (0 to 1) for X
        const x = ((event.gamma || 0) + 45) / 90;
        // Map beta (20 to 70) to (0 to 1) for Y (more natural holding angle)
        const y = ((event.beta || 45) - 20) / 50;
        
        const clampedX = Math.max(0, Math.min(1, x));
        const clampedY = Math.max(0, Math.min(1, y));
        
        setPosition({ x: clampedX, y: clampedY, isMobile: true });
      };

      const requestPermission = async () => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
          try {
            const permissionState = await (DeviceOrientationEvent as any).requestPermission();
            if (permissionState === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation);
            }
          } catch (e) {
            console.error("DeviceOrientation permission denied", e);
          }
        } else {
          window.addEventListener('deviceorientation', handleOrientation);
        }
      };

      // We need a user interaction to trigger requestPermission on iOS
      // But we'll try adding it immediately for other devices
      requestPermission();

      return () => window.removeEventListener('deviceorientation', handleOrientation);
    } else {
      const handleMouseMove = (event: MouseEvent) => {
        const x = event.clientX / window.innerWidth;
        const y = event.clientY / window.innerHeight;
        setPosition({ x, y, isMobile: false });
      };

      const handleMouseLeave = () => {
        setPosition({ x: -10, y: -10, isMobile: false });
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
      document.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
        document.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return position;
}
