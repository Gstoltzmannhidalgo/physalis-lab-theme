// Setup completo de la tienda Physalis Lab vía Admin API.
// Crea páginas, metaobject Designer, metafield, 3 diseñadores demo, 5 productos demo, menú.
// Idempotente: detecta lo existente y solo crea lo que falta.

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8').split('\n').filter(l => l && !l.startsWith('#')).map(l => {
    const i = l.indexOf('=');
    return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
  })
);
const { SHOP, ACCESS_TOKEN } = env;
if (!SHOP || !ACCESS_TOKEN) { console.error('Faltan SHOP o ACCESS_TOKEN en .env'); process.exit(1); }

const API = `https://${SHOP}/admin/api/2025-01`;
const H = { 'X-Shopify-Access-Token': ACCESS_TOKEN, 'Content-Type': 'application/json' };

async function rest(path, method = 'GET', body) {
  const r = await fetch(`${API}${path}`, { method, headers: H, body: body ? JSON.stringify(body) : undefined });
  const t = await r.text();
  let j; try { j = JSON.parse(t); } catch { j = t; }
  if (!r.ok) throw new Error(`${method} ${path} → ${r.status}: ${t.slice(0, 500)}`);
  return j;
}
async function gql(query, variables = {}) {
  const r = await fetch(`${API}/graphql.json`, { method: 'POST', headers: H, body: JSON.stringify({ query, variables }) });
  const j = await r.json();
  if (j.errors) throw new Error(`GraphQL: ${JSON.stringify(j.errors)}`);
  return j.data;
}

const log = (...a) => console.log('•', ...a);

// ────────────────────── 1. PÁGINAS ──────────────────────
const PAGES = [
  { title: 'Sobre nosotros', handle: 'sobre-nosotros', template_suffix: 'sobre-nosotros' },
  { title: 'Contacto', handle: 'contacto', template_suffix: 'contacto' },
  { title: 'Preguntas frecuentes', handle: 'faq', template_suffix: 'faq' },
  { title: 'Términos y condiciones', handle: 'terminos', template_suffix: 'terminos' },
  { title: 'Diseñadores', handle: 'disenadores', template_suffix: 'disenadores' },
  { title: 'Cómo funciona', handle: 'como-funciona', template_suffix: 'como-funciona' },
];

async function setupPages() {
  log('Páginas…');
  const existing = (await rest('/pages.json?limit=250')).pages;
  const existingHandles = new Set(existing.map(p => p.handle));
  for (const p of PAGES) {
    if (existingHandles.has(p.handle)) { log(`  ✓ existe: ${p.handle}`); continue; }
    const body_html = p.handle === 'terminos'
      ? '<p>Acá va el contenido de Términos y Condiciones de Physalis Lab. Editar desde Admin → Tienda online → Páginas → Términos.</p>'
      : '';
    await rest('/pages.json', 'POST', { page: { title: p.title, handle: p.handle, template_suffix: p.template_suffix, body_html, published: true } });
    log(`  + creada: ${p.handle} (plantilla page.${p.template_suffix})`);
  }
}

// ────────────────────── 2. METAOBJECT DESIGNER ──────────────────────
async function setupMetaobjectDefinition() {
  log('Metaobject Designer…');
  const data = await gql(`{ metaobjectDefinitionByType(type: "designer") { id name } }`);
  if (data.metaobjectDefinitionByType) { log(`  ✓ existe: ${data.metaobjectDefinitionByType.id}`); return data.metaobjectDefinitionByType.id; }
  const create = await gql(`
    mutation Create($d: MetaobjectDefinitionCreateInput!) {
      metaobjectDefinitionCreate(definition: $d) {
        metaobjectDefinition { id }
        userErrors { field message }
      }
    }`, {
    d: {
      name: 'Designer',
      type: 'designer',
      access: { storefront: 'PUBLIC_READ' },
      capabilities: { publishable: { enabled: true }, onlineStore: { enabled: true, data: { urlHandle: 'designer' } } },
      fieldDefinitions: [
        { key: 'name', name: 'Name', type: 'single_line_text_field', required: true },
        { key: 'bio', name: 'Bio', type: 'multi_line_text_field' },
        { key: 'portrait', name: 'Portrait', type: 'file_reference', validations: [{ name: 'file_type_options', value: '["Image"]' }] },
        { key: 'location', name: 'Location', type: 'single_line_text_field' },
        { key: 'instagram', name: 'Instagram', type: 'single_line_text_field' },
        { key: 'website', name: 'Website', type: 'url' },
      ],
    },
  });
  const errs = create.metaobjectDefinitionCreate.userErrors;
  if (errs.length) throw new Error('metaobject def: ' + JSON.stringify(errs));
  const id = create.metaobjectDefinitionCreate.metaobjectDefinition.id;
  log(`  + creada: ${id}`);
  return id;
}

