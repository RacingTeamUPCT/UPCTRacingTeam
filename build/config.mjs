/* Configuración común del build (npm run build). */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const DIST = path.join(ROOT, 'dist');

/* Dominio de producción: se usa en canonical, og:url, hreflang y sitemap.xml */
export const SITE_URL = (process.env.SITE_URL || 'https://upctracingteam.com').replace(/\/$/, '');

/* Páginas del sitio (archivo HTML de la raíz sin «.html»). «index» es la portada. */
export const PAGES = ['index', 'quienes-somos', 'equipo', 'competicion', 'garaje', 'blog', 'patrocinadores', 'contacto'];

export const LANGS = ['es', 'en'];

/* Carpetas y archivos que se copian tal cual a dist/ */
export const COPY_DIRS = ['css', 'js', 'data', 'assets'];
export const COPY_FILES = ['favicon.ico', 'favicon.png', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'manifest.webmanifest', 'robots.txt'];

/* Ruta pública de una página en un idioma: «/», «/equipo.html», «/en/», «/en/equipo.html», «/blog/nombre.html»… */
export function pagePath(name, lang) {
  const file = name === 'index' ? '' : name + '.html';
  return (lang === 'en' ? '/en/' : '/') + file;
}
export function postPath(id, lang) {
  return (lang === 'en' ? '/en' : '') + '/blog/' + id + '.html';
}
