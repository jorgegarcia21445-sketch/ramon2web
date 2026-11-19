// =========================================================
// BINASA — index.js
// Catalog + quotation site. No payments, no supplier APIs.
// Data: catjson/*.json (made by scripts/generar-catalogo.mjs from data/*.csv)
// Editable content: contenido.js · Seasonal themes: promos.js
// =========================================================
(() => {
"use strict";

const VERSION = "1.0.0";
const C = window.CONTENIDO || {};
const POR_PAGINA = 24;

/* ---------- Utilities ---------- */
const $ = (sel, raiz = document) => raiz.querySelector(sel);
const $$ = (sel, raiz = document) => Array.from(raiz.querySelectorAll(sel));
const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const sinAcentos = (t) => String(t ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const slug = (t) => sinAcentos(t).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const leer = (k, def) => { try { const v = localStorage.getItem(k); return v == null ? def : JSON.parse(v); } catch (e) { return def; } };
const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage off */ } };
const soloDigitos = (t) => String(t || "").replace(/\D/g, "");
const ICO = {
  chev: '<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.6A8.4 8.4 0 1 1 21 11.5z"/></svg>',
  basura: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>',
  reloj: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  compartir: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13"/></svg>',
  doc: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6"/></svg>',
  lista: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M8 12h8M8 16h5"/></svg>',
  etiqueta: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>',
  buscar: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  rodamiento: '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="15"/><circle cx="20" cy="20" r="6"/></svg>',
};

/* ---------- Texts in Spanish and English ---------- */
const T = {
  es: {
    saltar: "Saltar al contenido", util: "Importador de rodamientos desde 1986 · 23 almacenes en México", miSucursal: "Mi sucursal",
    elegir: "Elegir", moneda: "Moneda", abrirLineas: "Abrir líneas de producto", buscarProductos: "Buscar productos",
    buscaPh: "Busca por producto, marca o modelo (ej. 6205-2RS)", buscar: "Buscar", miCotizacion: "Mi cotización", inicio: "Inicio",
    marcas: "Marcas", sucursales: "Sucursales", nosotros: "Nosotros", contacto: "Contacto", lineasProducto: "Líneas de producto",
    catalogo: "Catálogo", empresa: "Empresa", aviso: "Aviso de privacidad", lineas: "Líneas", cotizacion: "Cotización",
    pieTxt: "Rodamientos, transmisión de potencia, hidráulica y neumática. Desde 1986.",
    pieNota: "Precios y disponibilidad sujetos a confirmación de cada sucursal. Sin pagos en línea.",
    eligeSucursal: "Elige tu sucursal", eligeSucursalTxt: "Tus cotizaciones se enviarán a esta sucursal. La recordamos mientras navegas.",
    buscarSucursal: "Buscar sucursal", sucPh: "Escribe tu ciudad o estado", cerrar: "Cerrar", buscarCatalogo: "Buscar en el catálogo",
    atajos: "Atajos", abrirMenu: "Abrir menú de líneas",
    heroKicker: "Transmisión de potencia, hidráulica y neumática",
    heroTit: "Rodamientos y componentes industriales, cotizados por tu sucursal más cercana.",
    heroTxt: "Explora 22 líneas de producto de más de 40 marcas. Arma tu lista con cantidades y notas, y envíala por WhatsApp o correo: tu sucursal te responde con precio y disponibilidad.",
    explorar: "Explorar catálogo", solicitar: "Solicitar cotización", asesor: "Contactar asesor",
    selloTit: "Sin pagos en línea", selloTxt: "Precio y existencia, confirmados por tu sucursal",
    cifraDesde: "Empresa 100% mexicana, fundada en Guadalajara", cifraAlm: "Almacenes en el territorio nacional",
    cifraM2: "De almacén a nivel nacional", cifraMarcas: "Marcas con distribución autorizada",
    lineasTit: "22 líneas de producto", lineasTxt: "Elige una línea para ver sus tipos de producto y las marcas disponibles.",
    verCatalogo: "Ver catálogo completo →", tipos: "tipos", comoTit: "Cotizar es así de simple",
    comoTxt: "Sin registro ni pagos en línea. Tú armas la lista; tu sucursal te responde.",
    paso1: "Agrega productos", paso1t: "Desde el catálogo o el buscador, con la cantidad que necesitas.",
    paso2: "Añade notas", paso2t: "Medida, modelo o aplicación. ¿No está en el catálogo? Escríbelo tal cual.",
    paso3: "Envía a tu sucursal", paso3t: "Por WhatsApp o correo. Te respondemos con precio y disponibilidad.",
    marcasTit: "Distribuidores autorizados", marcasTxt: "Marcas líderes en rodamientos, transmisión de potencia, hidráulica y neumática.",
    almTit: "23 almacenes en México", almTxt: "Elige tu sucursal y tus cotizaciones llegarán directo a ella.",
    leyRojo: "Estado con almacén BINASA", leyGris: "Atendido desde la sucursal más cercana",
    mapaAlt: "Mapa de México con los estados donde BINASA tiene almacén marcados en rojo",
    verSucursales: "Ver sucursales", clientesTit: "Nuestros clientes respaldan nuestra experiencia en la industria",
    nosTit: "Servicio, calidad y precio",
    nosTxt: "Empresa 100% mexicana que inició operaciones en 1986 en la ciudad de Guadalajara, Jalisco, teniendo como principal objetivo la importación de rodamientos. Actualmente, la gama de líneas se complementa con componentes de transmisión de potencia, hidráulica y neumática.",
    nosTxt2: "En BINASA buscamos optimizar costos operativos realizando alianzas con nuestros proveedores. Contamos con más de 13,000 m² de almacén a nivel nacional para satisfacer las necesidades de nuestros clientes.",
    conoce: "Conoce más de BINASA →", noEncuentras: "¿No encuentras lo que buscas?",
    noEncuentrasTxt: "Escribe el modelo o la medida y lo cotizamos por ti.", pedirCot: "Pedir una cotización", escribirWa: "Escribir por WhatsApp",
    productos: "productos", tiposProducto: "tipos de producto", deMarcas: "marcas", buscarEn: "Buscar en", grupo: "Tipo", marca: "Marca",
    todas: "Todas", mostrando: "Mostrando {a} de {b}", verMas: "Ver más", sinResultados: "No hay productos con esos filtros.",
    quitarFiltros: "Quitar filtros", buscasModelo: "¿Buscas un modelo específico?", escribelo: "Escríbelo en tu cotización",
    yConfirma: "y tu sucursal lo confirma.", fotoProx: "Foto próximamente", marcasDisp: "{n} marcas disponibles",
    agregar: "Agregar a cotización", consultarPrecio: "Consultar precio", desde: "Desde", agregado: "Agregado a tu cotización",
    verCotizacion: "Ver cotización", imgRep: "Imagen representativa. El modelo exacto lo confirma tu sucursal.",
    modelo: "Modelo", marcaPref: "Marca preferida", opcional: "(opcional)", cualquiera: "Cualquiera", cantidad: "Cantidad",
    menos: "Menos", mas: "Más", notaSuc: "Nota para tu sucursal", notaPh: "Ej. medida del eje, modelo actual o aplicación",
    preguntarWa: "Preguntar por WhatsApp", seEnvia: "Tu cotización se envía a", cambiar: "Cambiar",
    precioConfirma: "Precio final y disponibilidad los confirma la sucursal", copiar: "Copiar enlace para compartir",
    copiado: "Enlace copiado", precioRef: "Precio de referencia por pieza", precioCotizar: "Precio a cotizar",
    precioCotizarTxt: "Agrega este producto a tu cotización y tu sucursal te enviará precio y disponibilidad.",
    descripcion: "Descripción", especificaciones: "Especificaciones técnicas", ficha: "Ficha técnica (PDF)", otros: "Otros productos de",
    noEncontrado: "No encontramos esta página", noEncontradoTxt: "Puede que el enlace haya cambiado.", volverInicio: "Volver al inicio",
    revisa: "Revisa tu lista", eligeDatos: "Elige sucursal y tus datos", envia: "Envía por WhatsApp o correo",
    piezas: "piezas", partidas: "partidas", vaciaCot: "Tu lista está vacía.", exploraCat: "Explora el catálogo",
    oEscribe: "o escribe abajo lo que necesitas.", libreTit: "¿No está en el catálogo? Escríbelo",
    librePh: "Ej. rodamiento 6205-2RS, banda B-48, retén CRW1 de 2\"", agregarLista: "+ Agregar a la lista", pedidoLibre: "Pedido libre",
    quitar: "Quitar", nota: "Nota", notaCorta: "Medida, modelo o aplicación", precioRefCorto: "Precio ref.", resumen: "Resumen",
    totalEst: "Total estimado", totalNota: "Solo suma los productos con precio en {m}. Tu sucursal confirma el precio final.",
    enviarA: "Enviar a tu sucursal", sucursal: "Sucursal", nombre: "Nombre", empresaCampo: "Empresa", telefono: "Teléfono",
    correo: "Correo", ciudad: "Ciudad", vistaPrevia: "Vista previa del mensaje", enviarWa: "Enviar por WhatsApp a {s}",
    enviarCorreo: "Enviar por correo", descargarPdf: "Descargar solicitud (PDF)", vaciar: "Vaciar lista",
    letraChica: "Sin pagos en línea: tu sucursal te responde con precio y disponibilidad. Al enviar aceptas el",
    faltaNombre: "Escribe tu nombre.", faltaTel: "Escribe un teléfono de 10 dígitos.", faltaCorreo: "Revisa tu correo.",
    faltaItems: "Agrega al menos un producto.", enviando: "Enviando…", enviado: "¡Listo! Recibimos tu solicitud. Tu sucursal te contactará.",
    errorEnvio: "No pudimos enviar por correo. Envíala por WhatsApp; ya va con todo lo que escribiste.",
    vaciarConf: "¿Vaciar toda la lista?", hola: "Hola, BINASA {s}. Solicito cotización ({m}) de:", marcaCorta: "marca",
    sucTit: "Sucursales", sucTxt: "23 almacenes en México. Elige la tuya para enviar ahí tus cotizaciones.",
    esMia: "Mi sucursal", elegirMia: "Elegir como mi sucursal", llamar: "Llamar", verMapa: "Ver en mapa",
    datosProx: "Dirección y teléfono próximamente.", horario: "Horario",
    contactoTit: "Contacto", contactoTxt: "Cotiza con tu sucursal más cercana o escríbenos.", cotizarAhora: "Cotizar ahora",
    redes: "Redes sociales", avisoTit: "Aviso de privacidad",
    avisoPend: "El aviso de privacidad oficial de BINASA se publicará en esta página. Mientras tanto, los datos que envías en una cotización se usan solo para responderla.",
    avisoLink: "Consultar el aviso de privacidad oficial", actualizado: "Última actualización",
    marcaTit: "Marca", lineasConMarca: "Líneas con esta marca", productosMarca: "Productos", resultadosPara: "Resultados para “{q}”",
    sinBusqueda: "No encontramos productos para “{q}”. Prueba con otra palabra o escribe el modelo en tu cotización.",
    corregido: "Mostrando resultados para “{q}”", verTodos: "Ver los {n} resultados", todasLineas: "Todas las líneas",
    verTipos: "Ver los {n} tipos de {l}", cargando: "Cargando…", errorCarga: "No se pudo cargar el catálogo. Revisa tu conexión y recarga la página.",
    lineasTxtPag: "Elige una línea para ver sus tipos de producto.", marcasPag: "Marcas", marcasPagTxt: "Marcas que BINASA distribuye, por línea de producto.",
    pdfTit: "Solicitud de cotización", pdfCliente: "Cliente", pdfSucursal: "Sucursal", pdfFecha: "Fecha", pdfFolio: "Folio",
    pdfNota: "Precios de referencia; el precio final y la disponibilidad los confirma la sucursal.", pdfGuardar: "Guardar como PDF",
    permiteVentanas: "Permite las ventanas emergentes para descargar la solicitud.",
  },
  en: {
    saltar: "Skip to content", util: "Bearing importer since 1986 · 23 warehouses in Mexico", miSucursal: "My branch",
    elegir: "Choose", moneda: "Currency", abrirLineas: "Open product lines", buscarProductos: "Search products",
    buscaPh: "Search by product, brand or model (e.g. 6205-2RS)", buscar: "Search", miCotizacion: "My quote", inicio: "Home",
    marcas: "Brands", sucursales: "Branches", nosotros: "About us", contacto: "Contact", lineasProducto: "Product lines",
    catalogo: "Catalog", empresa: "Company", aviso: "Privacy notice", lineas: "Lines", cotizacion: "Quote",
    pieTxt: "Bearings, power transmission, hydraulics and pneumatics. Since 1986.",
    pieNota: "Prices and availability are confirmed by each branch. No online payments.",
    eligeSucursal: "Choose your branch", eligeSucursalTxt: "Your quote requests will go to this branch. We remember it while you browse.",
    buscarSucursal: "Search branch", sucPh: "Type your city or state", cerrar: "Close", buscarCatalogo: "Search the catalog",
    atajos: "Shortcuts", abrirMenu: "Open product lines menu",
    heroKicker: "Power transmission, hydraulics and pneumatics",
    heroTit: "Bearings and industrial components, quoted by your nearest branch.",
    heroTxt: "Browse 22 product lines from more than 40 brands. Build your list with quantities and notes, and send it by WhatsApp or email: your branch replies with price and availability.",
    explorar: "Browse catalog", solicitar: "Request a quote", asesor: "Talk to an advisor",
    selloTit: "No online payments", selloTxt: "Price and stock confirmed by your branch",
    cifraDesde: "100% Mexican company, founded in Guadalajara", cifraAlm: "Warehouses across Mexico",
    cifraM2: "Of warehouse space nationwide", cifraMarcas: "Authorized distributor brands",
    lineasTit: "22 product lines", lineasTxt: "Choose a line to see its product types and available brands.",
    verCatalogo: "See full catalog →", tipos: "types", comoTit: "Requesting a quote is this simple",
    comoTxt: "No sign-up and no online payments. You build the list; your branch replies.",
    paso1: "Add products", paso1t: "From the catalog or the search bar, with the quantity you need.",
    paso2: "Add notes", paso2t: "Size, model or application. Not in the catalog? Just type it.",
    paso3: "Send to your branch", paso3t: "By WhatsApp or email. We reply with price and availability.",
    marcasTit: "Authorized distributor", marcasTxt: "Leading brands in bearings, power transmission, hydraulics and pneumatics.",
    almTit: "23 warehouses in Mexico", almTxt: "Choose your branch and your quote requests go straight to it.",
    leyRojo: "State with a BINASA warehouse", leyGris: "Served by the nearest branch",
    mapaAlt: "Map of Mexico with the states where BINASA has a warehouse marked in red",
    verSucursales: "See branches", clientesTit: "Our clients back our experience in the industry",
    nosTit: "Service, quality and price",
    nosTxt: "A 100% Mexican company that started operations in 1986 in Guadalajara, Jalisco, with bearing importation as its main goal. Today our range also includes power transmission, hydraulic and pneumatic components.",
    nosTxt2: "At BINASA we optimize operating costs through alliances with our suppliers. We have more than 13,000 m² of warehouse space nationwide to meet our clients' needs.",
    conoce: "Learn more about BINASA →", noEncuentras: "Can't find what you need?",
    noEncuentrasTxt: "Type the model or size and we'll quote it for you.", pedirCot: "Request a quote", escribirWa: "Message us on WhatsApp",
    productos: "products", tiposProducto: "product types", deMarcas: "brands", buscarEn: "Search in", grupo: "Type", marca: "Brand",
    todas: "All", mostrando: "Showing {a} of {b}", verMas: "Show more", sinResultados: "No products match these filters.",
    quitarFiltros: "Clear filters", buscasModelo: "Looking for a specific model?", escribelo: "Type it in your quote",
    yConfirma: "and your branch will confirm it.", fotoProx: "Photo coming soon", marcasDisp: "{n} brands available",
    agregar: "Add to quote", consultarPrecio: "Ask for price", desde: "From", agregado: "Added to your quote",
    verCotizacion: "View quote", imgRep: "Representative image. Your branch confirms the exact model.",
    modelo: "Model", marcaPref: "Preferred brand", opcional: "(optional)", cualquiera: "Any", cantidad: "Quantity",
    menos: "Less", mas: "More", notaSuc: "Note for your branch", notaPh: "E.g. shaft size, current model or application",
    preguntarWa: "Ask on WhatsApp", seEnvia: "Your quote goes to", cambiar: "Change",
    precioConfirma: "Final price and availability are confirmed by the branch", copiar: "Copy link to share",
    copiado: "Link copied", precioRef: "Reference price per unit", precioCotizar: "Price on request",
    precioCotizarTxt: "Add this product to your quote and your branch will send you price and availability.",
    descripcion: "Description", especificaciones: "Technical specifications", ficha: "Datasheet (PDF)", otros: "More from",
    noEncontrado: "We couldn't find this page", noEncontradoTxt: "The link may have changed.", volverInicio: "Back to home",
    revisa: "Review your list", eligeDatos: "Choose branch and your details", envia: "Send by WhatsApp or email",
    piezas: "units", partidas: "items", vaciaCot: "Your list is empty.", exploraCat: "Browse the catalog",
    oEscribe: "or type what you need below.", libreTit: "Not in the catalog? Type it",
    librePh: "E.g. bearing 6205-2RS, belt B-48, CRW1 2\" oil seal", agregarLista: "+ Add to list", pedidoLibre: "Custom request",
    quitar: "Remove", nota: "Note", notaCorta: "Size, model or application", precioRefCorto: "Ref. price", resumen: "Summary",
    totalEst: "Estimated total", totalNota: "Only adds products priced in {m}. Your branch confirms the final price.",
    enviarA: "Send to your branch", sucursal: "Branch", nombre: "Name", empresaCampo: "Company", telefono: "Phone",
    correo: "Email", ciudad: "City", vistaPrevia: "Message preview", enviarWa: "Send by WhatsApp to {s}",
    enviarCorreo: "Send by email", descargarPdf: "Download request (PDF)", vaciar: "Empty list",
    letraChica: "No online payments: your branch replies with price and availability. By sending you accept the",
    faltaNombre: "Enter your name.", faltaTel: "Enter a 10-digit phone number.", faltaCorreo: "Check your email.",
    faltaItems: "Add at least one product.", enviando: "Sending…", enviado: "Done! We received your request. Your branch will contact you.",
    errorEnvio: "We couldn't send it by email. Send it by WhatsApp; it already includes everything you typed.",
    vaciarConf: "Empty the whole list?", hola: "Hello, BINASA {s}. I'd like a quote ({m}) for:", marcaCorta: "brand",
    sucTit: "Branches", sucTxt: "23 warehouses in Mexico. Choose yours to send your quote requests there.",
    esMia: "My branch", elegirMia: "Set as my branch", llamar: "Call", verMapa: "View on map",
    datosProx: "Address and phone coming soon.", horario: "Hours",
    contactoTit: "Contact", contactoTxt: "Request a quote from your nearest branch or message us.", cotizarAhora: "Request a quote",
    redes: "Social media", avisoTit: "Privacy notice",
    avisoPend: "BINASA's official privacy notice will be published on this page. In the meantime, the data you send in a quote request is used only to answer it.",
    avisoLink: "Read the official privacy notice", actualizado: "Last updated",
    marcaTit: "Brand", lineasConMarca: "Lines with this brand", productosMarca: "Products", resultadosPara: "Results for “{q}”",
    sinBusqueda: "No products found for “{q}”. Try another word or type the model in your quote.",
    corregido: "Showing results for “{q}”", verTodos: "See all {n} results", todasLineas: "All lines",
    verTipos: "See all {n} {l} types", cargando: "Loading…", errorCarga: "The catalog couldn't load. Check your connection and reload the page.",
    lineasTxtPag: "Choose a line to see its product types.", marcasPag: "Brands", marcasPagTxt: "Brands distributed by BINASA, by product line.",
    pdfTit: "Quote request", pdfCliente: "Customer", pdfSucursal: "Branch", pdfFecha: "Date", pdfFolio: "Reference",
    pdfNota: "Reference prices; final price and availability are confirmed by the branch.", pdfGuardar: "Save as PDF",
    permiteVentanas: "Allow pop-ups to download the request.",
  },
};
let idioma = leer("binasa_idioma", "es"); // Spanish by default; the visitor can switch to English
if (!T[idioma]) idioma = "es";
const t = (k, vars) => {
  let s = (T[idioma] && T[idioma][k]) ?? T.es[k] ?? k;
  if (vars) for (const [a, b] of Object.entries(vars)) s = s.replaceAll("{" + a + "}", b);
  return s;
};
const nombreDe = (o) => (idioma === "en" && o.nombre_en) || o.nombre;

/* ---------- State ---------- */
const MONEDAS = (C.precios && C.precios.monedas) || ["MXN", "USD", "EUR"];
let moneda = leer("binasa_moneda", (C.precios && C.precios.monedaInicial) || "MXN");
if (!MONEDAS.includes(moneda)) moneda = MONEDAS[0];
const SUCURSALES = Array.isArray(C.sucursales) ? C.sucursales : [];
let sucursalId = leer("binasa_sucursal", "");
const sucursal = () => SUCURSALES.find((s) => s.id === sucursalId) || null;
let cot = leer("binasa_cotizacion", []);
if (!Array.isArray(cot)) cot = [];
let cliente = leer("binasa_cliente", {});
const datos = { lineas: [], marcas: [], porLinea: new Map(), buscador: null, motor: null };

/* ---------- Data ---------- */
async function json(ruta) {
  const r = await fetch(`${ruta}?v=${VERSION}`);
  if (!r.ok) throw new Error(ruta + " " + r.status);
  return r.json();
}
async function cargarLineas() {
  const d = await json("catjson/lineas.json");
  datos.lineas = d.lineas || [];
  datos.marcas = d.marcas || [];
}
async function cargarLinea(id) {
  if (!datos.porLinea.has(id)) datos.porLinea.set(id, json(`catjson/linea-${id}.json`).then((d) => d.productos || []));
  return datos.porLinea.get(id);
}
async function cargarBuscador() {
  if (!datos.buscador) {
    datos.buscador = json("catjson/buscador.json").then((d) =>
      (d.p || []).map((f) => ({ id: f[0], nombre: f[1], nombre_en: f[2], linea: f[3], grupo: f[4], marcas: f[5] ? f[5].split("|") : [],
        modelo: f[6], foto: f[7], precios: { MXN: f[8], USD: f[9], EUR: f[10] }, destacado: !!f[11] })));
  }
  return datos.buscador;
}
const lineaPor = (id) => datos.lineas.find((l) => l.id === id);
const marcaPor = (id) => datos.marcas.find((m) => m.id === id);

/* ---------- Search engine (adapted from SoluTelecom) ----------
   Ignores accents, case and plurals; matches word beginnings and model numbers;
   fixes typos when nothing matches; ranks model > name > brand > line. */
const MB_SINONIMOS = {
  rodamient: ["balero", "bearing"], balero: ["rodamient"], bearing: ["rodamient"],
  chumacer: ["soport", "housing"], cople: ["acoplamient", "coupling"], acoplamient: ["cople"],
  band: ["corre", "belt"], corre: ["band"], belt: ["band"], reten: ["sell", "seal"], sell: ["reten"],
  sprocket: ["catarin", "engran"], catarin: ["sprocket"], reductor: ["motorreductor", "gearbox"], motorreductor: ["reductor"],
  manguer: ["hose"], hose: ["manguer"], cadena: ["chain"], chain: ["cadena"], pole: ["pulley"], pulley: ["pole"],
};
const MB_VACIAS = new Set(["de", "la", "el", "los", "las", "para", "con", "y", "en", "del", "a", "o", "un", "una", "por", "the", "of", "for", "and"]);
function mbNormal(x) {
  return sinAcentos(x)
    .replace(/(\d)\s+(hp|kw|rpm|psi|bar|nm|mm|cm|in|pulg|v|a)\b/g, "$1$2");
}
function mbRaiz(w) {
  if (w.length <= 3 || /\d/.test(w)) return w;
  let r = w;
  if (r.length > 4 && r.endsWith("es")) r = r.slice(0, -2);
  else if (r.endsWith("s")) r = r.slice(0, -1);
  if (r.length > 3 && /[aeo]$/.test(r)) r = r.slice(0, -1);
  return r;
}
const mbPalabras = (x) => mbNormal(x).split(/[^a-z0-9]+/).filter((w) => w && !MB_VACIAS.has(w));
const mbCompacto = (x) => mbNormal(x).replace(/[^a-z0-9]/g, "");
function mbDistancia(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const fila = [i]; let menor = i;
    for (let j = 1; j <= b.length; j++) {
      fila[j] = Math.min(prev[j] + 1, fila[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (fila[j] < menor) menor = fila[j];
    }
    if (menor > max) return max + 1;
    prev = fila;
  }
  return prev[b.length];
}
function crearMotor(lista) {
  const fichas = lista.map((p) => {
    const l = lineaPor(p.linea);
    const nombres = [p.nombre, p.nombre_en].filter(Boolean).join(" ");
    const tit = mbPalabras(nombres).map(mbRaiz);
    return {
      p, tit, titSet: new Set(tit),
      marca: new Set(mbPalabras(p.marcas.join(" ")).map(mbRaiz)),
      cats: new Set(mbPalabras([l && l.nombre, l && l.nombre_en, p.grupo].filter(Boolean).join(" ")).map(mbRaiz)),
      modelo: mbCompacto(p.modelo), modPal: new Set(mbPalabras(p.modelo)),
      frase: " " + mbPalabras(nombres).join(" ") + " ",
    };
  });
  let vocab = null;
  function vocabulario() {
    if (vocab) return vocab;
    const cuenta = new Map(), forma = new Map();
    for (const f of fichas) {
      const l = lineaPor(f.p.linea);
      const vistas = new Set();
      for (const w of mbPalabras([f.p.nombre, f.p.nombre_en, f.p.marcas.join(" "), l && l.nombre].join(" "))) {
        if (w.length < 3 || /\d/.test(w)) continue;
        const r = mbRaiz(w);
        if (!vistas.has(r)) { vistas.add(r); cuenta.set(r, (cuenta.get(r) || 0) + 1); }
        const m = forma.get(r) || {}; m[w] = (m[w] || 0) + 1; forma.set(r, m);
      }
    }
    vocab = { lista: Array.from(cuenta), cuenta, forma };
    return vocab;
  }
  function enConjunto(set, w, exacto, prefijo) {
    if (set.has(w)) return exacto;
    if (w.length < 2) return 0;
    for (const x of set) if (x.length > w.length && x.startsWith(w)) return prefijo;
    return 0;
  }
  function puntuar(f, w, original) {
    let mejor = 0;
    [w].concat((MB_SINONIMOS[w] || []).map(mbRaiz)).forEach((a, i) => {
      const k = i === 0 ? 1 : 0.8;
      mejor = Math.max(mejor, k * enConjunto(f.titSet, a, 10, 6), k * enConjunto(f.marca, a, 9, 5), k * enConjunto(f.cats, a, 4, 3));
    });
    if (f.modPal.has(original)) mejor = Math.max(mejor, 12);
    const c = original.replace(/[^a-z0-9]/g, "");
    if (c.length >= 3 && /\d/.test(c) && f.modelo.startsWith(c)) mejor = Math.max(mejor, 14);
    else if (c.length >= 4 && /\d/.test(c) && f.modelo.includes(c)) mejor = Math.max(mejor, 11);
    return mejor;
  }
  function correr(orig, permitirFalta) {
    const palabras = orig.map(mbRaiz), compacto = orig.join(""), frase = " " + orig.join(" ");
    const salida = [];
    for (const f of fichas) {
      if (compacto.length >= 4 && /\d/.test(compacto) && f.modelo && f.modelo.startsWith(compacto)) {
        salida.push({ p: f.p, puntos: f.modelo === compacto ? 300 : 150 }); continue;
      }
      let puntos = 0, faltan = 0;
      for (let i = 0; i < palabras.length; i++) {
        const s = puntuar(f, palabras[i], orig[i]);
        if (!s) { if (++faltan > permitirFalta) break; continue; }
        puntos += s;
      }
      if (faltan > permitirFalta) continue;
      if (orig.length > 1 && f.frase.includes(frase)) puntos += 6;
      if (f.tit.length && palabras.some((w) => f.tit[0] === w || (w.length >= 3 && f.tit[0].startsWith(w)))) puntos += 8;
      if (f.p.foto) puntos += 1;
      puntos -= faltan * 25 + f.tit.length / 40;
      salida.push({ p: f.p, puntos });
    }
    return salida.sort((a, b) => b.puntos - a.puntos);
  }
  function corregir(orig) {
    const v = vocabulario(); let cambio = false;
    const nuevas = orig.map((w) => {
      const r = mbRaiz(w);
      if (w.length < 3 || /\d/.test(w) || v.cuenta.has(r) || v.lista.some(([k]) => k.startsWith(r))) return w;
      const max = r.length <= 4 ? 1 : 2; let mejor = null;
      for (const [k, n] of v.lista) {
        const d = mbDistancia(r, k, max);
        if (d <= max && (!mejor || d < mejor.d || (d === mejor.d && n > mejor.n))) mejor = { k, d, n };
      }
      if (!mejor) return w;
      cambio = true;
      const formas = Object.entries(v.forma.get(mejor.k) || {}).sort((a, b) => b[1] - a[1]);
      return formas.length ? formas[0][0] : mejor.k;
    });
    return cambio ? nuevas : null;
  }
  return {
    buscar(q) {
      const orig = mbPalabras(q);
      if (!orig.length) return { resultados: [], corregido: null };
      let r = correr(orig, 0), corregido = null;
      if (!r.length) { const c = corregir(orig); if (c) { r = correr(c, 0); if (r.length) corregido = c.join(" "); } }
      if (!r.length && orig.length >= 3) r = correr(orig, 1);
      return { resultados: r.map((x) => x.p), corregido };
    },
  };
}
async function buscar(q) {
  const lista = await cargarBuscador();
  if (!datos.motor) datos.motor = crearMotor(lista);
  return datos.motor.buscar(q);
}

/* ---------- Small render helpers ---------- */
const imgOFalta = (src, alt, cls = "") => src
  ? `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async" class="${cls}" onerror="this.onerror=null;this.replaceWith(Object.assign(document.createElement('span'),{className:'sin-foto'}))">`
  : `<span class="sin-foto ${cls}" role="img" aria-label="${esc(t("fotoProx"))}">${ICO.rodamiento}<span>${esc(t("fotoProx"))}</span></span>`;
const dinero = (n, m = moneda) => new Intl.NumberFormat(idioma === "en" ? "en-US" : "es-MX", { style: "currency", currency: m, currencyDisplay: "narrowSymbol" }).format(n);
const precioDe = (p, m = moneda) => (p && p.precios && typeof p.precios[m] === "number" ? p.precios[m] : null);
function htmlPrecio(p, conDesde) {
  const v = precioDe(p);
  if (v == null) return `<p class="precio-consulta">${esc(t("consultarPrecio"))}</p>`;
  return `<p class="precio">${conDesde && !p.modelo ? esc(t("desde")) + " " : ""}${dinero(v)} <small>${moneda}</small></p>`;
}
function htmlTarjeta(p, h = "h3") {
  const l = lineaPor(p.linea);
  const ruta = `#/producto/${encodeURIComponent(p.id)}`;
  return `<article class="tarjeta">
    <a class="tarjeta-img" href="${ruta}" tabindex="-1" aria-hidden="true">${imgOFalta(p.foto, "")}</a>
    <div class="tarjeta-cuerpo">
      <span class="tarjeta-linea">${esc(l ? nombreDe(l) : "")}</span>
      <${h}><a href="${ruta}">${esc(nombreDe(p))}</a></${h}>
      ${p.modelo ? `<span class="tarjeta-meta">${esc(t("modelo"))}: ${esc(p.modelo)}</span>` : ""}
      ${p.marcas.length ? `<span class="tarjeta-meta">${p.marcas.length === 1 ? esc(p.marcas[0]) : esc(t("marcasDisp", { n: p.marcas.length }))}</span>` : ""}
      ${htmlPrecio(p, true)}
      <span class="esp"></span>
      <button type="button" class="btn" data-agregar="${esc(p.id)}">${esc(t("agregar"))}</button>
    </div>
  </article>`;
}
function segMonedas(attr = "") {
  return `<div class="seg" role="group" aria-label="${esc(t("moneda"))}" data-seg="moneda" ${attr}>${MONEDAS.map((m) => `<button type="button" data-valor="${m}" aria-pressed="${m === moneda}">${m}</button>`).join("")}</div>`;
}
let toastTimer = null;
function aviso(html) {
  const el = $("#toast");
  el.innerHTML = html;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.hidden = true), 3800);
}
function ponerTitulo(titulo, descripcion) {
  document.title = titulo ? `${titulo} | BINASA` : "BINASA | " + (idioma === "en" ? "Bearings, power transmission, hydraulics and pneumatics" : "Rodamientos, transmisión de potencia, hidráulica y neumática");
  const m = $('meta[name="description"]');
  if (m && descripcion) m.setAttribute("content", descripcion);
}

