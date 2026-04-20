# Migración de dominio — Vercel → Shopify

Runbook para apuntar `physalis-lab.cl` (y `www.physalis-lab.cl`) desde Vercel hacia el storefront Shopify, con downtime mínimo.

> **Tiempo estimado:** 30 min de trabajo + 1-48h de propagación DNS (TTL).
> **Ventana recomendada:** martes/miércoles por la mañana (menos tráfico).

## 0. Pre-requisitos

- [ ] Theme Physalis publicado como Live en `physalis-lab.myshopify.com`.
- [ ] Productos cargados (al menos 5 visibles).
- [ ] Mercado Pago activo y testeado con compra real de $1.
- [ ] Páginas estáticas creadas (sobre-nosotros, contacto, faq, terminos) y enlazadas en footer.
- [ ] Metaobjects designer poblados.
- [ ] Política de privacidad, devoluciones y términos publicadas.
- [ ] Email transaccional configurado en Shopify (Configuración → Notificaciones).
- [ ] SSL certificado de Vercel exportado o respaldado (no es crítico — Shopify emite uno nuevo).

## 1. Bajar TTL en Vercel/registrar (24h ANTES)

Si el dominio está gestionado en Vercel DNS o en el registrar (NIC.cl/Cloudflare):

1. Cambiar TTL del A/CNAME actual a `300` segundos (5 min).
2. Esperar al menos el TTL anterior (típicamente 1h-24h) antes de proceder.

Esto reduce el tiempo de propagación cuando hagamos el switch.

## 2. Agregar dominio en Shopify Admin

1. Admin → **Configuración** → **Dominio** → **Conectar dominio existente**.
2. Ingresar `physalis-lab.cl`.
3. Shopify mostrará los registros DNS necesarios:
   - **A record** `@` → `23.227.38.65` (IP de Shopify)
   - **CNAME** `www` → `shops.myshopify.com`

Anotar estos valores.

## 3. Editar DNS en el registrar (NIC.cl o Cloudflare)

### Si está en NIC.cl
1. Login en `nic.cl`.
2. Mis dominios → `physalis-lab.cl` → Modificar DNS.
3. Reemplazar registros actuales:
   - Eliminar el A record que apunta a Vercel (`76.76.21.21` o similar).
   - Agregar `A @ 23.227.38.65 TTL 300`.
   - Eliminar CNAME `www` actual (Vercel).
   - Agregar `CNAME www shops.myshopify.com TTL 300`.
4. Guardar.

### Si está en Cloudflare
1. Login en Cloudflare → seleccionar `physalis-lab.cl`.
2. DNS → Records.
3. Editar A record: cambiar contenido a `23.227.38.65`. **Importante:** desactivar el proxy (nube gris, no naranja). Shopify maneja su propio CDN.
4. Editar CNAME `www`: cambiar a `shops.myshopify.com`, también nube gris.
5. Mantener TTL en `Auto` o `300`.

## 4. Verificar en Shopify

1. Volver a Admin → Configuración → Dominio.
2. Click "Verificar conexión". Puede tardar 1-2 horas la primera vez.
3. Cuando aparezca verde: marcar `physalis-lab.cl` como **dominio principal**.
4. Activar redirección automática `www → apex` (o al revés, según preferencia SEO).

## 5. Esperar y verificar SSL

Shopify emite un certificado SSL Let's Encrypt automáticamente al detectar el dominio. Tarda 1-48h. Verificar con:

```bash
curl -I https://physalis-lab.cl
# Esperar: HTTP/2 200 con server: cloudflare o similar y certificado válido
```

## 6. Smoke test post-switch

- [ ] `https://physalis-lab.cl` → home Physalis (no Vercel old).
- [ ] `https://www.physalis-lab.cl` → redirige a apex.
- [ ] `https://physalis-lab.cl/products/{slug}` → ficha de producto carga.
- [ ] `https://physalis-lab.cl/cart` → carrito.
- [ ] Compra de prueba con tarjeta real $1 → llega email de confirmación.
- [ ] `physalis-lab.myshopify.com` → redirige a `physalis-lab.cl`.

## 7. Apagar deployment Vercel

Sólo después de 7 días con tráfico estable en Shopify y métricas Search Console limpias:

1. Vercel dashboard → Project Physalis → Settings → Domains.
2. Remover `physalis-lab.cl` y `www.physalis-lab.cl`.
3. Pausar el proyecto (no eliminarlo aún por 30 días).

## 8. Redirecciones SEO

Si la estructura de URLs cambió (ej. Vercel usaba `/productos/x` y Shopify usa `/products/x`):

1. Admin → **Tienda online** → **Navegación** → **URL Redirects**.
2. Importar CSV con `from,to` para cada URL antigua → nueva.
3. Verificar 30 días después en Google Search Console que no haya 404s nuevos.

## Rollback (si algo sale mal)

Si algo crítico falla en las primeras 2 horas:
1. Volver al registrar.
2. Restaurar el A y CNAME a los valores Vercel originales (anotar antes de cambiar en paso 3).
3. Esperar propagación (5-30 min con TTL 300).
4. Investigar problema en Shopify sin presión.

> **Tip:** Tomar screenshot completo de los DNS records de Vercel ANTES de tocar nada, así el rollback es trivial.
