import React, { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import DemoNotice from '@/components/common/DemoNotice';
import { weddingConfig } from '@/config/wedding';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { submitDedication } from '@/lib/firebase/dedications';
import useInviteToken from '@/hooks/useInviteToken';

const MAX_LENGTH = 800;
const MIN_LENGTH = 10;

/** Formulario para dejar una dedicatoria a los novios. */
export default function DedicationForm({ onSubmitted }) {
  const invite = useInviteToken();
  const [nombre, setNombre] = useState(invite?.nombre || '');
  const [mensaje, setMensaje] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!nombre.trim()) {
      setError('Escribe tu nombre para saber de quién es la dedicatoria.');
      return;
    }
    if (mensaje.trim().length < MIN_LENGTH) {
      setError(`Tu dedicatoria debe tener al menos ${MIN_LENGTH} caracteres.`);
      return;
    }

    setError('');
    setStatus('sending');
    try {
      const result = await submitDedication({
        nombre,
        mensaje,
        invitacionId: weddingConfig.invitacionId,
      });
      setStatus(result.demo ? 'demo' : 'sent');
      if (!result.demo) {
        setMensaje('');
        onSubmitted?.(result);
      }
    } catch (submitError) {
      setStatus('idle');
      setError('No pudimos enviar tu dedicatoria. Intenta de nuevo en un momento.');
    }
  };

  if (status === 'sent' || status === 'demo') {
    return (
      <div className="border border-primary/40 bg-background p-7 text-center">
        <p className="font-heading text-xl text-foreground">
          {status === 'sent' ? 'Gracias por tus palabras' : 'Dedicatoria preparada'}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {status === 'sent'
            ? 'Tu mensaje quedó pendiente de aprobación y aparecerá aquí en cuanto los novios lo lean.'
            : 'Tu mensaje se escribió correctamente, pero no se guardó: la invitación aún no está conectada a Firebase.'}
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 border border-primary/50 px-5 py-2.5 text-[0.66rem] uppercase tracking-wide-luxe text-foreground transition hover:bg-primary hover:text-primary-foreground"
        >
          Escribir otra dedicatoria
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-border/80 bg-background p-6 sm:p-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2 sm:col-span-1">
          <span className="text-[0.64rem] uppercase tracking-wide-luxe text-muted-foreground">
            Tu nombre
          </span>
          <input
            type="text"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            maxLength={120}
            className="border border-input bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"
            placeholder="Nombre y apellido"
          />
        </label>

        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-[0.64rem] uppercase tracking-wide-luxe text-muted-foreground">
            Tu dedicatoria
          </span>
          <textarea
            value={mensaje}
            onChange={(event) => setMensaje(event.target.value.slice(0, MAX_LENGTH))}
            rows={5}
            className="resize-none border border-input bg-card px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"
            placeholder="Escribe unas palabras que podamos recordar por siempre..."
          />
          <span className="text-right text-[0.6rem] text-muted-foreground">
            {mensaje.length} / {MAX_LENGTH}
          </span>
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {error}
        </p>
      )}

      {!isFirebaseConfigured && <DemoNotice className="mt-5" compact />}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 border border-primary bg-primary px-6 py-3 text-[0.68rem] uppercase tracking-wide-luxe text-primary-foreground transition hover:bg-transparent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === 'sending' ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        Enviar dedicatoria
      </button>
    </form>
  );
}