/* Garaje: las fotos de cada departamento son los archivos de assets/img/garaje/<id-del-departamento>/.
   Genera data/garaje-fotos.js. Sin archivos en las carpetas, el resultado es un objeto vacío y la web queda como está. */
import fs from 'node:fs';
import path from 'node:path';
import { imageSize } from 'image-size';
import { ROOT } from './config.mjs';

const DIR = path.join(ROOT, 'assets', 'img', 'garaje');
const EXT = /\.(jpe?g|png|webp|avif)$/i;

/* «montaje-del-chasis-2.jpg» → «Montaje del chasis 2» (sirve de texto alternativo si no hay alt.json) */
function humanize(file) {
  const s = file.replace(EXT, '').replace(/^\d+[-_ ]+/, '').replace(/[-_]+/g, ' ').trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Foto del departamento';
}

export function writeGarajeData() {
  const result = {};
  if (fs.existsSync(DIR)) {
    for (const dept of fs.readdirSync(DIR, { withFileTypes: true })) {
      if (!dept.isDirectory()) continue;
      const base = path.join(DIR, dept.name);
      let alts = {};
      try { alts = JSON.parse(fs.readFileSync(path.join(base, 'alt.json'), 'utf8')); } catch { /* sin alt.json */ }
      const files = fs.readdirSync(base).filter((f) => EXT.test(f)).sort((a, b) => a.localeCompare(b, 'es', { numeric: true }));
      const list = files.map((f) => {
        let dim = {};
        try { const d = imageSize(fs.readFileSync(path.join(base, f))); dim = { ancho: d.width, alto: d.height }; } catch { /* sin medidas */ }
        const alt = alts[f] ? (typeof alts[f] === 'string' ? alts[f] : alts[f].es) : humanize(f);
        const o = { src: `assets/img/garaje/${dept.name}/${f}`, ...dim, alt };
        if (alts[f] && typeof alts[f] === 'object' && alts[f].en) o.en = alts[f].en;
        return o;
      });
      if (list.length) result[dept.name] = list;
    }
  }
  const out =
`/* ==========================================================================
   UPCT Racing Team — Fotos del garaje   (ARCHIVO GENERADO: no se edita a mano)
   Lo crea "npm run build" con los archivos de assets/img/garaje/<departamento>/.
   ========================================================================== */
window.UPCT = window.UPCT || {};

UPCT.garajeFotos = ${JSON.stringify(result, null, 2)};
`;
  fs.writeFileSync(path.join(ROOT, 'data', 'garaje-fotos.js'), out, 'utf8');
  return Object.keys(result);
}
