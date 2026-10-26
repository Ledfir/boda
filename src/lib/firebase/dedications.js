import { getFirebase, demoResult } from './client';
import { firebaseCollections } from './config';
import { demoDedications } from './demoData';

/**
 * Dedicatorias.
 * Colección: `dedicatorias` — las nuevas quedan con `aprobada: false`.
 */
export async function submitDedication({ nombre, mensaje, invitacionId }) {
  const fb = await getFirebase();
  if (!fb) return demoResult();

  const { addDoc, collection, serverTimestamp } = fb.firestoreLib;
  const doc = await addDoc(collection(fb.db, firebaseCollections.dedications), {
    invitacionId,
    nombre: nombre.trim(),
    mensaje: mensaje.trim(),
    aprobada: false,
    fecha: serverTimestamp(),
  });
  return { ok: true, demo: false, id: doc.id };
}

export async function listApprovedDedications() {
  const fb = await getFirebase();
  if (!fb) return { demo: true, items: demoDedications.filter((d) => d.aprobada) };

  const { getDocs, collection, query, where, orderBy } = fb.firestoreLib;
  const snap = await getDocs(
    query(
      collection(fb.db, firebaseCollections.dedications),
      where('aprobada', '==', true),
      orderBy('fecha', 'desc'),
    ),
  );
  return { demo: false, items: snap.docs.map((d) => ({ id: d.id, ...d.data() })) };
}

export async function listAllDedications() {
  const fb = await getFirebase();
  if (!fb) return { demo: true, items: demoDedications };

  const { getDocs, collection, query, orderBy } = fb.firestoreLib;
  const snap = await getDocs(
    query(collection(fb.db, firebaseCollections.dedications), orderBy('fecha', 'desc')),
  );
  return { demo: false, items: snap.docs.map((d) => ({ id: d.id, ...d.data() })) };
}

export async function setDedicationApproval(id, aprobada) {
  const fb = await getFirebase();
  if (!fb) return demoResult({ id, aprobada });

  const { updateDoc, doc } = fb.firestoreLib;
  await updateDoc(doc(fb.db, firebaseCollections.dedications, id), { aprobada });
  return { ok: true, demo: false };
}

export async function removeDedication(id) {
  const fb = await getFirebase();
  if (!fb) return demoResult({ id });

  const { deleteDoc, doc } = fb.firestoreLib;
  await deleteDoc(doc(fb.db, firebaseCollections.dedications, id));
  return { ok: true, demo: false };
}