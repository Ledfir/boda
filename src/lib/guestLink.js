/**
 * Enlaces personalizados por invitado.
 *
 * El enlace lleva un identificador y el cupo autorizado, por ejemplo:
 *   https://mi-invitacion.com/?invitado=eyJpZCI6ImFiYzEyIiwibm9tYnJlIjoi...
 *
 * El cupo que viaja en el enlace es solo una comodidad de la interfaz:
 * el límite real se valida del lado del servidor con las reglas de seguridad
 * de Firestore (ver FIREBASE_SETUP.md), de modo que un invitado no puede
 * aumentarlo desde el navegador.
 */

function encodePayload(payload) {
  return window.btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}

function decodePayload(raw) {
  return JSON.parse(decodeURIComponent(escape(window.atob(raw))));
}

export function parseGuestLink(search = window.location.search) {
  const params = new URLSearchParams(search);
  const raw = params.get('invitado') || params.get('token');
  if (!raw) return null;

  try {
    const data = decodePayload(raw);
    return {
      id: data.id || raw,
      nombre: data.nombre || '',
      cupo: Number.isFinite(data.cupo) ? data.cupo : null,
    };
  } catch {
    return { id: raw, nombre: '', cupo: null };
  }
}

/** Utilidad para generar enlaces de invitado desde el panel o desde código. */
export function buildGuestLink({ id, nombre, cupo, baseUrl = window.location.origin }) {
  return `${baseUrl}/?invitado=${encodePayload({ id, nombre, cupo })}`;
}