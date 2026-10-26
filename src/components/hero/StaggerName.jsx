import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/** Aparición letra por letra para los nombres de los novios. */
export default function StaggerName({ text, delay = 0, className = '' }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <span className={className}>{text}</span>;

  const letters = Array.from(text);

  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: delay } } }}
      aria-label={text}
    >
      {letters.map((letter, position) => (
        <motion.span
          // eslint-disable-next-line react/no-array-index-key
          key={`${letter}-${position}`}
          className="inline-block"
          aria-hidden="true"
          variants={{
            hidden: { opacity: 0, y: 22 },
            visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}