/* ---------- Quote list ---------- */
function guardarCot() { guardar("binasa_cotizacion", cot); pintarContadores(); }
function pintarContadores() {
  const n = cot.length;
  $$("[data-contador]").forEach((el) => { el.textContent = String(n); el.hidden = !n; });
}
async function agregarACot(id, qty = 1, extra = {}) {
  const lista = await cargarBuscador();
  const p = lista.find((x) => x.id === id);
  if (!p) return;
  const ya = cot.find((i) => i.id === id && (i.marca || "") === (extra.marca || ""));
  if (ya) { ya.qty = Math.min(9999, ya.qty + qty); if (extra.nota) ya.nota = extra.nota; }
  else cot.push({ id, qty: Math.max(1, qty), nota: extra.nota || "", marca: extra.marca || "" });
  guardarCot();
  aviso(`<span>✓ ${esc(t("agregado"))}: <b>${esc(nombreDe(p))}</b></span> <a href="#/cotizacion">${esc(t("verCotizacion"))}</a>`);
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-agregar]");
  if (!b) return;
  agregarACot(b.dataset.agregar, 1);
});

/* ---------- Header: toggles, branch, search ---------- */
function pintarEstaticos() {
  document.documentElement.lang = idioma === "en" ? "en" : "es";
  $$("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  $$("[data-i18n-ph]").forEach((el) => el.setAttribute("placeholder", t(el.dataset.i18nPh)));
  $$("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
  $$('[data-seg="idioma"] button').forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.valor === idioma)));
  const segM = $('.util [data-seg="moneda"]');
  if (segM) segM.innerHTML = MONEDAS.map((m) => `<button type="button" data-valor="${m}" aria-pressed="${m === moneda}">${m}</button>`).join("");
  const s = sucursal();
  $$("[data-sucursal-nombre]").forEach((el) => (el.textContent = s ? s.nombre : t("elegir")));
  const wa = soloDigitos((s && s.whatsapp) || (C.contacto && C.contacto.whatsapp));
  $("#waFab").href = "https://wa.me/" + wa;
  $("#waFab").setAttribute("aria-label", t("escribirWa"));
  pintarPie();
}
function pintarPie() {
  const c = C.contacto || {};
  const filas = [c.telefono && `<a href="tel:${esc(soloDigitos(c.telefono))}">${esc(c.telefono)}</a>`,
    c.correo && `<a href="mailto:${esc(c.correo)}">${esc(c.correo)}</a>`,
    c.direccion && `<p>${esc(c.direccion)}</p>`,
    c.facebook && `<a href="${esc(c.facebook)}" target="_blank" rel="noopener">Facebook</a>`,
    c.linkedin && `<a href="${esc(c.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`,
    `<a href="#/sucursales">${esc(t("sucursales"))} →</a>`].filter(Boolean);
  $("#pieContacto").innerHTML = filas.join("");
  $("#anio").textContent = new Date().getFullYear();
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-seg] button[data-valor]");
  if (!b) return;
  const tipo = b.closest("[data-seg]").dataset.seg;
  if (tipo === "idioma") { idioma = b.dataset.valor; guardar("binasa_idioma", idioma); }
  if (tipo === "moneda") { moneda = b.dataset.valor; guardar("binasa_moneda", moneda); }
  pintarEstaticos();
  construirLateral();
  construirCajon();
  enrutar(true);
});

