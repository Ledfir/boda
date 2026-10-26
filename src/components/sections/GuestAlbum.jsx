import React, { useCallback, useEffect, useState } from 'react';
import { Camera, Heart } from 'lucide-react';
import SectionShell from '@/components/common/SectionShell';
import SectionHeading from '@/components/common/SectionHeading';
import Reveal from '@/components/common/Reveal';
import DemoNotice, { DemoBadge } from '@/components/common/DemoNotice';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import Lightbox from '@/components/common/Lightbox';
import PhotoUploadDialog from '@/components/album/PhotoUploadDialog';
import { weddingConfig } from '@/config/wedding';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { listApprovedGuestPhotos } from '@/lib/firebase/guestPhotos';
import useInviteToken from '@/hooks/useInviteToken';

/**
 * Álbum colaborativo de los invitados — completamente separado de la galería
 * oficial de los novios.
 */
export default function GuestAlbum() {
  const { album, texts, demoGuestPhotos } = weddingConfig;
  const invite = useInviteToken();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    if (!isFirebaseConfigured) {
      setPhotos(demoGuestPhotos.filter((photo) => photo.aprobada));
      setLoading(false);
      return;
    }
    try {
      const result = await listApprovedGuestPhotos();
      setPhotos(result.items);
    } finally {
      setLoading(false);
    }
  }, [demoGuestPhotos]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SectionShell id="album" tone="white" wide>
      <SectionHeading
        kicker="Álbum colaborativo"
        title={texts.albumTitle}
        subtitle={texts.albumSubtitle}
      />

      <Reveal className="mt-10 flex flex-col items-center gap-5">
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="inline-flex items-center gap-3 border border-primary bg-primary px-7 py-3.5 text-[0.68rem] uppercase tracking-luxe text-primary-foreground transition hover:bg-transparent hover:text-foreground"
        >
          <Camera className="h-4 w-4" aria-hidden="true" />
          Subir mis fotografías
        </button>

        <p className="max-w-lg text-center text-xs leading-relaxed text-muted-foreground">
          Tus fotografías quedan pendientes de revisión antes de publicarse en el álbum, para cuidar
          la privacidad de todos.
        </p>
      </Reveal>

      {!isFirebaseConfigured && (
        <Reveal className="mt-8 flex flex-col items-center gap-3">
          <DemoBadge />
          <DemoNotice
            message="Este álbum funciona en modo demostración: las fotografías de abajo son de ejemplo y las tuyas no se subirán a ningún lado todavía."
            compact
          />
        </Reveal>
      )}

      <div className="mt-12">
        {loading && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {[0, 1, 2, 3].map((placeholder) => (
              <div
                key={placeholder}
                className="h-40 animate-pulse border border-border/60 bg-background/70"
                aria-hidden="true"
              />
            ))}
          </div>
        )}

        {!loading && photos.length === 0 && (
          <div className="border border-dashed border-primary/40 bg-background p-10 text-center">
            <Heart className="mx-auto h-4 w-4 text-primary" aria-hidden="true" />
            <p className="mt-4 font-accent text-lg italic text-muted-foreground">
              Sé la primera persona en compartir un momento de este día.
            </p>
          </div>
        )}

        {!loading && photos.length > 0 && (
          <GalleryGrid photos={photos} onSelect={setSelected} />
        )}
      </div>

      <PhotoUploadDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onUploaded={load}
        defaultName={invite?.nombre || ''}
      />

      {selected !== null && photos.length > 0 && (
        <Lightbox
          items={photos}
          index={selected}
          onIndexChange={setSelected}
          onClose={() => setSelected(null)}
          allowDownload={album.allowDownload}
        />
      )}
    </SectionShell>
  );
}