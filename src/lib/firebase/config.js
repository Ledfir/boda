/**
 * ============================================================================
 * CONEXIÓN CON FIREBASE
 * ----------------------------------------------------------------------------
 * Cómo conectar tu proyecto (5 minutos):
 *   1. console.firebase.google.com → crea un proyecto.
 *   2. Configuración del proyecto → Tus apps → App web (< / >).
 *   3. Copia los valores del objeto `firebaseConfig` que te muestra Firebase
 *      y pégalos abajo (o defínelos como variables de entorno VITE_FIREBASE_*).
 *   4. Crea Firestore (modo producción) y Storage, y publica las reglas de
 *      seguridad incluidas en el archivo FIREBASE_SETUP.md de este proyecto.
 *
 * Mientras los valores sigan siendo los marcadores de posición, TODA la
 * invitación funciona en MODO DEMOSTRACIÓN: nada se guarda y la interfaz lo
 * indica claramente a los invitados y al panel de administración.
 * ============================================================================
 */

const PLACEHOLDER = 'CONFIGURA_TU_FIREBASE';
const env = import.meta.env;

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || PLACEHOLDER,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || PLACEHOLDER,
  projectId: env.VITE_FIREBASE_PROJECT_ID || PLACEHOLDER,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || PLACEHOLDER,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || PLACEHOLDER,
  appId: env.VITE_FIREBASE_APP_ID || PLACEHOLDER,
};

/** true cuando las credenciales reales ya están configuradas. */
export const isFirebaseConfigured = Object.values(firebaseConfig).every(
  (value) => typeof value === 'string' && value.length > 0 && value !== PLACEHOLDER,
);

/** Colecciones de Firestore (según la arquitectura solicitada). */
export const firebaseCollections = {
  rsvps: 'confirmaciones',
  dedications: 'dedicatorias',
  guestPhotos: 'fotos_invitados',
  invitations: 'invitaciones',
};

/** Rutas de Firebase Storage. */
export const storagePaths = {
  guestPhoto: ({ invitacionId, guestId, fileName }) =>
    `bodas/${invitacionId}/invitados/${guestId}/${fileName}`,
};

export const DEMO_MESSAGE =
  'Modo demostración: la invitación aún no está conectada a Firebase, así que esta información no se guarda en ningún lado.';