// branch picker
const dlgSuc = $("#dlgSucursal");
function abrirSucursales() {
  const q = $("#sucQ");
  q.value = "";
  pintarOpcionesSuc("");
  if (!dlgSuc.open) dlgSuc.showModal();
  if (matchMedia("(min-width: 700px)").matches) q.focus();
}
function pintarOpcionesSuc(filtro) {
  const f = sinAcentos(filtro).trim();
  $("#sucOps").innerHTML = SUCURSALES.filter((s) => !f || sinAcentos(s.nombre + " " + s.estado).includes(f))
    .map((s) => `<li><button type="button" data-suc="${esc(s.id)}" aria-pressed="${s.id === sucursalId}"><span>${esc(s.nombre)}</span><small>${esc(s.estado)}</small></button></li>`).join("");
}
function elegirSucursal(id) {
  sucursalId = id;
  guardar("binasa_sucursal", id);
  pintarEstaticos();
  if (dlgSuc.open) dlgSuc.close();
  enrutar(true);
}
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-abrir-sucursal]")) { e.preventDefault(); abrirSucursales(); }
  const op = e.target.closest("[data-suc]");
  if (op) elegirSucursal(op.dataset.suc);
});
$("#sucQ").addEventListener("input", (e) => pintarOpcionesSuc(e.target.value));
dlgSuc.querySelector("[data-cerrar]").addEventListener("click", () => dlgSuc.close());
dlgSuc.addEventListener("click", (e) => { if (e.target === dlgSuc) dlgSuc.close(); });

