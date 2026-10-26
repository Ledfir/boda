/**
 * ============================================================================
 * CONFIGURACIÓN CENTRAL DE LA BODA
 * ----------------------------------------------------------------------------
 * Este es el ÚNICO lugar donde se editan los datos de la invitación:
 * nombres, fecha, zona horaria, fotografías, música, ubicaciones, itinerario,
 * código de vestimenta, mesa de regalos, fecha límite de confirmación y textos.
 *
 * Los datos que ves aquí son de DEMOSTRACIÓN: sustitúyelos por los reales.
 * ============================================================================
 */

const MEDIA = 'https://media.base44.com/images/public/6adecd4b90cf5b2f755200fd';

export const IMAGES = {
  hero: `${MEDIA}/40bf6c387_generated_image.png`,
  ceremony: `${MEDIA}/1d4b54769_generated_image.png`,
  reception: `${MEDIA}/04552e4fd_generated_image.png`,
  storyOne: `${MEDIA}/014ea7611_generated_image.png`,
  storyTwo: `${MEDIA}/a71e4bc04_generated_image.png`,
  storyThree: `${MEDIA}/1b4c85af1_generated_image.png`,
  storyFour: `${MEDIA}/1aa18e839_generated_image.png`,
  dress: `${MEDIA}/0a78bf2a6_generated_image.png`,
  bouquet: `${MEDIA}/ed9355abe_generated_image.png`,
  foreheads: `${MEDIA}/de3762293_generated_image.png`,
  rings: `${MEDIA}/59d480f79_generated_image.png`,
  dancing: `${MEDIA}/c4b987d37_generated_image.png`,
  laughing: `${MEDIA}/563600922_generated_image.png`,
  closing: `${MEDIA}/ef6a2bcb1_generated_image.png`,
};

