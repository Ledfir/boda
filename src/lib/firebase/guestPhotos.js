import { getFirebase, getFirebaseAuth, demoResult } from './client';
import { firebaseCollections, storagePaths } from './config';

/**
 * Sesión anónima por invitado: permite aplicar reglas de seguridad en Storage
 * sin exponer credenciales administrativas.
 */
async function ensureGuestSession() {
  const fbAuth = await getFirebaseAuth();
  if (!fbAuth) return null;
  const { auth, authLib } = fbAuth;
  if (auth.currentUser) return auth.currentUser;
  const credential = await authLib.signInAnonymously(auth);
  return credential.user;
}

/**
 * Álbum colaborativo de invitados.
 * Storage: `bodas/{invitacionId}/invitados/{identificador}/{archivo}`
 * Firestore: `fotos_invitados` (las fotos quedan pendientes de moderación).
 */
export async function uploadGuestPhoto({ file, nombreInvitado, invitacionId, guestId, onProgress }) {
  const fb = await getFirebase();
  if (!fb) return demoResult();

  const { ref, uploadBytesResumable, getDownloadURL } = fb.storageLib;
  const { addDoc, collection, serverTimestamp } = fb.firestoreLib;

  const guestUser = await ensureGuestSession();
  const safeName = `${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`;
  const path = storagePaths.guestPhoto({
    invitacionId,
    guestId: guestUser?.uid || guestId || 'anonimo',
    fileName: safeName,
  });
  const task = uploadBytesResumable(ref(fb.storage, path), file, { contentType: file.type });

  const downloadUrl = await new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (snapshot) => onProgress?.(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
      reject,
      async () => resolve(await getDownloadURL(task.snapshot.ref)),
    );
  });

  const newDoc = await addDoc(collection(fb.db, firebaseCollections.guestPhotos), {
    invitacionId,
    nombreInvitado: nombreInvitado?.trim() || 'Invitado anónimo',
    storagePath: path,
    url: downloadUrl,
    fechaSubida: serverTimestamp(),
    aprobada: false,
  });

  return { ok: true, demo: false, id: newDoc.id, url: downloadUrl };
}

export async function listApprovedGuestPhotos() {
  const fb = await getFirebase();
  if (!fb) return { demo: true, items: [] };

  const { getDocs, collection, query, where, orderBy } = fb.firestoreLib;
  const snap = await getDocs(
    query(
      collection(fb.db, firebaseCollections.guestPhotos),
      where('aprobada', '==', true),
      orderBy('fechaSubida', 'desc'),
    ),
  );
  return { demo: false, items: snap.docs.map((d) => ({ id: d.id, ...d.data() })) };
}

export async function listAllGuestPhotos() {
  const fb = await getFirebase();
  if (!fb) return { demo: true, items: [] };

  const { getDocs, collection, query, orderBy } = fb.firestoreLib;
  const snap = await getDocs(
    query(collection(fb.db, firebaseCollections.guestPhotos), orderBy('fechaSubida', 'desc')),
  );
  return { demo: false, items: snap.docs.map((d) => ({ id: d.id, ...d.data() })) };
}

export async function setGuestPhotoApproval(id, aprobada) {
  const fb = await getFirebase();
  if (!fb) return demoResult({ id, aprobada });

  const { updateDoc, doc } = fb.firestoreLib;
  await updateDoc(doc(fb.db, firebaseCollections.guestPhotos, id), { aprobada });
  return { ok: true, demo: false };
}

export async function removeGuestPhoto({ id, storagePath }) {
  const fb = await getFirebase();
  if (!fb) return demoResult({ id });

  const { deleteDoc, doc } = fb.firestoreLib;
  await deleteDoc(doc(fb.db, firebaseCollections.guestPhotos, id));
  if (storagePath) {
    const { deleteObject, ref } = fb.storageLib;
    try {
      await deleteObject(ref(fb.storage, storagePath));
    } catch (error) {
      if (error?.code !== 'storage/object-not-found') throw error;
    }
  }
  return { ok: true, demo: false };
}