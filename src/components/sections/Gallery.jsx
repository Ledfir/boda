import React, { useState } from 'react';
import SectionShell from '@/components/common/SectionShell';
import SectionHeading from '@/components/common/SectionHeading';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import Lightbox from '@/components/common/Lightbox';
import { weddingConfig } from '@/config/wedding';

/** Galería oficial de los novios con visor a pantalla completa. */
export default function Gallery() {
  const { gallery, texts } = weddingConfig;
  const [selected, setSelected] = useState(null);

  return (
    <SectionShell id="galeria" tone="white" wide>
      <SectionHeading
        kicker="Galería"
        title={texts.galleryTitle}
        subtitle={texts.gallerySubtitle}
      />

      <div className="mt-14">
        <GalleryGrid photos={gallery} onSelect={setSelected} />
      </div>

      {selected !== null && (
        <Lightbox
          items={gallery}
          index={selected}
          onIndexChange={setSelected}
          onClose={() => setSelected(null)}
          allowDownload
          downloadName="nuestros-momentos.jpg"
        />
      )}
    </SectionShell>
  );
}