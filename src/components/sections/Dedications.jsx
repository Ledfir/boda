import React, { useEffect, useState } from 'react';
import SectionShell from '@/components/common/SectionShell';
import SectionHeading from '@/components/common/SectionHeading';
import Reveal from '@/components/common/Reveal';
import DemoNotice, { DemoBadge } from '@/components/common/DemoNotice';
import DedicationForm from '@/components/dedications/DedicationForm';
import DedicationCard from '@/components/dedications/DedicationCard';
import { weddingConfig } from '@/config/wedding';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { listApprovedDedications } from '@/lib/firebase/dedications';

/** Palabras que guardamos en el corazón: forman y dedicatorias aprobadas. */
export default function Dedications() {
  const { texts } = weddingConfig;
  const [state, setState] = useState({ loading: true, items: [], demo: false, error: false });

  const load = async () => {
    setState((previous) => ({ ...previous, loading: true, error: false }));
    try {
      const result = await listApprovedDedications();
      setState({ loading: false, items: result.items, demo: result.demo, error: false });
    } catch (error) {
      setState({ loading: false, items: [], demo: false, error: true });
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <SectionShell id="dedicatorias" tone="champagne">
      <SectionHeading
        kicker="Dedicatorias"
        title={texts.dedicationsTitle}
        subtitle={texts.dedicationsSubtitle}
      />

      <Reveal className="mt-12">
        <DedicationForm onSubmitted={load} />
      </Reveal>

      {!isFirebaseConfigured && (
        <Reveal className="mt-8">
          <div className="flex flex-col items-center gap-3">
            <DemoBadge />
            <DemoNotice
              message="Las dedicatorias de abajo son ejemplos de demostración. Nada se guarda todavía."
              compact
            />
          </div>
        </Reveal>
      )}

      <div className="mt-14">
        {state.loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((placeholder) => (
              <div
                key={placeholder}
                className="h-52 animate-pulse border border-border/60 bg-background/70"
                aria-hidden="true"
              />
            ))}
          </div>
        )}

        {!state.loading && state.error && (
          <p className="text-center text-sm text-muted-foreground">
            No pudimos cargar las dedicatorias en este momento.
          </p>
        )}

        {!state.loading && !state.error && state.items.length === 0 && (
          <p className="text-center font-accent text-lg italic text-muted-foreground">
            Sé la primera persona en dejarnos unas palabras.
          </p>
        )}

        {!state.loading && state.items.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {state.items.map((dedication, position) => (
              <Reveal key={dedication.id} delay={(position % 3) * 0.1}>
                <DedicationCard dedication={dedication} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </SectionShell>
  );
}