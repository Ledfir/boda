import React from 'react';
import { Image } from '@/components/ui/image';
import Reveal from '@/components/common/Reveal';
import FloralDivider from '@/components/common/FloralDivider';
import { weddingConfig, IMAGES } from '@/config/wedding';

/** Cierre romántico de la invitación. */
export default function Closing() {
  const { texts, couple, date } = weddingConfig;

  return (
    <section id="cierre" className="relative w-full overflow-hidden bg-foreground">
      <Image
        src={IMAGES.closing}
        alt="Los novios caminando al atardecer"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        fittingType="fill"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/55 to-foreground/80"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center sm:py-32">
        <Reveal>
          <p className="font-display text-4xl text-primary sm:text-5xl">{couple.initials}</p>
        </Reveal>

        <Reveal delay={0.12}>
          <h2 className="mt-8 font-heading text-2xl leading-snug text-background sm:text-3xl md:text-4xl">
            {texts.closingTitle}
          </h2>
        </Reveal>

        <FloralDivider className="mt-8 h-8 w-56 text-primary" />

        <Reveal delay={0.2}>
          <p className="mt-8 max-w-xl font-accent text-lg italic leading-relaxed text-background/90 sm:text-xl">
            {texts.closingText}
          </p>
        </Reveal>

        <Reveal delay={0.28} className="mt-12">
          <p className="font-heading text-xl tracking-wide-luxe text-background sm:text-2xl">
            {couple.display}
          </p>
          <p className="mt-3 text-[0.66rem] uppercase tracking-luxe text-background/75">
            {date.displayLong}
          </p>
        </Reveal>
      </div>
    </section>
  );
}