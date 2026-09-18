import React, { useState, useEffect, useRef } from 'react';
import { LogOut, Sparkles, Volume2, VolumeX, Flower2, Mail, RotateCcw, Music } from 'lucide-react';
import { UserConfig, AnimationType } from '../types';
import { playFlowerChime, playGentleSparkle } from '../utils/audio';
import { HeroBouquet } from './HeroBouquet';

interface MainScreenProps {
  user: UserConfig;
  activeAnimation: AnimationType;
  onLogout: () => void;
  onOpenCodeModal: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

type SequenceStage = 'bouquet' | 'hiding' | 'letter';

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export const MainScreen: React.FC<MainScreenProps> = ({
  user,
  onLogout,
  soundEnabled,
  onToggleSound
}) => {
  // Secuencia universal: 'bouquet' (Fase 1) -> 'hiding' (Fase 2) -> 'letter' (Fase 3)
  const [sequenceStage, setSequenceStage] = useState<SequenceStage>('bouquet');
  const [sparkles, setSparkles] = useState<SparkleParticle[]>([]);
  const nextParticleId = useRef(0);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Audio automático de fondo para Keisy (ad-free)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Reproducción automática de audio al ingresar al perfil de Keisy
  useEffect(() => {
    if (user.username.toLowerCase() !== 'keisy') return;

    let isCancelled = false;
    const audio = audioRef.current;
    if (!audio) return;

    // Sincronizar estado inicial de volumen y silencio
    audio.muted = !soundEnabled;
    audio.volume = soundEnabled ? 1 : 0;

    const startAudio = () => {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (!isCancelled) {
              setIsPlaying(true);
            }
          })
          .catch(() => {
            // Si las políticas de autoplay del navegador requieren un toque inicial
            const playOnFirstTouch = () => {
              if (audioRef.current && !isCancelled) {
                audioRef.current.muted = !soundEnabled;
                audioRef.current.volume = soundEnabled ? 1 : 0;
                audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
              }
              window.removeEventListener('pointerdown', playOnFirstTouch);
              window.removeEventListener('touchstart', playOnFirstTouch);
              window.removeEventListener('click', playOnFirstTouch);
            };
            window.addEventListener('pointerdown', playOnFirstTouch, { once: true, passive: true });
            window.addEventListener('touchstart', playOnFirstTouch, { once: true, passive: true });
            window.addEventListener('click', playOnFirstTouch, { once: true, passive: true });
          });
      }
    };

    startAudio();

    return () => {
      isCancelled = true;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [user.username]);

