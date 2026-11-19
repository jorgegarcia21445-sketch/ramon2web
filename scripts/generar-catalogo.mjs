// generar-catalogo.mjs — turns the spreadsheets in data/ into the JSON files the site reads.
//
//   node scripts/generar-catalogo.mjs
//
// Reads:   data/lineas.csv     (the 22 product lines)
//          data/productos.csv  (one row per product or product type)
// Writes:  catjson/lineas.json        lines, brands and counts (loaded on every page)
//          catjson/linea-<id>.json    full detail of each line's products
//          catjson/buscador.json      compact list of every product, for search
//
// Rows with activo = "no" are left out. Problems are listed at the end;
// errors stop the script without touching catjson/, warnings don't.
// No external packages: plain Node.js 18 or newer.
import fs from "node:fs";
import path from "node:path";

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const DATOS = path.join(RAIZ, "data");
const SALIDA = path.join(RAIZ, "catjson");

const COLS_PRODUCTOS = ["id", "linea", "tipo", "marca", "modelo", "nombre", "descripcion", "especificaciones", "foto", "ficha_pdf", "destacado", "activo"];
const OPCIONALES_PRODUCTOS = ["grupo", "nombre_en", "descripcion_en", "precio_mxn", "precio_usd", "precio_eur"];
const COLS_LINEAS = ["id", "orden", "nombre", "nombre_en", "descripcion", "descripcion_en", "marcas", "foto"];

const errores = [];
const avisos = [];

// ---------- CSV reader (quotes, commas or semicolons, Excel BOM, CRLF) ----------
function leerCSV(archivo) {
  let texto = fs.readFileSync(archivo, "utf8").replace(/^﻿/, "");
  const primera = texto.split(/\r?\n/, 1)[0];
  const sep = (primera.match(/;/g) || []).length > (primera.match(/,/g) || []).length ? ";" : ",";
  const filas = [];
  let fila = [], campo = "", comillas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (comillas) {
      if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') comillas = false;
      else campo += c;
    } else if (c === '"') comillas = true;
    else if (c === sep) { fila.push(campo); campo = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && texto[i + 1] === "\n") i++;
      fila.push(campo); campo = "";
      if (fila.some((x) => x.trim() !== "")) filas.push(fila);
      fila = [];
    } else campo += c;
  }
  fila.push(campo);
  if (fila.some((x) => x.trim() !== "")) filas.push(fila);
  const encabezado = filas.shift().map((h) => h.trim().toLowerCase());
  return {
    encabezado,
    filas: filas.map((f, n) => {
      const o = { _fila: n + 2 };
      encabezado.forEach((h, i) => (o[h] = (f[i] ?? "").trim()));
      return o;
    }),
  };
}

