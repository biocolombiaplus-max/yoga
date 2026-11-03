# Alma Barrientos · Landing de Yoga, Eventos y Retiros

Landing page premium (HTML + CSS + JS puro, sin dependencias) lista para desplegar en **Vercel**.

## Desplegar en Vercel
1. Entra a https://vercel.com/new e importa este repositorio de GitHub.
2. Framework Preset: **Other**. Sin comando de build. Output: raíz (`/`).
3. Clic en **Deploy**. Listo.

## Qué editar
| Qué | Dónde |
|---|---|
| Nombre de marca, textos, precios, eventos, retiro | `index.html` |
| Número de WhatsApp y endpoint del formulario | `script.js` → `CONFIG` |
| Horario semanal de clases | `script.js` → `SCHEDULE` |
| Fecha de la cuenta regresiva del retiro | `index.html` → `data-date` en `#countdown` |
| Colores y tipografías | `styles.css` → `:root` |
| Fotos | Sube tus fotos a `/assets` con estos nombres y aparecen solas: `alma-hero.jpg` (portada), `alma.jpg` (retrato de Alma), `clase.jpg`, `clases.jpg`, `retiro.jpg`, `eventos.jpg`, `cocora.jpg`. Si una foto no existe, se muestra una foto de stock o una ilustración artística. |
| Meta Pixel | `index.html` → descomenta el bloque y pon tu `PIXEL_ID` |

## Formulario
- Multi-paso (interés → práctica → datos) con validación, consentimiento Ley 1581 y anti-spam.
- Captura automáticamente `utm_*` y `fbclid` de los anuncios de Meta.
- Dispara el evento `Lead` del Pixel al enviar.
- Hoy funciona en **modo demo** (guarda en el navegador). Para recibir los leads, pon en
  `CONFIG.formEndpoint` una URL de Formspree, Make, Zapier o Google Apps Script (Google Sheets).

## Importante al actualizar
Cada vez que cambies `styles.css` o `script.js`, sube el número de versión en `index.html`
(`styles.css?v=5` → `?v=6`, igual para `script.js`). Así los celulares nunca muestran una versión vieja guardada en caché.
