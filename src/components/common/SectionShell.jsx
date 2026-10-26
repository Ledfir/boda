import React from 'react';
import { cn } from '@/lib/utils';

const TONES = {
  ivory: 'bg-background',
  champagne: 'bg-secondary/40',
  white: 'bg-card',
  graphite: 'bg-foreground text-background',
};

/** Contenedor de sección: espaciado amplio y ancho de lectura controlado. */
export default function SectionShell({ id, children, tone = 'ivory', wide = false, className = '' }) {
  return (
    <section
      id={id}
      className={cn(
        'relative w-full px-5 py-20 sm:px-8 sm:py-24 md:py-28',
        TONES[tone] ?? TONES.ivory,
        className,
      )}
    >
      <div className={cn('mx-auto w-full', wide ? 'max-w-6xl' : 'max-w-4xl')}>{children}</div>
    </section>
  );
}