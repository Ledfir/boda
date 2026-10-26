import React from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Image } from '@/components/ui/image';
import StaggerName from '@/components/hero/StaggerName';
import { weddingConfig } from '@/config/wedding';

const SPARKLES = [
  { top: '18%', left: '14%', size: 3, delay: 0 },
  { top: '32%', left: '78%', size: 2, delay: 1.4 },
  { top: '62%', left: '24%', size: 2, delay: 2.6 },
  { top: '74%', left: '68%', size: 3, delay: 3.4 },
  { top: '48%', left: '52%', size: 2, delay: 4.2 },
];

/** Portada principal a pantalla completa con parallax y partículas discretas. */
export default function Hero() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 700], [0, reduceMotion ? 0 : 120]);
  const contentY = useTransform(scrollY, [0, 600], [0, reduceMotion ? 0 : 60]);
  const contentOpacity = useTransform(scrollY, [0, 520], [1, 0.15]);

  const { couple, cover, date } = weddingConfig;

  return (
    <section
      id="portada"
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-foreground"
    >
      <motion.div style={{ y: imageY }} className="absolute inset-0 -top-10 -bottom-10">
        <motion.div
          className="h-full w-full"
          animate={reduceMotion ? undefined : { scale: [1, 1.08] }}
          transition={{ duration: 22, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        >
          <Image
            src={cover.image}
            alt={`${couple.display} caminando juntos al atardecer`}
            className="h-full w-full object-cover"
            fittingType="fill"
          />
        </motion.div>
      </motion.div>

      <div
        className="absolute inset-0 bg-gradient-to-b from-foreground/45 via-foreground/30 to-foreground/75"
        aria-hidden="true"
      />

      {!reduceMotion &&
        SPARKLES.map((sparkle, index) => (
          <motion.span
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className="absolute rounded-full bg-background/70"
            style={{ top: sparkle.top, left: sparkle.left, width: sparkle.size, height: sparkle.size }}
            animate={{ opacity: [0, 0.9, 0], y: [0, -18, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: sparkle.delay, ease: 'easeInOut' }}
            aria-hidden="true"
          />
        ))}

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex w-full max-w-3xl flex-col items-center px-6 py-24 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-[0.7rem] uppercase tracking-luxe text-background/85 sm:text-xs"
        >
          {cover.kicker}
        </motion.p>

        <h1 className="mt-8 flex flex-col items-center text-background">
          <StaggerName
            text={couple.bride.name}
            delay={0.6}
            className="font-display text-[3.4rem] leading-none sm:text-6xl md:text-7xl"
          />
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
            className="my-4 font-accent text-2xl italic text-primary sm:text-3xl"
          >
            &amp;
          </motion.span>
          <StaggerName
            text={couple.groom.name}
            delay={1.9}
            className="font-display text-[3.4rem] leading-none sm:text-6xl md:text-7xl"
          />
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 3 }}
          className="mt-9 flex flex-col items-center"
        >
          <p className="font-accent text-lg italic text-background/90 sm:text-xl">{cover.tagline}</p>
          <span className="mt-6 h-px w-16 bg-primary/70" aria-hidden="true" />
          <p className="mt-6 font-heading text-base tracking-wide-luxe text-background sm:text-lg">
            {date.displayShort}
          </p>
          <p className="mt-2 text-[0.64rem] uppercase tracking-wide-luxe text-background/70">
            {date.city}
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 3.6 }}
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[0.6rem] uppercase tracking-luxe text-background/70">Desliza</span>
        <motion.span
          animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-4 w-4 text-background/80" aria-hidden="true" />
        </motion.span>
      </motion.div>
    </section>
  );
}