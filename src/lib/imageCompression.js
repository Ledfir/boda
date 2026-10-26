/**
 * Comprime una fotografía en el navegador antes de subirla.
 * El archivo original nunca se modifica: solo se genera una copia optimizada.
 */
export async function compressImage(file, { maxWidthOrHeight = 2000, quality = 0.85 } = {}) {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidthOrHeight / Math.max(bitmap.width, bitmap.height));

  if (scale === 1 && file.size < 1.5 * 1024 * 1024) {
    bitmap.close?.();
    return file;
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext('2d');
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', quality),
  );
  if (!blob) return file;

  const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
  return new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() });
}

export function isSupportedImage(file, acceptedTypes) {
  return acceptedTypes.includes(file.type);
}