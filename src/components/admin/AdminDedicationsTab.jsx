import React, { useEffect, useMemo, useState } from 'react';
import { Check, Loader2, Trash2, X } from 'lucide-react';
import DemoNotice from '@/components/common/DemoNotice';
import {
  listAllDedications,
  removeDedication,
  setDedicationApproval,
} from '@/lib/firebase/dedications';

const FILTERS = [
  { id: 'pendientes', label: 'Pendientes' },
  { id: 'aprobadas', label: 'Aprobadas' },
  { id: 'todas', label: 'Todas' },
];

/** Moderación de dedicatorias: aprobar, rechazar y eliminar. */
export default function AdminDedicationsTab() {
  const [state, setState] = useState({ loading: true, items: [], demo: false, error: false });
  const [filter, setFilter] = useState('pendientes');
  const [notSaved, setNotSaved] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const result = await listAllDedications();
        if (active) setState({ loading: false, items: result.items, demo: result.demo, error: false });
      } catch (error) {
        if (active) setState({ loading: false, items: [], demo: false, error: true });
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(() => {
    if (filter === 'pendientes') return state.items.filter((item) => !item.aprobada);
    if (filter === 'aprobadas') return state.items.filter((item) => item.aprobada);
    return state.items;
  }, [state.items, filter]);

  const applyLocal = (id, patch) =>
    setState((previous) => ({
      ...previous,
      items: previous.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));

  const handleApproval = async (id, aprobada) => {
    const result = await setDedicationApproval(id, aprobada);
    applyLocal(id, { aprobada });
    if (result.demo) setNotSaved(true);
  };

  const handleRemove = async (id) => {
    const result = await removeDedication(id);
    setState((previous) => ({ ...previous, items: previous.items.filter((item) => item.id !== id) }));
    if (result.demo) setNotSaved(true);
  };

  if (state.loading) {
    return (
      <div className="flex items-center gap-3 text-sm text-background/60">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        Cargando dedicatorias…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {state.demo && (
        <DemoNotice message="Las dedicatorias mostradas son de demostración. Las de tus invitados aparecerán al conectar Firebase." />
      )}

      {notSaved && (
        <DemoNotice message="Los cambios se reflejan en esta pantalla, pero no se guardaron: modo demostración." />
      )}

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setFilter(option.id)}
            aria-pressed={filter === option.id}
            className={`border px-4 py-2 text-[0.64rem] uppercase tracking-wide-luxe transition ${
              filter === option.id
                ? 'border-primary text-primary'
                : 'border-background/20 text-background/60 hover:border-background/40'
            }`}
          >
            {option.label}
            <span className="ml-2 text-background/40">
              {option.id === 'pendientes'
                ? state.items.filter((item) => !item.aprobada).length
                : option.id === 'aprobadas'
                  ? state.items.filter((item) => item.aprobada).length
                  : state.items.length}
            </span>
          </button>
        ))}
      </div>

      {state.error && <p className="text-sm text-background/60">No pudimos cargar las dedicatorias.</p>}

      {!state.error && visible.length === 0 && (
        <p className="text-sm text-background/60">No hay dedicatorias en esta vista.</p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {visible.map((dedication) => (
          <article key={dedication.id} className="border border-background/15 bg-background/5 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-heading text-lg text-background">{dedication.nombre}</p>
                <p className="mt-1 text-[0.6rem] uppercase tracking-wide-luxe text-background/50">
                  {dedication.aprobada ? 'Aprobada' : 'Pendiente de aprobación'}
                </p>
              </div>
              <div className="flex gap-2">
                {!dedication.aprobada ? (
                  <button
                    type="button"
                    onClick={() => handleApproval(dedication.id, true)}
                    aria-label={`Aprobar dedicatoria de ${dedication.nombre}`}
                    className="inline-flex h-9 w-9 items-center justify-center border border-primary/60 text-primary transition hover:bg-primary hover:text-primary-foreground"
                  >
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleApproval(dedication.id, false)}
                    aria-label={`Ocultar dedicatoria de ${dedication.nombre}`}
                    className="inline-flex h-9 w-9 items-center justify-center border border-background/25 text-background/70 transition hover:border-primary hover:text-primary"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(dedication.id)}
                  aria-label={`Eliminar dedicatoria de ${dedication.nombre}`}
                  className="inline-flex h-9 w-9 items-center justify-center border border-background/25 text-background/70 transition hover:border-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <p className="mt-4 font-accent text-base italic leading-relaxed text-background/85">
              «{dedication.mensaje}»
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}