// header search with suggestions
(function buscadorCabecera() {
  const form = $("#busca"), input = $("#buscaQ"), caja = $("#buscaSug");
  let timer = null, turno = 0, activo = -1;
  const cerrar = () => { caja.hidden = true; activo = -1; input.setAttribute("aria-expanded", "false"); };
  async function sugerir() {
    const q = input.value.trim();
    if (q.length < 2) return cerrar();
    const mio = ++turno;
    const r = await buscar(q);
    if (mio !== turno) return;
    const top = r.resultados.slice(0, 7);
    caja.innerHTML = (r.corregido ? `<p class="sug-vacio">${esc(t("corregido", { q: r.corregido }))}</p>` : "") +
      (top.length
        ? top.map((p) => { const l = lineaPor(p.linea); return `<a class="sug-item" role="option" href="#/producto/${encodeURIComponent(p.id)}">${imgOFalta(p.foto, "")}<span>${esc(nombreDe(p))}<small>${esc(l ? nombreDe(l) : "")}${p.modelo ? " · " + esc(p.modelo) : ""}</small></span></a>`; }).join("") +
          `<a class="sug-todos" href="#/buscar/${encodeURIComponent(q)}">${esc(t("verTodos", { n: r.resultados.length }))} →</a>`
        : `<p class="sug-vacio">${esc(t("sinBusqueda", { q }))}</p>`);
    caja.hidden = false;
    input.setAttribute("aria-expanded", "true");
    activo = -1;
  }
  input.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(sugerir, 180); });
  input.addEventListener("keydown", (e) => {
    const items = $$(".sug-item", caja);
    if (caja.hidden || !items.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      activo = (activo + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      items.forEach((a, i) => a.classList.toggle("activo", i === activo));
    } else if (e.key === "Enter" && activo >= 0) { e.preventDefault(); location.hash = items[activo].getAttribute("href"); cerrar(); }
    else if (e.key === "Escape") cerrar();
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return input.focus();
    cerrar();
    input.blur();
    location.hash = "#/buscar/" + encodeURIComponent(q);
  });
  caja.addEventListener("click", (e) => { if (e.target.closest("a")) cerrar(); });
  document.addEventListener("click", (e) => { if (!form.contains(e.target)) cerrar(); });
})();

/* ---------- Side menu (desktop), flyout and mobile drawer ---------- */
function construirLateral() {
  const lat = $("#lateral");
  const n = cot.length;
  lat.innerHTML = `
    <button type="button" class="lat-abrir" data-lat-abrir aria-label="${esc(t("abrirMenu"))}" title="${esc(t("abrirMenu"))}">${ICO.menu}</button>
    <form class="lat-busca" role="search" data-lat-busca><label class="sr" for="latQ">${esc(t("buscarCatalogo"))}</label>${ICO.buscar}<input id="latQ" type="search" placeholder="${esc(t("buscarCatalogo"))}"></form>
    <p class="lat-tit">${esc(t("lineasProducto"))}</p>
    <ul>${datos.lineas.map((l) => `<li><button type="button" class="lat-item" data-lat="${esc(l.id)}" aria-expanded="false" title="${esc(nombreDe(l))}">${imgOFalta(l.foto, "")}<span>${esc(nombreDe(l))}</span>${ICO.chev}</button></li>`).join("")}</ul>
    <div class="lat-atajos"><p class="lat-tit">${esc(t("atajos"))}</p><ul>
      <li><a class="lat-item" href="#/cotizacion">${ICO.lista}<span>${esc(t("miCotizacion"))}</span><b class="contador" data-contador ${n ? "" : "hidden"}>${n}</b></a></li>
      <li><a class="lat-item" href="#/sucursales">${ICO.pin}<span>${esc(t("sucursales"))}</span></a></li>
      <li><a class="lat-item" href="#/marcas">${ICO.etiqueta}<span>${esc(t("marcas"))}</span></a></li>
    </ul></div>`;
  marcarLateral();
}
function marcarLateral() {
  const actual = (location.hash.match(/^#\/linea\/([^/?]+)/) || [])[1] || (vistaActual.linea || "");
  $$(".lat-item[data-lat]").forEach((b) => b.setAttribute("aria-current", String(b.dataset.lat === actual)));
}
async function abrirVolado(id) {
  const l = lineaPor(id);
  if (!l) return;
  const vol = $("#volado");
  $$(".lat-item[data-lat]").forEach((b) => b.setAttribute("aria-expanded", String(b.dataset.lat === id)));
  vol.innerHTML = `<p class="cargando">${esc(t("cargando"))}</p>`;
  vol.hidden = false;
  $("#velo").hidden = false;
  vol.style.top = Math.max(0, window.scrollY - $(".cuerpo").offsetTop) + "px";
  const prods = await cargarLinea(id);
  const grupos = l.grupos.length ? l.grupos.map((g) => g.n) : [""];
  vol.innerHTML = `<div class="volado-cab"><div><h2 class="titulo"><a href="#/linea/${esc(l.id)}">${esc(nombreDe(l))} ›</a></h2>
      <p>${l.total} ${esc(t("tiposProducto"))} · ${esc(l.marcas.join(", "))}</p></div>
      <button type="button" class="volado-x" data-cerrar-volado aria-label="${esc(t("cerrar"))}">×</button></div>
    <div class="volado-grid">${grupos.map((g) => {
      const items = prods.filter((p) => p.grupo === g);
      const lim = l.grupos.length ? 12 : 40;
      return `<div>${g ? `<h3><a href="#/linea/${esc(l.id)}?grupo=${encodeURIComponent(g)}">${esc(g)}</a></h3>` : ""}<ul>${items.slice(0, lim).map((p) => `<li><a href="#/producto/${encodeURIComponent(p.id)}">${esc(nombreDe(p))}</a></li>`).join("")}${items.length > lim ? `<li><a href="#/linea/${esc(l.id)}?grupo=${encodeURIComponent(g)}">+ ${items.length - lim}…</a></li>` : ""}</ul></div>`;
    }).join("")}</div>
    <a class="btn" style="margin-top:18px" href="#/linea/${esc(l.id)}">${esc(t("verTipos", { n: l.total, l: nombreDe(l) }))}</a>`;
}
function cerrarVolado() {
  $("#volado").hidden = true;
  $("#velo").hidden = true;
  $$(".lat-item[data-lat]").forEach((b) => b.setAttribute("aria-expanded", "false"));
}
document.addEventListener("click", (e) => {
  const b = e.target.closest(".lat-item[data-lat]");
  if (b) { b.getAttribute("aria-expanded") === "true" ? cerrarVolado() : abrirVolado(b.dataset.lat); return; }
  if (e.target.closest("[data-cerrar-volado]") || e.target.id === "velo") cerrarVolado();
  if (e.target.closest("[data-lat-abrir]")) document.body.classList.remove("lat-mini");
  if (e.target.closest("#volado a")) cerrarVolado();
});
document.addEventListener("submit", (e) => {
  if (!e.target.matches("[data-lat-busca]")) return;
  e.preventDefault();
  const q = e.target.querySelector("input").value.trim();
  if (q) location.hash = "#/buscar/" + encodeURIComponent(q);
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { cerrarVolado(); cerrarCajon(); } });

function construirCajon() {
  $("#cajon").innerHTML = `
    <div class="cajon-cab"><span><img src="img/binasa-logo-450.png" alt="BINASA"></span><button type="button" class="cajon-x" data-cerrar-cajon aria-label="${esc(t("cerrar"))}">×</button></div>
    <div class="cajon-lista">
      <p class="lat-tit">${esc(t("lineasProducto"))}</p>
      <ul>${datos.lineas.map((l) => `<li><a href="#/linea/${esc(l.id)}">${imgOFalta(l.foto, "")}<span>${esc(nombreDe(l))}</span>${ICO.chev}</a></li>`).join("")}</ul>
      <p class="lat-tit">${esc(t("empresa"))}</p>
      <ul><li><a href="#/marcas"><span>${esc(t("marcas"))}</span></a></li><li><a href="#/sucursales"><span>${esc(t("sucursales"))}</span></a></li>
      <li><a href="#/nosotros"><span>${esc(t("nosotros"))}</span></a></li><li><a href="#/contacto"><span>${esc(t("contacto"))}</span></a></li></ul>
    </div>
    <div class="cajon-pie">
      <div class="fila">${esc(t("moneda"))} ${segMonedas()}</div>
      <a class="btn" href="#/cotizacion">${esc(t("miCotizacion"))} (${cot.length})</a>
    </div>`;
}
let veloCajon = null;
function abrirCajon() {
  $("#cajon").hidden = false;
  if (!veloCajon) { veloCajon = document.createElement("div"); veloCajon.className = "cajon-velo"; veloCajon.addEventListener("click", cerrarCajon); }
  document.body.appendChild(veloCajon);
  $$("[data-abrir-cajon]").forEach((b) => b.setAttribute("aria-expanded", "true"));
  $("#cajon .cajon-x").focus();
}
function cerrarCajon() {
  $("#cajon").hidden = true;
  if (veloCajon) veloCajon.remove();
  $$("[data-abrir-cajon]").forEach((b) => b.setAttribute("aria-expanded", "false"));
}
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-abrir-cajon]")) abrirCajon();
  if (e.target.closest("[data-cerrar-cajon]") || e.target.closest("#cajon a")) cerrarCajon();
  if (e.target.closest('[data-bb="buscar"]')) { window.scrollTo({ top: 0 }); setTimeout(() => $("#buscaQ").focus(), 50); }
});

/* ---------- Views ---------- */
const app = $("#app");
let vistaActual = {};

