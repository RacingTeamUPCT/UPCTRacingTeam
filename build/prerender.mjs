/* Pre-generación de páginas.
   Cada página se ejecuta con jsdom (un navegador simulado) usando EXACTAMENTE los mismos scripts y datos que en el
   navegador real; el resultado se guarda como HTML ya pintado. Así Google (y quien no tenga JavaScript) ve el contenido
   y el aspecto visual no cambia: al cargar, los mismos scripts vuelven a pintar lo mismo y añaden la interactividad. */
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM, ResourceLoader, VirtualConsole } from 'jsdom';
import { ROOT, SITE_URL } from './config.mjs';

/* Scripts que no se ejecutan al pre-generar (necesitan WebGL, que un navegador simulado no tiene).
   Siguen enlazados en la página y funcionan igual en el navegador real. */
const SKIP_SCRIPTS = /(^|\/)(coche3d|visor)\.js$/;

class Loader extends ResourceLoader {
  fetch(url) {
    const u = new URL(url);
    if (u.hostname !== 'localhost') { return null; }                         // nada de red: fuentes, mapas…
    const p = decodeURIComponent(u.pathname);
    if (/\.css$/i.test(p) || SKIP_SCRIPTS.test(p)) { return Promise.resolve(Buffer.alloc(0)); }
    const file = path.join(ROOT, p);
    if (!fs.existsSync(file)) { return Promise.reject(new Error('No existe ' + p)); }
    return Promise.resolve(fs.readFileSync(file));
  }
}
const loader = new Loader();

/* Marca de «página generada» (el idioma lo decide la dirección) y, en páginas dentro de /en/ o /blog/, <base href="/">
   para que css, js y assets se encuentren desde cualquier carpeta. */
export function prepareSource(html, nested) {
  const add = '\n  <meta name="upct-static" content="1">' + (nested && !/<base\s/i.test(html) ? '\n  <base href="/">' : '');
  return html.replace(/(<meta charset[^>]*>)/i, '$1' + add);
}

export async function render(html, urlPath, errors) {
  let dom;
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => {
    if (/Not implemented/i.test(e.message) || (dom && dom.__quiet)) { return; }
    const detail = process.env.DEBUG_STACK && e.detail ? '\n' + (e.detail.stack || e.detail) : '';   // DEBUG_STACK=1 npm run build
    errors.push(`${urlPath}: ${e.message}${detail}`);
  });
  vc.on('error', (m) => errors.push(`${urlPath}: console.error ${m}`));
  dom = new JSDOM(html, {
    url: 'http://localhost' + urlPath,
    runScripts: 'dangerously',
    resources: loader,
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(window) {
      window.matchMedia = (q) => ({ matches: false, media: q, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } });
      window.scrollTo = () => {};
      window.Element.prototype.scrollIntoView = function () {};
    }
  });
  await new Promise((resolve) => {
    const t = setTimeout(resolve, 15000);
    dom.window.addEventListener('load', () => { clearTimeout(t); resolve(); });
  });
  await new Promise((r) => setTimeout(r, 250));                              // deja correr los temporizadores de los scripts
  return dom;
}

/* Cierra la página simulada (los observadores que se disparan después de cerrar ya no cuentan como error) */
export function finish(dom) {
  dom.__quiet = true;
  dom.window.close();
}

/* Quita lo que solo existe «en ejecución» para que el navegador real arranque igual que con la página de origen */
export function cleanRuntime(document) {
  const html = document.documentElement;
  ['js', 'i18n-wait', 'is-leaving', 'menu-open'].forEach((c) => html.classList.remove(c));
  if (!html.getAttribute('class')) { html.removeAttribute('class'); }
  ['data-ready', 'data-reveal-bound', 'data-i18n-done'].forEach((a) => {
    document.querySelectorAll('[' + a + ']').forEach((e) => e.removeAttribute(a));
  });
  /* Cabecera y pie ya vienen escritos: el navegador no debe volver a pintarlos (ver js/components.js) */
  document.querySelectorAll('site-header, site-footer').forEach((e) => e.setAttribute('data-prerendered', ''));
  document.querySelectorAll('.is-visible, .is-instant').forEach((e) => {
    e.classList.remove('is-visible', 'is-instant');
    if (!e.getAttribute('class')) { e.removeAttribute('class'); }
  });
  /* «Esta página necesita JavaScript»: ya no hace falta, el contenido viene escrito */
  document.querySelectorAll('noscript').forEach((n) => { if (/necesita JavaScript/i.test(n.textContent)) { n.remove(); } });
}