export const weddingConfig = {
  /** Identificador de la invitación: agrupa confirmaciones, dedicatorias y fotos. */
  invitacionId: 'valeria-y-andres-2027',

  couple: {
    bride: { name: 'Valeria', fullName: 'Valeria Herrera' },
    groom: { name: 'Andrés', fullName: 'Andrés Villalobos' },
    initials: 'V & A',
    display: 'Valeria & Andrés',
  },

  /** Fecha, hora y zona horaria del evento. */
  date: {
    iso: '2027-05-15T17:00:00-06:00',
    timeZone: 'America/Monterrey',
    displayLong: 'Sábado 15 de mayo de 2027',
    displayShort: '15 · 05 · 2027',
    time: '5:00 PM',
    city: 'Monterrey, Nuevo León',
  },

  /** Confirmación de asistencia (RSVP). */
  rsvp: {
    deadlineIso: '2027-04-15T23:59:59-06:00',
    deadlineDisplay: '15 de abril de 2027',
    defaultMaxCompanions: 2,
    closedMessage:
      'Las confirmaciones están cerradas. Si necesitas ajustar algo, por favor contacta directamente a los novios.',
  },

  /** Música ambiental. Deja `src` vacío hasta tener el MP3 definitivo. */
  music: {
    src: '',
    title: '',
    artist: '',
    initialVolume: 0.35,
  },

  cover: {
    image: IMAGES.hero,
    kicker: 'Nos casamos',
    tagline: 'El comienzo de nuestro para siempre',
    welcomeText: 'Nuestra historia continúa...',
  },

  texts: {
    quote:
      'Hay momentos en la vida que son especiales por sí solos, pero compartirlos con las personas que amamos los convierte en inolvidables.',
    quoteSubline:
      'Con inmensa alegría queremos compartir contigo el día en que uniremos nuestras vidas.',
    storyTitle: 'Nuestra historia',
    storySubtitle: 'Los momentos que nos trajeron hasta aquí.',
    galleryTitle: 'Nuestros momentos',
    gallerySubtitle: 'Cada fotografía guarda un pedacito de nuestra historia.',
    ceremonyTitle: 'Ceremonia',
    receptionTitle: 'Recepción',
    itineraryTitle: 'Itinerario',
    itinerarySubtitle: 'Los momentos del gran día, en orden.',
    dressCodeTitle: 'Dress code',
    dressCodeSubtitle: 'Queremos vernos elegantes juntos.',
    giftsTitle: 'El mejor regalo es tu presencia',
    giftsSubtitle: 'Si deseas tener un detalle con nosotros, te compartimos algunas opciones.',
    rsvpTitle: 'Confirma tu asistencia',
    rsvpSubtitle: 'Nos encantaría contar contigo en este día tan especial.',
    dedicationsTitle: 'Palabras que guardamos en el corazón',
    dedicationsSubtitle: 'Déjanos unas palabras que podamos recordar por siempre.',
    albumTitle: 'Captura nuestros momentos',
    albumSubtitle:
      'Queremos ver nuestra boda a través de tus ojos. Comparte con nosotros las fotografías que captures durante este día tan especial.',
    closingTitle: 'Gracias por ser parte de nuestra historia',
    closingText: 'El amor se celebra mejor cuando se comparte con quienes más queremos.',
  },

  /** Nuestra historia (línea de tiempo). */
  story: [
    {
      id: 'conocimos',
      title: 'Cómo nos conocimos',
      date: 'Abril 2019',
      description:
        'Una mesa compartida por casualidad, una conversación que duró hasta el amanecer y la sensación de haber encontrado algo distinto.',
      image: IMAGES.storyOne,
    },
    {
      id: 'primera-cita',
      title: 'Nuestra primera cita',
      date: 'Mayo 2019',
      description:
        'Caminamos sin rumbo por el centro de la ciudad, nos reímos de todo y prometimos repetirlo muy pronto.',
      image: IMAGES.storyTwo,
    },
    {
      id: 'historia',
      title: 'Nuestra historia de amor',
      date: '2019 — 2025',
      description:
        'Viajes, mudanzas, logros y días difíciles. Aprendimos que el amor se construye en los detalles pequeños de cada día.',
      image: IMAGES.storyThree,
    },
    {
      id: 'propuesta',
      title: 'La propuesta',
      date: 'Septiembre 2025',
      description:
        'Al atardecer, con las manos temblando y el corazón a mil, una pregunta cambió todo para siempre.',
      image: IMAGES.storyFour,
    },
    {
      id: 'gran-dia',
      title: 'El gran día',
      date: '15 de mayo de 2027',
      description:
        'Y ahora queremos que estés con nosotros para escribir el capítulo más importante de nuestra historia.',
      image: IMAGES.hero,
    },
  ],

  /** Galería oficial de los novios. */
  gallery: [
    { src: IMAGES.hero, alt: 'Los novios caminando al atardecer' },
    { src: IMAGES.foreheads, alt: 'Un momento íntimo de los novios' },
    { src: IMAGES.dress, alt: 'Detalle del vestido de novia' },
    { src: IMAGES.bouquet, alt: 'Ramo de novia con eucalipto' },
    { src: IMAGES.dancing, alt: 'Los novios bailando en el campo' },
    { src: IMAGES.rings, alt: 'Anillos de boda sobre lino' },
    { src: IMAGES.laughing, alt: 'Los novios riendo al sol' },
    { src: IMAGES.storyFour, alt: 'El momento de la propuesta' },
  ],

  ceremony: {
    venue: 'Parroquia de San José',
    date: 'Sábado 15 de mayo de 2027',
    time: '5:00 PM',
    address: 'Av. Constitución 500, Centro, Monterrey, N.L., México',
    image: IMAGES.ceremony,
    buttonLabel: 'Ver ubicación',
  },

  reception: {
    venue: 'Hacienda Los Encinos',
    date: 'Sábado 15 de mayo de 2027',
    time: '6:30 PM',
    address: 'Camino a Villa de Santiago 1200, Santiago, N.L., México',
    image: IMAGES.reception,
    buttonLabel: 'Cómo llegar',
  },

  /** Itinerario del evento (los iconos son nombres de lucide-react). */
  itinerary: [
    { time: '5:00 PM', title: 'Ceremonia', description: 'La bendición y el intercambio de anillos.', icon: 'Heart' },
    { time: '6:30 PM', title: 'Recepción', description: 'Coctel de bienvenida en el jardín.', icon: 'Wine' },
    { time: '7:00 PM', title: 'Entrada de los novios', description: 'El momento más esperado.', icon: 'Sparkles' },
    { time: '8:00 PM', title: 'Cena', description: 'Menú de tres tiempos.', icon: 'UtensilsCrossed' },
    { time: '9:00 PM', title: 'Primer baile', description: 'Nuestra canción, con todos ustedes cerca.', icon: 'Music' },
    { time: '10:00 PM', title: 'Fiesta', description: 'Baile, sorpresas y celebración hasta el final.', icon: 'PartyPopper' },
  ],

  dressCode: {
    code: 'Formal / Elegante',
    description:
      'Te pedimos vestir de etiqueta formal en tonos suaves: crema, arena, salvia o azul profundo. Nada de jeans, tenis ni estampados llamativos.',
    notes: 'La ceremonia es en un recinto religioso: te sugerimos evitar escotes muy pronunciados y prendas demasiado cortas.',
    reservedNote: 'Colores reservados para los novios:',
    reservedColors: [
      { name: 'Marfil', hex: '#FAF7F2' },
      { name: 'Blanco cálido', hex: '#FFFFFF' },
      { name: 'Champagne', hex: '#E8DCC8' },
    ],
    references: [
      { src: IMAGES.dress, alt: 'Referencia de vestimenta femenina' },
      { src: IMAGES.laughing, alt: 'Referencia de vestimenta masculina' },
    ],
  },

  /**
   * Mesa de regalos.
   * IMPORTANTE: los datos bancarios de demostración se muestran marcados como
   * tales. Al configurar los reales, cambia `isDemo` a false.
   */
  gifts: [
    {
      id: 'mesa',
      title: 'Mesa de regalos',
      description: 'Consulta nuestra mesa de regalos en Liverpool con el siguiente número de evento.',
      linkLabel: 'Ver mesa de regalos',
      url: '',
      detail: 'Evento de demostración 00000000',
      isDemo: true,
      enabled: true,
      icon: 'Gift',
    },
    {
      id: 'sobres',
      title: 'Lluvia de sobres',
      description:
        'Si prefieres un detalle en efectivo, habrá un buzón discreto en la recepción para tu sobre.',
      enabled: true,
      icon: 'Mail',
    },
    {
      id: 'transferencia',
      title: 'Transferencia bancaria',
      description: 'Para quienes prefieren hacerlo desde la comodidad de su casa.',
      bank: 'Banco de demostración',
      holder: 'Valeria Herrera / Andrés Villalobos',
      clabe: '•••• •••• •••• •••• ••',
      account: '•••• •••• •••• 0000',
      isDemo: true,
      enabled: true,
      icon: 'CreditCard',
    },
  ],

  /** Álbum colaborativo de invitados (separado de la galería oficial). */
  album: {
    requireApproval: true,
    maxFileSizeMb: 12,
    maxFilesPerGuest: 6,
    allowDownload: true,
    compression: { maxWidthOrHeight: 2000, quality: 0.85 },
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  },

  /** Fotos de demostración del álbum colaborativo (modo demostración). */
  demoGuestPhotos: [
    { id: 'demo-foto-1', nombreInvitado: 'Familia Ruiz', url: IMAGES.laughing, aprobada: true },
    { id: 'demo-foto-2', nombreInvitado: 'Mariana Solís', url: IMAGES.bouquet, aprobada: true },
    { id: 'demo-foto-3', nombreInvitado: 'Jorge y Ana', url: IMAGES.dancing, aprobada: true },
    { id: 'demo-foto-4', nombreInvitado: 'Invitado anónimo', url: IMAGES.rings, aprobada: true },
  ],
};

export default weddingConfig;