const limpiar = (t) => String(t ?? "").replace(/\s+/g, " ").trim();
const slug = (t) => limpiar(t).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const siNo = (v, porDefecto) => {
  const t = slug(v);
  if (!t) return porDefecto;
  if (["si", "s", "yes", "y", "1", "true", "x"].includes(t)) return true;
  if (["no", "n", "0", "false"].includes(t)) return false;
  return null;
};
function precio(v, fila, col) {
  const t = limpiar(v).replace(/[$\s]|mxn|usd|eur/gi, "").replace(/,/g, "");
  if (!t) return null;
  const n = Number(t);
  if (!isFinite(n) || n < 0) { avisos.push(`productos.csv fila ${fila}: ${col} "${v}" no es un número; se deja vacío.`); return null; }
  return Math.round(n * 100) / 100;
}
function archivoExiste(ruta, fila, col) {
  if (!ruta) return "";
  if (/^https?:\/\//i.test(ruta)) return ruta;
  const limpia = ruta.replace(/^\.?\//, "");
  if (!fs.existsSync(path.join(RAIZ, limpia))) {
    avisos.push(`fila ${fila}: ${col} "${ruta}" no existe; se mostrará sin ${col === "foto" ? "foto" : "ficha"}.`);
    return "";
  }
  return limpia;
}
// "d=25 mm; D=52 mm" or one spec per line -> [["d","25 mm"], ...]
function especificaciones(t) {
  return limpiar(t.replace(/\r?\n/g, ";"))
    .split(";")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => {
      const m = x.match(/^([^:=]+)[:=](.+)$/);
      return m ? [m[1].trim(), m[2].trim()] : ["", x];
    });
}
const faltan = (encabezado, cols, archivo) => {
  const f = cols.filter((c) => !encabezado.includes(c));
  if (f.length) errores.push(`${archivo}: faltan las columnas ${f.join(", ")}.`);
  return f.length > 0;
};

// ---------- Lines ----------
const L = leerCSV(path.join(DATOS, "lineas.csv"));
faltan(L.encabezado, COLS_LINEAS, "lineas.csv");
const lineas = new Map();
for (const r of L.filas) {
  const id = slug(r.id || r.nombre);
  if (!id || !limpiar(r.nombre)) { errores.push(`lineas.csv fila ${r._fila}: falta id o nombre.`); continue; }
  if (lineas.has(id)) { errores.push(`lineas.csv fila ${r._fila}: id "${id}" repetido.`); continue; }
  lineas.set(id, {
    id, orden: Number(r.orden) || lineas.size + 1, nombre: limpiar(r.nombre), nombre_en: limpiar(r.nombre_en),
    descripcion: limpiar(r.descripcion), descripcion_en: limpiar(r.descripcion_en),
    marcas: limpiar(r.marcas).split("|").map(limpiar).filter(Boolean),
    foto: archivoExiste(r.foto, r._fila, "foto"), grupos: [], total: 0,
  });
}

// ---------- Products ----------
const P = leerCSV(path.join(DATOS, "productos.csv"));
faltan(P.encabezado, COLS_PRODUCTOS, "productos.csv");
OPCIONALES_PRODUCTOS.filter((c) => !P.encabezado.includes(c)).forEach((c) => avisos.push(`productos.csv: columna opcional "${c}" no está; se ignora.`));

const productos = [];
const ids = new Set();
let inactivos = 0;
for (const r of P.filas) {
  const activo = siNo(r.activo, true);
  if (activo === null) avisos.push(`productos.csv fila ${r._fila}: activo "${r.activo}" no es si/no; se toma como "si".`);
  if (activo === false) { inactivos++; continue; }
  const id = slug(r.id);
  const linea = slug(r.linea);
  const nombre = limpiar(r.nombre) || limpiar([r.tipo, r.modelo].filter(Boolean).join(" "));
  if (!id) { errores.push(`productos.csv fila ${r._fila}: falta id.`); continue; }
  if (ids.has(id)) { errores.push(`productos.csv fila ${r._fila}: id "${id}" repetido.`); continue; }
  if (!lineas.has(linea)) { errores.push(`productos.csv fila ${r._fila}: la línea "${r.linea}" no existe en lineas.csv.`); continue; }
  if (!nombre) { errores.push(`productos.csv fila ${r._fila}: falta nombre (o tipo).`); continue; }
  ids.add(id);
  const marcas = limpiar(r.marca).split("|").map(limpiar).filter(Boolean);
  const destacado = siNo(r.destacado, false);
  productos.push({
    id, linea, grupo: limpiar(r.grupo), tipo: limpiar(r.tipo), marcas, modelo: limpiar(r.modelo),
    nombre, nombre_en: limpiar(r.nombre_en),
    descripcion: limpiar(r.descripcion), descripcion_en: limpiar(r.descripcion_en),
    especificaciones: especificaciones(r.especificaciones || ""),
    foto: archivoExiste(r.foto, r._fila, "foto"), ficha_pdf: archivoExiste(r.ficha_pdf, r._fila, "ficha_pdf"),
    precios: { MXN: precio(r.precio_mxn, r._fila, "precio_mxn"), USD: precio(r.precio_usd, r._fila, "precio_usd"), EUR: precio(r.precio_eur, r._fila, "precio_eur") },
    destacado: destacado === true,
  });
}

// ---------- Report ----------
console.log(`Líneas: ${lineas.size} · Productos activos: ${productos.length} · Inactivos omitidos: ${inactivos}`);
if (avisos.length) {
  console.log(`\nAvisos (${avisos.length}):`);
  avisos.slice(0, 60).forEach((a) => console.log("  - " + a));
  if (avisos.length > 60) console.log(`  … y ${avisos.length - 60} más.`);
}
if (errores.length) {
  console.log(`\nErrores (${errores.length}) — no se escribió nada:`);
  errores.forEach((e) => console.log("  ✗ " + e));
  process.exit(1);
}

// ---------- Write ----------
fs.mkdirSync(SALIDA, { recursive: true });
for (const f of fs.readdirSync(SALIDA)) if (/^linea-.*\.json$/.test(f)) fs.unlinkSync(path.join(SALIDA, f));

const marcas = new Map();
for (const p of productos) {
  const l = lineas.get(p.linea);
  l.total++;
  const g = l.grupos.find((x) => x.n === p.grupo);
  if (g) g.c++; else l.grupos.push({ n: p.grupo, c: 1 });
  for (const m of p.marcas.length ? p.marcas : []) {
    const k = slug(m);
    const e = marcas.get(k) || { id: k, nombre: m, lineas: [], total: 0 };
    e.total++;
    if (!e.lineas.includes(p.linea)) e.lineas.push(p.linea);
    marcas.set(k, e);
  }
}
for (const l of lineas.values()) {
  for (const m of l.marcas) if (!marcas.has(slug(m))) marcas.set(slug(m), { id: slug(m), nombre: m, lineas: [l.id], total: 0 });
  if (l.grupos.length === 1 && !l.grupos[0].n) l.grupos = [];
}

const generado = new Date().toISOString();
const listaLineas = [...lineas.values()].sort((a, b) => a.orden - b.orden);
fs.writeFileSync(path.join(SALIDA, "lineas.json"), JSON.stringify({
  v: 1, generado,
  lineas: listaLineas,
  marcas: [...marcas.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
}));
for (const l of listaLineas) {
  fs.writeFileSync(path.join(SALIDA, `linea-${l.id}.json`), JSON.stringify({ v: 1, linea: l.id, productos: productos.filter((p) => p.linea === l.id) }));
}
// [id, nombre, nombre_en, linea, grupo, "marca|marca", modelo, foto, mxn, usd, eur, destacado(0/1)]
fs.writeFileSync(path.join(SALIDA, "buscador.json"), JSON.stringify({
  v: 1, generado,
  p: productos.map((p) => [p.id, p.nombre, p.nombre_en, p.linea, p.grupo, p.marcas.join("|"), p.modelo, p.foto, p.precios.MXN, p.precios.USD, p.precios.EUR, p.destacado ? 1 : 0]),
}));
const kb = (f) => (fs.statSync(path.join(SALIDA, f)).size / 1024).toFixed(0) + " KB";
console.log(`\nListo: catjson/lineas.json (${kb("lineas.json")}), catjson/buscador.json (${kb("buscador.json")}), ${listaLineas.length} archivos linea-*.json`);
