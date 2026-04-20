# Physalis Lab Theme

Theme Shopify editorial para [Physalis Lab](https://physalis-lab.cl) — diseño de autor en tu hogar. Construido sobre Dawn 15.4.1, con identidad visual propia (paleta oficial Physalis, tipografías Fraunces + Manrope + IBM Plex Mono, estética japandi).

---

## Stack

| Pieza            | Versión / Notas                                  |
|------------------|--------------------------------------------------|
| Base theme       | Dawn 15.4.1                                      |
| Shopify CLI      | 3.93.2+                                          |
| Lenguajes        | Liquid · vanilla CSS · vanilla JS                |
| Tienda           | `physalis-lab.myshopify.com`                     |
| Dominio prod     | `physalis-lab.cl` (post Phase 9)                 |
| Pagos            | Mercado Pago Chile (config en panel Shopify)     |

## Tipografías

- **Display** — Fraunces (variable serif, italica, semibold)
- **Body** — Manrope
- **Mono** — IBM Plex Mono (uppercase con tracking 0.18rem para captions y nav)

## Paleta oficial

10 colores Physalis (10 base + ornamentales). NO usar `#000` ni `#fff`. Definidos como CSS custom props `--physalis-*` en `assets/physalis-custom.css`.

| Token                         | Hex      | Uso                            |
|-------------------------------|----------|--------------------------------|
| `--physalis-cream`            | #F3E5BC  | fondo principal                |
| `--physalis-cream-light`      | #FAF0CF  | fondo secundario               |
| `--physalis-terracota`        | #D96E3B  | acento primario, hover         |
| `--physalis-mostaza`          | #E0A94A  | focus rings, CTAs secundarios  |
| `--physalis-cacao`            | #3E2418  | texto, fondo oscuro            |
| `--physalis-cacao-light`      | #805A44  | texto secundario               |
| `--physalis-salvia`           | #7BA88A  | ornamental                     |
| `--physalis-celeste`          | #6FA3B0  | ornamental                     |
| `--physalis-lila`             | #B89BC4  | ornamental                     |
| `--physalis-hairline`         | #C9B58A  | bordes finos                   |

Las 5 schemas de Shopify (scheme-1 a scheme-5) están mapeadas a esta paleta en `config/settings_data.json`.

## Estructura

```
theme/
├── assets/
│   ├── physalis-custom.css        ← TODO el override Physalis va aquí
│   ├── physalis-logo.svg
│   └── ...                         (Dawn baseline)
├── config/
│   ├── settings_schema.json        ← schemas + 10 color pickers Physalis
│   └── settings_data.json          ← valores activos de la paleta
├── layout/
│   └── theme.liquid                ← inyecta tokens --physalis-* en :root
├── sections/
│   ├── disenadores-grid.liquid     ← grilla de metaobjects designer
│   ├── main-designer.liquid        ← perfil individual designer
│   └── ...                         (Dawn baseline modificado)
├── templates/
│   ├── index.json                  ← home editorial
│   ├── product.json                ← ficha producto + tagline + destacados
│   ├── collection.json             ← grid + filtros vertical
│   ├── page.disenadores.json       ← índice diseñadores
│   ├── page.sobre-nosotros.json
│   ├── page.contacto.json
│   ├── page.faq.json
│   ├── page.terminos.json
│   └── metaobject.designer.liquid  ← perfil público de diseñador
└── docs/
    ├── METAOBJECTS.md              ← setup metaobject designer en admin
    ├── PAGES.md                    ← handles + plantillas de páginas
    ├── PERFORMANCE-A11Y.md         ← checklist Lighthouse
    └── MIGRATION.md                ← runbook DNS Vercel → Shopify
```

## Desarrollo local

```bash
# Login (sólo primera vez)
shopify auth logout
shopify theme dev --store=physalis-lab.myshopify.com
# Pide la storefront password (no tu password de cuenta).
# Verla en Admin → Online Store → Preferences → "Password page".

# Preview en http://127.0.0.1:9292 con hot reload.
```

## Deploy

```bash
# Push como theme NO publicado (preview en admin)
shopify theme push --unpublished

# Push directo al theme live (cuidado)
shopify theme push --live

# Pull cambios hechos desde el admin
shopify theme pull --live
```

## Workflow recomendado

1. Branch local desde main.
2. Cambios en `physalis-custom.css` o templates.
3. Verificar local con `shopify theme dev`.
4. Commit en español (convencional: `feat:`, `fix:`, `docs:`).
5. Push a GitHub.
6. `shopify theme push --unpublished` para previewing en admin.
7. Si OK: publicar desde admin (Themes → Actions → Publish).

## Convenciones

- **Conversación y docs:** español.
- **Código:** inglés (variables, funciones, comentarios).
- **Commits:** español, conventional.
- **Mercado Pago:** se configura en panel Shopify, no se toca theme.
- **Imágenes:** todas con alt en admin. Ratio 4:5 portrait para producto.
- **Links externos:** `rel="noopener" target="_blank"`.

## Phases (historial de construcción)

1. ✅ Setup base + paleta + tipografías
2. ✅ Color schemes Physalis + mono utility
3. ✅ Header + footer editoriales
4. ✅ Home editorial (hero, manifiesto, colecciones, proceso, destacados, newsletter)
5. ✅ Catálogo + ficha de producto editoriales
6. ✅ Metaobjects diseñador (índice + perfil + bloque en producto)
7. ✅ Páginas estáticas (about, contacto, FAQ, términos)
8. ✅ Performance + accesibilidad
9. ✅ Migración de dominio (runbook)
10. ✅ Documentación final

## Próximos pasos sugeridos (post-launch)

- Cargar al menos 5 productos reales con metafields designer asignados.
- Lighthouse audit en preview branch antes de switch DNS.
- Configurar Google Search Console + GA4 con dominio nuevo.
- Schema.org Product + Organization markup (revisar Dawn baseline).
- Email transaccional con identidad Physalis (logo + colores).

---

## Ver también

- [docs/METAOBJECTS.md](docs/METAOBJECTS.md) — cómo crear el metaobject Designer en admin.
- [docs/PAGES.md](docs/PAGES.md) — handles y plantillas de páginas estáticas.
- [docs/PERFORMANCE-A11Y.md](docs/PERFORMANCE-A11Y.md) — checklist de auditoría.
- [docs/MIGRATION.md](docs/MIGRATION.md) — migración DNS Vercel → Shopify.
