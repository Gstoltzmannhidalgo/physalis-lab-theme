# Metaobjects — Diseñadores

El theme consume un metaobjeto `designer` que se define una sola vez desde el admin de Shopify. Sin esa definición, las páginas `/pages/disenadores` y los perfiles individuales muestran un placeholder.

## 1. Crear la definición del metaobjeto

1. Admin → **Configuración** → **Metaobjetos** → **Agregar definición**.
2. **Nombre:** `Designer` · **Tipo (handle):** `designer`.
3. **Acceso al storefront:** activar (necesario para que las páginas de perfil sean públicas en `/pages/designer/{handle}`).
4. **URL handle de página web:** `designer` (queda en `/pages/designer/...`).
5. Agregar los siguientes campos exactamente con esos handles:

| Handle      | Tipo                       | Notas                                      |
|-------------|----------------------------|--------------------------------------------|
| `name`      | Single line text           | Obligatorio                                |
| `bio`       | Multi line text            | Bio editorial, 2–4 párrafos                |
| `portrait`  | File · Image               | Retrato vertical 4:5 idealmente            |
| `location`  | Single line text           | Ej. "Santiago, Chile"                      |
| `instagram` | Single line text           | Solo el handle, sin @                      |
| `website`   | URL                        | Opcional                                   |
| `products`  | Lista de Productos         | Opcional · permite curaduría manual        |

6. Guardar.

## 2. Crear entradas

Admin → **Contenido** → **Metaobjetos** → **Designer** → **Agregar entrada**.
Llenar los campos. Cada entrada tendrá un handle (ej. `marina-soto`) y URL pública en `/pages/designer/marina-soto`.

## 3. Vincular productos a un diseñador

1. Admin → **Configuración** → **Metafields personalizados** → **Productos** → **Agregar definición**.
2. **Nombre:** `Diseñador` · **Namespace y key:** `custom.designer`.
3. **Tipo:** Referencia → **Metaobjeto** → seleccionar `Designer`.
4. Guardar.
5. En cada producto, asignar el diseñador correspondiente desde la sección Metafields.

El bloque "Diseñador" del producto (en `templates/product.json` block_order) lo renderiza automáticamente. Si el producto no tiene diseñador asignado, el bloque no se muestra.

## 4. Crear la página índice

Admin → **Contenido** → **Páginas** → **Agregar página**.
- Título: `Diseñadores`
- Handle: `disenadores`
- Plantilla: **page.disenadores**

## 5. Verificar

- `/pages/disenadores` → grilla con todas las entradas Designer.
- `/pages/designer/{handle}` → perfil individual con sus productos.
- En cada producto con metafield asignado → bloque "Diseño de · {nombre}".
