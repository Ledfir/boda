# Conectar Firebase (arquitectura lista)

La invitación funciona hoy en **modo demostración**: todo se ve y se recorre, pero
**nada se guarda** y la interfaz lo indica con claridad. Sigue estos pasos cuando
quieras activar el guardado real de confirmaciones, dedicatorias y fotografías.

## 1. Credenciales

1. Entra a [console.firebase.google.com](https://console.firebase.google.com) y crea un proyecto.
2. **Configuración del proyecto → Tus apps → App web (`< / >`)** y copia los valores.
3. Pégalos en `src/lib/firebase/config.js` (o defínelos como variables de entorno
   `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`,
   `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`).
4. En **Authentication → Sign-in method** habilita **Anónimo** (para las subidas de
   invitados) y **Correo electrónico/contraseña** (para el panel `/admin`).
5. Crea un usuario administrador y añade un *custom claim* `admin: true`
   (con una Cloud Function o desde la consola de Firebase).

En cuanto las credenciales estén puestas, la app deja de mostrar el aviso de
demostración y empieza a guardar en las colecciones reales.

## 2. Colecciones y rutas

| Dónde | Ruta |
| --- | --- |
| Firestore | `confirmaciones`, `dedicatorias`, `fotos_invitados`, `invitaciones/{invitacionId}` |
| Storage | `bodas/{invitacionId}/invitados/{identificador}/{archivo}` |

El `invitacionId` se configura en `src/config/wedding.js`.

## 3. Reglas de Firestore

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAdmin() {
      return request.auth != null && request.auth.token.admin == true;
    }

    function isCleanText(value, max) {
      return value is string && value.size() > 0 && value.size() <= max;
    }

    // Confirmaciones: cualquiera puede registrar la suya, una sola vez por documento.
    // El cupo autorizado NO se acepta desde el navegador: se valida contra el
    // documento de invitado (`invitados/{id}`) que solo edita el administrador.
    match /confirmaciones/{docId} {
      allow create: if isCleanText(request.resource.data.nombre, 120)
        && request.resource.data.asistencia in ['si', 'no']
        && request.resource.data.acompanantes is int
        && request.resource.data.acompanantes >= 0
        && request.resource.data.acompanantes <= 10
        && (!exists(/databases/$(database)/documents/confirmaciones/$(docId)));
      allow read, update, delete: if isAdmin();
    }

    // Dedicatorias: se crean como pendientes; solo el administrador las publica.
    match /dedicatorias/{docId} {
      allow create: if isCleanText(request.resource.data.nombre, 120)
        && isCleanText(request.resource.data.mensaje, 800)
        && request.resource.data.aprobada == false;
      allow read: if resource.data.aprobada == true || isAdmin();
      allow update, delete: if isAdmin();
    }

    // Fotografías de invitados: subidas anónimas, publicación solo tras aprobación.
    match /fotos_invitados/{docId} {
      allow create: if isCleanText(request.resource.data.nombreInvitado, 120)
        && isCleanText(request.resource.data.storagePath, 400)
        && request.resource.data.aprobada == false;
      allow read: if resource.data.aprobada == true || isAdmin();
      allow update, delete: if isAdmin();
    }

    match /invitaciones/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Cupos por invitado (enlaces personalizados): solo lectura pública.
    match /invitados/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 4. Reglas de Storage

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /bodas/{invitacionId}/invitados/{identificador}/{archivo} {
      // Solo imágenes JPG/PNG/WEBP y hasta 12 MB. Las credenciales
      // administrativas nunca se exponen: cada invitado usa una sesión anónima.
      allow write: if request.auth != null
        && request.resource.size < 12 * 1024 * 1024
        && request.resource.contentType.matches('image/(jpeg|jpg|png|webp)');
      allow read: if true;
    }
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## 5. Controles de abuso

- Activa **App Check** (reCAPTCHA v3 para web) en la consola de Firebase y
  habilítalo para Firestore y Storage.
- Las fotografías permanecen **pendientes de moderación**: nada se publica sin
  aprobación desde `/admin`.
- Las dedicatorias también se aprueban antes de publicarse.
- La compresión de imágenes ocurre en el navegador del invitado antes de subir.