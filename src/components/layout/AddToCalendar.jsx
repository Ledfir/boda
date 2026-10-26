import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarPlus, Download, ExternalLink } from 'lucide-react';
import { downloadIcsFile, googleCalendarUrl, outlookCalendarUrl } from '@/lib/calendar';

const OPTIONS = [
  { id: 'google', label: 'Google Calendar', icon: ExternalLink, href: googleCalendarUrl },
  { id: 'apple', label: 'Apple / iPhone', icon: Download, action: downloadIcsFile },
  { id: 'outlook', label: 'Outlook', icon: ExternalLink, href: outlookCalendarUrl },
];

/** Agregar el evento al calendario: se despliega en tres opciones. */
export default function AddToCalendar({ variant = 'floating' }) {
  const [open, setOpen] = useState(false);
  const isInline = variant === 'inline';

  return (
    <div className={isInline ? 'relative' : 'relative flex flex-col items-end'}>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className={
              isInline
                ? 'mt-3 flex flex-col gap-2 sm:flex-row sm:justify-center'
                : 'glass-ivory absolute bottom-14 right-0 mb-2 w-52 rounded-sm border border-primary/30 p-2 shadow-xl'
            }
          >
            {OPTIONS.map((option, position) => (
              <motion.li
                key={option.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: position * 0.08, duration: 0.35, type: 'spring', stiffness: 220 }}
              >
                {option.href ? (
                  <a
                    href={option.href()}
                    target="_blank"
                    rel="noreferrer"
                    className={
                      isInline
                        ? 'inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-2 text-[0.64rem] uppercase tracking-wide-luxe text-foreground transition hover:bg-primary hover:text-primary-foreground'
                        : 'flex items-center gap-2 px-3 py-2 text-xs text-foreground transition hover:bg-secondary/50'
                    }
                  >
                    <option.icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    {option.label}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      option.action();
                      setOpen(false);
                    }}
                    className={
                      isInline
                        ? 'inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-2 text-[0.64rem] uppercase tracking-wide-luxe text-foreground transition hover:bg-primary hover:text-primary-foreground'
                        : 'flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground transition hover:bg-secondary/50'
                    }
                  >
                    <option.icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    {option.label}
                  </button>
                )}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Agregar la boda a tu calendario"
        className={
          isInline
            ? 'inline-flex items-center gap-2 border border-primary/50 px-5 py-2.5 text-[0.66rem] uppercase tracking-wide-luxe text-foreground transition hover:bg-primary hover:text-primary-foreground'
            : 'glass-ivory inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/40 text-foreground shadow-lg transition hover:border-primary'
        }
      >
        <CalendarPlus className="h-4 w-4" aria-hidden="true" />
        {isInline && 'Agregar a mi calendario'}
      </button>
    </div>
  );
}