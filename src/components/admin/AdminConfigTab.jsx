import React, { useState } from 'react';
import { cloneDeep, set as setPath } from 'lodash';
import { Loader2, Save } from 'lucide-react';
import AdminField from '@/components/admin/AdminField';
import DemoNotice from '@/components/common/DemoNotice';
import { weddingConfig } from '@/config/wedding';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { saveWeddingDoc } from '@/lib/firebase/weddingDoc';

const GROUPS = [
  {
    title: 'Los novios',
    fields: [
      { path: 'couple.bride.name', label: 'Nombre de la novia' },
      { path: 'couple.groom.name', label: 'Nombre del novio' },
      { path: 'couple.display', label: 'Cómo se muestran juntos' },
      { path: 'couple.initials', label: 'Iniciales' },
    ],
  },
  {
    title: 'Fecha y horarios',
    fields: [
      { path: 'date.iso', label: 'Fecha y hora (ISO con zona)', hint: 'Ejemplo: 2027-05-15T17:00:00-06:00' },
      { path: 'date.timeZone', label: 'Zona horaria', hint: 'Ejemplo: America/Monterrey' },
      { path: 'date.displayLong', label: 'Fecha para mostrar' },
      { path: 'date.time', label: 'Hora de la ceremonia' },
      { path: 'date.city', label: 'Ciudad' },
    ],
  },
  {
    title: 'Ceremonia y recepción',
    fields: [
      { path: 'ceremony.venue', label: 'Recinto de la ceremonia' },
      { path: 'ceremony.address', label: 'Dirección de la ceremonia' },
      { path: 'ceremony.time', label: 'Hora de la ceremonia' },
      { path: 'reception.venue', label: 'Recinto de la recepción' },
      { path: 'reception.address', label: 'Dirección de la recepción' },
      { path: 'reception.time', label: 'Hora de la recepción' },
    ],
  },
  {
    title: 'Música y confirmaciones',
    fields: [
      { path: 'music.src', label: 'Archivo MP3 (URL o ruta)', hint: 'Déjalo vacío si aún no tienes la canción.' },
      { path: 'music.title', label: 'Título de la canción' },
      { path: 'music.artist', label: 'Intérprete' },
      { path: 'rsvp.deadlineIso', label: 'Fecha límite de confirmación (ISO)' },
      { path: 'rsvp.deadlineDisplay', label: 'Fecha límite para mostrar' },
    ],
  },
  {
    title: 'Textos y código de vestimenta',
    fields: [
      { path: 'texts.quote', label: 'Frase principal', textarea: true },
      { path: 'texts.closingTitle', label: 'Título del cierre' },
      { path: 'texts.closingText', label: 'Texto del cierre', textarea: true },
      { path: 'dressCode.code', label: 'Código de vestimenta' },
      { path: 'dressCode.description', label: 'Descripción del código', textarea: true },
    ],
  },
  {
    title: 'Álbum colaborativo',
    fields: [
      { path: 'album.maxFileSizeMb', label: 'Tamaño máximo por fotografía (MB)', type: 'number' },
      { path: 'album.maxFilesPerGuest', label: 'Máximo de fotografías por invitado', type: 'number' },
    ],
  },
];

/** Configuración de la boda: lista para guardarse en Firebase. */
export default function AdminConfigTab() {
  const [form, setForm] = useState(() => cloneDeep(weddingConfig));
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const update = (path, value) =>
    setForm((previous) => {
      const next = cloneDeep(previous);
      setPath(next, path, value);
      return next;
    });

  const handleSave = async () => {
    setStatus('saving');
    setMessage('');
    try {
      const result = await saveWeddingDoc(weddingConfig.invitacionId, {
        couple: form.couple,
        date: form.date,
        ceremony: form.ceremony,
        reception: form.reception,
        music: form.music,
        rsvp: form.rsvp,
        texts: form.texts,
        dressCode: form.dressCode,
        album: form.album,
      });

      if (result.demo) {
        setStatus('demo');
        setMessage(
          'Los cambios no se guardaron: la invitación aún no está conectada a Firebase. Mientras tanto, los datos que se muestran salen del archivo central de configuración.',
        );
      } else {
        setStatus('saved');
        setMessage('Cambios guardados correctamente.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('No pudimos guardar los cambios. Revisa tu conexión e intenta de nuevo.');
    }
  };

  return (
    <div className="space-y-8">
      {!isFirebaseConfigured && (
        <DemoNotice message="Modo demostración: puedes editar y ver los cambios aquí, pero no se guardan en ningún lado hasta conectar Firebase." />
      )}

      <div className="space-y-10">
        {GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="font-heading text-xl text-background">{group.title}</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {group.fields.map((field) => (
                <AdminField
                  key={field.path}
                  label={field.label}
                  hint={field.hint}
                  type={field.type || 'text'}
                  textarea={field.textarea}
                  value={String(
                    field.path.split('.').reduce((value, key) => value?.[key] ?? '', form),
                  )}
                  onChange={(value) =>
                    update(field.path, field.type === 'number' ? Number(value) : value)
                  }
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {message && (
        <p className={status === 'saved' ? 'text-sm text-primary' : 'text-sm text-background/70'}>
          {message}
        </p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={status === 'saving'}
        className="inline-flex items-center gap-2 border border-primary bg-primary px-6 py-3 text-[0.66rem] uppercase tracking-wide-luxe text-primary-foreground transition hover:bg-transparent hover:text-primary disabled:opacity-60"
      >
        {status === 'saving' ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Save className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        Guardar configuración
      </button>

      <p className="text-xs leading-relaxed text-background/50">
        Los datos base de la invitación viven en el archivo central de configuración del proyecto
        (nombres, fotografías, itinerario, mesa de regalos y textos completos). Este panel edita los
        campos principales y los guarda en Firebase para que el cambio se refleje sin tocar código.
      </p>
    </div>
  );
}