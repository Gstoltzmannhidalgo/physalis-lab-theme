# Páginas estáticas — setup en admin

El theme incluye plantillas editoriales para 4 páginas. Para activarlas, hay que crear cada página en el admin con el handle exacto y elegir su plantilla.

Admin → **Contenido** → **Páginas** → **Agregar página**

| Título de página      | Handle              | Plantilla            | Notas                                    |
|-----------------------|---------------------|----------------------|------------------------------------------|
| Sobre nosotros        | `sobre-nosotros`    | `page.sobre-nosotros`| Manifiesto + valores. Contenido ya en JSON. |
| Contacto              | `contacto`          | `page.contacto`      | Form de contacto editorial. Cambiar email en banner. |
| Preguntas frecuentes  | `faq`               | `page.faq`           | 3 acordeones (envíos, producto, compras). |
| Términos y condiciones| `terminos`          | `page.terminos`      | Cuerpo desde el campo "Contenido" del admin. |

> El campo "Contenido" del admin sólo se usa en `terminos` (la plantilla incluye `main-page` que renderiza ese contenido). Las demás llevan toda la copy en el JSON; editás vía Personalizador del theme.

## URLs públicas

- `/pages/sobre-nosotros`
- `/pages/contacto`
- `/pages/faq`
- `/pages/terminos`

## Footer

Recordá enlazar estas páginas en el footer (Personalizador → Footer → menú).
