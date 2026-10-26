import { getFirebase, demoResult } from './client';
import { firebaseCollections } from './config';

/**
 * Configuración de la boda guardada en Firestore para poder editarla desde el
 * panel de administración. Documento: `invitaciones/{invitacionId}`.
 */
export async function getWeddingDoc(invitacionId) {
  const fb = await getFirebase();
  if (!fb) return { demo: true, data: null };

  const { getDoc, doc } = fb.firestoreLib;
  const snap = await getDoc(doc(fb.db, firebaseCollections.invitations, invitacionId));
  return { demo: false, data: snap.exists() ? snap.data() : null };
}

export async function saveWeddingDoc(invitacionId, data) {
  const fb = await getFirebase();
  if (!fb) return demoResult();

  const { setDoc, doc } = fb.firestoreLib;
  await setDoc(doc(fb.db, firebaseCollections.invitations, invitacionId), data, { merge: true });
  return { ok: true, demo: false };
}