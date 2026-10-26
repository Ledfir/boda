import React from 'react';
import {
  Heart,
  Music,
  PartyPopper,
  Sparkles,
  UtensilsCrossed,
  Wine,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const ICONS = {
  Heart,
  Music,
  PartyPopper,
  Sparkles,
  UtensilsCrossed,
  Wine,
};

/** Un momento del itinerario con su icono minimalista. */
export default function ItineraryItem({ item, position }) {
  const reduceMotion = useReducedMotion();
  const Icon = ICONS[item.icon] || Sparkles;

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.8, delay: position * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-5 pb-10 last:pb-0"
    >
      <span
        className="absolute left-[19px] top-11 h-full w-px bg-primary/30 last:hidden"
        aria-hidden="true"
      />

      <span className="relative z-10 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/50 bg-background">
        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
      </span>

      <div className="pt-1">
        <p className="font-body text-[0.68rem] uppercase tracking-luxe text-primary">{item.time}</p>
        <h3 className="mt-2 font-heading text-lg text-foreground sm:text-xl">{item.title}</h3>
        {item.description && (
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        )}
      </div>
    </motion.li>
  );
}