function vistaInicio() {
  const marcas = (C.marcasInicio || []);
  const s = sucursal();
  ponerTitulo("", t("heroTxt"));
  app.innerHTML = `
  <section class="hero"><div class="wrap hero-in">
    <div class="hero-txt">
      <p class="kicker">${esc(t("heroKicker"))}</p>
      <h1 class="titulo">${esc(t("heroTit"))}</h1>
      <p>${esc(t("heroTxt"))}</p>
      <div class="hero-acc">
        <a class="btn" href="#/lineas">${esc(t("explorar"))}</a>
        <a class="btn btn-sec" href="#/cotizacion">${esc(t("solicitar"))}</a>
        <a class="btn-txt" href="#/contacto">${ICO.wa} ${esc(t("asesor"))}</a>
      </div>
    </div>
    <div class="hero-img">
      <img src="img/hero-motores.webp" alt="${idioma === "en" ? "Industrial electric motors" : "Motores eléctricos industriales"}" width="940" height="645" fetchpriority="high">
      <p class="hero-sello"><small>${esc(t("selloTit"))}</small><b>${esc(t("selloTxt"))}</b></p>
    </div>
  </div></section>

  <section class="cifras" aria-label="BINASA"><ul>
    <li><strong>${esc(C.empresa?.desde || 1986)}</strong><span>${esc(t("cifraDesde"))}</span></li>
    <li><strong>${esc(C.empresa?.almacenes || 23)}</strong><span>${esc(t("cifraAlm"))}</span></li>
    <li><strong>${esc(C.empresa?.metros || "13,000 m²")}</strong><span>${esc(t("cifraM2"))}</span></li>
    <li><strong>${esc(C.empresa?.marcas || "+40")}</strong><span>${esc(t("cifraMarcas"))}</span></li>
  </ul></section>

  <section class="sec" id="lineas"><div class="wrap">
    <div class="sec-cab"><div><h2 class="titulo">${esc(t("lineasTit"))}</h2><p>${esc(t("lineasTxt"))}</p></div><a href="#/lineas">${esc(t("verCatalogo"))}</a></div>
    ${htmlMosaico()}
  </div></section>

  <section class="sec sec-osc"><div class="wrap">
    <div class="sec-cab"><div><h2 class="titulo">${esc(t("comoTit"))}</h2><p>${esc(t("comoTxt"))}</p></div></div>
    <ol class="pasos3">
      <li><b>01</b><h3>${esc(t("paso1"))}</h3><p>${esc(t("paso1t"))}</p></li>
      <li><b>02</b><h3>${esc(t("paso2"))}</h3><p>${esc(t("paso2t"))}</p></li>
      <li><b>03</b><h3>${esc(t("paso3"))}</h3><p>${esc(t("paso3t"))}</p></li>
    </ol>
  </div></section>

  <section class="sec" id="marcas"><div class="wrap">
    <div class="sec-cab"><div><h2 class="titulo">${esc(t("marcasTit"))}</h2><p>${esc(t("marcasTxt"))}</p></div><a href="#/marcas">${esc(t("marcasPag"))} →</a></div>
    <ul class="muro">${marcas.map((m) => `<li><a href="#/marca/${esc(slug(m))}">${esc(m)}</a></li>`).join("")}</ul>
  </div></section>

  <section class="sec sec-gris"><div class="wrap suc-blq">
    <div>
      <h2 class="titulo" style="font-size:34px;margin:0">${esc(t("almTit"))}</h2>
      <p style="color:var(--gris-700)">${esc(t("almTxt"))}</p>
      <p><b>${esc(t("miSucursal"))}:</b> ${s ? esc(s.nombre) : "—"} · <button type="button" class="btn-txt" data-abrir-sucursal>${esc(s ? t("cambiar") : t("elegir"))}</button></p>
      <ul class="ciudades">${SUCURSALES.map((x) => `<li><button type="button" data-suc="${esc(x.id)}">${esc(x.nombre)}</button></li>`).join("")}</ul>
      <a class="btn btn-sec" style="margin-top:18px" href="#/sucursales">${esc(t("verSucursales"))}</a>
    </div>
    <div class="suc-mapa">
      <img src="img/mapa-mexico.png" alt="${esc(t("mapaAlt"))}" width="1200" height="763" loading="lazy">
      <p class="leyenda"><span><i style="background:var(--rojo)"></i>${esc(t("leyRojo"))}</span><span><i style="background:#C3C0C0"></i>${esc(t("leyGris"))}</span></p>
    </div>
  </div></section>

  ${(C.clientes || []).length ? `<section class="sec"><div class="wrap">
    <h2 class="titulo" style="text-align:center;font-size:28px;margin:0 0 20px">${esc(t("clientesTit"))}</h2>
    <ul class="clientes">${C.clientes.map((c) => `<li>${c.logo ? `<img src="${esc(c.logo)}" alt="${esc(c.nombre)}" loading="lazy">` : esc(c.nombre)}</li>`).join("")}</ul>
  </div></section>` : ""}

  <section class="sec" style="border-top:1px solid var(--gris-200)"><div class="wrap dos-col">
    <img src="img/almacen.webp" alt="${idioma === "en" ? "Warehouse staff moving pallets" : "Personal de almacén moviendo tarimas"}" loading="lazy" width="851" height="379">
    <div><h2 class="titulo" style="font-size:34px;margin:0">${esc(t("nosTit"))}</h2><p style="color:var(--gris-700)">${esc(t("nosTxt"))}</p>
      <p class="lema">${esc(C.empresa?.lema || "")}</p><a href="#/nosotros">${esc(t("conoce"))}</a></div>
  </div></section>

  ${htmlFranja()}`;
}
function htmlMosaico() {
  return `<div class="mosaico">${datos.lineas.map((l) => `<a class="losa" href="#/linea/${esc(l.id)}">${imgOFalta(l.foto, "")}<span>${esc(nombreDe(l))}<small>${l.total} ${esc(t("tipos"))}</small></span></a>`).join("")}</div>`;
}
function htmlFranja() {
  const s = sucursal();
  const wa = soloDigitos((s && s.whatsapp) || (C.contacto && C.contacto.whatsapp));
  return `<section class="franja"><div class="wrap">
    <div><h2 class="titulo">${esc(t("noEncuentras"))}</h2><p>${esc(t("noEncuentrasTxt"))}</p></div>
    <div class="hero-acc" style="margin:0"><a class="btn" href="#/cotizacion">${esc(t("pedirCot"))}</a>
    <a class="btn btn-sec" href="https://wa.me/${wa}" target="_blank" rel="noopener">${esc(t("escribirWa"))}</a></div>
  </div></section>`;
}

function vistaLineas() {
  ponerTitulo(t("lineasProducto"), t("lineasTxtPag"));
  app.innerHTML = `<div class="wrap"><nav class="migas" aria-label="Ruta"><a href="#/">${esc(t("inicio"))}</a> › <span>${esc(t("lineasProducto"))}</span></nav>
    <div class="cat-cab"><div><h1 class="titulo">${esc(t("lineasProducto"))}</h1><p>${esc(t("lineasTxtPag"))}</p></div></div>
    ${htmlMosaico()}<div style="height:56px"></div></div>`;
}

