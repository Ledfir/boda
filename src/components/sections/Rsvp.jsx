import React from 'react';
import SectionShell from '@/components/common/SectionShell';
import SectionHeading from '@/components/common/SectionHeading';
import Reveal from '@/components/common/Reveal';
import RsvpForm from '@/components/rsvp/RsvpForm';
import AddToCalendar from '@/components/layout/AddToCalendar';
import { weddingConfig } from '@/config/wedding';

/** Sección de confirmación de asistencia. */
export default function Rsvp() {
  const { texts, rsvp, date } = weddingConfig;
  const closed = new Date(rsvp.deadlineIso).getTime() < Date.now();

  return (
    <SectionShell id="confirmacion" tone="ivory">
      <SectionHeading
        kicker="RSVP"
        title={texts.rsvpTitle}
        subtitle={closed ? undefined : texts.rsvpSubtitle}
      />

      {closed ? (
        <Reveal className="mt-12 border border-primary/40 bg-background p-8 text-center sm:p-10">
          <h3 className="font-heading text-2xl text-foreground">Confirmaciones cerradas</h3>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
            {rsvp.closedMessage}
          </p>
        </Reveal>
      ) : (
        <>
          <Reveal className="mt-6 text-center">
            <p className="text-[0.66rem] uppercase tracking-wide-luxe text-muted-foreground">
              Confirma antes del {rsvp.deadlineDisplay}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-10">
            <RsvpForm />
          </Reveal>

          <Reveal delay={0.15} className="mt-10 flex flex-col items-center gap-4">
            <p className="text-center font-accent text-base italic text-muted-foreground">
              {date.displayLong} · {date.time}
            </p>
            <AddToCalendar variant="inline" />
          </Reveal>
        </>
      )}
    </SectionShell>
  );
}