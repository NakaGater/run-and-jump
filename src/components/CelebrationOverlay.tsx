import { useEffect, useRef } from 'react';

interface Props {
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotSpeed: number;
  life: number;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  color: string;
}

const COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96E6A1', '#FF9FF3', '#FFA502'];
const DURATION = 3000;

export function CelebrationOverlay({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();

    const w = window.innerWidth;
    const h = window.innerHeight;

    // Create confetti particles
    const particles: Particle[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: w * 0.5 + (Math.random() - 0.5) * w * 0.3,
        y: h * 0.3,
        vx: (Math.random() - 0.5) * 400,
        vy: -200 - Math.random() * 300,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 4 + Math.random() * 6,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 10,
        life: 1,
      });
    }

    // Star burst
    const stars: Star[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      stars.push({
        x: w * 0.5 + Math.cos(angle) * 60,
        y: h * 0.25 + Math.sin(angle) * 60,
        radius: 0,
        maxRadius: 15 + Math.random() * 10,
        opacity: 1,
        color: COLORS[i % COLORS.length],
      });
    }

    let textBounce = 0;
    const startTime = performance.now();

    const animate = () => {
      const elapsed = performance.now() - startTime;
      if (elapsed > DURATION) {
        onComplete();
        return;
      }

      const dt = 1 / 60;
      ctx.clearRect(0, 0, w, h);

      // Update and draw confetti
      for (const p of particles) {
        p.vy += 400 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rotation += p.rotSpeed * dt;
        p.life = Math.max(0, 1 - elapsed / DURATION);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }

      // Stars
      for (const s of stars) {
        const t = Math.min(elapsed / 500, 1);
        s.radius = s.maxRadius * t;
        s.opacity = 1 - Math.max(0, (elapsed - 1500) / 1500);

        ctx.save();
        ctx.globalAlpha = Math.max(0, s.opacity);
        ctx.fillStyle = s.color;
        drawStar(ctx, s.x, s.y, s.radius);
        ctx.restore();
      }

      // "NEW HIGH SCORE!" text
      textBounce = Math.sin(elapsed * 0.008) * 10;
      const textOpacity = Math.min(1, elapsed / 300);
      const textScale = 1 + Math.sin(elapsed * 0.005) * 0.05;

      ctx.save();
      ctx.globalAlpha = textOpacity;
      ctx.translate(w / 2, h * 0.25 + textBounce);
      ctx.scale(textScale, textScale);
      ctx.font = 'bold 36px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 4;
      ctx.strokeText('NEW HIGH SCORE!', 0, 0);
      ctx.fillStyle = '#FFD700';
      ctx.fillText('NEW HIGH SCORE!', 0, 0);
      ctx.restore();

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        pointerEvents: 'none',
      }}
    />
  );
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  const spikes = 5;
  const outerR = r;
  const innerR = r * 0.4;
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (i * Math.PI) / spikes - Math.PI / 2;
    const radius = i % 2 === 0 ? outerR : innerR;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}
