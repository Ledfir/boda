import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/** Aparición suave al hacer scroll (respeta «reducir movimiento»). */
export default function Reveal({ children, className = '', delay = 0, y = 28, duration = 0.9 }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}