async function vistaLinea(id, params) {
  const l = lineaPor(id);
  if (!l) return vista404();
  vistaActual.linea = id;
  ponerTitulo(nombreDe(l), (idioma === "en" ? l.descripcion_en : l.descripcion) || `${nombreDe(l)}: ${l.total} ${t("tiposProducto")}. ${l.marcas.join(", ")}.`);
  app.innerHTML = `<p class="cargando">${esc(t("cargando"))}</p>`;
  const prods = await cargarLinea(id);
  const est = { grupo: params.get("grupo") || "", marca: params.get("marca") || "", q: "", pagina: 1 };
  const desc = (idioma === "en" && l.descripcion_en) || l.descripcion;
  app.innerHTML = `<div class="wrap">
    <nav class="migas" aria-label="Ruta"><a href="#/">${esc(t("inicio"))}</a> › <a href="#/lineas">${esc(t("lineasProducto"))}</a> › <span>${esc(nombreDe(l))}</span></nav>
    <div class="cat-cab"><div><h1 class="titulo">${esc(nombreDe(l))}</h1><p>${desc ? esc(desc) + " " : ""}${l.total} ${esc(t("tiposProducto"))} · ${l.marcas.length} ${esc(t("deMarcas"))}</p></div></div>
    <div class="filtros">
      ${l.grupos.length ? `<div class="filtros-fila" role="group" aria-label="${esc(t("grupo"))}"><span>${esc(t("grupo"))}</span>
        <button type="button" class="chip" data-f-grupo="">${esc(t("todas"))}</button>
        ${l.grupos.map((g) => `<button type="button" class="chip" data-f-grupo="${esc(g.n)}">${esc(g.n)} (${g.c})</button>`).join("")}</div>` : ""}
      <div class="filtros-fila" role="group" aria-label="${esc(t("marca"))}"><span>${esc(t("marca"))}</span>
        <button type="button" class="chip" data-f-marca="">${esc(t("todas"))}</button>
        ${l.marcas.map((m) => `<button type="button" class="chip" data-f-marca="${esc(m)}">${esc(m)}</button>`).join("")}</div>
    </div>
    <div class="barra-cat">
      <label class="sr" for="enLinea">${esc(t("buscarEn"))} ${esc(nombreDe(l))}</label>
      <input id="enLinea" class="campo" type="search" placeholder="${esc(t("buscarEn"))} ${esc(nombreDe(l))}">
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><p id="cuenta"></p>${segMonedas()}</div>
    </div>
    <div class="rejilla" id="rejilla"></div>
    <div class="mas" id="mas"></div>
    <p class="nota-libre">${esc(t("buscasModelo"))} <a href="#/cotizacion">${esc(t("escribelo"))}</a> ${esc(t("yConfirma"))}</p>
    <div style="height:48px"></div>
  </div>`;
  const pintar = () => {
    const q = mbPalabras(est.q).map(mbRaiz);
    const lista = prods.filter((p) => (!est.grupo || p.grupo === est.grupo) && (!est.marca || p.marcas.includes(est.marca)) &&
      (!q.length || q.every((w) => mbPalabras([p.nombre, p.nombre_en, p.modelo, p.grupo, p.marcas.join(" ")].join(" ")).map(mbRaiz).some((x) => x.startsWith(w)))));
    $$("[data-f-grupo]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.fGrupo === est.grupo)));
    $$("[data-f-marca]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.fMarca === est.marca)));
    const ver = lista.slice(0, est.pagina * POR_PAGINA);
    $("#cuenta").innerHTML = `<b>${lista.length}</b> ${esc(t("tiposProducto"))}`;
    $("#rejilla").innerHTML = ver.length ? ver.map((p) => htmlTarjeta(p, "h2")).join("")
      : `<div class="vacio" style="grid-column:1/-1">${esc(t("sinResultados"))} <button type="button" class="btn-txt" data-limpiar>${esc(t("quitarFiltros"))}</button></div>`;
    $("#mas").innerHTML = lista.length > ver.length ? `<span>${esc(t("mostrando", { a: ver.length, b: lista.length }))}</span><button type="button" class="btn btn-sec" data-mas>${esc(t("verMas"))}</button>` : "";
  };
  app.onclick = (e) => {
    const g = e.target.closest("[data-f-grupo]"), m = e.target.closest("[data-f-marca]");
    if (g) { est.grupo = g.dataset.fGrupo; est.pagina = 1; pintar(); }
    if (m) { est.marca = m.dataset.fMarca; est.pagina = 1; pintar(); }
    if (e.target.closest("[data-mas]")) { est.pagina++; pintar(); }
    if (e.target.closest("[data-limpiar]")) { est.grupo = ""; est.marca = ""; est.q = ""; $("#enLinea").value = ""; pintar(); }
  };
  let tm = null;
  $("#enLinea").addEventListener("input", (e) => { clearTimeout(tm); tm = setTimeout(() => { est.q = e.target.value; est.pagina = 1; pintar(); }, 120); });
  pintar();
}

async function vistaProducto(id) {
  app.innerHTML = `<p class="cargando">${esc(t("cargando"))}</p>`;
  const lista = await cargarBuscador();
  const base = lista.find((p) => p.id === id);
  if (!base) return vista404();
  const prods = await cargarLinea(base.linea);
  const p = prods.find((x) => x.id === id) || base;
  const l = lineaPor(p.linea);
  vistaActual.linea = p.linea;
  marcarLateral();
  const desc = (idioma === "en" && p.descripcion_en) || p.descripcion;
  ponerTitulo(nombreDe(p), desc || `${nombreDe(p)} — ${l ? nombreDe(l) : ""}. ${p.marcas.join(", ")}.`);
  const s = sucursal();
  const wa = soloDigitos((s && s.whatsapp) || (C.contacto && C.contacto.whatsapp));
  const url = location.href.split("#")[0] + "#/producto/" + encodeURIComponent(p.id);
  const v = precioDe(p);
  const relacionados = prods.filter((x) => x.id !== p.id && x.grupo === p.grupo).slice(0, 5);
  app.innerHTML = `<div class="wrap">
    <nav class="migas" aria-label="Ruta"><a href="#/">${esc(t("inicio"))}</a> › <a href="#/linea/${esc(p.linea)}">${esc(l ? nombreDe(l) : "")}</a> › <span>${esc(nombreDe(p))}</span></nav>
    <div class="prod">
      <div><div class="prod-foto">${imgOFalta(p.foto, nombreDe(p))}</div><small>${esc(t("imgRep"))}</small></div>
      <div>
        <a class="prod-linea" href="#/linea/${esc(p.linea)}">${esc(l ? nombreDe(l) : "")}${p.grupo ? " · " + esc(p.grupo) : ""}</a>
        <h1 class="titulo">${esc(nombreDe(p))}</h1>
        ${p.modelo ? `<p class="prod-modelo">${esc(t("modelo"))}: <b>${esc(p.modelo)}</b></p>` : ""}
        ${desc ? `<p style="color:var(--gris-700)">${esc(desc)}</p>` : ""}
        <div class="caja-precio">
          <div class="fila"><p>${esc(v == null ? t("precioCotizar") : t("precioRef"))}</p>${segMonedas()}</div>
          ${v == null ? `<small style="margin-top:6px">${esc(t("precioCotizarTxt"))}</small>`
            : `<strong>${!p.modelo ? esc(t("desde")) + " " : ""}${dinero(v)} <small>${moneda}</small></strong><small>${[C.precios?.notaIVA, t("precioConfirma")].filter(Boolean).map(esc).join(" · ")}</small>`}
        </div>
        <form class="prod-form" id="prodForm">
          ${p.marcas.length > 1 ? `<fieldset><legend class="etq">${esc(t("marcaPref"))} <small>${esc(t("opcional"))}</small></legend><div class="opciones">
            <label class="opcion"><input type="radio" name="marca" value="" checked><span>${esc(t("cualquiera"))}</span></label>
            ${p.marcas.map((m) => `<label class="opcion"><input type="radio" name="marca" value="${esc(m)}"><span>${esc(m)}</span></label>`).join("")}</div></fieldset>`
            : p.marcas.length ? `<p style="margin:0">${esc(t("marca"))}: <a href="#/marca/${esc(slug(p.marcas[0]))}"><b>${esc(p.marcas[0])}</b></a></p>` : ""}
          <div class="prod-fila">
            <div><label class="etq" for="ppCant">${esc(t("cantidad"))}</label>
              <div class="paso"><button type="button" data-paso="-1" aria-label="${esc(t("menos"))}">−</button><input id="ppCant" type="number" inputmode="numeric" min="1" max="9999" value="1"><button type="button" data-paso="1" aria-label="${esc(t("mas"))}">+</button></div></div>
            <div><label class="etq" for="ppNota">${esc(t("notaSuc"))} <small>${esc(t("opcional"))}</small></label><input id="ppNota" class="campo" type="text" maxlength="200" placeholder="${esc(t("notaPh"))}"></div>
          </div>
          <div class="prod-acc">
            <button type="submit" class="btn">${esc(t("agregar"))}</button>
            <a class="btn btn-sec" target="_blank" rel="noopener" href="https://wa.me/${wa}?text=${encodeURIComponent(`${t("hola", { s: s ? s.nombre : "", m: moneda })}\n- ${nombreDe(p)}${p.modelo ? " (" + p.modelo + ")" : ""}\n${url}`)}">${ICO.wa} ${esc(t("preguntarWa"))}</a>
          </div>
        </form>
        <ul class="ventajas">
          <li>${ICO.pin}<span>${esc(t("seEnvia"))} <b>${s ? esc(s.nombre) : "—"}</b> · <button type="button" class="btn-txt" style="min-height:0;padding:0" data-abrir-sucursal>${esc(s ? t("cambiar") : t("elegir"))}</button></span></li>
          <li>${ICO.reloj}<span>${esc(t("precioConfirma"))}</span></li>
          <li>${ICO.compartir}<button type="button" class="btn-txt" style="min-height:0;padding:0" data-copiar="${esc(url)}">${esc(t("copiar"))}</button></li>
        </ul>
      </div>
    </div>
    ${p.especificaciones && p.especificaciones.length ? `<section class="bloque"><h2 class="titulo">${esc(t("especificaciones"))}</h2><table class="specs"><tbody>${p.especificaciones.map(([k, val]) => `<tr><th scope="row">${esc(k || "—")}</th><td>${esc(val)}</td></tr>`).join("")}</tbody></table></section>` : ""}
    ${p.ficha_pdf ? `<section class="bloque"><a class="btn btn-sec" href="${esc(p.ficha_pdf)}" target="_blank" rel="noopener">${ICO.doc} ${esc(t("ficha"))}</a></section>` : ""}
    ${relacionados.length ? `<section class="bloque"><h2 class="titulo">${esc(t("otros"))} ${esc(p.grupo || (l ? nombreDe(l) : ""))}</h2><div class="rejilla">${relacionados.map((x) => htmlTarjeta(x)).join("")}</div></section>` : ""}
    <div style="height:56px"></div>
  </div>`;
  const cant = $("#ppCant");
  app.onclick = async (e) => {
    const b = e.target.closest("[data-paso]");
    if (b) cant.value = Math.min(9999, Math.max(1, (parseInt(cant.value, 10) || 1) + Number(b.dataset.paso)));
    const c = e.target.closest("[data-copiar]");
    if (c) { try { await navigator.clipboard.writeText(c.dataset.copiar); aviso("✓ " + esc(t("copiado"))); } catch (err) { prompt(t("copiar"), c.dataset.copiar); } }
  };
  $("#prodForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const m = $('input[name="marca"]:checked', e.target);
    agregarACot(p.id, Math.max(1, parseInt(cant.value, 10) || 1), { nota: $("#ppNota").value.trim(), marca: m ? m.value : "" });
    $("#ppNota").value = "";
  });
}

async function vistaMarcas() {
  ponerTitulo(t("marcasPag"), t("marcasPagTxt"));
  app.innerHTML = `<div class="wrap"><nav class="migas" aria-label="Ruta"><a href="#/">${esc(t("inicio"))}</a> › <span>${esc(t("marcasPag"))}</span></nav>
    <div class="cat-cab"><div><h1 class="titulo">${esc(t("marcasPag"))}</h1><p>${esc(t("marcasPagTxt"))}</p></div></div>
    <ul class="muro">${datos.marcas.map((m) => `<li><a href="#/marca/${esc(m.id)}">${esc(m.nombre)}</a></li>`).join("")}</ul><div style="height:56px"></div></div>`;
}
async function vistaMarca(id) {
  const m = marcaPor(id);
  if (!m) return vista404();
  ponerTitulo(m.nombre, `${m.nombre} — BINASA. ${m.lineas.map((x) => lineaPor(x)).filter(Boolean).map((l) => l.nombre).join(", ")}.`);
  const lista = (await cargarBuscador()).filter((p) => p.marcas.includes(m.nombre));
  app.innerHTML = `<div class="wrap">
    <nav class="migas" aria-label="Ruta"><a href="#/">${esc(t("inicio"))}</a> › <a href="#/marcas">${esc(t("marcasPag"))}</a> › <span>${esc(m.nombre)}</span></nav>
    <div class="cat-cab"><div><p class="kicker">${esc(t("marcaTit"))}</p><h1 class="titulo">${esc(m.nombre)}</h1><p>${lista.length} ${esc(t("productos"))}</p></div></div>
    <h2 style="font-size:16px;text-transform:uppercase;letter-spacing:.5px;color:var(--gris-700)">${esc(t("lineasConMarca"))}</h2>
    <div class="filtros-fila" style="margin-bottom:24px">${m.lineas.map((x) => lineaPor(x)).filter(Boolean).map((l) => `<a class="chip" href="#/linea/${esc(l.id)}?marca=${encodeURIComponent(m.nombre)}">${esc(nombreDe(l))}</a>`).join("")}</div>
    <div class="rejilla">${lista.map((p) => htmlTarjeta(p, "h2")).join("")}</div>
    <div style="height:56px"></div></div>`;
}

async function vistaBuscar(q) {
  ponerTitulo(t("resultadosPara", { q }), "");
  $("#buscaQ").value = q;
  app.innerHTML = `<p class="cargando">${esc(t("cargando"))}</p>`;
  const r = await buscar(q);
  app.innerHTML = `<div class="wrap">
    <nav class="migas" aria-label="Ruta"><a href="#/">${esc(t("inicio"))}</a> › <span>${esc(t("buscar"))}</span></nav>
    <div class="cat-cab"><div><h1 class="titulo">${esc(t("resultadosPara", { q }))}</h1><p>${r.corregido ? esc(t("corregido", { q: r.corregido })) + " · " : ""}${r.resultados.length} ${esc(t("productos"))}</p></div>${segMonedas()}</div>
    ${r.resultados.length ? `<div class="rejilla">${r.resultados.slice(0, 120).map((p) => htmlTarjeta(p, "h2")).join("")}</div>`
      : `<div class="vacio">${esc(t("sinBusqueda", { q }))}<br><br><a class="btn" href="#/cotizacion">${esc(t("pedirCot"))}</a></div>`}
    <p class="nota-libre">${esc(t("buscasModelo"))} <a href="#/cotizacion">${esc(t("escribelo"))}</a> ${esc(t("yConfirma"))}</p>
    <div style="height:56px"></div></div>`;
}

/* quote page */
async function vistaCotizacion() {
  ponerTitulo(t("miCotizacion"), t("comoTxt"));
  const lista = await cargarBuscador();
  const porId = new Map(lista.map((p) => [p.id, p]));
  cot = cot.filter((i) => i.libre || porId.has(i.id));
  const pintar = () => {
    const s = sucursal();
    const piezas = cot.reduce((a, i) => a + i.qty, 0);
    let total = 0, conPrecio = 0;
    cot.forEach((i) => { const v = i.libre ? null : precioDe(porId.get(i.id)); if (v != null) { total += v * i.qty; conPrecio++; } });
    app.innerHTML = `<div class="wrap">
      <ol class="cot-pasos"><li class="on"><b>1</b>${esc(t("revisa"))}</li><li class="on"><b>2</b>${esc(t("eligeDatos"))}</li><li><b>3</b>${esc(t("envia"))}</li></ol>
      <h1 class="titulo" style="font-size:38px;margin:0 0 18px">${esc(t("miCotizacion"))} <span style="font-size:20px;color:var(--gris-500)">· ${piezas} ${esc(t("piezas"))} · ${cot.length} ${esc(t("partidas"))}</span></h1>
      <div class="cot">
        <section class="cot-lista" aria-label="${esc(t("productos"))}">
          ${cot.length ? cot.map((i, n) => htmlItemCot(i, n, porId.get(i.id))).join("") : `<div class="vacio">${esc(t("vaciaCot"))} <a href="#/lineas">${esc(t("exploraCat"))}</a> ${esc(t("oEscribe"))}</div>`}
          <form class="libre-form" id="libreForm"><label class="etq" for="libreQ">${esc(t("libreTit"))}</label>
            <div class="fila"><input id="libreQ" class="campo" type="text" maxlength="160" placeholder="${esc(t("librePh"))}"><button type="submit" class="btn btn-sec">${esc(t("agregarLista"))}</button></div></form>
          ${cot.length ? `<button type="button" class="btn-txt" style="align-self:flex-start" data-vaciar>${esc(t("vaciar"))}</button>` : ""}
        </section>
        <aside class="cot-lado" aria-label="${esc(t("enviarA"))}">
          <div class="fila-cab"><h2>${esc(t("resumen"))}</h2>${segMonedas()}</div>
          <div class="resumen"><span>${esc(t("totalEst"))}</span><b>${conPrecio ? dinero(total) + " " + moneda : "—"}</b></div>
          <p class="letra-chica" style="margin:0 0 16px">${esc(t("totalNota", { m: moneda }))}</p>
          <h2>${esc(t("enviarA"))}</h2>
          <form class="cot-form" id="cotForm" novalidate>
            <div class="ancho"><label class="etq" for="cSuc">${esc(t("sucursal"))}</label>
              <select id="cSuc" class="campo">${s ? "" : `<option value="">${esc(t("elegir"))}…</option>`}${SUCURSALES.map((x) => `<option value="${esc(x.id)}" ${x.id === sucursalId ? "selected" : ""}>${esc(x.nombre)}</option>`).join("")}</select></div>
            <div class="ancho"><label class="etq" for="cNombre">${esc(t("nombre"))} *</label><input id="cNombre" name="nombre" class="campo" autocomplete="name" required value="${esc(cliente.nombre || "")}"></div>
            <div class="ancho"><label class="etq" for="cEmpresa">${esc(t("empresaCampo"))} <small>${esc(t("opcional"))}</small></label><input id="cEmpresa" name="empresa" class="campo" autocomplete="organization" value="${esc(cliente.empresa || "")}"></div>
            <div><label class="etq" for="cTel">${esc(t("telefono"))} *</label><input id="cTel" name="telefono" class="campo" type="tel" inputmode="tel" autocomplete="tel" required value="${esc(cliente.telefono || "")}"></div>
            <div><label class="etq" for="cCorreo">${esc(t("correo"))} *</label><input id="cCorreo" name="correo" class="campo" type="email" autocomplete="email" required value="${esc(cliente.correo || "")}"></div>
            <div class="ancho"><label class="etq" for="cCiudad">${esc(t("ciudad"))} <small>${esc(t("opcional"))}</small></label><input id="cCiudad" name="ciudad" class="campo" autocomplete="address-level2" value="${esc(cliente.ciudad || "")}"></div>
            <p class="error" id="cError" role="alert"></p>
          </form>
          <details class="vista"><summary>${esc(t("vistaPrevia"))}</summary><pre id="cMensaje"></pre></details>
          <div class="cot-btns">
            <button type="button" class="btn btn-wa" data-enviar="wa">${ICO.wa} ${esc(t("enviarWa", { s: s ? s.nombre : "BINASA" }))}</button>
            ${C.cotizacion && C.cotizacion.formularioURL ? `<button type="button" class="btn btn-sec" data-enviar="correo">${esc(t("enviarCorreo"))}</button>` : ""}
            <button type="button" class="btn-txt" data-enviar="pdf">${esc(t("descargarPdf"))}</button>
          </div>
          <p class="letra-chica">${esc(t("letraChica"))} <a href="#/aviso-privacidad">${esc(t("aviso").toLowerCase())}</a>.</p>
        </aside>
      </div></div>`;
    $("#cMensaje").textContent = mensajeCot(porId);
  };
  const leerCliente = () => {
    const f = $("#cotForm");
    if (!f) return;
    cliente = { nombre: f.nombre.value.trim(), empresa: f.empresa.value.trim(), telefono: f.telefono.value.trim(), correo: f.correo.value.trim(), ciudad: f.ciudad.value.trim() };
    guardar("binasa_cliente", cliente);
    $("#cMensaje").textContent = mensajeCot(porId);
  };
  const validar = () => {
    leerCliente();
    let err = "";
    if (!cot.length) err = t("faltaItems");
    else if (!cliente.nombre) err = t("faltaNombre");
    else if (soloDigitos(cliente.telefono).length < 10) err = t("faltaTel");
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cliente.correo)) err = t("faltaCorreo");
    $("#cError").textContent = err;
    if (err) {
      const campo = !cot.length ? $("#libreQ") : !cliente.nombre ? $("#cNombre") : soloDigitos(cliente.telefono).length < 10 ? $("#cTel") : $("#cCorreo");
      campo.focus();
    }
    return !err;
  };
  pintar();
  app.oninput = (e) => {
    const n = e.target.dataset.notaN;
    if (n != null) { cot[n].nota = e.target.value; guardarCot(); $("#cMensaje").textContent = mensajeCot(porId); }
    if (e.target.closest("#cotForm")) leerCliente();
  };
  app.onchange = (e) => {
    if (e.target.id === "cSuc") { elegirSucursal(e.target.value); }
    const n = e.target.dataset.qtyN;
    if (n != null) { cot[n].qty = Math.min(9999, Math.max(1, parseInt(e.target.value, 10) || 1)); guardarCot(); pintar(); }
  };
  app.onsubmit = (e) => {
    if (e.target.id !== "libreForm") return;
    e.preventDefault();
    const q = $("#libreQ").value.trim();
    if (!q) return;
    cot.push({ id: "libre-" + Date.now().toString(36), libre: q, qty: 1, nota: "" });
    guardarCot();
    pintar();
    $("#libreQ").focus();
  };
  app.onclick = async (e) => {
    const paso = e.target.closest("[data-qty]");
    if (paso) { const i = cot[paso.dataset.n]; i.qty = Math.min(9999, Math.max(1, i.qty + Number(paso.dataset.qty))); guardarCot(); pintar(); return; }
    const q = e.target.closest("[data-quitar]");
    if (q) { cot.splice(Number(q.dataset.quitar), 1); guardarCot(); pintar(); return; }
    if (e.target.closest("[data-vaciar]") && confirm(t("vaciarConf"))) { cot = []; guardarCot(); pintar(); return; }
    const env = e.target.closest("[data-enviar]");
    if (!env) return;
    const modo = env.dataset.enviar;
    if (modo === "pdf") { leerCliente(); return imprimirCot(porId); }
    if (!validar()) return;
    const msg = mensajeCot(porId);
    if (modo === "wa") {
      const s = sucursal();
      const num = soloDigitos((s && s.whatsapp) || (C.contacto && C.contacto.whatsapp));
      window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    }
    if (modo === "correo") {
      env.disabled = true;
      const txt = env.textContent;
      env.textContent = t("enviando");
      try {
        const s = sucursal();
        const r = await fetch(C.cotizacion.formularioURL, {
          method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(Object.assign({}, C.cotizacion.formularioCampos || {}, {
            subject: `${t("pdfTit")} — ${cliente.nombre}${s ? " — " + s.nombre : ""}`, nombre: cliente.nombre, empresa: cliente.empresa,
            telefono: cliente.telefono, email: cliente.correo, ciudad: cliente.ciudad, sucursal: s ? s.nombre : "", moneda, mensaje: msg })),
        });
        if (!r.ok) throw new Error(r.status);
        aviso("✓ " + esc(t("enviado")));
      } catch (err) {
        $("#cError").textContent = t("errorEnvio");
      } finally { env.disabled = false; env.textContent = txt; }
    }
  };
}
function htmlItemCot(i, n, p) {
  const l = p && lineaPor(p.linea);
  const v = p ? precioDe(p) : null;
  return `<article class="cot-item">
    ${i.libre ? `<span class="libre">${esc(t("pedidoLibre"))}</span>` : imgOFalta(p.foto, "")}
    <div class="cot-info">
      <div class="cot-top"><div>
        <p style="font-size:11.5px;font-weight:700;text-transform:uppercase;color:var(--gris-500);margin:0">${esc(i.libre ? t("pedidoLibre") : l ? nombreDe(l) : "")}</p>
        <h2>${i.libre ? esc(i.libre) : `<a href="#/producto/${encodeURIComponent(p.id)}">${esc(nombreDe(p))}</a>`}</h2>
        ${!i.libre ? `<p>${p.modelo ? esc(t("modelo")) + ": " + esc(p.modelo) + " · " : ""}${esc(t("marca"))}: ${esc(i.marca || (p.marcas.length === 1 ? p.marcas[0] : t("cualquiera")))}</p>` : ""}
      </div><button type="button" class="quitar" data-quitar="${n}" aria-label="${esc(t("quitar"))}: ${esc(i.libre || nombreDe(p))}">${ICO.basura}<span>${esc(t("quitar"))}</span></button></div>
      <div class="cot-campos">
        <div><span class="etq">${esc(t("cantidad"))}</span><div class="paso"><button type="button" data-qty="-1" data-n="${n}" aria-label="${esc(t("menos"))}">−</button><input type="number" inputmode="numeric" min="1" max="9999" value="${i.qty}" data-qty-n="${n}" aria-label="${esc(t("cantidad"))}"><button type="button" data-qty="1" data-n="${n}" aria-label="${esc(t("mas"))}">+</button></div></div>
        ${!i.libre ? `<div class="cot-precio"><span class="etq">${esc(t("precioRefCorto"))}</span><b>${v == null ? esc(t("consultarPrecio")) : dinero(v) + " " + moneda}</b></div>` : ""}
        <div class="nota"><label class="etq" for="nota${n}">${esc(t("nota"))}</label><input id="nota${n}" class="campo" type="text" maxlength="200" value="${esc(i.nota || "")}" data-nota-n="${n}" placeholder="${esc(t("notaCorta"))}"></div>
      </div>
    </div>
  </article>`;
}
function mensajeCot(porId) {
  const s = sucursal();
  const lineas = cot.map((i, n) => {
    if (i.libre) return `${n + 1}. ${i.libre} × ${i.qty}${i.nota ? " — " + i.nota : ""}`;
    const p = porId.get(i.id);
    const marca = i.marca || (p.marcas.length === 1 ? p.marcas[0] : "");
    return `${n + 1}. ${nombreDe(p)}${p.modelo ? " " + p.modelo : ""}${marca ? " (" + marca + ")" : ""} × ${i.qty}${i.nota ? " — " + i.nota : ""} [${p.id}]`;
  });
  return [t("hola", { s: s ? s.nombre : "", m: moneda }).replace("  ", " "), ...lineas, "",
    `${t("nombre")}: ${cliente.nombre || "—"}`, cliente.empresa && `${t("empresaCampo")}: ${cliente.empresa}`,
    `${t("telefono")}: ${cliente.telefono || "—"}`, `${t("correo")}: ${cliente.correo || "—"}`, cliente.ciudad && `${t("ciudad")}: ${cliente.ciudad}`]
    .filter((x) => x !== "" && x != null && x !== false).join("\n").replace(/\n(?=\S+: )/, "\n\n");
}
function imprimirCot(porId) {
  if (!cot.length) return;
  const s = sucursal();
  const ahora = new Date();
  const dos = (n) => String(n).padStart(2, "0");
  const folio = `BIN-${ahora.getFullYear()}${dos(ahora.getMonth() + 1)}${dos(ahora.getDate())}-${dos(ahora.getHours())}${dos(ahora.getMinutes())}`;
  const filas = cot.map((i, n) => {
    const p = i.libre ? null : porId.get(i.id);
    const v = p ? precioDe(p) : null;
    return `<tr><td>${n + 1}</td><td>${esc(i.libre || nombreDe(p))}${p && p.modelo ? "<br><small>" + esc(p.modelo) + "</small>" : ""}</td><td>${esc(i.libre ? "" : i.marca || (p.marcas.length === 1 ? p.marcas[0] : t("cualquiera")))}</td><td class="n">${i.qty}</td><td class="n">${v == null ? "—" : dinero(v)}</td><td>${esc(i.nota || "")}</td></tr>`;
  }).join("");
  const logo = new URL("img/binasa-logo.png", location.href).href;
  const html = `<!doctype html><html lang="${idioma}"><head><meta charset="utf-8"><title>${folio} · BINASA</title><style>
    *{box-sizing:border-box}body{font:13px/1.45 Arial,Helvetica,sans-serif;color:#1E1F22;margin:0;padding:30px}
    .top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #E30613;padding-bottom:14px;margin-bottom:18px}
    .top img{height:46px}h1{font-size:22px;margin:0 0 4px}.m{color:#4A4D52}
    .cols{display:flex;gap:20px;margin-bottom:18px}.box{flex:1;border:1px solid #ddd;border-radius:4px;padding:10px 12px}
    .box b{display:block;font-size:11px;text-transform:uppercase;color:#6B6F76;margin-bottom:4px}
    table{width:100%;border-collapse:collapse}th{background:#1E1F22;color:#fff;text-align:left;padding:8px;font-size:12px}
    td{padding:8px;border-bottom:1px solid #e5e5e5;vertical-align:top}td small{color:#6B6F76}.n{text-align:right;white-space:nowrap}
    .nota{margin-top:20px;font-size:12px;color:#4A4D52}.btn{position:fixed;bottom:20px;right:20px;background:#E30613;color:#fff;border:0;padding:12px 18px;border-radius:4px;font-weight:bold;cursor:pointer}
    @media print{.btn{display:none}body{padding:0}}</style></head><body>
    <button class="btn" onclick="print()">${esc(t("pdfGuardar"))}</button>
    <div class="top"><img src="${logo}" alt="BINASA"><div style="text-align:right"><h1>${esc(t("pdfTit"))}</h1>
      <div class="m">${esc(t("pdfFolio"))}: <b>${folio}</b></div><div class="m">${esc(t("pdfFecha"))}: ${ahora.toLocaleDateString(idioma === "en" ? "en-US" : "es-MX", { day: "2-digit", month: "long", year: "numeric" })}</div></div></div>
    <div class="cols"><div class="box"><b>${esc(t("pdfCliente"))}</b>${esc(cliente.nombre || "—")}${cliente.empresa ? "<br>" + esc(cliente.empresa) : ""}${cliente.telefono ? "<br>" + esc(cliente.telefono) : ""}${cliente.correo ? "<br>" + esc(cliente.correo) : ""}${cliente.ciudad ? "<br>" + esc(cliente.ciudad) : ""}</div>
      <div class="box"><b>${esc(t("pdfSucursal"))}</b>BINASA ${esc(s ? s.nombre : "")}${s && s.telefono ? "<br>" + esc(s.telefono) : ""}${s && s.correo ? "<br>" + esc(s.correo) : ""}</div></div>
    <table><thead><tr><th>#</th><th>${esc(t("productos"))}</th><th>${esc(t("marca"))}</th><th class="n">${esc(t("cantidad"))}</th><th class="n">${esc(t("precioRefCorto"))} (${moneda})</th><th>${esc(t("nota"))}</th></tr></thead><tbody>${filas}</tbody></table>
    <p class="nota">${esc(t("pdfNota"))}</p>
    <script>setTimeout(function(){print()},500)<\/script></body></html>`;
  const w = window.open("", "_blank");
  if (!w) return alert(t("permiteVentanas"));
  w.document.open(); w.document.write(html); w.document.close();
}

