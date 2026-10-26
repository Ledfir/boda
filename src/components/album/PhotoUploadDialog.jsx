import React, { useEffect, useRef, useState } from 'react';
import { Camera, Check, ImagePlus, Loader2, Trash2, X } from 'lucide-react';
import DemoNotice from '@/components/common/DemoNotice';
import { weddingConfig } from '@/config/wedding';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { uploadGuestPhoto } from '@/lib/firebase/guestPhotos';
import { compressImage, isSupportedImage } from '@/lib/imageCompression';

/**
 * Interfaz de carga del álbum colaborativo: nombre, selección (o cámara),
 * vista previa, eliminación, compresión y progreso real de la subida.
 */
export default function PhotoUploadDialog({ open, onClose, onUploaded, defaultName = '' }) {
  const { album, invitacionId } = weddingConfig;
  const [nombre, setNombre] = useState(defaultName);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  useEffect(() => {
    if (!open) {
      items.forEach((item) => URL.revokeObjectURL(item.preview));
      setItems([]);
      setStatus('idle');
      setProgress(0);
      setError('');
    }
  }, [open]);

  if (!open) return null;

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList || []);
    const accepted = [];
    let rejected = false;

    incoming.forEach((file) => {
      if (!isSupportedImage(file, album.acceptedTypes) || file.size > album.maxFileSizeMb * 1024 * 1024) {
        rejected = true;
        return;
      }
      // Evita archivos duplicados (mismo nombre y tamaño).
      const duplicate = items.some(
        (item) => item.file.name === file.name && item.file.size === file.size,
      );
      if (!duplicate) {
        accepted.push({ file, preview: URL.createObjectURL(file) });
      }
    });

    const limited = [...items, ...accepted].slice(0, album.maxFilesPerGuest);
    setItems(limited);

    if (rejected) {
      setError(
        `Solo aceptamos JPG, PNG o WEBP de hasta ${album.maxFileSizeMb} MB. Algunos archivos no se agregaron.`,
      );
    } else if (items.length + accepted.length > album.maxFilesPerGuest) {
      setError(`Puedes subir hasta ${album.maxFilesPerGuest} fotografías a la vez.`);
    } else {
      setError('');
    }
  };

  const removeItem = (preview) => {
    URL.revokeObjectURL(preview);
    setItems((previous) => previous.filter((item) => item.preview !== preview));
  };

  const handleUpload = async () => {
    if (!items.length) {
      setError('Selecciona al menos una fotografía.');
      return;
    }
    if (!isFirebaseConfigured) {
      setStatus('preparing');
      await Promise.all(items.map((item) => compressImage(item.file, album.compression)));
      setStatus('demo');
      return;
    }

    setError('');
    setStatus('uploading');
    try {
      for (const item of items) {
        const optimized = await compressImage(item.file, album.compression);
        // eslint-disable-next-line no-await-in-loop
        const result = await uploadGuestPhoto({
          file: optimized,
          nombreInvitado: nombre,
          invitacionId,
          onProgress: setProgress,
        });
        if (result.demo) {
          setStatus('demo');
          return;
        }
      }
      navigator.vibrate?.(30);
      setStatus('done');
      onUploaded?.();
    } catch (uploadError) {
      setStatus('idle');
      setError('No pudimos subir tus fotografías. Revisa tu conexión e intenta de nuevo.');
    }
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center bg-foreground/70 backdrop-blur-sm sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Subir fotografías al álbum colaborativo"
        className="max-h-[92svh] w-full max-w-2xl overflow-y-auto border border-primary/30 bg-background p-6 sm:max-h-[88svh] sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-heading text-2xl text-foreground">Sube tus fotografías</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              JPG, PNG o WEBP · máximo {album.maxFileSizeMb} MB cada una · hasta{' '}
              {album.maxFilesPerGuest} fotografías.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition hover:border-primary"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {status === 'done' || status === 'demo' ? (
          <div className="mt-8 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-primary/50">
              <Check className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <h4 className="mt-5 font-heading text-xl text-foreground">
              {status === 'done' ? '¡Gracias por compartir!' : 'Fotografías listas'}
            </h4>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              {status === 'done'
                ? 'Tus fotografías quedaron pendientes de revisión y aparecerán en el álbum en cuanto los novios las aprueben.'
                : 'Optimizamos tus fotografías correctamente, pero no se subieron: la invitación aún no está conectada a Firebase.'}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-7 border border-primary bg-primary px-6 py-3 text-[0.68rem] uppercase tracking-wide-luxe text-primary-foreground transition hover:bg-transparent hover:text-foreground"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <label className="mt-7 flex flex-col gap-2">
              <span className="text-[0.64rem] uppercase tracking-wide-luxe text-muted-foreground">
                Tu nombre
              </span>
              <input
                type="text"
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                maxLength={120}
                placeholder="Para saber quién compartió cada momento"
                className="border border-input bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"
              />
            </label>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 border border-primary/50 bg-card px-4 py-3 text-[0.66rem] uppercase tracking-wide-luxe text-foreground transition hover:bg-primary hover:text-primary-foreground"
              >
                <ImagePlus className="h-4 w-4" aria-hidden="true" />
                Elegir fotografías
              </button>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 border border-primary/50 bg-card px-4 py-3 text-[0.66rem] uppercase tracking-wide-luxe text-foreground transition hover:bg-primary hover:text-primary-foreground"
              >
                <Camera className="h-4 w-4" aria-hidden="true" />
                Tomar foto
              </button>
            </div>

            <input
              ref={galleryInputRef}
              type="file"
              accept={album.acceptedTypes.join(',')}
              multiple
              className="hidden"
              onChange={(event) => {
                addFiles(event.target.files);
                event.target.value = '';
              }}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(event) => {
                addFiles(event.target.files);
                event.target.value = '';
              }}
            />

            {items.length > 0 && (
              <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {items.map((item) => (
                  <li key={item.preview} className="relative overflow-hidden border border-border/70">
                    {/* Vista previa de la fotografía elegida */}
                    <img src={item.preview} alt="" className="h-32 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeItem(item.preview)}
                      aria-label={`Quitar ${item.file.name}`}
                      className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground transition hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {status === 'uploading' && (
              <div className="mt-6">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Subiendo… {progress}%
                </p>
              </div>
            )}

            {error && (
              <p role="alert" className="mt-5 text-sm text-destructive">
                {error}
              </p>
            )}

            {!isFirebaseConfigured && <DemoNotice className="mt-5" compact />}

            <button
              type="button"
              onClick={handleUpload}
              disabled={status === 'uploading' || status === 'preparing'}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 border border-primary bg-primary px-6 py-3.5 text-[0.68rem] uppercase tracking-wide-luxe text-primary-foreground transition hover:bg-transparent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
            >
              {(status === 'uploading' || status === 'preparing') && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              )}
              {status === 'preparing' ? 'Optimizando fotografías…' : 'Subir mis fotografías'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}