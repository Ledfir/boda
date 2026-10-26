import React from 'react';
import { Heart } from 'lucide-react';

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

/** Dedicatoria aprobada, en tarjeta elegante. */
export default function DedicationCard({ dedication, delay = 0 }) {
  return (
    <div
      className="flex h-full flex-col border border-border/80 bg-background p-6"
      style={{ animationDelay: `${delay}s` }}
    >
      <Heart className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
      <p className="mt-4 font-accent text-lg italic leading-relaxed text-foreground">
        «{dedication.mensaje}»
      </p>
      <div className="mt-auto pt-5">
        <span className="block h-px w-10 bg-primary/60" aria-hidden="true" />
        <p className="mt-4 text-[0.66rem] uppercase tracking-wide-luxe text-muted-foreground">
          {dedication.nombre}
        </p>
        {formatDate(dedication.fecha) && (
          <p className="mt-1 text-[0.6rem] text-muted-foreground/80">
            {formatDate(dedication.fecha)}
          </p>
        )}
      </div>
    </div>
  );
}