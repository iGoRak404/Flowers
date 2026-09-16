import React, { useState, useEffect } from 'react';
import { Sparkles, Sun } from 'lucide-react';
import { playFlowerChime } from '../../utils/audio';

interface SunflowerBloomSVGProps {
  interactive?: boolean;
}

export const SunflowerBloomSVG: React.FC<SunflowerBloomSVGProps> = ({ interactive = true }) => {
  const [bloomKey, setBloomKey] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [pulseRings, setPulseRings] = useState<{ id: number; x: number; y: number }[]>([]);

  const outerPetalsCount = 22;
  const innerPetalsCount = 18;

  const handleBloomClick = (e: React.MouseEvent) => {
    if (!interactive) return;
    playFlowerChime(1.1);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPulseRings((prev) => [...prev.slice(-3), { id: Date.now(), x, y }]);
    setBloomKey((k) => k + 1);
  };

  useEffect(() => {
    // Al montarse, reproducir el acorde cálido inicial
    const t = setTimeout(() => {
      playFlowerChime(1);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      id="sunflower-bloom-container"
      className="fixed inset-0 pointer-events-none z-10 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Resplandor radial de fondo */}
      <div className="absolute w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full bg-radial from-amber-400/20 via-yellow-500/10 to-transparent blur-3xl animate-pulse pointer-events-none" />

      {/* Partículas de polen y luz dorada flotando hacia arriba */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={`pollen-${i}`}
            className="absolute rounded-full bg-amber-300 shadow-[0_0_12px_#f59e0b] animate-float-pollen"
            style={{
              width: `${4 + (i % 5)}px`,
              height: `${4 + (i % 5)}px`,
              left: `${15 + (i * 3.5) % 70}%`,
              bottom: `${(i * 12) % 100}%`,
              opacity: 0.2 + ((i % 5) * 0.15),
              animationDuration: `${5 + (i % 6)}s`,
              animationDelay: `${(i * 0.4)}s`
            }}
          />
        ))}
      </div>

      {/* Contenedor central del girasol interactivo */}
      <div
        className="relative pointer-events-auto cursor-pointer group select-none transition-transform duration-700 ease-out"
        onClick={handleBloomClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="¡Haz clic en el girasol para hacerlo florecer de nuevo!"
      >
        {/* Anillos de pulsación al hacer clic */}
        {pulseRings.map((ring) => (
          <span
            key={ring.id}
            className="absolute rounded-full border-2 border-amber-400/80 animate-ping pointer-events-none"
            style={{
              left: ring.x - 50,
              top: ring.y - 50,
              width: 100,
              height: 100
            }}
          />
        ))}

        <svg
          key={bloomKey}
          viewBox="0 0 500 650"
          className={`w-[320px] h-[410px] sm:w-[420px] sm:h-[540px] md:w-[500px] md:h-[650px] drop-shadow-[0_15px_35px_rgba(234,179,8,0.35)] transition-all duration-500 ${
            isHovered ? 'scale-105 filter drop-shadow-[0_20px_45px_rgba(245,158,11,0.5)]' : ''
          }`}
        >
          <defs>
            {/* Gradientes dorados ricos para pétalos */}
            <linearGradient id="petalGradOuter" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="40%" stopColor="#f59e0b" />
              <stop offset="85%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>

            <linearGradient id="petalGradInner" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="35%" stopColor="#d97706" />
              <stop offset="80%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#fef3c7" />
            </linearGradient>

            {/* Gradiente para el disco central */}
            <radialGradient id="centerCoreGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#451a03" />
              <stop offset="60%" stopColor="#78350f" />
              <stop offset="88%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>

            {/* Gradiente tallo */}
            <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#15803d" />
              <stop offset="50%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#166534" />
            </linearGradient>

            {/* Gradiente hojas */}
            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="50%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#14532d" />
            </linearGradient>

            {/* Sombra de pétalo */}
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* TALLO Y HOJAS CON BRISA NATURAL */}
          <g className="animate-stem-sway origin-bottom">
            {/* Tallo */}
            <path
              d="M 250 250 Q 240 450 250 630"
              stroke="url(#stemGrad)"
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
            />

            {/* Hoja Izquierda */}
            <g transform="translate(230, 420) rotate(-28)">
              <path
                d="M 0 0 C -60 -40 -120 10 -90 60 C -60 100 0 10 0 0 Z"
                fill="url(#leafGrad)"
                stroke="#15803d"
                strokeWidth="2"
                className="animate-leaf-left origin-top-right"
              />
              <path d="M 0 0 C -45 20 -75 40 -85 55" stroke="#86efac" strokeWidth="2" fill="none" opacity="0.6" />
            </g>

            {/* Hoja Derecha */}
            <g transform="translate(260, 490) rotate(25)">
              <path
                d="M 0 0 C 70 -40 130 15 100 65 C 70 105 0 10 0 0 Z"
                fill="url(#leafGrad)"
                stroke="#15803d"
                strokeWidth="2"
                className="animate-leaf-right origin-top-left"
              />
              <path d="M 0 0 C 50 20 85 45 95 60" stroke="#86efac" strokeWidth="2" fill="none" opacity="0.6" />
            </g>
          </g>

          {/* CABEZA DEL GIRASOL EN FLORACIÓN CENTRAL */}
          <g transform="translate(250, 250)">
            {/* Capa de destellos mágicos detrás de la flor */}
            <circle cx="0" cy="0" r="140" fill="rgba(251, 191, 36, 0.15)" filter="url(#softGlow)" />

            {/* CAPA 1: PÉTALOS EXTERIORES (22 pétalos con floración progresiva) */}
            <g className="animate-bloom-outer origin-center">
              {Array.from({ length: outerPetalsCount }).map((_, i) => {
                const angle = (360 / outerPetalsCount) * i;
                const delay = i * 0.04;
                return (
                  <g
                    key={`outer-${i}`}
                    transform={`rotate(${angle})`}
                    style={{
                      transformOrigin: '0px 0px'
                    }}
                  >
                    <path
                      d="M 0 0 C -22 -60 -26 -145 0 -195 C 26 -145 22 -60 0 0 Z"
                      fill="url(#petalGradOuter)"
                      stroke="#f59e0b"
                      strokeWidth="1.2"
                      style={{
                        animation: `petalUnfold 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
                        animationDelay: `${delay}s`,
                        transformOrigin: '0px 0px'
                      }}
                    />
                    {/* Nervadura dorada central */}
                    <line
                      x1="0"
                      y1="-20"
                      x2="0"
                      y2="-175"
                      stroke="#d97706"
                      strokeWidth="1.2"
                      opacity="0.5"
                    />
                  </g>
                );
              })}
            </g>

            {/* CAPA 2: PÉTALOS INTERIORES (18 pétalos intercalados) */}
            <g className="animate-bloom-inner origin-center">
              {Array.from({ length: innerPetalsCount }).map((_, i) => {
                const angle = (360 / innerPetalsCount) * i + (360 / innerPetalsCount / 2);
                const delay = 0.3 + i * 0.04;
                return (
                  <g
                    key={`inner-${i}`}
                    transform={`rotate(${angle})`}
                    style={{
                      transformOrigin: '0px 0px'
                    }}
                  >
                    <path
                      d="M 0 0 C -18 -45 -22 -115 0 -160 C 22 -115 18 -45 0 0 Z"
                      fill="url(#petalGradInner)"
                      stroke="#d97706"
                      strokeWidth="1.2"
                      style={{
                        animation: `petalUnfold 1.1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
                        animationDelay: `${delay}s`,
                        transformOrigin: '0px 0px'
                      }}
                    />
                  </g>
                );
              })}
            </g>

            {/* CORONA DE PÉTALOS DE RETOQUE CERCANOS AL CORAZÓN */}
            {Array.from({ length: 14 }).map((_, i) => {
              const angle = (360 / 14) * i + 12;
              return (
                <g key={`small-${i}`} transform={`rotate(${angle})`}>
                  <path
                    d="M 0 0 C -12 -25 -14 -70 0 -95 C 14 -70 12 -25 0 0 Z"
                    fill="#fbbf24"
                    opacity="0.9"
                  />
                </g>
              );
            })}

            {/* DISCO CENTRAL (Fibonacci / Semillas concéntricas) */}
            <circle
              cx="0"
              cy="0"
              r="76"
              fill="url(#centerCoreGrad)"
              stroke="#ca8a04"
              strokeWidth="3.5"
              className="animate-core-pulse origin-center shadow-inner"
            />

            {/* ESPIRAL DE FIBONACCI DE SEMILLAS DORADAS */}
            <g opacity="0.85">
              {Array.from({ length: 90 }).map((_, idx) => {
                const phi = 137.5 * (Math.PI / 180);
                const r = Math.sqrt(idx + 1) * 7.2;
                const theta = idx * phi;
                const x = r * Math.cos(theta);
                const y = r * Math.sin(theta);
                const dotSize = 1.4 + (idx / 90) * 2.2;
                const isOuter = idx > 50;

                return (
                  <circle
                    key={`seed-${idx}`}
                    cx={x}
                    cy={y}
                    r={dotSize}
                    fill={isOuter ? '#d97706' : '#f59e0b'}
                    opacity={0.7 + (idx % 3) * 0.15}
                  />
                );
              })}
            </g>

            {/* Anillo de polen dorado brillante */}
            <circle
              cx="0"
              cy="0"
              r="74"
              fill="none"
              stroke="#fef08a"
              strokeWidth="2"
              strokeDasharray="4, 6"
              className="animate-spin-slow origin-center"
              opacity="0.8"
            />
          </g>
        </svg>

        {/* Botón flotante interactivo sutil */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-amber-500/20 backdrop-blur-md border border-amber-300/40 rounded-full px-4 py-1.5 text-xs text-amber-200 flex items-center gap-1.5 shadow-lg group-hover:bg-amber-500/30 transition-colors">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span>Toca para florecer</span>
        </div>
      </div>
    </div>
  );
};
