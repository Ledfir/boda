import { firebaseConfig, isFirebaseConfigured } from './config';

let cached = null;

/** Inicializa Firebase solo cuando hay credenciales (carga diferida). */
export async function getFirebase() {
  if (!isFirebaseConfigured) return null;
  if (cached) return cached;

  const [{ getApps, initializeApp }, firestoreLib, storageLib] = await Promise.all([
    import('firebase/app'),
    import('firebase/firestore'),
    import('firebase/storage'),
  ]);

  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  cached = {
    app,
    db: firestoreLib.getFirestore(app),
    storage: storageLib.getStorage(app),
    firestoreLib,
    storageLib,
  };
  return cached;
}

/** Firebase Authentication (acceso administrativo). */
export async function getFirebaseAuth() {
  if (!isFirebaseConfigured) return null;
  const [{ getApps, initializeApp }, authLib] = await Promise.all([
    import('firebase/app'),
    import('firebase/auth'),
  ]);
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  return { auth: authLib.getAuth(app), authLib };
}

/** Respuesta estándar cuando no hay conexión: nunca simulamos un guardado. */
export const demoResult = (extra = {}) => ({ ok: false, demo: true, ...extra });