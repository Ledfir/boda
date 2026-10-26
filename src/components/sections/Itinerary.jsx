import React from 'react';
import SectionShell from '@/components/common/SectionShell';
import SectionHeading from '@/components/common/SectionHeading';
import ItineraryItem from '@/components/events/ItineraryItem';
import { weddingConfig } from '@/config/wedding';

/** Itinerario del evento. */
export default function Itinerary() {
  const { itinerary, texts } = weddingConfig;

  return (
    <SectionShell id="itinerario" tone="ivory">
      <SectionHeading
        kicker="Itinerario"
        title={texts.itineraryTitle}
        subtitle={texts.itinerarySubtitle}
      />

      <ol className="mx-auto mt-14 max-w-xl">
        {itinerary.map((item, position) => (
          <ItineraryItem key={`${item.time}-${item.title}`} item={item} position={position} />
        ))}
      </ol>
    </SectionShell>
  );
}