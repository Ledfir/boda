import { getFirebase, demoResult } from './client';
import { firebaseCollections } from './config';
import { demoRsvps } from './demoData';

/**
 * Guarda una confirmación de asistencia.
 * Colección: `confirmaciones`.
 */
export async function submitRsvp(payload) {
  const fb = await getFirebase();
  if (!fb) return demoResult();

  const { addDoc, collection, serverTimestamp } = fb.firestoreLib;
  const doc = await addDoc(collection(fb.db, firebaseCollections.rsvps), {
    ...payload,
    fechaConfirmacion: serverTimestamp(),
  });
  return { ok: true, demo: false, id: doc.id };
}

export async function listRsvps() {
  const fb = await getFirebase();
  if (!fb) return { demo: true, items: demoRsvps };

  const { getDocs, collection, query, orderBy } = fb.firestoreLib;
  const snap = await getDocs(
    query(collection(fb.db, firebaseCollections.rsvps), orderBy('fechaConfirmacion', 'desc')),
  );
  const items = snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      fechaConfirmacion: data.fechaConfirmacion?.toDate?.()?.toISOString?.() || null,
    };
  });
  return { demo: false, items };
}

/** ¿Ya existe una confirmación con este nombre? (evita duplicados) */
export async function findRsvpByName(nombre) {
  const fb = await getFirebase();
  if (!fb) return null;
  const { getDocs, collection, query, where, limit } = fb.firestoreLib;
  const snap = await getDocs(
    query(collection(fb.db, firebaseCollections.rsvps), where('nombre', '==', nombre.trim()), limit(1)),
  );
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() };
}