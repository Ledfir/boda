import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, X } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { cn } from '@/lib/utils';

/**
 * Visor a pantalla completa con navegación por teclado, botones y gestos táctiles.
 */
export default function Lightbox({
  items = [],
  index = 0,
  onIndexChange,
  onClose,
  allowDownload = false,
  downloadName,
}) {
  const [current, setCurrent] = useState(index);
  const touchStartX = useRef(null);

  useEffect(() => setCurrent(index), [index]);

  useEffect(() => {
    if (!items.length) return undefined;

    const handleKey = (event) => {
      if (event.key === 'Escape') onClose?.();
      if (event.key === 'ArrowRight') go(current + 1);
      if (event.key === 'ArrowLeft') go(current - 1);
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [current, items.length, onClose]);

  if (!items.length) return null;

  const item = items[Math.min(Math.max(current, 0), items.length - 1)];

  function go(next) {
    const total = items.length;
    const normalized = (next + total) % total;
    setCurrent(normalized);
    onIndexChange?.(normalized);
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col bg-foreground/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Galería de fotografías"
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const delta = event.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 50) go(delta < 0 ? current + 1 : current - 1);
        touchStartX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <span className="font-body text-xs uppercase tracking-wide-luxe text-background/70">
          {current + 1} / {items.length}
        </span>
        <div className="flex items-center gap-2">
          {allowDownload && (
            <a
              href={item.url || item.src}
              download={downloadName || undefined}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-background/25 text-background transition hover:border-primary hover:text-primary"
              aria-label="Descargar fotografía"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-background/25 text-background transition hover:border-primary hover:text-primary"
            aria-label="Cerrar galería"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-2 pb-4 sm:px-10">
        <button
          type="button"
          onClick={() => go(current - 1)}
          className="absolute left-2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-background/25 text-background transition hover:border-primary hover:text-primary sm:left-4"
          aria-label="Fotografía anterior"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        <Image
          src={item.url || item.src}
          alt={item.alt || item.nombreInvitado || 'Fotografía de la boda'}
          fittingType="fit"
          className="max-h-[72vh] w-auto max-w-full object-contain"
        />

        <button
          type="button"
          onClick={() => go(current + 1)}
          className="absolute right-2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-background/25 text-background transition hover:border-primary hover:text-primary sm:right-4"
          aria-label="Fotografía siguiente"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {(item.alt || item.nombreInvitado || item.caption) && (
        <p className={cn('pb-6 text-center font-accent text-sm italic text-background/75')}>
          {item.caption || item.alt || `Compartida por ${item.nombreInvitado}`}
        </p>
      )}
    </div>
  );
}