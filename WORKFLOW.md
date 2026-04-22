# Physalis Lab — Protocolo de trabajo seguro

## Regla #1: NUNCA tocar LIVE directamente
- LIVE theme: `161279017185` (physalislab.com) — SOLO LECTURA hasta aprobación explícita
- Staging theme: `161312145633` — ambiente de trabajo
- Dev theme: `161274560737` — snapshot histórico, no tocar

## Flujo por cambio

### 1. Snapshot antes
```bash
cd ~/Documents/Proyectos/physalis-snapshots
mkdir live-$(date +%Y%m%d-%H%M)-<tag>
cd live-$(date +%Y%m%d-%H%M)-<tag>
SHOPIFY_CLI_THEME_TOKEN=$TOKEN shopify theme pull --theme=161279017185 --path=.
git init -q -b main && git add -A && git -c user.email=... commit -m "snapshot: ..."
```

### 2. Trabajar en working folder
```bash
cd ~/Documents/Proyectos/physalis-lab-mushroom-backup
# editar archivos
git add <archivos> && git commit -m "feat: descripción"
```

### 3. Push a STAGING (nunca a LIVE)
```bash
SHOPIFY_CLI_THEME_TOKEN=$TOKEN shopify theme push \
  --store=physalis-lab.myshopify.com \
  --theme=161312145633 \
  --only=<path específico> \
  --nodelete --force
```
**Siempre `--only=<path>`** — nunca push completo.

### 4. Preview y validación
```
https://physalis-lab.myshopify.com?preview_theme_id=161312145633
```
Playwright screenshot + aprobación del usuario.

### 5. Recién después de aprobación: push a LIVE
```bash
shopify theme push --theme=161279017185 --only=<paths> --allow-live --force
```

### 6. Commit post-publish
```bash
git tag live-$(date +%Y%m%d-%H%M)
git commit --allow-empty -m "release: publicado a LIVE"
```

## Token management
- Token TTL: 24h (OAuth client_credentials)
- Regenerar con:
```bash
curl -X POST "https://physalis-lab.myshopify.com/admin/oauth/access_token" \
  -H "Content-Type: application/json" \
  -d '{"client_id":"...","client_secret":"...","grant_type":"client_credentials"}'
```
- Credenciales en `/Users/gerardostoltzmannh./Documents/Proyectos/physalis-lab-theme/.env`

## Files-nunca-tocar sin confirmación
- `config/settings_data.json` (logo, favicon, colors wireados)
- `sections/header-group.json` + `footer-group.json` (nav config)
- `layout/theme.liquid` (carga de fuentes, meta tags)

## Anti-patrones prohibidos
- ❌ `shopify theme push` sin `--only`
- ❌ `shopify theme dev` contra `--theme=<live-id>`
- ❌ Editar directo en Shopify Admin sin pull previo
- ❌ Push sin `git commit` previo
- ❌ Usar `--allow-live` sin aprobación explícita del user
