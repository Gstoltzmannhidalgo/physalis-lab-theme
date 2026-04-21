import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = Object.fromEntries(
  readFileSync(join(__dirname, '..', '.env'), 'utf8').split('\n').filter(l => l && !l.startsWith('#')).map(l => {
    const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
  })
);
const { SHOP, ACCESS_TOKEN } = env;
const API = `https://${SHOP}/admin/api/2025-01`;
const H = { 'X-Shopify-Access-Token': ACCESS_TOKEN, 'Content-Type': 'application/json' };

async function rest(path, method = 'GET', body) {
  const r = await fetch(`${API}${path}`, { method, headers: H, body: body ? JSON.stringify(body) : undefined });
  const t = await r.text();
  if (!r.ok) throw new Error(`${method} ${path} → ${r.status}: ${t.slice(0, 500)}`);
  return JSON.parse(t);
}

const COLLECTIONS = [
  { handle: 'lamparas', title: 'Lámparas', body_html: '<p>Iluminación escultórica para tu hogar — lámparas de mesa, suspensiones y apliques diseñados por autores chilenos y latinoamericanos.</p>', rules: [{ column: 'type', relation: 'equals', condition: 'Lámparas' }] },
  { handle: 'floreros', title: 'Floreros', body_html: '<p>Floreros escultóricos en distintas alturas y texturas. Cada pieza pensada como objeto autónomo, con o sin flores.</p>', rules: [{ column: 'type', relation: 'equals', condition: 'Floreros' }] },
  { handle: 'maceteros', title: 'Maceteros', body_html: '<p>Maceteros de diseño para suculentas, plantas medianas y arreglos de interior. Drenaje, plato y diseño en una sola pieza.</p>', rules: [{ column: 'type', relation: 'equals', condition: 'Maceteros' }] },
  { handle: 'decoracion', title: 'Decoración', body_html: '<p>Cuencos, esculturas, objetos de mesa y rincón. La categoría que reúne todo lo que no entra en una sola palabra.</p>', rules: [{ column: 'type', relation: 'equals', condition: 'Decoración' }] },
];

(async () => {
  const existing = (await rest('/smart_collections.json?limit=250')).smart_collections;
  const existingHandles = new Set(existing.map(c => c.handle));

  for (const c of COLLECTIONS) {
    if (existingHandles.has(c.handle)) {
      console.log(`✓ existe: ${c.handle}`);
      continue;
    }
    const created = await rest('/smart_collections.json', 'POST', {
      smart_collection: {
        title: c.title,
        handle: c.handle,
        body_html: c.body_html,
        rules: c.rules,
        disjunctive: false,
        published: true,
      },
    });
    console.log(`+ creada: ${c.handle} (id ${created.smart_collection.id})`);
  }
})();
