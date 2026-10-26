import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import AddToCalendar from './AddToCalendar';

/** Botones flotantes: agregar al calendario y volver al inicio. */
export default function FloatingUtilities() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 700);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-5 right-4 z-[70] flex flex-col items-end gap-3 sm:bottom-7 sm:right-6">
      <AddToCalendar />

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Volver al inicio de la invitación"
        className={`glass-ivory inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/40 text-foreground shadow-lg transition-all duration-500 hover:border-primary ${
          showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
        }`}
      >
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}