// ────────────────────── 3. METAFIELD custom.designer en productos ──────────────────────
async function setupProductMetafieldDefinition() {
  log('Metafield custom.designer en productos…');
  const data = await gql(`{
    metafieldDefinitions(first: 50, ownerType: PRODUCT, namespace: "custom", key: "designer") {
      edges { node { id name } }
    }
  }`);
  if (data.metafieldDefinitions.edges.length) { log(`  ✓ existe`); return; }
  const create = await gql(`
    mutation Create($d: MetafieldDefinitionInput!) {
      metafieldDefinitionCreate(definition: $d) {
        createdDefinition { id }
        userErrors { field message }
      }
    }`, {
    d: {
      name: 'Diseñador',
      namespace: 'custom',
      key: 'designer',
      ownerType: 'PRODUCT',
      type: 'metaobject_reference',
      validations: [{ name: 'metaobject_definition_id', value: (await gql(`{ metaobjectDefinitionByType(type: "designer") { id } }`)).metaobjectDefinitionByType.id }],
      access: { storefront: 'PUBLIC_READ' },
    },
  });
  const errs = create.metafieldDefinitionCreate.userErrors;
  if (errs.length) throw new Error('metafield def: ' + JSON.stringify(errs));
  log(`  + creado`);
}

// ────────────────────── 4. DISEÑADORES DEMO ──────────────────────
const DESIGNERS = [
  { handle: 'amaya-rojas', name: 'Amaya Rojas', location: 'Santiago, Chile', instagram: 'amaya.studio', website: 'https://amaya-studio.cl', bio: 'Diseñadora industrial enfocada en piezas escultóricas para el hogar. Trabaja la geometría como puente entre lo artesanal y lo digital. Sus piezas exploran el balance entre vacío y llenado, inspiradas en cerámica japonesa y arquitectura latinoamericana.' },
  { handle: 'bruno-tachi', name: 'Bruno Tachi', location: 'São Paulo, Brasil', instagram: 'brunotachi', website: 'https://tachi.design', bio: 'Arquitecto y diseñador brasileño. Su obra reinterpreta tradiciones modernistas en objetos cotidianos imprimibles. Cree que el diseño bien hecho debe ser simple, honesto, y accesible — sin renunciar a la presencia.' },
  { handle: 'mei-chen', name: 'Mei Chen', location: 'Taipei, Taiwán', instagram: 'mei.objects', website: 'https://meichen.work', bio: 'Diseñadora de productos formada entre Taipei y Eindhoven. Sus piezas combinan precisión técnica con sensibilidad poética. Trabaja con formas mínimas que esconden complejidades estructurales.' },
];

async function setupDesigners() {
  log('Diseñadores demo…');
  for (const d of DESIGNERS) {
    const exist = await gql(`query Q($h: MetaobjectHandleInput!) { metaobjectByHandle(handle: $h) { id } }`, { h: { type: 'designer', handle: d.handle } });
    if (exist.metaobjectByHandle) { log(`  ✓ existe: ${d.handle}`); continue; }
    const create = await gql(`
      mutation Create($m: MetaobjectCreateInput!) {
        metaobjectCreate(metaobject: $m) {
          metaobject { id handle }
          userErrors { field message }
        }
      }`, {
      m: {
        type: 'designer',
        handle: d.handle,
        capabilities: { publishable: { status: 'ACTIVE' } },
        fields: [
          { key: 'name', value: d.name },
          { key: 'bio', value: d.bio },
          { key: 'location', value: d.location },
          { key: 'instagram', value: d.instagram },
          { key: 'website', value: d.website },
        ],
      },
    });
    const errs = create.metaobjectCreate.userErrors;
    if (errs.length) { log(`  ! error ${d.handle}:`, JSON.stringify(errs)); continue; }
    log(`  + creado: ${d.handle}`);
  }
}

// ────────────────────── 5. PRODUCTOS DEMO ──────────────────────
const PRODUCTS = [
  { handle: 'cuenco-origami-18cm', title: 'Cuenco Origami · 18cm', vendor: 'Amaya Studio', product_type: 'Decoración', body_html: '<p>Cuenco escultórico inspirado en pliegues de papel. Impreso en PLA biodegradable color crema.</p><ul><li>Diámetro 18cm · alto 9cm</li><li>Apto para frutas, llaves, joyería</li><li>No apto para líquidos calientes</li></ul>', price: '38900', designer: 'amaya-rojas', tags: 'cuencos,decoracion,amaya' },
  { handle: 'florero-mediterraneo', title: 'Florero Mediterráneo', vendor: 'Bruno Tachi', product_type: 'Floreros', body_html: '<p>Florero minimalista de líneas largas, pensado para tallos altos. Impreso en PLA mate color terracota.</p><ul><li>Alto 28cm · base 9cm</li><li>Forro interior estanco para agua</li><li>Acabado mate aterciopelado</li></ul>', price: '52000', designer: 'bruno-tachi', tags: 'floreros,bruno' },
  { handle: 'lampara-luna-mesa', title: 'Lámpara Luna · de mesa', vendor: 'Mei Chen', product_type: 'Lámparas', body_html: '<p>Lámpara esférica con difusión cálida. Estructura impresa, ampolleta E14 LED 4W incluida.</p><ul><li>Diámetro 22cm</li><li>Cable textil 1.8m con interruptor</li><li>Enchufe chileno</li></ul>', price: '79900', designer: 'mei-chen', tags: 'lamparas,mesa,mei' },
  { handle: 'macetero-totem-15', title: 'Macetero Tótem · 15cm', vendor: 'Amaya Studio', product_type: 'Maceteros', body_html: '<p>Macetero geométrico apilable. Pensado para suculentas y plantas pequeñas.</p><ul><li>Altura 15cm · diámetro interior 11cm</li><li>Drenaje en base con plato integrado</li><li>PLA color cacao</li></ul>', price: '24900', designer: 'amaya-rojas', tags: 'maceteros,plantas,amaya' },
  { handle: 'florero-corteza', title: 'Florero Corteza', vendor: 'Bruno Tachi', product_type: 'Floreros', body_html: '<p>Florero de textura inspirada en corteza de árbol. Impreso en PLA color salvia.</p><ul><li>Alto 24cm · base 11cm</li><li>Textura tactil única</li><li>Estanco para flores frescas</li></ul>', price: '46500', designer: 'bruno-tachi', tags: 'floreros,bruno' },
];

