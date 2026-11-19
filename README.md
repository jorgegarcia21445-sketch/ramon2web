# BINASA — Catálogo y cotizaciones (versión 1.0.0)

Sitio estático para GitHub Pages: catálogo de 22 líneas de producto y solicitud de cotización por WhatsApp, correo o PDF.
**No hay pagos en línea ni APIs de proveedores.** HTML, CSS y JavaScript sin frameworks.

## Archivos

| Archivo / carpeta | Qué es |
|---|---|
| `index.html` | Estructura de la página (encabezado, menú, pie). |
| `index.css` | Diseño: colores BINASA, tipografía, móvil. |
| `index.js` | Funcionamiento: rutas, catálogo, buscador, cotización, sucursales, ES/EN, MXN/USD/EUR. |
| `contenido.js` | **Editable:** contactos, WhatsApp, sucursales, clientes, marcas, aviso de privacidad. |
| `promos.js` | **Editable:** temas de temporada (Navidad, Fiestas Patrias, Día de Muertos). |
| `data/lineas.csv` | **Editable:** las 22 líneas (nombre, nombre en inglés, descripción, marcas, foto). |
| `data/productos.csv` | **Editable:** productos (hoy, los 565 tipos del catálogo PDF). |
| `scripts/generar-catalogo.mjs` | Convierte los CSV en `catjson/`. |
| `catjson/` | Archivos generados. **No se editan a mano.** |
| `img/` | Logo, mapa y fotos (`img/lineas/`, `img/tipos/`). |

## Rutas

`#/` inicio · `#/lineas` · `#/linea/<id>` · `#/producto/<id>` · `#/marcas` · `#/marca/<id>` · `#/buscar/<texto>` ·
`#/sucursales` · `#/cotizacion` · `#/nosotros` · `#/contacto` · `#/aviso-privacidad`

## Actualizar productos

1. Edita `data/productos.csv` en Excel o Google Sheets y guárdalo como CSV (UTF-8).
2. Ejecuta `node scripts/generar-catalogo.mjs` (Node 18 o más nuevo, sin instalar nada).
3. El script avisa de filas con errores (no escribe nada si hay errores) y de fotos o fichas que no existen.
4. Sube `?v=1.0.0` en `index.html` (ej. `1.0.1`) para que los navegadores tomen la versión nueva, y publica.

Columnas de `productos.csv`:

| Columna | Uso |
|---|---|
| `id` | Único. No cambiarlo después de publicar (es el enlace del producto). |
| `linea` | El `id` de una línea de `lineas.csv` (ej. `chumaceras`). |
| `grupo` | Opcional. Subgrupo para filtros (ej. `Poleas`). |
| `tipo` | Tipo de producto (ej. `Piso`). |
| `marca` | Una o varias marcas separadas con `|` (ej. `SKF|Timken`). |
| `modelo` | Número de modelo (ej. `6205-2RS`). Se puede buscar. |
| `nombre`, `nombre_en` | Nombre en español e inglés (si falta el inglés, se muestra el español). |
| `descripcion`, `descripcion_en` | Descripción corta. Vacía = no se muestra. |
| `especificaciones` | `clave=valor; clave=valor` (ej. `d=25 mm; D=52 mm`). |
| `foto` | Ruta, ej. `img/productos/6205-2rs.webp` (WebP, ~800×800, fondo blanco). |
| `ficha_pdf` | Ruta, ej. `fichas/skf-6205.pdf`. Vacía = no se muestra. |
| `precio_mxn`, `precio_usd`, `precio_eur` | Precio de cada moneda. Vacío = "Consultar precio". |
| `destacado` | `si` / `no`. |
| `activo` | `si` / `no`. Los `no` no se publican. |

## Probar en tu computadora

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```
(Abrir `index.html` con doble clic no funciona: el navegador bloquea la lectura de los JSON.)

## Publicar (GitHub Pages)

```bash
git status
git add .
git commit -m "Descripción de los cambios"
git pull --rebase origin main
git push origin main
```
Si el `pull --rebase` marca conflictos, detente y resuélvelos antes de hacer `push`. **Nunca uses `git push --force`.**
Cuando haya dominio: agrega un archivo `CNAME` con el dominio y descomenta `<link rel="canonical">` en `index.html`.

## Seguridad

- No hay contraseñas ni claves en el código. `contenido.js` es público: solo datos de contacto y la dirección pública del servicio de formularios.
- El botón "Enviar por correo" aparece solo cuando `cotizacion.formularioURL` tiene un servicio configurado (Formspree, Web3Forms…).

## Pendiente de BINASA

Dominio · teléfonos, WhatsApp, correos, direcciones y horarios por sucursal (`contenido.js`) · destino de las cotizaciones y servicio de correo ·
fotos de producto · precios · nombres en inglés · descripciones de líneas · aviso de privacidad oficial · permiso para mostrar clientes y marcas.

## SEO

El sitio usa rutas con `#` (compatibles con GitHub Pages). Google indexa bien la página principal, pero no trata cada `#/producto/...`
como una página independiente. Si más adelante se necesita posicionar cada línea o producto, se pueden generar páginas estáticas por línea
con el mismo script.
