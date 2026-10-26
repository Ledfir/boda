import React from 'react';
import { cn } from '@/lib/utils';
import Reveal from './Reveal';
import FloralDivider from './FloralDivider';

/** Encabezado de sección con kicker, ornamento y subtítulo. */
export default function SectionHeading({ kicker, title, subtitle, light = false, className = '' }) {
  return (
    <Reveal className={cn('flex flex-col items-center text-center', className)}>
      {kicker && (
        <span
          className={cn(
            'mb-4 text-[0.7rem] font-medium uppercase tracking-luxe',
            light ? 'text-primary' : 'text-primary',
          )}
        >
          {kicker}
        </span>
      )}
      <h2
        className={cn(
          'font-heading text-3xl leading-tight sm:text-4xl md:text-[2.6rem]',
          light ? 'text-background' : 'text-foreground',
        )}
      >
        {title}
      </h2>
      <FloralDivider className={cn('mt-5 h-8 w-52', light ? 'text-primary' : 'text-primary/80')} />
      {subtitle && (
        <p
          className={cn(
            'mt-5 max-w-2xl text-balance-luxe text-base leading-relaxed sm:text-lg',
            light ? 'text-background/85' : 'text-muted-foreground',
          )}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}