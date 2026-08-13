import { useState, useEffect, useRef } from 'react';

type Position = { x: number; y: number; isMobile: boolean };

const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

function useAutoAnimation(active: boolean, setPosition: (p: Position) => void) {
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!active) return;

    let startTime: number | null = null;
    const EASE_IN_DURATION = 2000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const t = (timestamp - startTime) / 1000;
      const elapsed = timestamp - startTime;

      const easeIn = Math.min(1, elapsed / EASE_IN_DURATION);

      const radius = 0.4;
      const speed = 0.3;

      const x = 0.5 + easeIn * radius * Math.cos(t * speed);
      const y = 0.5 + easeIn * radius * Math.sin(t * speed);

      setPosition({ x, y, isMobile: true });
      rafRef.current = requestAnimationFrame(animate);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        startTime = null; // will be reset on next frame
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, setPosition]);
}

export function useMouse() {
  const [position, setPosition] = useState<Position>({
    x: -10,
    y: -10,
    isMobile: false,
  });
  const [useAnimation, setUseAnimation] = useState(false);

  useAutoAnimation(useAnimation, setPosition);

  useEffect(() => {
    if (isMobile) {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        const x = Math.max(0, Math.min(1, ((event.gamma || 0) + 45) / 90));
        const y = Math.max(0, Math.min(1, ((event.beta || 45) - 20) / 50));
        setPosition({ x, y, isMobile: true });
      };

      const requestPermission = async () => {
        if (
          typeof (DeviceOrientationEvent as any).requestPermission ===
          'function'
        ) {
          try {
            const state = await (
              DeviceOrientationEvent as any
            ).requestPermission();
            if (state === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation);
            } else {
              setUseAnimation(true);
            }
          } catch {
            setUseAnimation(true);
          }
        } else if (isIOS) {
          setUseAnimation(true);
        } else {
          window.addEventListener('deviceorientation', handleOrientation);
        }
      };

      requestPermission();
      return () =>
        window.removeEventListener('deviceorientation', handleOrientation);
    } else {
      const handleMouseMove = (event: MouseEvent) => {
        setPosition({
          x: event.clientX / window.innerWidth,
          y: event.clientY / window.innerHeight,
          isMobile: false,
        });
      };
      const handleMouseLeave = () =>
        setPosition({ x: -10, y: -10, isMobile: false });

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