function vistaSucursales() {
  ponerTitulo(t("sucTit"), t("sucTxt"));
  app.innerHTML = `<div class="wrap">
    <nav class="migas" aria-label="Ruta"><a href="#/">${esc(t("inicio"))}</a> › <span>${esc(t("sucTit"))}</span></nav>
    <div class="cat-cab"><div><h1 class="titulo">${esc(t("sucTit"))}</h1><p>${esc(t("sucTxt"))}</p></div></div>
    <div class="suc-blq" style="margin-bottom:28px"><div class="suc-mapa" style="max-width:760px"><img src="img/mapa-mexico.png" alt="${esc(t("mapaAlt"))}" width="1200" height="763">
      <p class="leyenda"><span><i style="background:var(--rojo)"></i>${esc(t("leyRojo"))}</span><span><i style="background:#C3C0C0"></i>${esc(t("leyGris"))}</span></p></div></div>
    <div class="sucs">${SUCURSALES.map((s) => {
      const mia = s.id === sucursalId;
      const tel = soloDigitos(s.telefono), wa = soloDigitos(s.whatsapp);
      const tieneDatos = s.direccion || s.telefono || s.whatsapp || s.correo;
      return `<article class="suc ${mia ? "mia" : ""}">
        ${mia ? `<span class="etiqueta">${esc(t("esMia"))}</span>` : ""}
        <h2 class="titulo">${esc(s.nombre)}</h2><p>${esc(s.estado)}</p>
        ${s.direccion ? `<p>${esc(s.direccion)}</p>` : ""}
        ${s.horario ? `<p>${esc(t("horario"))}: ${esc(s.horario)}</p>` : ""}
        ${s.correo ? `<p><a href="mailto:${esc(s.correo)}">${esc(s.correo)}</a></p>` : ""}
        ${tieneDatos ? "" : `<p class="pendiente">${esc(t("datosProx"))}</p>`}
        <div class="suc-acc">
          ${mia ? "" : `<button type="button" class="btn btn-sec" data-suc="${esc(s.id)}">${esc(t("elegirMia"))}</button>`}
          ${tel ? `<a class="btn btn-sec" href="tel:${tel}">${esc(t("llamar"))}</a>` : ""}
          ${wa ? `<a class="btn btn-wa" href="https://wa.me/${wa}" target="_blank" rel="noopener">WhatsApp</a>` : ""}
          ${s.mapa ? `<a class="btn btn-sec" href="${esc(s.mapa)}" target="_blank" rel="noopener">${esc(t("verMapa"))}</a>` : ""}
        </div></article>`;
    }).join("")}</div><div style="height:56px"></div></div>`;
}

