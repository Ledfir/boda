import React, { useState } from 'react';
import { Check, Loader2, Users } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import DemoNotice from '@/components/common/DemoNotice';
import FloralDivider from '@/components/common/FloralDivider';
import { weddingConfig } from '@/config/wedding';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { findRsvpByName, submitRsvp } from '@/lib/firebase/rsvps';
import useInviteToken from '@/hooks/useInviteToken';

/** Confirmación de asistencia (RSVP) preparada para Firebase. */
export default function RsvpForm() {
  const invite = useInviteToken();
  const reduceMotion = useReducedMotion();
  const { rsvp, invitacionId } = weddingConfig;

  const maxCompanions = invite?.cupo ?? rsvp.defaultMaxCompanions;

  const [form, setForm] = useState({
    nombre: invite?.nombre || '',
    telefono: '',
    asistencia: 'si',
    acompanantes: 0,
    nombresAcompanantes: '',
    mensaje: '',
  });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [savedDemo, setSavedDemo] = useState(false);

  const update = (field, value) => setForm((previous) => ({ ...previous, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.nombre.trim()) {
      setError('Necesitamos tu nombre completo para registrar la confirmación.');
      return;
    }
    if (form.asistencia === 'si' && form.acompanantes > maxCompanions) {
      setError(`Tu invitación autoriza hasta ${maxCompanions} acompañante(s).`);
      return;
    }

    setError('');
    setStatus('sending');

    const payload = {
      invitacionId,
      invitadoId: invite?.id || null,
      nombre: form.nombre.trim(),
      telefono: form.telefono.trim(),
      asistencia: form.asistencia,
      acompanantes: form.asistencia === 'si' ? Number(form.acompanantes) : 0,
      nombresAcompanantes: form.asistencia === 'si' ? form.nombresAcompanantes.trim() : '',
      mensaje: form.mensaje.trim(),
    };

    try {
      if (isFirebaseConfigured) {
        const existing = await findRsvpByName(payload.nombre);
        if (existing) {
          setStatus('duplicate');
          return;
        }
      }

      const result = await submitRsvp(payload);
      navigator.vibrate?.(25);
      setSavedDemo(Boolean(result.demo));
      setStatus('sent');
    } catch (submitError) {
      setStatus('idle');
      setError('No pudimos guardar tu confirmación. Intenta de nuevo en un momento.');
    }
  };

  if (status === 'sent' || status === 'duplicate') {
    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="border border-primary/40 bg-background p-8 text-center sm:p-10"
      >
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-primary/50">
          <Check className="h-5 w-5 text-primary" aria-hidden="true" />
        </span>
        <FloralDivider className="mx-auto mt-6 h-8 w-48 text-primary" />
        <h3 className="mt-6 font-heading text-2xl text-foreground">
          {status === 'duplicate' ? 'Ya teníamos tu confirmación' : '¡Gracias por confirmar!'}
        </h3>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          {status === 'duplicate'
            ? 'Registramos tu respuesta anteriormente. Si necesitas cambiar algo, contacta directamente a los novios.'
            : 'Tu respuesta quedó registrada y nos hará muy felices compartir este día contigo.'}
        </p>

        {savedDemo && (
          <DemoNotice
            className="mx-auto mt-6 max-w-md text-left"
            message="Importante: la invitación aún no está conectada a Firebase, así que tu confirmación no se guardó en ningún lado."
          />
        )}

        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-7 border border-primary/50 px-5 py-2.5 text-[0.66rem] uppercase tracking-wide-luxe text-foreground transition hover:bg-primary hover:text-primary-foreground"
        >
          Volver al formulario
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-border/80 bg-background p-6 sm:p-8">
      <div className="flex flex-col gap-6">
        <label className="flex flex-col gap-2">
          <span className="text-[0.64rem] uppercase tracking-wide-luxe text-muted-foreground">
            Nombre completo
          </span>
          <input
            type="text"
            value={form.nombre}
            onChange={(event) => update('nombre', event.target.value)}
            maxLength={120}
            className="border border-input bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"
            placeholder="Nombre y apellido"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[0.64rem] uppercase tracking-wide-luxe text-muted-foreground">
            Teléfono (opcional)
          </span>
          <input
            type="tel"
            value={form.telefono}
            onChange={(event) => update('telefono', event.target.value)}
            maxLength={30}
            className="border border-input bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"
            placeholder="81 0000 0000"
          />
        </label>

        <fieldset className="flex flex-col gap-3">
          <legend className="text-[0.64rem] uppercase tracking-wide-luxe text-muted-foreground">
            ¿Asistirás?
          </legend>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'si', label: 'Sí, con gusto' },
              { value: 'no', label: 'No podré ir' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  update('asistencia', option.value);
                  if (option.value === 'no') {
                    update('acompanantes', 0);
                    update('nombresAcompanantes', '');
                  }
                }}
                aria-pressed={form.asistencia === option.value}
                className={`border px-4 py-3 text-sm transition ${
                  form.asistencia === option.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input bg-card text-foreground hover:border-primary/60'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        {invite?.id && (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Invitación personal: tu cupo autorizado es de {maxCompanions} acompañante(s).
          </p>
        )}

        {form.asistencia === 'si' && (
          <>
            <label className="flex flex-col gap-2">
              <span className="text-[0.64rem] uppercase tracking-wide-luxe text-muted-foreground">
                Número de acompañantes
              </span>
              <select
                value={form.acompanantes}
                onChange={(event) => update('acompanantes', Number(event.target.value))}
                className="border border-input bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"
              >
                {Array.from({ length: maxCompanions + 1 }, (_, index) => index).map((count) => (
                  <option key={count} value={count}>
                    {count === 0 ? 'Ninguno, asisto solo' : `${count} acompañante(s)`}
                  </option>
                ))}
              </select>
            </label>

            {form.acompanantes > 0 && (
              <label className="flex flex-col gap-2">
                <span className="text-[0.64rem] uppercase tracking-wide-luxe text-muted-foreground">
                  Nombres de tus acompañantes
                </span>
                <input
                  type="text"
                  value={form.nombresAcompanantes}
                  onChange={(event) => update('nombresAcompanantes', event.target.value)}
                  maxLength={240}
                  className="border border-input bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"
                  placeholder="Sepáralos con una coma"
                />
              </label>
            )}
          </>
        )}

        <label className="flex flex-col gap-2">
          <span className="text-[0.64rem] uppercase tracking-wide-luxe text-muted-foreground">
            Mensaje adicional (opcional)
          </span>
          <textarea
            value={form.mensaje}
            onChange={(event) => update('mensaje', event.target.value.slice(0, 600))}
            rows={3}
            className="resize-none border border-input bg-card px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"
            placeholder="¿Alguna alergia, preferencia o mensaje para los novios?"
          />
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-5 text-sm text-destructive">
          {error}
        </p>
      )}

      {!isFirebaseConfigured && <DemoNotice className="mt-6" compact />}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 border border-primary bg-primary px-6 py-3.5 text-[0.68rem] uppercase tracking-wide-luxe text-primary-foreground transition hover:bg-transparent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'sending' && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
        Enviar confirmación
      </button>
    </form>
  );
}