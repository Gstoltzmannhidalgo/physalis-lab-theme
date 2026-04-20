# Setup inicial del admin Shopify — checklist

Una vez que el theme está en la tienda, hay configuración que se hace **sólo desde el admin** (no desde el código). Este es el orden recomendado.

## 1. Información de la tienda

Admin → **Configuración** → **Detalles de la tienda**.
- [ ] Nombre: `Physalis Lab`
- [ ] Email contacto: `hola@physalis-lab.cl`
- [ ] Email del dueño: el de Tito.
- [ ] Dirección física (para facturas).
- [ ] Zona horaria: America/Santiago.
- [ ] Moneda: CLP.
- [ ] Sistema de unidades: Métrico.
- [ ] Peso por defecto: kg.

## 2. Pagos

Admin → **Configuración** → **Pagos**.
- [ ] Mercado Pago Chile activado y verificado.
- [ ] Account Mercado Pago vinculada.
- [ ] Test compra de $1 con tarjeta real → confirmar email + estado en Mercado Pago.
- [ ] Considerar agregar transferencia manual como respaldo.

## 3. Envíos

Admin → **Configuración** → **Envío y entrega**.
- [ ] Zona Chile creada.
- [ ] Tarifa Starken / Chilexpress configurada (manual o por API).
- [ ] Retiro en tienda (pickup) opcional, dirección Santiago.
- [ ] Tiempo de procesamiento: "Se envía dentro de 3 a 5 días hábiles".

## 4. Impuestos

Admin → **Configuración** → **Impuestos**.
- [ ] IVA Chile (19%) — verificar si está incluido en precio o se suma.
- [ ] Para B2C generalmente: precios incluyen IVA.

## 5. Notificaciones

Admin → **Configuración** → **Notificaciones**.
- [ ] Email transaccional con identidad Physalis (logo + colores cream/cacao).
- [ ] Templates a personalizar (mínimo): order_confirmation, order_shipped, order_refunded.
- [ ] Sender email: `pedidos@physalis-lab.cl` (configurar SPF/DKIM en DNS).

## 6. Políticas

Admin → **Configuración** → **Políticas**.
- [ ] Política de privacidad
- [ ] Términos de servicio
- [ ] Política de devoluciones
- [ ] Política de envíos
- [ ] Política de información de contacto

(Shopify tiene generadores. Editar para adaptar a Physalis y a la legislación chilena — SERNAC.)

## 7. Idioma y locale

Admin → **Configuración** → **Idiomas**.
- [ ] Idioma principal: Español (Chile) — `es-CL`.
- [ ] Sin idiomas secundarios por ahora.

## 8. Metafields y metaobjects

Ver `docs/METAOBJECTS.md`.
- [ ] Definir metaobject `designer`.
- [ ] Definir metafield `custom.designer` en productos (referencia → designer).
- [ ] Cargar al menos 3 entradas Designer.
- [ ] Asignar a productos existentes.

## 9. Páginas

Ver `docs/PAGES.md`.
- [ ] `Sobre nosotros` (handle `sobre-nosotros`, plantilla `page.sobre-nosotros`)
- [ ] `Contacto` (handle `contacto`, plantilla `page.contacto`)
- [ ] `Preguntas frecuentes` (handle `faq`, plantilla `page.faq`)
- [ ] `Términos` (handle `terminos`, plantilla `page.terminos`)
- [ ] `Diseñadores` (handle `disenadores`, plantilla `page.disenadores`)

## 10. Navegación

Admin → **Tienda online** → **Navegación**.

### Main menu
- [ ] Catálogo → /collections/all
- [ ] Diseñadores → /pages/disenadores
- [ ] Sobre nosotros → /pages/sobre-nosotros
- [ ] Contacto → /pages/contacto

### Footer menu
- [ ] FAQ → /pages/faq
- [ ] Envíos y devoluciones → /pages/faq#envios
- [ ] Términos → /pages/terminos
- [ ] Política de privacidad → (link a la política Shopify)

## 11. Cuentas de cliente

Admin → **Configuración** → **Cuentas de cliente**.
- [ ] "Las cuentas son opcionales" (recomendado para Physalis — checkout invitado posible).

## 12. Apps mínimas recomendadas

- [ ] Mercado Pago (ya viene como gateway, no requiere app extra).
- [ ] Shopify Email (free, para newsletter).
- [ ] Klaviyo o Mailchimp si necesitás campañas avanzadas (opcional).
- [ ] Search & Discovery (free de Shopify, mejora filtros).

## 13. Analytics

Admin → **Configuración** → **Aplicaciones de canal de venta** → **Tienda online** → **Preferencias**.
- [ ] Google Analytics 4 ID (después de switch DNS).
- [ ] Facebook/Meta Pixel (opcional).
- [ ] Habilitar UTM tracking nativo de Shopify.

## 14. Search Console + Bing

Después de switch DNS:
- [ ] Verificar dominio en Google Search Console.
- [ ] Submit sitemap: `https://physalis-lab.cl/sitemap.xml`.
- [ ] Mismo en Bing Webmaster Tools.

## 15. Theme

Una vez todo lo anterior listo:
- [ ] Push del theme: `shopify theme push --unpublished`.
- [ ] Preview en admin → revisar todas las URLs principales.
- [ ] **Publish** desde admin.
- [ ] Mantener un theme backup de Dawn vanilla por si hay que rollback.
