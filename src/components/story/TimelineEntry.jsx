import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Image } from '@/components/ui/image';

/** Un momento de la historia, con línea de tiempo vertical. */
export default function TimelineEntry({ moment, position }) {
  const reduceMotion = useReducedMotion();
  const isLeft = position % 2 === 0;

  const image = (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-90px' }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <Image
        src={moment.image}
        alt={moment.title}
        loading="lazy"
        className="h-56 w-full object-cover sm:h-72"
        fittingType="fill"
      />
    </motion.div>
  );

  const text = (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, x: isLeft ? -24 : 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-90px' }}
      transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className={`mt-6 sm:mt-0 ${isLeft ? 'sm:pr-4 sm:text-right' : 'sm:pl-4'}`}
    >
      <span className="text-[0.62rem] uppercase tracking-luxe text-primary">{moment.date}</span>
      <h3 className="mt-3 font-heading text-xl text-foreground sm:text-2xl">{moment.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {moment.description}
      </p>
    </motion.div>
  );

  return (
    <div className="relative pl-12 sm:pl-0">
      <span
        className="absolute left-[13px] top-2 z-10 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border border-primary bg-background sm:left-1/2"
        aria-hidden="true"
      />

      <div className="sm:grid sm:grid-cols-2 sm:items-center sm:gap-12">
        {isLeft ? (
          <>
            {image}
            {text}
          </>
        ) : (
          <>
            {text}
            {image}
          </>
        )}
      </div>
    </div>
  );
}