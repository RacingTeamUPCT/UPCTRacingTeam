/* Servidor local para ver dist/ (npm start). Se comporta como Vercel: carpeta → index.html y 404.html para lo que no existe. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { DIST as BUILT } from './config.mjs';
const DIST = process.env.SERVE_DIR ? path.resolve(process.env.SERVE_DIR) : BUILT;   // SERVE_DIR: servir otra carpeta (p. ej. para comparar)

const PORT = Number(process.env.PORT || process.argv[2] || 5173);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.mp4': 'video/mp4', '.pdf': 'application/pdf', '.glb': 'model/gltf-binary', '.woff2': 'font/woff2'
};

http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.join(DIST, p);
  if (!file.startsWith(DIST)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  let status = 200;
  if (!fs.existsSync(file)) { file = path.join(DIST, '404.html'); status = 404; }
  const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
  const data = fs.readFileSync(file);
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
  res.end(data);
}).listen(PORT, () => console.log(`Sirviendo dist/ en http://localhost:${PORT}`));
