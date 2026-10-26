import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Image } from '@/components/ui/image';

/** Cuadrícula editorial tipo masonry con zoom suave al pasar el cursor. */
export default function GalleryGrid({ photos = [], onSelect, columns = 3 }) {
  const reduceMotion = useReducedMotion();
  const columnClass = columns === 2 ? 'columns-1 sm:columns-2' : 'columns-2 md:columns-3';

  return (
    <div className={`${columnClass} gap-3 sm:gap-4`}>
      {photos.map((photo, position) => (
        <motion.button
          key={photo.id || photo.src}
          type="button"
          onClick={() => onSelect?.(position)}
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, delay: (position % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="group mb-3 block w-full break-inside-avoid overflow-hidden border border-border/70 bg-card sm:mb-4"
          aria-label={`Ver fotografía: ${photo.alt || photo.nombreInvitado || 'momento'}`}
        >
          <Image
            src={photo.url || photo.src}
            alt={photo.alt || photo.nombreInvitado || 'Fotografía de la boda'}
            loading="lazy"
            className="w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.06]"
            fittingType="fill"
          />
        </motion.button>
      ))}
    </div>
  );
}