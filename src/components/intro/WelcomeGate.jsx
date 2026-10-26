import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from 'framer-motion';
import FloralDivider from '@/components/common/FloralDivider';
import { weddingConfig } from '@/config/wedding';

/**
 * Pantalla de bienvenida: iniciales sobre fondo marfil, ornamento floral y el
 * botón «Abrir invitación» que abre el sobre con una transición cinematográfica.
 */
export default function WelcomeGate({ onOpen }) {
  const rootRef = useRef(null);
  const flapRef = useRef(null);
  const cardRef = useRef(null);
  const overlayRef = useRef(null);
  const [opening, setOpening] = useState(false);
  const [done, setDone] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return undefined;
    const context = gsap.context(() => {
      gsap.from('[data-gate="item"]', {
        opacity: 0,
        y: 26,
        duration: 1.2,
        stagger: 0.4,
        ease: 'power2.out',
        delay: 0.2,
      });
    }, rootRef);
    return () => context.revert();
  }, [reduceMotion]);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    onOpen?.();

    if (reduceMotion) {
      setDone(true);
      return;
    }

    const timeline = gsap.timeline({ onComplete: () => setDone(true) });
    timeline
      .to(flapRef.current, { rotateX: -178, duration: 1, ease: 'power3.inOut' })
      .to(cardRef.current, { yPercent: 12, opacity: 0, scale: 1.04, duration: 0.9, ease: 'power2.inOut' }, '-=0.35')
      .to(overlayRef.current, { opacity: 0, duration: 0.7, ease: 'power1.inOut' }, '-=0.45');
  };

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background px-5"
    >
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-secondary/50 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-accent/25 blur-3xl" aria-hidden="true" />

      <div ref={cardRef} className="relative w-full max-w-sm" style={{ perspective: '1200px' }}>
        <div
          ref={flapRef}
          className="absolute inset-x-0 top-0 z-20 h-28 origin-top border-x border-t border-primary/35 bg-secondary/80"
          style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', transformStyle: 'preserve-3d' }}
          aria-hidden="true"
        />

        <div className="relative z-10 glass-ivory border border-primary/30 px-8 pb-12 pt-16 text-center shadow-2xl sm:px-10">
          <p data-gate="item" className="font-display text-5xl leading-none text-primary sm:text-6xl">
            {weddingConfig.couple.initials}
          </p>

          <FloralDivider className="mx-auto mt-6 h-8 w-44 text-primary" />

          <p data-gate="item" className="mt-6 font-heading text-lg italic text-foreground sm:text-xl">
            {weddingConfig.couple.display}
          </p>

          <p data-gate="item" className="mt-4 font-accent text-base text-muted-foreground sm:text-lg">
            {weddingConfig.cover.welcomeText}
          </p>

          <button
            data-gate="item"
            type="button"
            onClick={handleOpen}
            className="group mt-9 inline-flex w-full items-center justify-center gap-3 border border-primary bg-transparent px-7 py-3.5 font-body text-[0.7rem] font-medium uppercase tracking-luxe text-foreground transition-colors duration-500 hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Abrir invitación
            <span className="h-px w-6 bg-primary transition-all duration-500 group-hover:w-10" aria-hidden="true" />
          </button>

          <p data-gate="item" className="mt-6 text-[0.68rem] uppercase tracking-wide-luxe text-muted-foreground">
            Con música · puedes silenciarla cuando quieras
          </p>
        </div>
      </div>
    </div>
  );
}