async function setupProducts() {
  log('Productos demo…');
  const existing = (await rest('/products.json?limit=250&fields=id,handle')).products;
  const existingByHandle = new Map(existing.map(p => [p.handle, p.id]));

  for (const p of PRODUCTS) {
    let productId = existingByHandle.get(p.handle);
    if (productId) {
      log(`  ✓ existe: ${p.handle} (id ${productId})`);
    } else {
      const created = await rest('/products.json', 'POST', {
        product: {
          title: p.title, handle: p.handle, vendor: p.vendor, product_type: p.product_type,
          body_html: p.body_html, tags: p.tags, status: 'active',
          variants: [{ price: p.price, inventory_management: null, requires_shipping: true }],
        },
      });
      productId = created.product.id;
      log(`  + creado: ${p.handle} (id ${productId})`);
    }

    // Metafield designer
    const designerHandle = p.designer;
    const mo = await gql(`query Q($h: MetaobjectHandleInput!) { metaobjectByHandle(handle: $h) { id } }`, { h: { type: 'designer', handle: designerHandle } });
    if (!mo.metaobjectByHandle) { log(`  ! no existe metaobject designer ${designerHandle}`); continue; }
    await rest(`/products/${productId}/metafields.json`, 'POST', {
      metafield: { namespace: 'custom', key: 'designer', type: 'metaobject_reference', value: mo.metaobjectByHandle.id },
    }).catch(e => { if (!String(e).includes('taken')) log(`    ! metafield ${p.handle}:`, String(e).slice(0, 200)); });
  }
}

// ────────────────────── 6. MENÚ PRINCIPAL ──────────────────────
async function setupMenu() {
  log('Menú principal…');
  // Shopify navigation: REST endpoint es /menus.json (limited). GraphQL: navigationMenuCreate / Update.
  // Usar GraphQL menu API:
  const data = await gql(`{ menus(first: 20) { edges { node { id handle title } } } }`);
  const main = data.menus.edges.find(e => e.node.handle === 'main-menu');
  if (!main) { log('  ! main-menu no encontrado (debería existir por default)'); return; }
  const items = [
    { title: 'Catálogo', type: 'HTTP', url: '/collections/all' },
    { title: 'Diseñadores', type: 'HTTP', url: '/pages/disenadores' },
    { title: 'Cómo funciona', type: 'HTTP', url: '/pages/como-funciona' },
    { title: 'Sobre nosotros', type: 'HTTP', url: '/pages/sobre-nosotros' },
    { title: 'Contacto', type: 'HTTP', url: '/pages/contacto' },
  ];
  const upd = await gql(`
    mutation Upd($id: ID!, $title: String!, $handle: String!, $items: [MenuItemUpdateInput!]!) {
      menuUpdate(id: $id, title: $title, handle: $handle, items: $items) {
        menu { id handle items { title url } }
        userErrors { field message }
      }
    }`, {
    id: main.node.id, title: 'Menú principal', handle: 'main-menu',
    items: items.map(i => ({ title: i.title, type: i.type, url: i.url, items: [] })),
  });
  const errs = upd.menuUpdate.userErrors;
  if (errs.length) { log('  ! menu errors:', JSON.stringify(errs)); return; }
  log(`  + actualizado: ${upd.menuUpdate.menu.items.map(i => i.title).join(', ')}`);
}

// ────────────────────── RUN ──────────────────────
(async () => {
  try {
    await setupPages();
    await setupMetaobjectDefinition();
    await setupProductMetafieldDefinition();
    await setupDesigners();
    await setupProducts();
    await setupMenu();
    console.log('\n✓ Setup completo.');
  } catch (e) {
    console.error('\n✗ Error:', e.message);
    process.exit(1);
  }
})();
