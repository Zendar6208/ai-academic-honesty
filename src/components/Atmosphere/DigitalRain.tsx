import React, { useEffect, useRef } from 'react';

interface DigitalRainProps {
  opacity?: number;
  active?: boolean;
}

export const DigitalRain: React.FC<DigitalRainProps> = ({ 
  opacity = 0.35,
  active = true 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !active) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.fillStyle = '#050807';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ010101アイウエオカキクケコサシスセソタチツテトナニヌネノ∑∫∂√∆π';
    const charArray = chars.split('');

    const fontSize = 14;
    let columns = Math.floor(width / fontSize);
    let drops: number[] = new Array(columns).fill(1).map(() => Math.floor(Math.random() * -40));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(1).map(() => Math.floor(Math.random() * -40));
    };

    window.addEventListener('resize', handleResize);

    let lastDrawTime = 0;
    const targetFPS = 28; // Calibrated for smooth atmospheric cinematic drift
    const frameInterval = 1000 / targetFPS;

    const render = (currentTime: number) => {
      // Pause rendering if window has scrolled deep down past hero section
      if (window.scrollY > window.innerHeight * 1.5) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      animationFrameId = requestAnimationFrame(render);

      const elapsed = currentTime - lastDrawTime;
      if (elapsed < frameInterval) return;
      lastDrawTime = currentTime - (elapsed % frameInterval);

      ctx.fillStyle = 'rgba(5, 8, 7, 0.09)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px 'IBM Plex Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        if (Math.random() > 0.88) {
          ctx.fillStyle = '#8AFFB2';
          ctx.shadowColor = '#00FF88';
          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle = 'rgba(0, 255, 136, 0.5)';
          ctx.shadowBlur = 0;
        }

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.98) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  return (
    <canvas 
      ref={canvasRef} 
      className="digital-rain-canvas"
      style={{ 
        opacity,
        pointerEvents: 'none'
      }}
      aria-hidden="true"
    />
  );
};