function absolute(url) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return SITE_URL + '/' + String(url).replace(/^\.?\//, '');
}

function setMeta(document, attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute('content', value);
}
function dropMeta(document, attr, key) { const el = document.head.querySelector(`meta[${attr}="${key}"]`); if (el) el.remove(); }

/* canonical, og:url, hreflang (es/en/x-default) y og:image absoluta */
export function decorateHead(document, { canonical, altEs, altEn }) {
  document.head.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]').forEach((e) => e.remove());
  const link = (rel, href, extra = {}) => {
    const el = document.createElement('link');
    el.setAttribute('rel', rel);
    Object.entries(extra).forEach(([k, v]) => el.setAttribute(k, v));
    el.setAttribute('href', href);
    document.head.appendChild(el);
  };
  link('canonical', SITE_URL + canonical);
  link('alternate', SITE_URL + altEs, { hreflang: 'es' });
  link('alternate', SITE_URL + altEn, { hreflang: 'en' });
  link('alternate', SITE_URL + altEs, { hreflang: 'x-default' });
  setMeta(document, 'property', 'og:url', SITE_URL + canonical);
  const img = document.head.querySelector('meta[property="og:image"]');
  if (img) img.setAttribute('content', absolute(img.getAttribute('content')));
}

/* Datos propios de la página de una noticia: título, descripción, imagen para compartir y datos estructurados */
export function decoratePost(dom, post, canonical) {
  const w = dom.window, document = w.document, UPCT = w.UPCT;
  const p = UPCT.loc(post);
  const title = p.titulo + ' · UPCT Racing Team';
  const desc = UPCT.postExcerpt(p, 180);
  const cover = UPCT.postCover(p);
  const image = cover ? cover.src : (p.poster || 'assets/img/og/og-default.jpg');
  const imageAlt = cover ? cover.alt : (p.videoAlt || p.titulo);
  document.title = title;
  setMeta(document, 'name', 'description', desc);
  setMeta(document, 'property', 'og:title', title);
  setMeta(document, 'property', 'og:description', desc);
  setMeta(document, 'property', 'og:image', absolute(image));
  setMeta(document, 'property', 'og:image:alt', imageAlt);
  setMeta(document, 'property', 'article:published_time', p.fecha);
  const first = (post.fotos && post.fotos[0]) || null;
  if (first && first.ancho && first.alto) {
    setMeta(document, 'property', 'og:image:width', String(first.ancho));
    setMeta(document, 'property', 'og:image:height', String(first.alto));
  } else { dropMeta(document, 'property', 'og:image:width'); dropMeta(document, 'property', 'og:image:height'); }
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.titulo, description: desc,
    datePublished: p.fecha, image: absolute(image), inLanguage: UPCT.i18n.lang,
    mainEntityOfPage: SITE_URL + canonical,
    author: { '@type': 'Organization', name: p.autor || 'UPCT Racing Team' },
    publisher: { '@type': 'Organization', name: 'UPCT Racing Team', logo: { '@type': 'ImageObject', url: SITE_URL + '/favicon.png' } }
  });
  document.head.appendChild(ld);
}

/* Revisión de imágenes: cuántas no tienen «alt», cuántas lo tienen vacío (decorativas) y las que no deberían estarlo */
export function auditImages(document) {
  const imgs = [...document.querySelectorAll('img')];
  const missing = imgs.filter((i) => !i.hasAttribute('alt'));
  const empty = imgs.filter((i) => i.getAttribute('alt') === '');
  const emptyMeaningful = empty.filter((i) => !i.closest('[aria-hidden="true"]') && i.getAttribute('aria-hidden') !== 'true');
  return { total: imgs.length, missing, empty: empty.length, emptyMeaningful };
}