function vistaNosotros() {
  ponerTitulo(t("nosotros"), t("nosTxt"));
  app.innerHTML = `<div class="wrap"><nav class="migas" aria-label="Ruta"><a href="#/">${esc(t("inicio"))}</a> › <span>${esc(t("nosotros"))}</span></nav>
    <div class="dos-col" style="padding:20px 0 40px">
      <div class="texto"><p class="kicker">BINASA</p><h1 class="titulo">${esc(t("nosTit"))}</h1><p>${esc(t("nosTxt"))}</p><p>${esc(t("nosTxt2"))}</p><p class="lema">${esc(C.empresa?.lema || "")}</p></div>
      <img src="img/almacen.webp" alt="${idioma === "en" ? "BINASA warehouse" : "Almacén BINASA"}" width="851" height="379">
    </div></div>
    <section class="cifras" aria-label="BINASA" style="border-top:1px solid var(--gris-200)"><ul>
      <li><strong>${esc(C.empresa?.desde || 1986)}</strong><span>${esc(t("cifraDesde"))}</span></li>
      <li><strong>${esc(C.empresa?.almacenes || 23)}</strong><span>${esc(t("cifraAlm"))}</span></li>
      <li><strong>${esc(C.empresa?.metros || "")}</strong><span>${esc(t("cifraM2"))}</span></li>
      <li><strong>${esc(C.empresa?.marcas || "")}</strong><span>${esc(t("cifraMarcas"))}</span></li></ul></section>
    <section class="sec"><div class="wrap"><div class="sec-cab"><div><h2 class="titulo">${esc(t("marcasTit"))}</h2></div></div>
      <ul class="muro">${(C.marcasInicio || []).map((m) => `<li><a href="#/marca/${esc(slug(m))}">${esc(m)}</a></li>`).join("")}</ul></div></section>
    ${htmlFranja()}`;
}

function vistaContacto() {
  ponerTitulo(t("contactoTit"), t("contactoTxt"));
  const c = C.contacto || {};
  const s = sucursal();
  const wa = soloDigitos((s && s.whatsapp) || c.whatsapp);
  app.innerHTML = `<div class="wrap"><nav class="migas" aria-label="Ruta"><a href="#/">${esc(t("inicio"))}</a> › <span>${esc(t("contactoTit"))}</span></nav>
    <div class="texto" style="padding-bottom:48px"><h1 class="titulo">${esc(t("contactoTit"))}</h1><p>${esc(t("contactoTxt"))}</p>
      <div class="hero-acc"><a class="btn" href="#/cotizacion">${esc(t("cotizarAhora"))}</a><a class="btn btn-wa" href="https://wa.me/${wa}" target="_blank" rel="noopener">${ICO.wa} ${esc(t("escribirWa"))}</a><a class="btn btn-sec" href="#/sucursales">${esc(t("verSucursales"))}</a></div>
      <p style="margin-top:24px"><b>${esc(t("miSucursal"))}:</b> ${s ? esc(s.nombre) : "—"} · <button type="button" class="btn-txt" style="min-height:0;padding:0" data-abrir-sucursal>${esc(s ? t("cambiar") : t("elegir"))}</button></p>
      ${c.telefono ? `<p><b>${esc(t("telefono"))}:</b> <a href="tel:${esc(soloDigitos(c.telefono))}">${esc(c.telefono)}</a></p>` : ""}
      ${c.correo ? `<p><b>${esc(t("correo"))}:</b> <a href="mailto:${esc(c.correo)}">${esc(c.correo)}</a></p>` : ""}
      ${c.direccion ? `<p>${esc(c.direccion)}</p>` : ""}
      ${c.facebook || c.linkedin ? `<h2>${esc(t("redes"))}</h2><p>${c.facebook ? `<a href="${esc(c.facebook)}" target="_blank" rel="noopener">Facebook</a>` : ""}${c.facebook && c.linkedin ? " · " : ""}${c.linkedin ? `<a href="${esc(c.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>` : ""}</p>` : ""}
    </div></div>`;
}

function vistaAviso() {
  ponerTitulo(t("avisoTit"), t("avisoTit"));
  const a = C.avisoPrivacidad || {};
  app.innerHTML = `<div class="wrap"><nav class="migas" aria-label="Ruta"><a href="#/">${esc(t("inicio"))}</a> › <span>${esc(t("avisoTit"))}</span></nav>
    <div class="texto" style="padding-bottom:56px"><h1 class="titulo">${esc(t("avisoTit"))}</h1>
    ${a.texto ? a.texto.split(/\n\s*\n/).map((p) => `<p>${esc(p.trim())}</p>`).join("") + (a.actualizado ? `<p><small>${esc(t("actualizado"))}: ${esc(a.actualizado)}</small></p>` : "")
      : `<p class="aviso-borrador">${esc(t("avisoPend"))}</p>`}
    ${a.url ? `<p><a href="${esc(a.url)}" target="_blank" rel="noopener">${esc(t("avisoLink"))} ↗</a></p>` : ""}
    </div></div>`;
}

function vista404() {
  ponerTitulo(t("noEncontrado"), "");
  app.innerHTML = `<div class="wrap texto" style="padding:56px 24px"><h1 class="titulo">${esc(t("noEncontrado"))}</h1><p>${esc(t("noEncontradoTxt"))}</p><a class="btn" href="#/">${esc(t("volverInicio"))}</a></div>`;
}

/* ---------- Router ---------- */
let ultimaRuta = "";
async function enrutar(mismaRuta = false) {
  const h = location.hash || "#/";
  if (!h.startsWith("#/")) return; // in-page anchors
  const [ruta, qs] = h.slice(1).split("?");
  const params = new URLSearchParams(qs || "");
  const partes = ruta.split("/").filter(Boolean).map((x) => { try { return decodeURIComponent(x); } catch (e) { return x; } });
  const cambio = h !== ultimaRuta;
  ultimaRuta = h;
  vistaActual = {};
  app.onclick = app.oninput = app.onchange = app.onsubmit = null;
  cerrarVolado();
  cerrarCajon();
  const [a, b] = partes;
  document.body.classList.toggle("lat-mini", !!a && a !== "lineas");
  $$(".nav a[data-ruta]").forEach((x) => x.setAttribute("aria-current", x.dataset.ruta === (a || "inicio") ? "page" : "false"));
  $$(".bb [data-bb]").forEach((x) => x.setAttribute("aria-current", x.dataset.bb === (a || "inicio") ? "page" : "false"));
  try {
    if (!a) vistaInicio();
    else if (a === "lineas") vistaLineas();
    else if (a === "linea" && b) await vistaLinea(b, params);
    else if (a === "producto" && b) await vistaProducto(b);
    else if (a === "marcas") await vistaMarcas();
    else if (a === "marca" && b) await vistaMarca(b);
    else if (a === "buscar" && b) await vistaBuscar(b);
    else if (a === "cotizacion") await vistaCotizacion();
    else if (a === "sucursales") vistaSucursales();
    else if (a === "nosotros") vistaNosotros();
    else if (a === "contacto") vistaContacto();
    else if (a === "aviso-privacidad") vistaAviso();
    else vista404();
  } catch (err) {
    console.error(err);
    app.innerHTML = `<div class="wrap"><p class="cargando">${esc(t("errorCarga"))}</p></div>`;
  }
  marcarLateral();
  if (cambio && !mismaRuta) { window.scrollTo(0, 0); app.focus({ preventScroll: true }); }
}
window.addEventListener("hashchange", () => enrutar());

/* ---------- Seasonal theme (promos.js) ---------- */
(function tema() {
  const temas = (window.PROMOS && window.PROMOS.temas) || [];
  const VALIDOS = ["navidad", "patrias", "muertos"];
  let elegido = null;
  const pedido = new URLSearchParams(location.search).get("tema");
  if (pedido && VALIDOS.includes(pedido)) elegido = temas.find((x) => x.tema === pedido) || { tema: pedido };
  if (!elegido) {
    const mx = new Date(Date.now() - 6 * 3600000);
    const hoy = String(mx.getUTCMonth() + 1).padStart(2, "0") + "-" + String(mx.getUTCDate()).padStart(2, "0");
    elegido = temas.find((x) => VALIDOS.includes(x.tema) && (x.desde <= x.hasta ? hoy >= x.desde && hoy <= x.hasta : hoy >= x.desde || hoy <= x.hasta));
  }
  if (!elegido) return;
  document.body.classList.add("tema-" + elegido.tema);
  const cab = $(".cab");
  const tira = document.createElement("div");
  tira.className = "tema-tira";
  tira.setAttribute("aria-hidden", "true");
  cab.appendChild(tira);
  const clave = "binasa_saludo_" + elegido.tema + "_" + new Date().getFullYear();
  const saludo = idioma === "en" ? elegido.saludo_en || elegido.saludo : elegido.saludo;
  if (saludo && !leer(clave, false)) {
    const bar = document.createElement("div");
    bar.className = "tema-saludo";
    bar.innerHTML = `<span>${esc(saludo)}</span><button type="button" aria-label="${esc(t("cerrar"))}">×</button>`;
    bar.querySelector("button").addEventListener("click", () => { bar.remove(); guardar(clave, true); });
    document.body.prepend(bar);
  }
})();

/* ---------- Analytics (off until contenido.js has an ID) ---------- */
if (/^G-[A-Z0-9]+$/i.test(C.googleAnalytics || "")) {
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + C.googleAnalytics;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", C.googleAnalytics);
}

/* ---------- Start ---------- */
pintarEstaticos();
pintarContadores();
cargarLineas()
  .then(() => { construirLateral(); construirCajon(); return enrutar(); })
  .catch((err) => { console.error(err); app.innerHTML = `<div class="wrap"><p class="cargando">${esc(t("errorCarga"))}</p></div>`; });
})();
