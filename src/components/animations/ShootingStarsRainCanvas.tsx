import React, { useEffect, useRef } from 'react';
import { playCelestialChime } from '../../utils/audio';

interface ShootingStarsRainCanvasProps {
  interactive?: boolean;
}

interface ShootingStar {
  x: number;
  y: number;
  len: number;
  speed: number;
  alpha: number;
  maxAlpha: number;
  fadeSpeed: number;
  width: number;
  color: string;
  headColor: string;
  active: boolean;
  delay: number;
}

interface FallingStardust {
  x: number;
  y: number;
  speedY: number;
  speedX: number;
  size: number;
  alpha: number;
  twinklePhase: number;
  twinkleSpeed: number;
  color: string;
}

/**
 * Motor de lluvia de estrellas ultra-optimizado sin lag:
 * - Pool de objetos estático (cero asignaciones / sin garbage collection en el bucle)
 * - Trazo directo por coordenadas
 * - 60 FPS garantizado en dispositivos móviles y de escritorio
 */
export const ShootingStarsRainCanvas: React.FC<ShootingStarsRainCanvasProps> = ({
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = window.innerWidth < 640;

    // Ángulo fijo diagonal (~48 grados) para evitar cálculos trigonométricos por fotograma
    const cosAngle = 0.7071; // cos(45°)
    const sinAngle = 0.7071; // sin(45°)

    const starPalettes = [
      { trail: '#fde047', head: '#ffffff' }, // Oro luminoso
      { trail: '#fef08a', head: '#fffbeb' }, // Amarillo suave
      { trail: '#38bdf8', head: '#f0f9ff' }, // Celeste brillante
      { trail: '#fbbf24', head: '#ffffff' }, // Ámbar cálido
    ];

    // 1. POOL FIJO DE ESTRELLAS FUGACES (Sin 'push' ni 'splice' por fotograma)
    const MAX_STARS = isMobile ? 10 : 18;
    const stars: ShootingStar[] = new Array(MAX_STARS);

    const resetStar = (s: ShootingStar, initialDelay = 0) => {
      const palette = starPalettes[Math.floor(Math.random() * starPalettes.length)];
      s.x = Math.random() * (width + 200) - 200;
      s.y = -60 - Math.random() * 150;
      s.len = 70 + Math.random() * (isMobile ? 70 : 120);
      s.speed = 10 + Math.random() * (isMobile ? 8 : 12);
      s.maxAlpha = 0.6 + Math.random() * 0.4;
      s.alpha = 0.1;
      s.fadeSpeed = 0.015 + Math.random() * 0.015;
      s.width = 1.2 + Math.random() * 1.3;
      s.color = palette.trail;
      s.headColor = palette.head;
      s.active = false;
      s.delay = initialDelay;
    };

    for (let i = 0; i < MAX_STARS; i++) {
      stars[i] = {
        x: 0,
        y: 0,
        len: 0,
        speed: 0,
        alpha: 0,
        maxAlpha: 0,
        fadeSpeed: 0,
        width: 0,
        color: '',
        headColor: '',
        active: false,
        delay: Math.floor(Math.random() * 90),
      };
      resetStar(stars[i], Math.floor(Math.random() * 120));
    }

    // 2. POOL FIJO DE POLVO ESTELAR CAYENDO SUAVEMENTE (Lluvia de motas estelares)
    const MAX_DUST = isMobile ? 18 : 34;
    const dustPool: FallingStardust[] = new Array(MAX_DUST);
    const dustColors = ['#ffffff', '#fef08a', '#fde047', '#7dd3fc', '#fef9c3'];

    const resetDust = (d: FallingStardust, startY?: number) => {
      d.x = Math.random() * width;
      d.y = startY !== undefined ? startY : Math.random() * height;
      d.speedY = 0.4 + Math.random() * 1.1;
      d.speedX = 0.2 + Math.random() * 0.6;
      d.size = 1.0 + Math.random() * 2.2;
      d.alpha = 0.3 + Math.random() * 0.6;
      d.twinklePhase = Math.random() * Math.PI * 2;
      d.twinkleSpeed = 0.03 + Math.random() * 0.05;
      d.color = dustColors[Math.floor(Math.random() * dustColors.length)];
    };

    for (let i = 0; i < MAX_DUST; i++) {
      dustPool[i] = {
        x: 0,
        y: 0,
        speedY: 0,
        speedX: 0,
        size: 0,
        alpha: 0,
        twinklePhase: 0,
        twinkleSpeed: 0,
        color: '',
      };
      resetDust(dustPool[i]);
    }

    // Manejo de redimensionado sin lag
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Disparar estrella fugaz al interactuar (toque/clic)
    const handleSpawnInteractiveStar = (clientX: number, clientY: number) => {
      if (!interactive) return;
      playCelestialChime();

      // Buscar una estrella inactiva en el pool
      for (let i = 0; i < MAX_STARS; i++) {
        const s = stars[i];
        if (!s.active) {
          s.x = Math.max(20, clientX - 120);
          s.y = Math.max(-20, clientY - 140);
          s.len = 120 + Math.random() * 60;
          s.speed = 15 + Math.random() * 5;
          s.alpha = 1.0;
          s.maxAlpha = 1.0;
          s.active = true;
          s.delay = 0;
          break;
        }
      }
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      handleSpawnInteractiveStar(clientX, clientY);
    };

    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('touchstart', onPointerDown, { passive: true });

    // BUCLE DE ANIMACIÓN LIGERO A 60 FPS
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Dibujar polvo estelar cayendo (partículas luminosas suaves)
      for (let i = 0; i < MAX_DUST; i++) {
        const d = dustPool[i];
        d.y += d.speedY;
        d.x += d.speedX;
        d.twinklePhase += d.twinkleSpeed;

        const currentAlpha = Math.max(0.1, d.alpha + Math.sin(d.twinklePhase) * 0.25);

        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();

        if (d.y > height + 10 || d.x > width + 10) {
          resetDust(d, -10);
        }
      }

      // 2. Dibujar estrellas fugaces
      for (let i = 0; i < MAX_STARS; i++) {
        const s = stars[i];

        if (s.delay > 0) {
          s.delay--;
          continue;
        }

        if (!s.active) {
          s.active = true;
        }

        s.x += cosAngle * s.speed;
        s.y += sinAngle * s.speed;

        // Fading suave
        if (s.alpha < s.maxAlpha) {
          s.alpha = Math.min(s.maxAlpha, s.alpha + 0.1);
        }

        const tailX = s.x - cosAngle * s.len;
        const tailY = s.y - sinAngle * s.len;

        // Trazo de la cola de la estrella fugaz con gradiente lineal
        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(0.7, s.color);
        grad.addColorStop(1, s.headColor);

        ctx.globalAlpha = s.alpha;
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.width;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        // Cabeza brillante de la estrella
        ctx.fillStyle = s.headColor;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.width * 1.3, 0, Math.PI * 2);
        ctx.fill();

        // Si sale de los límites de pantalla, reestablecer en el pool con pausa aleatoria
        if (s.x > width + 120 || s.y > height + 120) {
          resetStar(s, Math.floor(20 + Math.random() * 80));
        }
      }

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('touchstart', onPointerDown);
    };
  }, [interactive]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.95 }}
    />
  );
};
