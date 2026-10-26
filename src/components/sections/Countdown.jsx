import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import SectionShell from '@/components/common/SectionShell';
import SectionHeading from '@/components/common/SectionHeading';
import Reveal from '@/components/common/Reveal';
import { weddingConfig } from '@/config/wedding';
import useCountdown from '@/hooks/useCountdown';

function CountdownUnit({ value, label, delay }) {
  const reduceMotion = useReducedMotion();

  return (
    <Reveal delay={delay} className="flex flex-col items-center">
      <span className="relative font-heading text-4xl tabular-nums text-foreground sm:text-5xl md:text-6xl">
        {String(value).padStart(2, '0')}
        {!reduceMotion && (
          <motion.span
            key={value}
            initial={{ opacity: 0.35 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="absolute inset-0 text-primary"
            aria-hidden="true"
          >
            {String(value).padStart(2, '0')}
          </motion.span>
        )}
      </span>
      <span className="mt-2 text-[0.6rem] uppercase tracking-luxe text-muted-foreground sm:text-[0.68rem]">
        {label}
      </span>
    </Reveal>
  );
}

/** Contador en tiempo real hasta la boda (zona horaria configurada). */
export default function Countdown() {
  const { date, invitacionId } = weddingConfig;
  const timeLeft = useCountdown(date.iso);

  const units = [
    { label: 'Días', value: timeLeft.days },
    { label: 'Horas', value: timeLeft.hours },
    { label: 'Minutos', value: timeLeft.minutes },
    { label: 'Segundos', value: timeLeft.seconds },
  ];

  return (
    <SectionShell id="cuenta-regresiva" tone="champagne">
      <div className="sr-only">{invitacionId}</div>
      <SectionHeading
        kicker="Cuenta regresiva"
        title={
          timeLeft.isPast ? '¡Hoy es nuestro gran día!' : 'Falta muy poco para nuestro gran día'
        }
        subtitle={`${date.displayLong} · ${date.time} · ${date.timeZone}`}
      />

      {!timeLeft.isPast && (
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {units.map((unit, position) => (
            <CountdownUnit
              key={unit.label}
              value={unit.value}
              label={unit.label}
              delay={position * 0.1}
            />
          ))}
        </div>
      )}

      {timeLeft.isPast && (
        <Reveal delay={0.2} className="mt-10 text-center">
          <p className="font-accent text-xl italic text-foreground">
            Gracias por acompañarnos en el día más importante de nuestras vidas.
          </p>
        </Reveal>
      )}
    </SectionShell>
  );
}