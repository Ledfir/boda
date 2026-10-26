import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const STEM = 'M120 24C102 24 92 16 74 19 58 22 48 30 34 31';
const LEAF = 'M0 0c4.5-6 11-7.5 15.5-6-3 8.5-10.5 10.5-15.5 6z';

/** Ornamento floral dibujado con líneas finas (línea dorada de guía). */
export default function FloralDivider({ className = '', animate = true }) {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = animate && !reduceMotion;

  return (
    <svg
      viewBox="0 0 240 48"
      className={className}
      role="presentation"
      aria-hidden="true"
      fill="none"
    >
      <motion.path
        d={STEM}
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        initial={shouldAnimate ? { pathLength: 0 } : false}
        whileInView={shouldAnimate ? { pathLength: 1 } : undefined}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
      />
      <g transform="translate(240 0) scale(-1 1)">
        <motion.path
          d={STEM}
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
          initial={shouldAnimate ? { pathLength: 0 } : false}
          whileInView={shouldAnimate ? { pathLength: 1 } : undefined}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
        />
      </g>

      <motion.g
        fill="currentColor"
        opacity="0.9"
        initial={shouldAnimate ? { opacity: 0 } : false}
        whileInView={shouldAnimate ? { opacity: 0.9 } : undefined}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.4 }}
      >
        <path d={LEAF} transform="translate(66 15) rotate(-12)" />
        <path d={LEAF} transform="translate(48 27) rotate(24)" />
        <path d={LEAF} transform="translate(174 15) rotate(192)" />
        <path d={LEAF} transform="translate(192 27) rotate(156)" />
        <rect x="117.4" y="21.4" width="5.2" height="5.2" transform="rotate(45 120 24)" />
        <circle cx="120" cy="10" r="1.1" />
        <circle cx="120" cy="38" r="1.1" />
      </motion.g>
    </svg>
  );
}