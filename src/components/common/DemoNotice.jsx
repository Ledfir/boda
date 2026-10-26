import React from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEMO_MESSAGE } from '@/lib/firebase/config';

/**
 * Aviso de modo demostración: deja claro que la información NO se guarda
 * mientras Firebase no esté conectado.
 */
export default function DemoNotice({ message = DEMO_MESSAGE, className = '', compact = false }) {
  return (
    <div
      role="status"
      className={cn(
        'flex items-start gap-3 rounded-sm border border-primary/40 bg-secondary/40 text-left',
        compact ? 'px-3 py-2' : 'px-4 py-3',
        className,
      )}
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
      <p className={cn('text-muted-foreground', compact ? 'text-xs' : 'text-sm')}>{message}</p>
    </div>
  );
}

/** Etiqueta compacta «Modo demostración». */
export function DemoBadge({ className = '' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-primary/40 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-wide-luxe text-primary',
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
      Modo demostración
    </span>
  );
}