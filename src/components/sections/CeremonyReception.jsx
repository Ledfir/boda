import React from 'react';
import SectionShell from '@/components/common/SectionShell';
import SectionHeading from '@/components/common/SectionHeading';
import VenueCard from '@/components/events/VenueCard';
import { weddingConfig } from '@/config/wedding';

/** Ceremonia y recepción: dos apartados visuales diferenciados. */
export default function CeremonyReception() {
  const { ceremony, reception, texts } = weddingConfig;

  return (
    <SectionShell id="ceremonia" tone="champagne" wide>
      <SectionHeading
        kicker="Dónde y cuándo"
        title="Ceremonia y recepción"
        subtitle={`${ceremony.date} · ${weddingConfig.date.city}`}
      />

      <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-10">
        <VenueCard venue={ceremony} kicker={texts.ceremonyTitle} />
        <VenueCard venue={reception} kicker={texts.receptionTitle} delay={0.15} />
      </div>
    </SectionShell>
  );
}