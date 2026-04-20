# Cómo editar el theme — guía para Tito

Esta guía cubre los cambios que vas a hacer **sin tocar código**, desde el admin de Shopify.

## 1. Cambiar copy del home, página de producto, etc.

Admin → **Tienda online** → **Temas** → tema activo → **Personalizar**.

- Lado izquierdo: árbol de secciones (hero, manifiesto, colecciones, etc.).
- Click en cualquier sección → editás texto, imágenes, colores en el panel derecho.
- Botón **Guardar** arriba a la derecha.

## 2. Cambiar imagen del hero

Personalizar → **Inicio** → sección "hero" (image-banner) → click en la imagen → reemplazar.
- Tamaño recomendado: 2400×1200 px (relación 2:1).
- Formato: WebP o JPG optimizado.

## 3. Agregar/sacar secciones del home

Personalizar → **Inicio** → botón **+ Agregar sección** (en cualquier posición).

Secciones recomendadas para Physalis:
- Image banner (hero)
- Rich text (manifiesto, captions)
- Collection list (3 colecciones featured)
- Image with text (diseñador del mes)
- Multicolumn (proceso)
- Featured collection (lo recién impreso)
- Newsletter

## 4. Subir un producto nuevo

Admin → **Productos** → **Agregar producto**.

Llenar:
- Título (ej: "Cuenco Origami · 18cm")
- Descripción (rich text)
- Imágenes: mínimo 3, ratio 4:5 portrait recomendado.
- Precio en CLP.
- Vendedor (= nombre del estudio o diseñador).
- Categoría: Hogar > Decoración.
- Variantes: si aplica (color, tamaño).
- **Metafield "Diseñador"** (custom.designer): asignar el designer correspondiente. Si no aparece la opción, ver `docs/METAOBJECTS.md`.

## 5. Subir un nuevo diseñador

Admin → **Contenido** → **Metaobjetos** → **Designer** → **Agregar entrada**.

- Name: nombre completo o seudónimo.
- Bio: 2-4 párrafos editoriales.
- Portrait: foto vertical 4:5.
- Location: ciudad y país (ej. "Santiago, Chile").
- Instagram: handle sin @.
- Website: URL completa con https://.

Su perfil queda automáticamente en `/pages/designer/{handle}` y aparece en `/pages/disenadores`.

## 6. Editar páginas estáticas (sobre nosotros, FAQ, etc.)

Las copys principales están en el JSON del theme (no en admin). Para cambiarlas:

**Opción A (sin código):** Admin → Personalizar → seleccionar la página en el dropdown superior → editar las secciones rich-text desde ahí.

**Opción B (código):** abrir `templates/page.sobre-nosotros.json` (etc.) en VS Code, editar los textos, commit.

Excepción: `terminos` usa el campo "Contenido" del admin. Editar en Páginas > Términos > campo Contenido.

## 7. Cambiar colores

⚠️ La paleta Physalis es fija — no cambiar sin coordinar.

Si necesitás ajustar algún detalle:
- Personalizar → **Configuración del tema** (engranaje) → **Colores** → editar las 5 schemes.
- O Configuración → **Colores Physalis ornamentales** para los 4 acentos (salvia, celeste, lila, hairline).

## 8. Cambiar el menú principal

Admin → **Tienda online** → **Navegación** → **Main menu** → editar.

## 9. Cambiar el footer

Personalizar → bajar hasta el footer en el preview → click → editar columnas, textos, menú, redes.

## 10. Backup antes de cambios grandes

Antes de tocar algo crítico:
1. Admin → Themes → Actions del theme actual → **Duplicate**.
2. Ese duplicado queda como backup.
3. Si algo se rompe: Actions → **Publish** sobre el duplicado.

## 11. ¿Qué NO tocar desde el admin?

- Archivos `.liquid` y `.json` en Edit Code → eso lo manejamos por git/VS Code.
- Configuración de pagos → ya está Mercado Pago, no tocar.
- Configuración de checkout → ya está editorial, no tocar.

## Ayuda

- Manual Shopify: https://help.shopify.com/es
- Soporte tema: contactar al desarrollador (ver README.md raíz).
