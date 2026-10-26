import React, { useEffect, useMemo, useState } from 'react';
import { Check, Download, Eye, Loader2, Trash2, X } from 'lucide-react';
import DemoNotice from '@/components/common/DemoNotice';
import Lightbox from '@/components/common/Lightbox';
import { Image } from '@/components/ui/image';
import { weddingConfig } from '@/config/wedding';
import {
  listAllGuestPhotos,
  removeGuestPhoto,
  setGuestPhotoApproval,
} from '@/lib/firebase/guestPhotos';

/** Moderación de las fotografías del álbum colaborativo. */
export default function AdminPhotosTab() {
  const [state, setState] = useState({ loading: true, items: [], demo: false, error: false });
  const [notSaved, setNotSaved] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const result = await listAllGuestPhotos();
        const items = result.demo ? weddingConfig.demoGuestPhotos : result.items;
        if (active) setState({ loading: false, items, demo: result.demo, error: false });
      } catch (error) {
        if (active) setState({ loading: false, items: [], demo: false, error: true });
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const pending = useMemo(() => state.items.filter((item) => !item.aprobada), [state.items]);
  const approved = useMemo(() => state.items.filter((item) => item.aprobada), [state.items]);

  const applyLocal = (id, patch) =>
    setState((previous) => ({
      ...previous,
      items: previous.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));

  const handleApproval = async (id, aprobada) => {
    const result = await setGuestPhotoApproval(id, aprobada);
    applyLocal(id, { aprobada });
    if (result.demo) setNotSaved(true);
  };

  const handleRemove = async (photo) => {
    const result = await removeGuestPhoto({ id: photo.id, storagePath: photo.storagePath });
    setState((previous) => ({
      ...previous,
      items: previous.items.filter((item) => item.id !== photo.id),
    }));
    if (result.demo) setNotSaved(true);
  };

  if (state.loading) {
    return (
      <div className="flex items-center gap-3 text-sm text-background/60">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        Cargando fotografías…
      </div>
    );
  }

  const renderGrid = (photos) => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {photos.map((photo) => (
        <figure key={photo.id} className="border border-background/15 bg-background/5">
          <Image
            src={photo.url}
            alt={`Fotografía compartida por ${photo.nombreInvitado || 'un invitado'}`}
            className="h-36 w-full object-cover"
            fittingType="fill"
          />
          <figcaption className="flex flex-wrap items-center gap-1 p-3">
            <span className="w-full truncate text-[0.62rem] text-background/60">
              {photo.nombreInvitado || 'Invitado anónimo'}
            </span>
            <button
              type="button"
              onClick={() => setPreview(photos.indexOf(photo))}
              aria-label="Ver fotografía completa"
              className="inline-flex h-8 w-8 items-center justify-center border border-background/20 text-background/70 transition hover:border-primary hover:text-primary"
            >
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <a
              href={photo.url}
              target="_blank"
              rel="noreferrer"
              aria-label="Descargar fotografía"
              className="inline-flex h-8 w-8 items-center justify-center border border-background/20 text-background/70 transition hover:border-primary hover:text-primary"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            {!photo.aprobada ? (
              <button
                type="button"
                onClick={() => handleApproval(photo.id, true)}
                aria-label="Aprobar fotografía"
                className="inline-flex h-8 w-8 items-center justify-center border border-primary/60 text-primary transition hover:bg-primary hover:text-primary-foreground"
              >
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleApproval(photo.id, false)}
                aria-label="Quitar de la galería"
                className="inline-flex h-8 w-8 items-center justify-center border border-background/20 text-background/70 transition hover:border-primary hover:text-primary"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={() => handleRemove(photo)}
              aria-label="Eliminar fotografía"
              className="inline-flex h-8 w-8 items-center justify-center border border-background/20 text-background/70 transition hover:border-destructive hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </figcaption>
        </figure>
      ))}
    </div>
  );

  return (
    <div className="space-y-10">
      {state.demo && (
        <DemoNotice message="Las fotografías mostradas son de ejemplo. Las de tus invitados llegarán aquí al conectar Firebase." />
      )}

      {notSaved && (
        <DemoNotice message="Los cambios se reflejan en esta pantalla, pero no se guardaron: modo demostración." />
      )}

      <section>
        <h2 className="font-heading text-xl text-background">
          Pendientes de revisión
          <span className="ml-3 text-sm text-background/50">{pending.length}</span>
        </h2>
        <div className="mt-5">
          {pending.length === 0 ? (
            <p className="text-sm text-background/60">No hay fotografías pendientes.</p>
          ) : (
            renderGrid(pending)
          )}
        </div>
      </section>

      <section>
        <h2 className="font-heading text-xl text-background">
          Publicadas en el álbum
          <span className="ml-3 text-sm text-background/50">{approved.length}</span>
        </h2>
        <div className="mt-5">
          {approved.length === 0 ? (
            <p className="text-sm text-background/60">Aún no has publicado fotografías.</p>
          ) : (
            renderGrid(approved)
          )}
        </div>
        <p className="mt-5 text-xs text-background/50">
          La descarga en lote estará disponible cuando las fotografías vivan en Firebase Storage.
        </p>
      </section>

      {preview !== null && state.items.length > 0 && (
        <Lightbox
          items={state.items}
          index={preview}
          onIndexChange={setPreview}
          onClose={() => setPreview(null)}
          allowDownload
        />
      )}
    </div>
  );
}