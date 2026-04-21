// OAuth helper para obtener un Admin API access token desde un app del Dev Dashboard.
// Uso: node scripts/auth.mjs
// Lee CLIENT_ID, CLIENT_SECRET, SHOP, SCOPES desde .env.

import http from 'node:http';
import { exec } from 'node:child_process';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import crypto from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env');

if (!existsSync(envPath)) {
  console.error('Falta .env en la raíz. Crealo con CLIENT_ID, CLIENT_SECRET, SHOP, SCOPES.');
  process.exit(1);
}

const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
    })
);

const { CLIENT_ID, CLIENT_SECRET, SHOP, SCOPES } = env;
if (!CLIENT_ID || !CLIENT_SECRET || !SHOP || !SCOPES) {
  console.error('Faltan vars en .env: CLIENT_ID, CLIENT_SECRET, SHOP, SCOPES');
  process.exit(1);
}

const PORT = 53682;
const REDIRECT = `http://localhost:${PORT}/callback`;
const STATE = crypto.randomBytes(16).toString('hex');

const authUrl =
  `https://${SHOP}/admin/oauth/authorize` +
  `?client_id=${CLIENT_ID}` +
  `&scope=${encodeURIComponent(SCOPES)}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT)}` +
  `&state=${STATE}` +
  `&grant_options[]=`;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname !== '/callback') {
    res.writeHead(404).end();
    return;
  }
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  if (state !== STATE) {
    res.writeHead(400).end('state mismatch');
    server.close();
    process.exit(1);
  }

  const r = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code }),
  });
  const data = await r.json();
  if (!data.access_token) {
    res.writeHead(500).end('No token: ' + JSON.stringify(data));
    console.error(data);
    server.close();
    process.exit(1);
  }

  const lines = readFileSync(envPath, 'utf8').split('\n').filter(l => !l.startsWith('ACCESS_TOKEN='));
  lines.push(`ACCESS_TOKEN=${data.access_token}`);
  writeFileSync(envPath, lines.join('\n').replace(/\n+$/, '') + '\n');

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(
    `<h1>Token guardado en .env</h1><p>Cerrá esta pestaña.</p>`
  );
  console.log('OK — token guardado.');
  server.close();
  process.exit(0);
});

server.listen(PORT, () => {
  console.log(`Abriendo: ${authUrl}`);
  exec(`open "${authUrl}"`);
});
