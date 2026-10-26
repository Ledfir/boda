import React, { useEffect, useMemo, useState } from 'react';
import { Download, Loader2, Search } from 'lucide-react';
import DemoNotice from '@/components/common/DemoNotice';
import { listRsvps } from '@/lib/firebase/rsvps';
import { downloadCsv } from '@/lib/csv';

const CSV_COLUMNS = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'asistenciaTexto', label: 'Asistencia' },
  { key: 'acompanantes', label: 'Acompañantes' },
  { key: 'nombresAcompanantes', label: 'Nombres de acompañantes' },
  { key: 'mensaje', label: 'Mensaje' },
  { key: 'fechaConfirmacion', label: 'Fecha de confirmación' },
];

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function Stat({ label, value }) {
  return (
    <div className="border border-background/15 bg-background/5 p-5">
      <p className="text-[0.6rem] uppercase tracking-wide-luxe text-background/55">{label}</p>
      <p className="mt-3 font-heading text-3xl tabular-nums text-background">{value}</p>
    </div>
  );
}

/** Confirmaciones: asistentes, acompañantes, búsqueda y exportación a CSV. */
export default function AdminRsvpTab() {
  const [state, setState] = useState({ loading: true, items: [], demo: false, error: false });
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const result = await listRsvps();
        if (active) setState({ loading: false, items: result.items, demo: result.demo, error: false });
      } catch (error) {
        if (active) setState({ loading: false, items: [], demo: false, error: true });
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const confirmed = state.items.filter((item) => item.asistencia === 'si');
    const declined = state.items.filter((item) => item.asistencia === 'no');
    const companions = confirmed.reduce(
      (total, item) => total + (Number(item.acompanantes) || 0),
      0,
    );
    return {
      confirmed: confirmed.length,
      declined: declined.length,
      companions,
      total: confirmed.length + companions,
    };
  }, [state.items]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return state.items;
    return state.items.filter((item) => item.nombre?.toLowerCase().includes(term));
  }, [state.items, search]);

  const handleExport = () => {
    downloadCsv(
      `confirmaciones-${new Date().toISOString().slice(0, 10)}.csv`,
      CSV_COLUMNS,
      filtered.map((item) => ({
        ...item,
        asistenciaTexto: item.asistencia === 'si' ? 'Sí' : 'No',
        fechaConfirmacion: formatDate(item.fechaConfirmacion),
      })),
    );
  };

  if (state.loading) {
    return (
      <div className="flex items-center gap-3 text-sm text-background/60">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        Cargando confirmaciones…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {state.demo && (
        <DemoNotice
          message="Estas confirmaciones son datos de demostración. Conecta Firebase para recibir las de tus invitados."
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Invitados confirmados" value={stats.confirmed} />
        <Stat label="Acompañantes" value={stats.companions} />
        <Stat label="Total de asistentes" value={stats.total} />
        <Stat label="No asistirán" value={stats.declined} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-background/40"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre"
            aria-label="Buscar confirmación por nombre"
            className="w-full border border-background/20 bg-background/5 py-2.5 pl-10 pr-3 text-sm text-background outline-none transition placeholder:text-background/35 focus:border-primary"
          />
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-2 border border-primary/60 px-4 py-2.5 text-[0.66rem] uppercase tracking-wide-luxe text-background transition hover:bg-primary hover:text-primary-foreground"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          Exportar CSV
        </button>
      </div>

      {state.error && (
        <p className="text-sm text-background/60">No pudimos cargar las confirmaciones.</p>
      )}

      {!state.error && filtered.length === 0 && (
        <p className="text-sm text-background/60">No hay confirmaciones que coincidan.</p>
      )}

      {filtered.length > 0 && (
        <div className="overflow-x-auto border border-background/15">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-background/15 text-[0.6rem] uppercase tracking-wide-luxe text-background/55">
                <th className="px-4 py-3 font-medium">Invitado</th>
                <th className="px-4 py-3 font-medium">Asistencia</th>
                <th className="px-4 py-3 font-medium">Acompañantes</th>
                <th className="px-4 py-3 font-medium">Teléfono</th>
                <th className="px-4 py-3 font-medium">Mensaje</th>
                <th className="px-4 py-3 font-medium">Confirmado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-background/10 last:border-0">
                  <td className="px-4 py-3 text-background">{item.nombre}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        item.asistencia === 'si'
                          ? 'border border-primary/60 px-2 py-1 text-[0.6rem] uppercase tracking-wide-luxe text-primary'
                          : 'border border-background/25 px-2 py-1 text-[0.6rem] uppercase tracking-wide-luxe text-background/60'
                      }
                    >
                      {item.asistencia === 'si' ? 'Asistirá' : 'No asistirá'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-background/80">
                    {Number(item.acompanantes) || 0}
                    {item.nombresAcompanantes ? (
                      <span className="block text-xs text-background/50">
                        {item.nombresAcompanantes}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-background/70">{item.telefono || '—'}</td>
                  <td className="max-w-xs px-4 py-3 text-background/70">{item.mensaje || '—'}</td>
                  <td className="px-4 py-3 text-background/60">
                    {formatDate(item.fechaConfirmacion)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}