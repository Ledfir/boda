import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Music, Volume2, VolumeX, X } from 'lucide-react';
import { weddingConfig } from '@/config/wedding';
import useAmbientMusic from '@/hooks/useAmbientMusic';
import { setAmbientVolume, toggleAmbient } from '@/lib/ambientAudio';
import { cn } from '@/lib/utils';

/** Botón flotante de música: nunca reinicia la canción al desplazarse. */
export default function MusicToggle() {
  const { available, playing, volume } = useAmbientMusic();
  const [expanded, setExpanded] = useState(false);
  const { music } = weddingConfig;

  const bars = [0, 1, 2, 3];

  return (
    <div className="fixed right-4 top-4 z-[70] flex flex-col items-end gap-3 sm:right-6 sm:top-6">
      <div className="flex items-center gap-2">
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.35 }}
              className="glass-ivory w-60 rounded-sm border border-primary/30 px-4 py-3 shadow-xl"
            >
              {available ? (
                <>
                  <p className="truncate font-heading text-sm text-foreground">
                    {music.title || 'Música ambiental'}
                  </p>
                  <p className="mt-0.5 truncate text-[0.6rem] uppercase tracking-wide-luxe text-muted-foreground">
                    {music.artist || weddingConfig.couple.display}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    {playing ? (
                      <Volume2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    ) : (
                      <VolumeX className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                    )}
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={(event) => setAmbientVolume(Number(event.target.value))}
                      aria-label="Volumen de la música"
                      className="h-1 w-full cursor-pointer accent-primary"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={toggleAmbient}
                    className="mt-3 w-full border border-primary/40 py-2 text-[0.62rem] uppercase tracking-wide-luxe text-foreground transition hover:bg-primary hover:text-primary-foreground"
                  >
                    {playing ? 'Pausar música' : 'Reproducir música'}
                  </button>
                </>
              ) : (
                <>
                  <p className="font-heading text-sm text-foreground">Música no configurada</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    Añade el archivo MP3 de la boda y la canción sonará automáticamente después de
                    abrir la invitación.
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-label={expanded ? 'Cerrar controles de música' : 'Controles de música'}
          aria-expanded={expanded}
          className={cn(
            'glass-ivory inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/40 text-foreground shadow-lg transition hover:border-primary',
            !available && 'opacity-70',
          )}
        >
          {expanded ? (
            <X className="h-4 w-4" aria-hidden="true" />
          ) : available && playing ? (
            <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
              {bars.map((bar) => (
                <motion.span
                  key={bar}
                  className="w-[2px] rounded-full bg-primary"
                  animate={{ height: ['5px', '14px', '8px'] }}
                  transition={{
                    duration: 1.1,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    delay: bar * 0.14,
                  }}
                />
              ))}
            </span>
          ) : (
            <Music className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}