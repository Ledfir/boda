import React from 'react';
import SectionShell from '@/components/common/SectionShell';
import SectionHeading from '@/components/common/SectionHeading';
import TimelineEntry from '@/components/story/TimelineEntry';
import { weddingConfig } from '@/config/wedding';

/** Nuestra historia: línea de tiempo vertical (una columna en móviles). */
export default function OurStory() {
  const { story, texts } = weddingConfig;

  return (
    <SectionShell id="nuestra-historia" tone="ivory" wide>
      <SectionHeading
        kicker="Nuestra historia"
        title={texts.storyTitle}
        subtitle={texts.storySubtitle}
      />

      <div className="relative mt-16">
        <span
          className="absolute bottom-0 left-[13px] top-0 w-px bg-primary/35 sm:left-1/2 sm:-translate-x-1/2"
          aria-hidden="true"
        />

        <div className="flex flex-col gap-16 sm:gap-24">
          {story.map((moment, position) => (
            <TimelineEntry key={moment.id} moment={moment} position={position} />
          ))}
        </div>
      </div>
    </SectionShell>
  );
}