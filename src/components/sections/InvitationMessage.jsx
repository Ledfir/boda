import React from 'react';
import SectionShell from '@/components/common/SectionShell';
import FloralDivider from '@/components/common/FloralDivider';
import Reveal from '@/components/common/Reveal';
import { weddingConfig } from '@/config/wedding';

/** Mensaje romántico de bienvenida a la celebración. */
export default function InvitationMessage() {
  const { texts, couple } = weddingConfig;

  return (
    <SectionShell id="mensaje" tone="ivory">
      <div className="flex flex-col items-center text-center">
        <Reveal>
          <p className="font-display text-4xl text-primary sm:text-5xl">{couple.initials}</p>
        </Reveal>

        <Reveal delay={0.15} className="mt-6 max-w-3xl">
          <p className="font-accent text-xl italic leading-relaxed text-foreground sm:text-2xl md:text-[1.7rem]">
            «{texts.quote}»
          </p>
        </Reveal>

        <FloralDivider className="mt-10 h-8 w-56 text-primary/80" />

        <Reveal delay={0.25} className="mt-8 max-w-2xl">
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            {texts.quoteSubline}
          </p>
        </Reveal>
      </div>
    </SectionShell>
  );
}