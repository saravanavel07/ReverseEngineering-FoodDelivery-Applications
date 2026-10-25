import React, { useEffect, useRef, useState } from 'react';

interface ParticleBackgroundProps {
  enabled?: boolean;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  speedX: number;
  speedY: number;
  alpha: number;
  type: 'circle' | 'glow' | 'citrus-slice' | 'spice-star';
  rotation: number;
  rotSpeed: number;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ enabled = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [motionAllowed, setMotionAllowed] = useState(true);

  useEffect(() => {
    // Respect user's prefers-reduced-motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setMotionAllowed(!mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setMotionAllowed(!e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!enabled || !motionAllowed) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isPageVisible = true;

    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Limit particle counts on mobile
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 22 : 45;

    const colors = [
      'rgba(252, 128, 25, 0.22)',   // Primary orange
      'rgba(232, 111, 0, 0.18)',    // Deep orange
      'rgba(255, 179, 71, 0.25)',   // Amber gold
      'rgba(255, 241, 229, 0.40)',  // Warm cream
    ];

    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const isGlow = i % 7 === 0;
      const isShape = i % 10 === 0;

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: isGlow ? Math.random() * 25 + 15 : isShape ? Math.random() * 6 + 4 : Math.random() * 3.5 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 0.45,
        speedY: -Math.random() * 0.4 - 0.15, // gentle upward floating drift
        alpha: Math.random() * 0.5 + 0.2,
        type: isGlow ? 'glow' : isShape ? (i % 2 === 0 ? 'citrus-slice' : 'spice-star') : 'circle',
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
      });
    }

    const render = () => {
      if (!isPageVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        // Wrap around boundaries smoothly
        if (p.x < -40) p.x = canvas.width + 30;
        if (p.x > canvas.width + 40) p.x = -30;
        if (p.y < -40) p.y = canvas.height + 30;
        if (p.y > canvas.height + 40) p.y = -30;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === 'glow') {
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.radius);
          grad.addColorStop(0, 'rgba(252, 128, 25, 0.12)');
          grad.addColorStop(1, 'rgba(252, 128, 25, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'citrus-slice') {
          // Subtle citrus wedge segment
          ctx.strokeStyle = 'rgba(252, 128, 25, 0.2)';
          ctx.fillStyle = 'rgba(255, 241, 229, 0.18)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 0.6);
          ctx.lineTo(0, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (p.type === 'spice-star') {
          // Subtle tiny star anise / spice accent
          ctx.fillStyle = 'rgba(232, 111, 0, 0.2)';
          ctx.beginPath();
          for (let s = 0; s < 5; s++) {
            ctx.rotate(Math.PI / 2.5);
            ctx.ellipse(p.radius * 0.8, 0, p.radius * 0.4, p.radius * 0.15, 0, 0, Math.PI * 2);
          }
          ctx.fill();
        } else {
          // Gentle floating circular dot
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, motionAllowed]);

  if (!enabled || !motionAllowed) {
    return (
      <div
        className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-b from-[#FFF9F4] via-white to-[#FFF9F4]/70"
        aria-hidden="true"
      />
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none -z-20 bg-gradient-to-b from-[#FFF9F4] via-white to-[#FFF9F4]/70"
        aria-hidden="true"
      />
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none -z-10"
        aria-hidden="true"
      />
    </>
  );
};
