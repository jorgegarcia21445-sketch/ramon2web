// =====================================================================
// contenido.js — CONTENIDO EDITABLE DEL SITIO BINASA
// =====================================================================
// Aquí se cambian datos de contacto, sucursales, clientes y textos sin
// tocar el código. Reglas:
//  - Texto entre "comillas dobles"; coma entre elementos; sin coma tras el último.
//  - Un campo vacío "" se OCULTA en el sitio (nunca se muestra vacío).
//  - Números de WhatsApp: solo dígitos con lada de país, ej. "526861234567".
//  - Después de guardar: sube la versión en index.html (?v=) y publica con git.
// =====================================================================

window.CONTENIDO = {

  // ---------- EMPRESA (datos del catálogo oficial) ----------
  empresa: {
    nombre: "BINASA",
    lema: "¡Binasa… Calidad y Confianza!",
    desde: 1986,
    almacenes: 23,
    metros: "13,000 m²",
    marcas: "+40",
  },

  // ---------- CONTACTO CENTRAL (pendiente: llenar con datos oficiales) ----------
  contacto: {
    telefono: "",          // ej. "33 3837 5710"
    whatsapp: "",          // ej. "523338375710" — recibe cotizaciones si la sucursal no tiene WhatsApp
    correo: "",            // ej. "ventas@binasa.com.mx"
    direccion: "",         // dirección de la matriz
    facebook: "https://www.facebook.com/BinasaMexicali",
    linkedin: "",
  },

  // ---------- ENVÍO DE COTIZACIONES ----------
  // WhatsApp: se usa el WhatsApp de la sucursal elegida; si está vacío, el central;
  // si ambos están vacíos, WhatsApp pide al cliente elegir a quién enviarlo.
  // Correo: el botón "Enviar por correo" aparece solo cuando hay un servicio configurado.
  //   formularioURL: dirección del servicio de formularios (Formspree, Web3Forms...).
  //   Es una dirección PÚBLICA de envío, no una contraseña. Nunca pongas aquí claves privadas.
  cotizacion: {
    formularioURL: "",
    formularioCampos: {},  // campos fijos extra que pida el servicio (ej. { access_key: "..." } en Web3Forms, que es pública)
  },

  // ---------- PRECIOS ----------
  // Los precios vienen de data/productos.csv (columnas precio_mxn, precio_usd, precio_eur).
  // Si un producto no tiene precio en la moneda elegida, se muestra "Consultar precio".
  precios: {
    monedas: ["MXN", "USD", "EUR"],
    monedaInicial: "MXN",
    notaIVA: "",           // ej. "IVA incluido" o "Más IVA" — vacío = no se muestra
  },

  // ---------- SUCURSALES (23 almacenes del catálogo) ----------
  // estado: para sugerir la sucursal más cercana. mapa: enlace de Google Maps u OpenStreetMap.
  sucursales: [
    { id: "aguascalientes", nombre: "Aguascalientes", estado: "Aguascalientes", direccion: "", telefono: "", whatsapp: "", correo: "", horario: "", mapa: "" },
    { id: "chihuahua", nombre: "Chihuahua", estado: "Chihuahua", direccion: "", telefono: "", whatsapp: "", correo: "", horario: "", mapa: "" },
    { id: "cdmx", nombre: "Ciudad de México", estado: "Ciudad de México", direccion: "", telefono: "", whatsapp: "", correo: "", horario: "", mapa: "" },
    { id: "obregon", nombre: "Ciudad Obregón", estado: "Sonora", direccion: "", telefono: "", whatsapp: "", correo: "", horario: "", mapa: "" },
    { id: "edomex", nombre: "Estado de México", estado: "Estado de México", direccion: "", telefono: "", whatsapp: "", correo: "", horario: "", mapa: "" },
    { id: "guadalajara", nombre: "Guadalajara", estado: "Jalisco", direccion: "", telefono: "", whatsapp: "", correo: "", horario: "", mapa: "" },
    { id: "guaymas", nombre: "Guaymas", estado: "Sonora", direccion: "", telefono: "", whatsapp: "", correo: "", horario: "", mapa: "" },
    { id: "hermosillo", nombre: "Hermosillo", estado: "Sonora", direccion: "", telefono: "", whatsapp: "", correo: "", horario: "", mapa: "" },
    { id: "la-paz", nombre: "La Paz", estado: "Baja California Sur", direccion: "", telefono: "", whatsapp: "", correo: "", horario: "", mapa: "" },
    { id: "leon", nombre: "León", estado: "Guanajuato", direccion: "", telefono: "", whatsapp: "", correo: "", horario: "", mapa: "" },
    { id: "manzanillo", nombre: "Manzanillo", estado: "Colima", direccion: "", telefono: "", whatsapp: "", correo: "", horario: "", mapa: "" },
    { id: "merida", nombre: "Mérida", estado: "Yucatán", direccion: "", telefono: "", whatsapp: "", correo: "", horario: "", mapa: "" },
    { id: "mexicali", nombre: "Mexicali", estado: "Baja California", direccion: "", telefono: "", whatsapp: "", correo: "", horario: "", mapa: "" },
    { id: "monterrey", nombre: "Monterrey", estado: "Nuevo León", direccion: "", telefono: "", whatsapp: "", correo: "", horario: "", mapa: "" },
    { id: "puebla", nombre: "Puebla", estado: "Puebla", direccion: "", telefono: "", whatsapp: "", correo: "", horario: "", mapa: "" },
    { id: "puerto-vallarta", nombre: "Puerto Vallarta", estado: "Jalisco", direccion: "", telefono: "", whatsapp: "", correo: "", horario: "", mapa: "" },
    { id: "saltillo", nombre: "Saltillo", estado: "Coahuila", direccion: "", telefono: "", whatsapp: "", correo: "", horario: "", mapa: "" },
    { id: "slp", nombre: "San Luis Potosí", estado: "San Luis Potosí", direccion: "", telefono: "", whatsapp: "", correo: "", horario: "", mapa: "" },
    { id: "tampico", nombre: "Tampico", estado: "Tamaulipas", direccion: "", telefono: "", whatsapp: "", correo: "", horario: "", mapa: "" },
    { id: "tijuana", nombre: "Tijuana", estado: "Baja California", direccion: "", telefono: "", whatsapp: "", correo: "", horario: "", mapa: "" },
    { id: "tlaquepaque", nombre: "Tlaquepaque", estado: "Jalisco", direccion: "", telefono: "", whatsapp: "", correo: "", horario: "", mapa: "" },
    { id: "tula", nombre: "Tula", estado: "Hidalgo", direccion: "", telefono: "", whatsapp: "", correo: "", horario: "", mapa: "" },
    { id: "veracruz", nombre: "Veracruz", estado: "Veracruz", direccion: "", telefono: "", whatsapp: "", correo: "", horario: "", mapa: "" },
  ],

  // ---------- CLIENTES (del catálogo; logo opcional en img/clientes/) ----------
  // Confirma que BINASA tiene permiso para mostrar cada cliente en la web.
  clientes: [
    { nombre: "ArcelorMittal", logo: "" }, { nombre: "Boleo", logo: "" }, { nombre: "CFE", logo: "" },
    { nombre: "Grupo Fertinal", logo: "" }, { nombre: "Heineken", logo: "" }, { nombre: "Holcim", logo: "" },
    { nombre: "Hutchison Ports", logo: "" }, { nombre: "Hyundai", logo: "" }, { nombre: "Ingenios Santos", logo: "" },
    { nombre: "Peña Colorada", logo: "" }, { nombre: "Pepsi", logo: "" }, { nombre: "PSF", logo: "" }, { nombre: "Tuny", logo: "" },
  ],

  // ---------- MARCAS DESTACADAS EN INICIO (las 40 del catálogo; logo opcional en img/marcas/) ----------
  marcasInicio: ["ABB", "Baldor", "Brecoflex", "Continental", "Depreux", "Dodge", "DPI", "ECOM", "FAG", "Falk", "Fersa", "Gates",
    "INA", "Jason Industrial", "JTEKT Koyo", "Link-Belt", "Lock", "LTH", "Marathon", "Martin", "Megadyne", "Morse", "National", "NORD",
    "Optibelt", "PEER", "PFI Bearings", "PPI", "Regina", "Rema Tip Top", "Regal Rexnord", "SEW Eurodrive", "Sumitomo", "Surtek", "SYD",
    "Timken", "Urrea", "Vazel", "WEG", "ZSG Chains"],

  // ---------- AVISO DE PRIVACIDAD ----------
  // Pega aquí el texto OFICIAL aprobado por BINASA (párrafos separados por una línea en blanco),
  // o pon la dirección donde está publicado. Mientras ambos estén vacíos, la página lo indica.
  avisoPrivacidad: {
    texto: "",
    url: "",
    actualizado: "",
  },

  // ---------- ESTADÍSTICAS (opcional) ----------
  googleAnalytics: "",     // ID de Google Analytics 4 (G-XXXXXXX). Vacío = apagado.
};