  // Sincronización continua de silencio con el control general de sonido
  useEffect(() => {
    if (audioRef.current && user.username.toLowerCase() === 'keisy') {
      audioRef.current.muted = !soundEnabled;
      audioRef.current.volume = soundEnabled ? 1 : 0;
      if (soundEnabled && audioRef.current.paused) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  }, [soundEnabled, user.username]);

  // Función universal para iniciar o reiniciar la secuencia
  const runSequence = () => {
    // Limpiar temporizadores previos
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    // FASE 1: El Ramo es el protagonista inicial
    setSequenceStage('bouquet');
    if (soundEnabled) {
      playFlowerChime(user.username === 'leslie' ? 1.15 : user.username === 'nata' ? 1.2 : 1.05);
    }

    // FASE 2: Concluida la animación del ramo (2.8s), se oculta/desvanece suavemente
    const t1 = setTimeout(() => {
      setSequenceStage('hiding');

      // FASE 3: Solo cuando el ramo se ha escondido por completo (+850ms), aparece la Carta
      const t2 = setTimeout(() => {
        setSequenceStage('letter');
        if (soundEnabled) {
          playGentleSparkle();
        }
      }, 850);
      timeoutsRef.current.push(t2);
    }, 2800);
    timeoutsRef.current.push(t1);
  };

  useEffect(() => {
    runSequence();
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [user.username]);

  return (
    <div
      id="main-welcome-screen"
      className="relative z-20 min-h-screen w-full flex flex-col justify-between p-3 sm:p-6 md:p-8 animate-in fade-in zoom-in-95 duration-500 select-none will-change-transform"
    >
      {/* PARTÍCULAS SUTILES AL DISPARAR DESTELOS */}
      {sparkles.map((sp) => (
        <div
          key={sp.id}
          className="fixed pointer-events-none rounded-full animate-fade-star z-50 will-change-transform"
          style={{
            left: `${sp.x}px`,
            top: `${sp.y}px`,
            width: `${sp.size}px`,
            height: `${sp.size}px`,
            backgroundColor: sp.color,
            boxShadow: `0 0 6px ${sp.color}`
          }}
        />
      ))}

      {/* BARRA SUPERIOR DE NAVEGACIÓN */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Identificador de Usuario */}
        <div className="flex items-center gap-2.5 sm:gap-3 glass-panel-subtle px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl shadow-lg border border-amber-400/25">
          <span className="text-xl sm:text-2xl" role="img" aria-label="avatar">
            {user.avatarSeed || '💐'}
          </span>
          <div>
            <span className="text-[10px] sm:text-xs text-amber-300/80 uppercase tracking-wider font-semibold block">
              Para ti
            </span>
            <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
              {user.displayName}
            </span>
          </div>
        </div>

        {/* Controles rápidos (Sonido, Cerrar Sesión) */}
        <div className="flex items-center gap-2">
          {/* Botón de Sonido con vinculación real a audio.muted */}
          <button
            type="button"
            id="toggle-audio-btn"
            onClick={onToggleSound}
            className="p-2 sm:p-2.5 rounded-2xl glass-panel-subtle text-amber-200 hover:text-white hover:border-amber-400/50 transition-all cursor-pointer shadow-md active:scale-95"
            title={soundEnabled ? 'Silenciar sonido' : 'Activar sonido'}
            aria-label={soundEnabled ? 'Silenciar todo el audio' : 'Activar todo el audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-300" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Botón Cerrar Sesión */}
          <button
            type="button"
            id="logout-btn"
            onClick={onLogout}
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 hover:border-rose-400/60 transition-all text-xs font-semibold cursor-pointer shadow-md active:scale-95"
            title="Cerrar sesión y probar otro usuario"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* ESCENARIO PRINCIPAL: SECUENCIA RAMO -> OCULTAR -> CARTA */}
      <main className="my-auto w-full max-w-3xl mx-auto py-2 sm:py-4 flex flex-col items-center justify-center min-h-[460px] pointer-events-auto">
        
        {/* FASE 1 & FASE 2: EL RAMO DE FLORES AMARILLAS */}
        {(sequenceStage === 'bouquet' || sequenceStage === 'hiding') && (
          <div
            id="hero-bouquet-container"
            className={`transition-all duration-700 flex flex-col items-center will-change-transform ${
              sequenceStage === 'hiding'
                ? 'animate-bouquet-fade-out pointer-events-none'
                : 'animate-bouquet-bloom'
            }`}
          >
            <HeroBouquet user={user} interactive={true} />

            {/* Indicador sutil de fase 1 */}
            <div className="mt-2 text-xs font-medium text-amber-300/80 bg-slate-950/75 px-3 py-1 rounded-full border border-amber-400/25 shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>
                {sequenceStage === 'bouquet'
                  ? `Floreciendo ramo especial para ${user.displayName}...`
                  : `Preparando tu dedicatoria...`}
              </span>
            </div>
          </div>
        )}

        {/* FASE 3: LA CARTA / LETRA CON EL MENSAJE */}
        {sequenceStage === 'letter' && (
          <div
            id="dedication-letter-card"
            className="w-full max-w-2xl glass-panel golden-card-glow rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden border border-amber-400/35 text-center animate-letter-unfold will-change-transform"
          >
            {/* Adorno superior dorado de pergamino */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-1.5 bg-gradient-to-r from-transparent via-amber-400/90 to-transparent" />
            <div className="absolute top-0 right-0 w-28 h-28 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

            {/* Sello de la Carta */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold mb-4 shadow-sm">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {
                  {
                    leslie: 'Carta de Carlos',
                    ashlie: 'Carta de Carlos',
                    nata: 'Carta de Carlos',
                    naty: 'Carta de Carlos',
                    ange: 'Carta de Carlos',
                    ronald: 'Carta de Carlos',
                    keisy: 'Carta de Carlos',
                  }[user?.username?.toLowerCase()] || `Carta para ${user?.displayName || 'ti'}`
                }
              </span>
            </div>

            {/* Saludo Principal */}
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug mb-3">
              ¡Para ti,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                {user.displayName}
              </span>
              !
            </h2>

            {/* Línea divisoria ornamental */}
            <div className="flex items-center justify-center gap-2 my-2 opacity-80">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-400/60" />
              <Flower2 className="w-4 h-4 text-amber-400" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-400/60" />
            </div>

            {/* Contenido de la Carta / Letra con párrafos legibles */}
            <div className="my-4 sm:my-6 p-4 sm:p-7 rounded-2xl bg-slate-900/60 border border-amber-400/25 shadow-inner">
              <blockquote className="text-sm sm:text-base md:text-lg text-amber-100/95 font-serif italic leading-relaxed relative whitespace-pre-line text-left">
                <span className="text-3xl sm:text-4xl text-amber-400/40 font-serif absolute -top-4 -left-2">“</span>
                {user.customMessage}
                <span className="text-3xl sm:text-4xl text-amber-400/40 font-serif absolute -bottom-6 -right-2">”</span>
              </blockquote>
            </div>

            {/* REPRODUCCIÓN AUTOMÁTICA DE MÚSICA DE FONDO PARA KEISY (SIN BOTÓN DE PLAY/PAUSA) */}
            {user.username.toLowerCase() === 'keisy' && (
              <div
                id="keisy-auto-player"
                className="my-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-400/35 shadow-lg flex items-center justify-between gap-3 text-left"
              >
                {/* Elemento de audio nativo configurado para reproducirse automáticamente con la canción completa */}
                <audio
                  ref={audioRef}
                  id="keisy-audio-element"
                  src="/assets/audio/youth_stray_kids.mp3"
                  autoPlay
                  loop
                  preload="auto"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />

                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-sm shrink-0">
                    <Music className={`w-5 h-5 text-amber-300 ${isPlaying && soundEnabled ? 'animate-bounce' : ''}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm sm:text-base font-bold text-amber-200 truncate">Youth (청춘)</span>
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/25 text-amber-300 font-semibold border border-amber-400/30 shrink-0">
                        Lee Know · Stray Kids
                      </span>
                    </div>
                    <span className="text-xs text-amber-300/80 block mt-0.5 truncate">
                      ✨ Canción completa sonando automáticamente para ti
                    </span>
                  </div>
                </div>

                {/* Ecualizador visual animado que baila con la música de fondo */}
                <div className="flex items-end gap-1 h-5 px-1 shrink-0" title="Música reproduciéndose de fondo">
                  <span className={`w-1 bg-amber-400 rounded-full transition-all duration-300 ${isPlaying && soundEnabled ? 'animate-[pulse_0.8s_ease-in-out_infinite] h-3.5' : 'h-1.5 opacity-40'}`} />
                  <span className={`w-1 bg-yellow-300 rounded-full transition-all duration-300 ${isPlaying && soundEnabled ? 'animate-[pulse_0.5s_ease-in-out_infinite_0.2s] h-5' : 'h-2 opacity-40'}`} />
                  <span className={`w-1 bg-amber-400 rounded-full transition-all duration-300 ${isPlaying && soundEnabled ? 'animate-[pulse_0.7s_ease-in-out_infinite_0.4s] h-4' : 'h-1.5 opacity-40'}`} />
                  <span className={`w-1 bg-yellow-400 rounded-full transition-all duration-300 ${isPlaying && soundEnabled ? 'animate-[pulse_0.6s_ease-in-out_infinite_0.1s] h-3' : 'h-1 opacity-40'}`} />
                </div>
              </div>
            )}

            <div className="text-xs sm:text-sm text-amber-300/85 font-serif tracking-wide italic mt-3 mb-6">
              — Que la luz y calidez de este día te acompañen siempre en cada paso
            </div>

            {/* Acciones de la Carta: Repetir secuencia y activar destellos */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-amber-500/20">
              <button
                type="button"
                id="replay-bouquet-btn"
                onClick={runSequence}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400/20 to-yellow-400/20 hover:from-amber-400/30 hover:to-yellow-400/30 text-amber-200 hover:text-white border border-amber-400/40 hover:border-amber-400/70 text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
                title="Volver a ver la floración del ramo"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Volver a ver el ramo</span>
              </button>

              <button
                type="button"
                id="sparkle-tap-btn"
                onClick={() => {
                  if (soundEnabled) playGentleSparkle();
                  const cx = window.innerWidth / 2;
                  const cy = window.innerHeight / 2;
                  const newSp: SparkleParticle[] = Array.from({ length: 8 }, (_, i) => ({
                    id: nextParticleId.current++,
                    x: cx + (Math.random() - 0.5) * 160,
                    y: cy + (Math.random() - 0.5) * 120,
                    size: Math.random() * 6 + 3,
                    color: ['#fef08a', '#fde047', '#f59e0b', '#ffffff'][i % 4]
                  }));
                  setSparkles((prev) => [...prev.slice(-10), ...newSp]);
                  setTimeout(() => {
                    setSparkles((prev) => prev.filter((s) => !newSp.some((n) => n.id === s.id)));
                  }, 650);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/60 hover:bg-amber-500/20 text-amber-300 hover:text-amber-100 border border-amber-400/30 text-xs sm:text-sm font-medium transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Esparcir destellos</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* PIE DE PÁGINA ELEGANTE Y DISCRETO */}
      <footer className="w-full max-w-2xl mx-auto pointer-events-none pb-2 text-center">
        <p className="text-[11px] text-amber-200/50 font-light tracking-wider">
          🌻 Flores Amarillas · Un detalle especial para ti
        </p>
      </footer>
    </div>
  );
};
